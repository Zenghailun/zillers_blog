'use client'

import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import UploadButton from '@/components/UploadButton'
import FileUploadProgress from '@/components/FileUploadProgress'
import request from '../../utils/request'
import calculateHash from './utils/calculateHash'
import { verifyUpload } from './queries/verifyUpload'
import { useUpLoadChunks } from './hooks/useUploadChunks'
import { useState, useRef } from 'react'

// export const metadata = genPageMetadata({ title: '云相册' })

export default function CloudPhotoAlbum() {
  const SIZE = 50 * 1024 * 1024
  const { progress, upLoadChunks } = useUpLoadChunks()
  const createFileChunk = (file: Blob, size = SIZE) => {
    const fileChunkList: Blob[] = []
    let fileSum = 0
    for (let cur = 0; cur < file.size; cur += size) {
      fileChunkList.push(file.slice(cur, cur + size))
      fileSum++
    }
    return { fileChunkList, fileSum }
  }
  const requestListRef = useRef([])
  const fileChunkListRef = useRef<Blob[]>([])
  const fileHashRef = useRef<string>('')
  const fileRef = useRef(null)
  const handleFileChange = async (file) => {
    // 处理文件变化事件，例如上传文件到服务器
    fileRef.current = file
    const { fileChunkList, fileSum } = createFileChunk(file)
    fileChunkListRef.current = fileChunkList
    const hash = await calculateHash(fileChunkListRef.current)
    fileHashRef.current = hash
    const { shouldUpload } = await verifyUpload(hash)
    if (!shouldUpload) {
      alert('File has been uploaded')
      return
    }
    upLoadChunks(fileChunkListRef.current, [], file, hash, requestListRef, SIZE)
  }

  function handlePause() {
    requestListRef.current.forEach((xhr) => xhr?.abort())
    requestListRef.current = []
  }

  const handleResume = async () => {
    const { uploadedList } = await verifyUpload(fileHashRef.current)
    upLoadChunks(
      fileChunkListRef.current,
      uploadedList,
      fileRef.current,
      fileHashRef.current,
      requestListRef,
      SIZE
    )
  }

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            云相册
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            在这里上传你的照片和视频
          </p>
          <div style={{ display: 'flex' }}>
            <UploadButton onFileChange={handleFileChange} />
            <button
              className="ml-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              onClick={handlePause}
            >
              暂停上传
            </button>
            <button
              className="ml-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              onClick={handleResume}
            >
              继续上传
            </button>
          </div>
          <FileUploadProgress progress={progress} />
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
