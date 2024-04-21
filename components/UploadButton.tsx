'use client'

import React, { useRef } from 'react'

function UploadButton({ onFileChange }) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    onFileChange(file)
  }

  return (
    <div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={() => fileInputRef?.current?.click()}
      >
        上传照片或视频
      </button>
    </div>
  )
}

export default UploadButton
