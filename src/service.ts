import { Method, OriginApis } from './types'

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
          q: api.reqQuery.map((query: { name: any; required: any }) => ({
            n: query.name,
            r: query.required ? '1' : '0',
          })),
          p: api.reqParams.map((param: { name: any }) => ({ n: param.name })),
        }
      }),
    }
  })
}

interface ServiceConvertResult {
  [key: string]: {
    url: string
    method: Method
    query?: {
      name: string
      required?: boolean
    }[]
    params?: string[]
    body?: {
      [key: string]: any
    }
    resp: any
  }
}

export function convertApiToService(apis: OriginApis): ServiceConvertResult {
  return apis.reduce<ServiceConvertResult>((ret, group) => {
    group.list.forEach(api => {
      ret[`${group.name}@${api.title}`] = {
        url: api.path,
        method: api.method,
        query: api.req_query
          ? api.req_query.map(query => {
              return {
                name: query.name,
                required: Number(query.required) > 0,
              }
            })
          : [],
        params: api.req_params
          ? api.req_params.reduce<string[]>((arr, param) => {
              arr.push(param.name)
              return arr
            }, [])
          : [],
        resp: api.res,
      }
    })
    return ret
  }, {} as ServiceConvertResult)
}
