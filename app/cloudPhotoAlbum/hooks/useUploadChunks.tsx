import request from '../../../utils/request'
import { useState, useRef } from 'react'
import { Scheduler } from '../utils/schduler'

export const useUpLoadChunks = () => {
  const [progress, setProgress] = useState(0)
  const scheduler = new Scheduler(5)
  const upLoadChunks = (fileChunkList, upLoadedChunks = [], file, hash, requestListRef, size) => {
    let count = 0
    const fileSum = fileChunkList.length - upLoadedChunks.length
    const upLoadedChunksSet = new Set(upLoadedChunks.map((item) => Number(item.split('-')[1])))
    const requireList = fileChunkList
      .map((chunk, index) => {
        const formData = new FormData()
        formData.append('chunk', chunk)
        formData.append('sliceHash', hash + '-' + index)
        formData.append('fileName', file.name)
        formData.append('fileHash', hash)
        return { formData, index }
      })
      .filter((_, index) => !upLoadedChunksSet.has(index))
      .map(
        ({ formData, index }) =>
          () =>
            request({
              url: 'http://localhost:3008/my/upload',
              data: formData,
              requestListRef,
            }).then((value) => {
              count++
              setProgress((count * 100) / fileSum)
              if (count === fileSum) {
                request({
                  url: 'http://localhost:3008/my/merge',
                  headers: {
                    'content-type': 'application/json',
                  },
                  data: JSON.stringify({
                    fileName: file.name,
                    fileHash: hash,
                    size,
                  }),
                })
              }
            })
      )
    requireList.forEach((item) => {
      scheduler.add(item)
    })
  }
  return { progress, upLoadChunks }
}
