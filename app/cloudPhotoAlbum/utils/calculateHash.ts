// 生成文件 hash
export default function calculateHash(fileChunkList): Promise<string> {
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
