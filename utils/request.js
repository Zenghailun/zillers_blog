export default function request({
  url,
  method = 'post',
  data,
  onProgress = (e) => e,
  headers = {},
}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.upload.onprogress = onProgress
    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key])
    })
    xhr.send(data)
    xhr.onload = (e) => {
      resolve({ data: e.target.response })
    }
  })
}
