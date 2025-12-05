'use server'

import prisma from '../../lib/prisma' // relative path
import { revalidateTag } from 'next/cache'
import { getServerSession } from 'next-auth'
import { GoogleAIFileManager } from '@google/generative-ai/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { embedMany } from 'ai'
import { google } from '@ai-sdk/google'
import { put, del } from '@vercel/blob'
import { authOptions } from '../../lib/authOptions' // relative path
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

// Initialize Gemini
const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY as string
const fileManager = new GoogleAIFileManager(GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

// TEXT SPLITTER
function chunkText(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
) {
  if (!text || text.length === 0) return []
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = start + chunkSize
    let chunk = text.slice(start, end)

    if (end < text.length) {
      const lastPeriod = chunk.lastIndexOf('.')
      if (lastPeriod > 0 && lastPeriod > chunk.length * 0.5) {
        chunk = chunk.slice(0, lastPeriod + 1)
      }
    }

    chunks.push(chunk)

    const step = chunk.length - overlap
    if (step <= 0) {
      start = text.length
    } else {
      start += step
    }
  }

  return chunks
}

// SANITIZE EXTRACTED TEXT
function sanitizeText(text: string): string {
  return text
    .replace(/\u0000/g, '') // Null bytes
    .replace(/\uFFFD/g, '') // Replacement character
    .replace(/\r\n/g, '\n') // Normalize line breaks
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n') // Collapse multiple newlines
    .trim()
}

// PARSE PDF USING GEMINI FILE API
async function parsePDFWithGemini(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const tempPdfPath = join(tmpdir(), `${Date.now()}-${fileName}`)

  try {
    // Write buffer to temporary file (Gemini File API requires file path)
    await writeFile(tempPdfPath, buffer)

    console.log('Uploading PDF to Gemini File API...')

    // Upload the file to Gemini
    const uploadResponse = await fileManager.uploadFile(tempPdfPath, {
      mimeType: 'application/pdf',
      displayName: fileName,
    })

    console.log(`Uploaded file: ${uploadResponse.file.displayName}`)
    console.log(`File URI: ${uploadResponse.file.uri}`)

    // Wait for file to be processed (if needed)
    let file = uploadResponse.file
    while (file.state === 'PROCESSING') {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      file = await fileManager.getFile(file.name)
    }

    if (file.state === 'FAILED') {
      throw new Error('The AI service was unable to process your PDF file. The file may be corrupted, password-protected, or in an unsupported format. Please ensure your PDF is readable and try again.')
    }

    console.log('File processed successfully, extracting text...')

    // Use Gemini to extract text from the PDF
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      {
        text: 'Extract all text content from this PDF document. Return ONLY the raw text with no formatting, no summaries, no explanations. Just the complete text content exactly as it appears in the document.',
      },
    ])

    const extractedText = result.response.text()

    // Clean up: delete the file from Gemini
    try {
      await fileManager.deleteFile(uploadResponse.file.name)
      console.log('Deleted file from Gemini')
    } catch (deleteError) {
      console.warn('Could not delete file from Gemini:', deleteError)
    }

    const sanitized = sanitizeText(extractedText)

    if (!sanitized) {
      throw new Error('The PDF file was processed but no text content could be extracted. This usually means the PDF contains only images or scanned pages without OCR. Please use a PDF with selectable text or convert scanned documents first.')
    }

    return sanitized
  } catch (error: any) {
    throw new Error(`Gemini PDF parsing failed: ${error.message}`)
  } finally {
    // Clean up temp file
    try {
      await unlink(tempPdfPath)
    } catch { }
  }
}

