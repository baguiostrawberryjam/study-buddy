import type { File as FileModel } from '@prisma/client'
import FileCard from './FileCard'

export default function Files({ files }: { files: FileModel[] }) {
  return (
    <div className="max-w-md w-full mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 ">
        {files.map((file: FileModel) => (
          <FileCard key={file.id} file={file} />
        ))}
      </div>
    </div>
  )
}