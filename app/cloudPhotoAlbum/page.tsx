'use client'

import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import UploadButton from '@/components/UploadButton'
import FileUploadProgress from '@/components/FileUploadProgress'
import request from '../../utils/request'
import { useState, useRef } from 'react'

// export const metadata = genPageMetadata({ title: '云相册' })

export default function CloudPhotoAlbum() {
  const [progress, setProgress] = useState(0)
  const fileChunkListRef = useRef([])
  const SIZE = 10 * 1024
  const createFileChunk = (file: Blob, size = SIZE) => {
    const fileChunkList: Blob[] = []
    for (let cur = 0; cur < file.size; cur += size) {
      fileChunkList.push(file.slice(cur, cur + size))
    }
    return fileChunkList
  }

  const createProgressHandler = (item) => {
    return (e) => {
      item.percentage = parseInt(String((e.loaded / e.total) * 100))
    }
  }

  const handleFileChange = async (file) => {
    // 处理文件变化事件，例如上传文件到服务器
    const fileChunkList = createFileChunk(file)
    const hash = await calculateHash(fileChunkList)
    const requireList = fileChunkList
      .map((chunk, index) => {
        const formData = new FormData()
        formData.append('chunk', chunk)
        formData.append('hash', file.name + '-' + index)
        formData.append('fileName', file.name)
        formData.append('fileHash', hash)
        return { formData, index }
      })
      .map(({ formData, index }) =>
        request({
          url: 'http://localhost:3008/my/upload',
          data: formData,
          // onProgress: createProgressHandler(),
        })
      )
    Promise.all(requireList).then((value) => {
      request({
        url: 'http://localhost:3008/my/merge',
        headers: {
          'content-type': 'application/json',
        },
        data: JSON.stringify({
          fileName: file.name,
          size: SIZE,
        }),
      })
    })
  }

  // 生成文件 hash
  function calculateHash(fileChunkList): Promise<string> {
    return new Promise((resolve, reject) => {
      // 添加 worker属性
      const worker = new Worker('hashWorker.js')
      worker.postMessage({ fileChunkList })
      worker.onmessage = (e) => {
        const { percentage, hash } = e.data
        if (hash) {
          resolve(hash)
        }
      }
    })
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
          <UploadButton onFileChange={handleFileChange} />
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
