/**
 * .y2src.js
 */
export const initConfigFileTemplate = `/* eslint-disable */
/** @type {import('y2s/dist/types').ConfigRC} */
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
  overwrite: true,
  // [Optional, default: false] wether to trim the api's group name and api's name 是否对api的分组名和名称进行trim
  trim: false,
  // [Optional, default: []] files to ignore when generating 生成时可忽略的文件集合
  // eg: ['yapi.services.ts']
  ignoreFiles: [],
  // [Optional, default: true] use FormData type or not 是否使用FormData，小程序不需要
  hasFormData: true,
  // [Optional, default: null] de-structure response data types 解构response返回的数据层级，一般用于后端返回的数据有一层固定的包裹，比如 { data: {}, message: '', err_code: '' } 这种情况，此时设置为 'data' 将自动解构到 data 里面的具体数据，如果有多层包裹，请使用数组
  dataPath: null
}
`

/**
 * yapi.service.keys.d.ts
 */
export const serviceKeysDescriptionFileTemplate = `/* eslint-disable */
export interface ServiceRequestAndResponseMap {
  $$1
}

export type ServiceKeys = keyof ServiceRequestAndResponseMap
`

/**
 * yapi.request.d.ts
 */
export const serviceRequestDescriptionFileTemplate = `/* eslint-disable */
import { ServiceKeys, ServiceRequestAndResponseMap } from './yapi.service.keys'
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH'

export type ServiceReturn = {
  [P in ServiceKeys]: (
    data?: ServiceRequestAndResponseMap[P]['body'] &
      ServiceRequestAndResponseMap[P]['params'] &
      ServiceRequestAndResponseMap[P]['query']
    ,
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

/**
 * yapi.apis.ts
 */
export const apisFileTemplate = `/* eslint-disable */
*#import { Apis } from './yapi.request'

#*export const apis*#: Apis#* = {
  $$1
}
`

/**
 * yapi.service.ts
 */
export const servicesFileTemplate = `/* eslint-disable */
*#import { RequestAdapter, ServiceReturn } from './yapi.request'
import { ServiceKeys } from './yapi.service.keys'
#*import { apis } from './yapi.apis'
*#
type PayloadData = Record<string | number, any>#*

export function createServices(createFunc*#: RequestAdapter#*)*#: ServiceReturn#* {
  const ret = {}*# as ServiceReturn#*
  let key*#: ServiceKeys#*
  for (key in apis) {
    const api = apis[key]
    *#// @ts-ignore
    #*ret[key] = (payload*#: PayloadData | FormData#*, extraParams*#?: any#*) => {
      let url = api.u
      let body*#: PayloadData | FormData#*
      let query*#: PayloadData#* = {}
      if (FormData && payload instanceof FormData) {
        body = payload
      } else {
        const _body*#: PayloadData#* = { ...(payload || {}) }
        // params
        if (api.p?.length) {
          api.p.forEach(paramKey => {
            delete _body[paramKey]
            url = url.replace(new RegExp(\`:\${paramKey}|{\${paramKey}}\`, 'g'),*#(#*payload*# as PayloadData)#*[paramKey])
          })
        }
        // query
        if (api.q?.length && payload) {
          api.q.forEach(queryKey => {
            if (queryKey in payload) {
              delete _body[queryKey]
              query[queryKey] = *#(#*payload*# as PayloadData)#*[queryKey]
            }
          })
        }
        body = _body
      }
      return createFunc(url, api.m, query, body, extraParams, api.d > 0)
    }
  }
  return ret*# as ServiceReturn#*
}
`

/**
 * yapi.service.ts with no FormData
 */
export const servicesFileWithNoFormDataTemplate = `/* eslint-disable */
 *#import { RequestAdapter, ServiceReturn } from './yapi.request'
 import { ServiceKeys } from './yapi.service.keys'
 #*import { apis } from './yapi.apis'
 *#
 type PayloadData = Record<string | number, any>#*

 export function createServices(createFunc*#: RequestAdapter#*)*#: ServiceReturn#* {
   const ret = {}*# as ServiceReturn#*
   let key*#: ServiceKeys#*
   for (key in apis) {
     const api = apis[key]
     *#// @ts-ignore
     #*ret[key] = (payload*#: PayloadData#*, extraParams*#?: any#*) => {
       let url = api.u
       let body*#: PayloadData#* = { ...(payload || {}) }
       let query*#: PayloadData#* = {}
        // params
        if (api.p?.length) {
          api.p.forEach(paramKey => {
            delete body[paramKey]
            url = url.replace(new RegExp(\`:\${paramKey}|{\${paramKey}}\`, 'g'),*#(#*payload*# as PayloadData)#*[paramKey])
          })
        }
        // query
        if (api.q?.length) {
          api.q.forEach(queryKey => {
            if (queryKey in payload) {
              delete body[queryKey]
              query[queryKey] = *#(#*payload*# as PayloadData)#*[queryKey]
            }
          })
        }
       return createFunc(url, api.m, query, body, extraParams, api.d > 0)
     }
   }
   return ret*# as ServiceReturn#*
 }
 `

export const serviceDescriptionFileTemplate = `/* eslint-disable */
import { RequestAdapter, ServiceReturn } from './yapi.request'

export function createServices(createFunc: RequestAdapter): ServiceReturn
`

export const requestAndResponseMapTemplate = `'$$k': {
    params: {$$p}
    query: {$$q}
    body: $$b
    response: $$r
  }`

export const apiDescTemplate = `'$$k': {
    u: '$$u',
    m: '$$m',
    $$p$$qd: $$d
  }`
