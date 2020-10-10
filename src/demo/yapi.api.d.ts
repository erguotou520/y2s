export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH'

export type ServiceKeys = '用户@用户列表' | '用户@用户详情'

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
  '用户@用户列表': {
    request: { size: number; pageSize: number }
    response: { data: any }
  }
  '用户@用户详情': {
    request: { id: number }
    response: { id: number; name: string; age: number }
  }
}

export type ServiceReturn = {
  [P in ServiceKeys]: (
    data: ServiceRequestAndResponseMap[P]['request']
  ) => Promise<ServiceFunctionResponse<ServiceRequestAndResponseMap[P]['response']>>
}