export async function uploadAndEmbedFile(prevState: any, formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: 'You must be logged in to upload files. Please sign in and try again.' }

  const userId = session.user.id
  const file = formData.get('file') as File

  if (!file || file.size === 0) {
    return { error: 'No file was selected or the file is empty. Please choose a PDF file to upload.' }
  }

  if (file.type !== 'application/pdf') {
    return { error: `The file "${file.name}" is not a PDF document. Only PDF files are currently supported. Please convert your file to PDF format and try again.` }
  }

  // Gemini supports up to 50MB PDFs
  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
  if (file.size > MAX_FILE_SIZE) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return { error: `The file "${file.name}" is too large (${fileSizeMB} MB). Maximum file size allowed is 50 MB. Please compress your PDF or choose a smaller file.` }
  }

  let blobUrl: string | null = null
  let fileRecord: any = null

  try {
    // STEP 1: Parse PDF using Gemini (BEFORE uploading)
    console.log(`Processing file: ${file.name} (${file.size} bytes)`)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let rawText: string
    try {
      rawText = await parsePDFWithGemini(buffer, file.name)
      console.log(`✓ Extracted ${rawText.length} characters from PDF`)
    } catch (parseError: any) {
      console.error('PDF parsing failed:', parseError)
      return {
        error: `Unable to extract text from the PDF "${file.name}". ${parseError.message || 'The file may be corrupted, password-protected, or contain only images. Please ensure your PDF contains readable text and try again.'}`,
      }
    }

    // STEP 2: Split Text
    const chunks = chunkText(rawText)

    if (chunks.length === 0) {
      return { error: `No readable text content was found in the PDF "${file.name}". The file may contain only images or scanned pages. Please use a PDF with selectable text or convert scanned documents using OCR (Optical Character Recognition) first.` }
    }

    console.log(`✓ Split into ${chunks.length} chunks`)

    // STEP 3: Generate Embeddings (BEFORE uploading)
    console.log('Generating embeddings...')
    let embeddings: number[][]
    try {
      const result = await embedMany({
        model: google.textEmbeddingModel('text-embedding-004'),
        values: chunks,
      })
      embeddings = result.embeddings
      console.log(`✓ Generated ${embeddings.length} embeddings`)
    } catch (embeddingError: any) {
      console.error('Embedding generation failed:', embeddingError)
      return {
        error: `Unable to process the document for AI search. ${embeddingError.message || 'This may be due to a temporary service issue. Please try again in a few moments. If the problem persists, contact support.'}`,
      }
    }

    // STEP 4: Upload to Blob (ONLY after embeddings are ready)
    console.log('Uploading to Blob storage...')
    const blob = await put(`${userId}/${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    })
    blobUrl = blob.url
    console.log(`✓ Uploaded to: ${blobUrl}`)

    // STEP 5: Create DB Record
    fileRecord = await prisma.file.create({
      data: {
        name: file.name,
        url: blob.url,
        mimeType: file.type,
        user: {
          connect: {
            id: userId,
          },
        },
        status: 'PROCESSING',
      },
    })

    // STEP 6: Save Embeddings to DB in batches
    console.log('Saving embeddings to database...')
    const BATCH_SIZE = 50
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE)
      await Promise.all(
        batch.map(async (chunk, batchIndex) => {
          const globalIndex = i + batchIndex
          await prisma.$executeRaw`
            INSERT INTO "Embedding" ("id", "content", "vector", "fileId")
            VALUES (
              gen_random_uuid(),
              ${chunk},
              ${JSON.stringify(embeddings[globalIndex])}::vector,
              ${fileRecord.id}
            );
          `
        })
      )
      console.log(
        `✓ Saved batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
          chunks.length / BATCH_SIZE
        )}`
      )
    }

    // STEP 7: Mark as completed
    await prisma.file.update({
      where: { id: fileRecord.id },
      data: { status: 'COMPLETED' },
    })

    revalidateTag(`files-${userId}`)

    console.log('✅ File processing complete!')
    return {
      success: true,
      message: `File processed successfully! Generated ${chunks.length} embeddings.`,
    }
  } catch (error: any) {
    console.error('Pipeline error:', error)

    // CLEANUP: Remove uploaded blob if processing failed
    if (blobUrl) {
      try {
        console.log('Cleaning up uploaded blob...')
        await del(blobUrl)
        console.log('✓ Blob deleted')
      } catch (deleteError) {
        console.error('Failed to delete blob:', deleteError)
      }
    }

    // CLEANUP: Update file status or delete record
    if (fileRecord) {
      try {
        await prisma.file.delete({
          where: { id: fileRecord.id },
        })
        console.log('✓ Database record deleted')
      } catch (deleteError) {
        console.error('Failed to delete file record:', deleteError)
      }
    }

    return {
      error: `File processing failed for "${file.name}". ${error.message || 'An unexpected error occurred during file processing. The file may be corrupted or there may be a temporary service issue. Please try again or contact support if the problem continues.'}`,
    }
  }
}

uploadAndEmbedFile.maxDuration = 60