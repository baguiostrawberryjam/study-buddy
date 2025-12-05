import { google } from '@ai-sdk/google'
import { streamText, convertToModelMessages } from 'ai'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/authOptions'
import { embed } from 'ai'
import prisma from '../../lib/prisma'
import { Prisma } from '@prisma/client'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const user = session?.user
  const name = user?.name || 'Guest'

  const { messages } = await req.json()
  const lastUserMessage = messages[messages.length - 1]?.content ?? ''

  // -------------------------------------
  // 1. If logged in -> run RAG retrieval
  // -------------------------------------
  let ragContext = ''

  if (session) {
    // 1.1 Create embedding for the user's query
    const queryEmbedding = await embed({
      model: google.textEmbedding('text-embedding-004'),
      value: lastUserMessage,
    })

    // 1.2 Vector similarity search in Neon PostgreSQL
    // SECURITY FIX: Get file IDs first using Prisma (safe), then do vector search
    const userId = user?.id || ''

    // Validate userId is a valid CUID format (basic check)
    if (!userId || !/^c[a-z0-9]{24}$/.test(userId)) {
      throw new Error('Your session appears to be invalid. Please sign out and sign back in to continue using StudyBuddy.')
    }

    // First, get user's file IDs safely using Prisma
    const userFiles = await prisma.file.findMany({
      where: {
        userId: userId,
        status: 'COMPLETED',
      },
      select: {
        id: true,
      },
    })

    if (userFiles.length > 0) {
      // File IDs come from Prisma (safe), user ID already validated
      const fileIds = userFiles.map(f => f.id)
      // Validate all file IDs are valid CUIDs
      const validFileIds = fileIds.filter(id => /^c[a-z0-9]{24}$/.test(id))

      if (validFileIds.length > 0) {
        const embeddingVector = JSON.stringify(queryEmbedding.embedding)
        // Escape file IDs for safe SQL (they're already validated CUIDs from Prisma)
        const escapedFileIds = validFileIds.map(id => `'${id.replace(/'/g, "''")}'`).join(', ')

        // Use parameterized query with Prisma.sql
        // Note: Vector operations require casting, embedding is from trusted AI SDK
        const results = await prisma.$queryRaw<{
          content: string
          metadata: any
          similarity: number
        }[]>(
          Prisma.sql`
            SELECT 
              "content",
              "metadata",
              1 - ("vector" <=> ${embeddingVector}::vector) as similarity
            FROM "Embedding"
            WHERE "fileId" IN (${Prisma.raw(escapedFileIds)})
            ORDER BY "vector" <=> ${embeddingVector}::vector
            LIMIT 5
          `
        )

        // 1.3 Combine retrieved chunks
        if (results.length > 0) {
          ragContext = results.map((r) => r.content).join('\n\n---\n\n')
        }
      }
    }

  }

  // Default
  // Create a prompt
  const systemPrompt = !session
    ? `
    You are StudyBuddy, a friendly virtual tutor.
    The user is not logged in, so politely explain that signing in will unlock:
    - Personalised tutoring and chat experience.
    - Answer based on their uploaded documents (RAG)
  `
    : `You are StudyBuddy, a helpful virtual tutor for the user named ${name}.
    Use the RAG context below if it is relevant to the user's question.
    If no files have been uploaded or the RAG context is not relevant, answer normally.
    If the user hasn't uploaded PDFs yet, gently remind them to upload files so you can provide better, personalized tutoring.

    --- RAG CONTEXT START ---
    ${ragContext || 'No relevant uploaded file content found.'}
    --- RAG CONTEXT END ---`

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
    system: systemPrompt,
    maxOutputTokens: session ? 1000 : 300,
  })

  return result.toUIMessageStreamResponse()
}