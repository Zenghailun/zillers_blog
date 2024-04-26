export default function request({
  url,
  method = 'post',
  data,
  headers = {},
  requestListRef = undefined,
}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key])
    })
    xhr.send(data)
    xhr.onload = (e) => {
      if (requestListRef) {
        requestListRef.current.filter((item) => item !== xhr)
      }
      resolve({ data: e.target.response })
    }
    requestListRef?.current.push(xhr)
  })
}
