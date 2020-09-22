import axios from 'axios'
import { ensureDirSync } from 'fs-extra'
import { resolve } from 'path'
import ora from 'ora'
import { writeToFile } from './file'
import { OriginApis, ConfigRC } from './types'
import { JSONSchema4 } from 'json-schema'

export function transformJson(apis: OriginApis) {
  return apis.map(group => {
    return {
      name: group.name,
      desc: group.desc,
      upTime: group.up_time,
      list: group.list.map(api => {
        const resBody: JSONSchema4 = api.res_body ? JSON.parse(api.res_body) : {}
        return {
          path: api.path,
          method: api.method,
          title: api.title,
          desc: api.desc,
          status: api.status,
          upTime: api.up_time,
          reqBodyType: api.req_body_type,
          reqParams: api.req_params.map(params => {
            return { name: params.name }
          }),
          reqQuery: api.req_query.map(query => {
            return {
              required: +query.required > 0,
              name: query.name,
              desc: query.desc
            }
          }),
          reqBodyForm: api.req_body_form.map(body => {
            return {
              required: +body.required > 0,
              name: body.name,
              desc: body.desc,
              type: body.type
            }
          }),
          resBody: resBody.properties
        }
      })
    }
  })
}

export function minifyJson(apis: any) {
  return apis.map((group: { name: any; list: any[] }) => {
    return {
      name: group.name,
      list: group.list.map(api => {
        return {
          t: api.title,
          s: api.status,
          m: api.method,
          path: api.path,
          q: api.reqQuery.map((query: { name: any; required: any }) => ({ n: query.name, r: query.required ? '1' : '0'})),
          p: api.reqParams.map((param: { name: any }) => ({ n: param.name }))
        }
      })

    }
  })
}

export async function fetchJson(config: ConfigRC): Promise<any> {
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
    const apis = transformJson(res.data as OriginApis)
    const serviceFolder = resolve(process.cwd(), outputPath)
    const apiFile = resolve(serviceFolder, 'api.min.json')
    ensureDirSync(serviceFolder)
    await writeToFile(apiFile, JSON.stringify(minifyJson(apis)), 'api.min.json文件已存在，是否覆盖？')
    return apis
  }
}
