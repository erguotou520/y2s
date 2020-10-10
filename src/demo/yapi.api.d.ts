export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH'

export interface ServiceRequestAndResponseMap {
  '用户@修改用户信息': {
    params: { id: any }
    query: {}
    body: { name?: string | number | boolean; gender?: string | number | boolean; age?: string | number | boolean }
    response: { name?: string; gender?: string; age?: number; id?: string }
  }
  '用户@用户列表': {
    params: {}
    query: { page: any; pageSize: any; keyword?: any; ids?: any }
    body: {}
    response: { total: number; items: { name: string; gender: string; age: number; id: string }[] }
  }
  '用户@用户详情': {
    params: { id: any }
    query: {}
    body: {}
    response: { name?: string; gender?: string; age?: number; id: string }
  }
  '用户@获取用户关注的人数': {
    params: { id: any }
    query: {}
    body: {}
    response: number
  }
  '认证@登出': {
    params: {}
    query: {}
    body: {}
    response: {}
  }
  '认证@登录': {
    params: {}
    query: {}
    body: {
      username: string | number | boolean
      password: string | number | boolean
      rememberMe?: string | number | boolean
    }
    response: { token: string; id?: string }
  }
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
