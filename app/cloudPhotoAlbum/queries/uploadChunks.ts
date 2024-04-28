import request from '../../../utils/request'

export const verifyUpload = async (fileHash) => {
  const { data } = await request({
    url: 'http://localhost:3008/my/verify',
    headers: {
      'content-type': 'application/json',
    },
    data: JSON.stringify({
      fileHash,
    }),
  })
  return JSON.parse(data)
}
