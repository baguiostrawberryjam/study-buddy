'use server'

import prisma from '../../lib/prisma'
import { revalidateTag, unstable_cache as nextCache } from 'next/cache'
import { cache } from 'react'
import { del } from '@vercel/blob'
// 1. You correctly aliased this, so you must use 'FileModel' everywhere
import type { File as FileModel } from '@prisma/client'

type ActionError = {
  field: string
  message: string
}

type ActionResponse<T = unknown> = {
  success: boolean
  payload: T | null
  message: string | null
  errors: ActionError[]
  input?: any
}

// GET FILES BY USER
export const getFilesByUser = cache(
  // 2. FIX: Change 'File[]' to 'FileModel[]' here
  async (userId: string): Promise<ActionResponse<FileModel[]>> => {
    const data = await nextCache(
      async () => {
        try {
          const files = await prisma.file.findMany({
            where: {
              userId: userId,
            },
            orderBy: {
              createdAt: 'desc',
            },
          })

          console.log(`---DB HIT: getFilesByUser ${userId}`)

          // 3. Optional: explicit cast to help TS know this matches the alias
          // (Usually not strictly needed if the types align, but good for safety)
          if (!files) {
            return {
              success: true,
              payload: [],
              message: null,
              errors: [],
            }
          }

          return {
            success: true,
            payload: files, // Now this matches FileModel[]
            message: 'Files fetched successfully',
            errors: [],
          }

        } catch (error) {
          console.log(`getFilesByUser error: `, error)
          return {
            success: false,
            payload: null,
            message: 'Unable to load your files at this time',
            errors: [
              { field: 'system', message: 'An unexpected error occurred while retrieving your files. Please refresh the page and try again. If the problem continues, contact support.' },
            ],
          }
        }
      },
      ['getFilesByUser', userId],
      {
        tags: [`files-${userId}`, 'files', 'cache'],
      }
    )()

    return data
  }
)

// DELETE FILE AND FILE RECORD
export async function deleteFile(
  prevState: ActionResponse<FileModel>,
  formData: FormData
): Promise<ActionResponse<FileModel>> {
  try {
    const fileData = formData.get('file') as string

    // 4. This part was already correct in your snippet
    const file: FileModel = JSON.parse(fileData)

    const deletions = await Promise.all([
      del(file.url as string),
      prisma.file.delete({
        where: {
          id: file.id,
        },
      }),
    ])

    console.log('Deletions', deletions)

    // 5. This works now because FileModel definitely has 'userId'
    revalidateTag(`files-${file.userId}`)

    return {
      success: true,
      payload: file,
      message: 'File successfully deleted.',
      errors: [],
    }

  } catch (error) {
    console.log('Error deleting file: ', error)
    return {
      success: false,
      payload: null,
      message: 'Unable to delete the file',
      errors: [
        {
          field: 'system',
          message: `Failed to delete "${file.name}". This may be due to a temporary server issue or the file may have already been removed. Please refresh the page and try again. If the problem persists, contact support.`,
        },
      ],
    }
  }
}