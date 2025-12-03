'use client'

import { useState } from 'react'
import Modal from './Modal'
import FormUploadFile from '../components/forms/FormUploadFile'

interface ButtonUploadFileProps {
  label?: string
}

export default function ButtonUploadFile({ label = 'Upload File' }: ButtonUploadFileProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-150"
      >
        {label}
      </button>

      {showModal && (
        <Modal
          title="Upload File"
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        >
          <div className="flex flex-col gap-5">
            <p className="text-sm text-gray-600">Accepts PDF, TXT, or MD files.</p>
            <FormUploadFile setShowModal={setShowModal} />
          </div>
        </Modal>
      )}
    </>
  )
}
