self.importScripts('https://cdn.jsdelivr.net/npm/spark-md5')

self.onmessage = (e) => {
  const { file, SIZE } = e.data
  const spark = new self.SparkMD5.ArrayBuffer()
  let percentage = 0
  let count = 0
  const createFileChunk = (file, size) => {
    const fileChunkList = []
    let fileSum = 0
    for (let cur = 0; cur < file.size; cur += size) {
      fileChunkList.push(file.slice(cur, cur + size))
      fileSum++
    }
    return { fileChunkList, fileSum }
  }
  const { fileChunkList, fileSum } = createFileChunk(file, SIZE)
  const loadNext = (index) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(fileChunkList[index])
    reader.onload = (e) => {
      count++
      spark.append(e.target.result)
      if (count === fileChunkList.length) {
        self.postMessage({
          fileChunkList,
          percentage: 100,
          hash: spark.end(),
        })
        self.close()
      } else {
        percentage += 100 / fileChunkList.length
        self.postMessage({ percentage })
        loadNext(count)
      }
    }
  }
  loadNext(0)
}
