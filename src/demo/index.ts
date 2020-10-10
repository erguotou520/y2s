import axios from 'axios'
import { Method, RequestBody, RequestQuery } from './yapi.api'
import { createServices } from './yapi.services'

const token = localStorage.getItem('token')
const services = createServices(async (url: string, method: Method, query: RequestQuery, body: RequestBody) => {
  const { status, data, statusText } = await axios.request({
    url,
    method,
    baseURL: 'https://api.github.com/v3',
    params: query,
    data: body,
    responseType: 'json',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  })
  if (status < 300 && status >= 200) {
    return {
      error: false,
      data: data,
    }
  }
  return {
    error: true,
    data: null,
    message: statusText,
  }
})

// async function test() {
//   const { error, data } = await services['用户@用户列表']({page: 1, pageSize: 20})
//   return error ? false : data
// }

async function test1() {
  const a = services['用户@用户列表']
  const { error, data } = await services['用户@用户列表']({})
  return error ? false : data
}
