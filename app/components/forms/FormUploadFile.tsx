'use client'

import { useEffect, useState } from 'react'
import { useActionState } from 'react'
import { uploadAndEmbedFile } from '../../lib/actions/embedding'
import toast from 'react-hot-toast'

export default function FormUploadFile({
  setShowModal,
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
  // Initial state
  const initialState = {
    message: '',
    error: '',
    success: false,
  }

  // Action
  const [state, handleSubmit, isPending] = useActionState(
    uploadAndEmbedFile,
    initialState
  )

  // Client-side error
  const [clientError, setClientError] = useState<string | null>(null)

  // Side effects: toast + modal
  useEffect(() => {
    if (state.success) {
      setShowModal(false)
      toast.success(state.message)
    }

    if (state.error) {
      toast.error(state.error)
    }
  }, [state.success, state.error, state.message, setShowModal])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setClientError(null)

    const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
    if (file && file.size > MAX_FILE_SIZE) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const errorMsg = `File "${file.name}" is too large (${fileSizeMB} MB). Maximum file size allowed is 50 MB. Please compress your PDF or choose a smaller file.`;
      setClientError(errorMsg)
      toast.error(errorMsg)
      e.target.value = ''
    }
  }

  return (
    <form
      data-loading={isPending}
      action={handleSubmit}
      className="flex flex-col gap-5 rounded-lg bg-white p-5 shadow-md"
      noValidate
    >
      <div>
        <label className="block text-sm font-medium text-gray-700"></label>
        <input
          type="file"
          name="file"
          accept=".pdf,.txt,.md"
          required
          onChange={handleFileChange}
          disabled={isPending}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-gray-500">
          Max 50MB. This will be added to your AI knowledge base.
        </p>
      </div>

      {/** Client-side error */}
      {clientError && <p className="text-red-500 text-sm">{clientError}</p>}

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isPending || !!clientError}
          className={`px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isPending ? 'Uploading & Embedding...' : 'Upload Knowledge'}
        </button>
      </div>
    </form>
  )
}