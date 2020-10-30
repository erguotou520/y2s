import axios from 'axios'
import { Method, RequestBody, RequestQuery } from './yapi.api'
import { createServices } from './yapi.services'

const token = localStorage.getItem('token')
const services = createServices(
  async (url: string, method: Method, query: RequestQuery, body: RequestBody, done = true) => {
    console.debug(url, method, query, body)
    // return { error: false, data: {} }
    const { status, data, statusText } = await axios.request({
      url,
      method,
      baseURL: done ? 'https://your.api.com/v1' : 'https://mock.your.api.com/v1',
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
  }
)

export default services

async function test() {
  const { error, data } = await services['用户@用户详情']({ id: 1 })
  return error ? false : data
}

async function testAll() {
  await services['用户@用户列表']({ page: 1, pageSize: 20, ids: [1, 2, 3] })
  await services['用户@用户详情']({ id: 123 })
  await services['用户@修改用户信息']({ id: 12, name: '1', gender: '' })
  await services['用户@修改用户信息']({ id: 123 }, { age: 23, name: '张三', gender: 1 })
  await services['用户@获取用户关注的人数']({ id: 123 })
  await services['认证@登录']({ username: 'root', password: '123456', rememberMe: true })
  await services['认证@登出']({})
}
testAll()
