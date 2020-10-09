export const initConfigFileTemplate = `module.exports = {
  apiPrefix: 'https://yapi.your.company',
  token: 'token',
  projectId: 1,
  outputPath: 'src/services'
}
`

export const apiDescriptionFileTemplate = `export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH'

export type ServiceKeys = $$1

export type ApiDefine = {
  u: string
  m: Method
  q?: {
    [key: string]: { type: 'string' | 'number' | 'boolean'; required?: 1 | 0 }
  }
  p?: {
    [key: string]: { type: 'string' | 'number' }
  }
}

export type Apis = Record<ServiceKeys, ApiDefine>

export interface RequestQuery {
  [key: string]: string | number | RequestQuery
}

export interface RequestBody {
  [key: string]: any
}

export interface ServiceFunctionResponse<T> {
  error: boolean
  data: T
  message?: string
  stack?: string | object
}

export type CreateServiceFunction<T = unknown> = (
  url: string,
  method: Method,
  query: RequestQuery,
  body: RequestBody
) => Promise<ServiceFunctionResponse<T>>

export interface ServiceRequestAndResponseMap {
  $$2
}

export type ServiceReturn = {
  [P in ServiceKeys]: (
    data: ServiceRequestAndResponseMap[P]['request']
  ) => Promise<ServiceFunctionResponse<ServiceRequestAndResponseMap[P]['response']>>
}
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
    // @ts-ignore
    ret[key] = (data: any) => createFunc(api.u, api.m, data, {})
  }
  return ret as ServiceReturn
}
`
