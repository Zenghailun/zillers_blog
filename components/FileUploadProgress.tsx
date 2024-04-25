import { useState } from 'react'

const FileUploadProgress = ({ progress }) => {
  return (
    <div className="w-full rounded-full bg-gray-200">
      <div
        className="text-black-100 rounded-full bg-blue-600 p-0.5 text-center text-xs font-medium leading-none"
        style={{ width: `${progress}%` }}
      >
        <div className="whitespace-nowrap">已上传:{progress}%</div>
      </div>
    </div>
  )
}

export default FileUploadProgress
