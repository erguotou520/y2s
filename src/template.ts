export const initConfigFileTemplate = `// eslint-ignore
// prettier-ignore
module.exports = {
  // yapi prefix yapi地址前缀
  apiPrefix: 'https://yapi.your.company',
  // yapi project's token yapi的项目token
  token: 'token',
  // yapi projects's id yapi的项目id
  projectId: 12,
  // folder to save service files 生成的service相关文件的存储位置
  outputPath: 'src/services',
  // wether to save the origin yapi api json response to file 是否保存api.json文件
  saveJson: true,
  // overwrite the static files? This is recommended, keep it true 是否覆盖固定生成的几个文件？一般不建议取消，保持文件最新
  overwrite: true
}
`

export const apiDescriptionFileTemplate = `// prettier-ignore
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH'

export interface ServiceRequestAndResponseMap {
  $$1
}

export type ServiceKeys = keyof ServiceRequestAndResponseMap

export type ServiceReturn = {
  [P in ServiceKeys]: (
    data?: ServiceRequestAndResponseMap[P]['body'] &
      ServiceRequestAndResponseMap[P]['params'] &
      ServiceRequestAndResponseMap[P]['query'],
    body?: ServiceRequestAndResponseMap[P]['body']
  ) => Promise<ServiceFunctionResponse<ServiceRequestAndResponseMap[P]['response']>>
}

export interface ApiDefine {
  u: string
  m: Method
  // params
  p?: (string | number)[]
  // query
  q?: string[]
  // done / undone
  d: 0 | 1
}

export type Apis = Record<ServiceKeys, ApiDefine>

export interface RequestQuery {
  [key: string]: string | number | RequestQuery
}

export interface RequestBody {
  [key: string]: any
}

export interface ServiceFunctionResponse<T = any> {
  error: boolean
  data: T | null | undefined
  message?: string
  stack?: string | object
}

export type RequestAdapter<T = unknown> = (
  url: string,
  method: Method,
  query: RequestQuery,
  body: RequestBody,
  extraParams: any,
  done: boolean
) => Promise<ServiceFunctionResponse<T>>
`

export const apisFileTemplate = `// eslint-ignore
// prettier-ignore
*#import { Apis } from './yapi.api'

#*export const apis*#: Apis#* = {
  $$1
}
`

export const servicesFileTemplate = `// eslint-ignore
// prettier-ignore
*#import { RequestAdapter, ServiceKeys, ServiceReturn } from './yapi.api'
#*import { apis } from './yapi.apis'

export function createServices(createFunc*#: RequestAdapter#*)*#: ServiceReturn#* {
  const ret = {}*# as ServiceReturn#*
  let key*#: ServiceKeys#*
  for (key in apis) {
    const api = apis[key]
    *#// @ts-ignore
    #*ret[key] = (payload*#: { [key: string]: any }#*, extraParams*#?: any#*) => {
      let url = api.u
      const body = { ...payload }
      // params
      if (api.p?.length) {
        api.p.forEach(paramKey => {
          delete body[paramKey]
          url = url.replace(new RegExp(\`:\${paramKey}|{\${paramKey}}\`, 'g'), payload[paramKey])
        })
      }
      // query
      const query*#: { [key: string]: any }#* = {}
      if (api.q?.length) {
        api.q.forEach(queryKey => {
          if (queryKey in payload) {
            delete body[queryKey]
            query[queryKey] = payload[queryKey]
          }
        })
      }
      return createFunc(url, api.m, query, body, extraParams, api.d > 0)
    }
  }
  return ret*# as ServiceReturn#*
}
`

export const serviceDescriptionFileTemplate = `import { RequestAdapter, ServiceReturn } from './yapi.api'

export function createServices(createFunc: RequestAdapter): ServiceReturn
`

export const requestAndResponseMapTemplate = `'$$k': {
    params: {$$p}
    query: {$$q}
    body: {$$b}
    response: $$r
  }`

export const apiDescTemplate = `'$$k': {
    u: '$$u',
    m: '$$m',
    $$p$$qd: $$d
  }`
