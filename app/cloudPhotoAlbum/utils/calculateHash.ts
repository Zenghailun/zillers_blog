// 生成文件 hash
export default function calculateHash(file, SIZE): Promise<Object> {
  return new Promise((resolve, reject) => {
    // 添加 worker属性
    const worker = new Worker('hashWorker.js')
    worker.postMessage({ file, SIZE })
    worker.onmessage = (e) => {
      const { fileChunkList, hash } = e.data
      if (hash) {
        resolve({ fileChunkList, hash })
      }
    }
  })
}
