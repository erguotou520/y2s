import axios from 'axios'
import ora from 'ora'
import { OriginApis, ConfigRC, Method } from './types'
// import { JSONSchema4 } from 'json-schema'
import { writeToFile } from './file'

// interface Apis {
//   name: string
//   desc?: string
//   upTime: string
//   list: {
//     path: string
//     method: Method
//     title: string
//     desc?: string
//     status:
//   }[]
// }[]

// export function transformJson(apis: OriginApis): Apis {
//   return apis.map(group => {
//     return {
//       name: group.name,
//       desc: group.desc,
//       upTime: group.up_time,
//       list: group.list.map(api => {
//         const resBody: JSONSchema4 = api.res_body ? JSON.parse(api.res_body) : {}
//         return {
//           path: api.path,
//           method: api.method,
//           title: api.title,
//           desc: api.desc,
//           status: api.status,
//           upTime: api.up_time,
//           reqBodyType: api.req_body_type,
//           reqParams: api.req_params.map(params => {
//             return { name: params.name }
//           }),
//           reqQuery: api.req_query.map(query => {
//             return {
//               required: +query.required > 0,
//               name: query.name,
//               desc: query.desc,
//             }
//           }),
//           reqBodyForm: api.req_body_form.map(body => {
//             return {
//               required: +body.required > 0,
//               name: body.name,
//               desc: body.desc,
//               type: body.type,
//             }
//           }),
//           resBody: resBody.properties,
//         }
//       }),
//     }
//   })
// }

export async function fetchJson(config: ConfigRC): Promise<OriginApis | undefined> {
  const { apiPrefix, projectId, token, outputPath = 'src/services' } = config
  const spinner = ora({ text: 'Downloading api json', spinner: 'bouncingBar' }).start()
  let res
  try {
    res = await axios.get('/api/plugin/export', {
      baseURL: apiPrefix,
      responseType: 'json',
      timeout: 60000,
      timeoutErrorMessage: 'Yapi接口请求超时',
      params: {
        type: 'json',
        pid: projectId,
        status: 'all',
        isWiki: false,
        token: token,
      },
    })
  } catch (error) {
    console.error(error.code, '接口数据获取出错，请尝试检查配置')
    console.error(error.message)
    console.error(error.stack)
    process.exit(-1)
  }
  spinner.stop()
  if (res.status >= 200 && res.status < 300) {
    await writeToFile('./services/api.json', JSON.stringify(res.data, null, 2), undefined, true)
    // const apis = transformJson(res.data as OriginApis)
    return res.data as OriginApis
  }
}
