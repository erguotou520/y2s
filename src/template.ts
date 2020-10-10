export const initConfigFileTemplate = `module.exports = {
  apiPrefix: 'https://yapi.your.company',
  token: 'token',
  projectId: 1,
  outputPath: 'src/services'
}
`

export const apiDescriptionFileTemplate = `export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH'

export interface ServiceRequestAndResponseMap {
  $$1
}

export type ServiceReturn = {
  [P in ServiceKeys]: (
    payload?: ServiceRequestAndResponseMap[P]['params'] &
      ServiceRequestAndResponseMap[P]['query'] &
      (ServiceRequestAndResponseMap[P]['body'] | { _body: ServiceRequestAndResponseMap[P]['body'] })
  ) => Promise<ServiceFunctionResponse<ServiceRequestAndResponseMap[P]['response']>>
}

export type ServiceKeys = keyof ServiceRequestAndResponseMap

export type ApiDefine = {
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

export type CreateServiceFunction<T = unknown> = (
  url: string,
  method: Method,
  query: RequestQuery,
  body: RequestBody,
  done?: boolean
) => Promise<ServiceFunctionResponse<T>>
`

export const apisFileTemplate = `import { Apis } from './yapi.api'

export const apis: Apis = {
  $$1
}
`

export const servicesFileTemplate = `import { CreateServiceFunction, ServiceKeys, ServiceReturn } from './yapi.api'
import { apis } from './yapi.apis'

export function createServices(createFunc: CreateServiceFunction): ServiceReturn {
  const ret = {} as ServiceReturn
  let key: ServiceKeys
  for (key in apis) {
    const api = apis[key]
    let url = api.u
    // @ts-ignore
    ret[key] = (payload: { [key: string]: any }) => {
      const body = { ...payload }
      // params
      if (api.p?.length) {
        api.p.forEach(paramKey => {
          delete body[paramKey]
          url = url.replace(new RegExp(\`:\${paramKey}|{\${paramKey}}\`, 'g'), payload[paramKey])
        })
      }
      // query
      const query: { [key: string]: any } = {}
      if (api.q?.length) {
        api.q.forEach(queryKey => {
          if (queryKey in payload) {
            delete body[queryKey]
            query[queryKey] = payload[queryKey]
          }
        })
      }
      return createFunc(url, api.m, query, '_body' in body ? body._body : body)
    }
  }
  return ret as ServiceReturn
}
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
