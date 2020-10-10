import { JSONSchema4 } from 'json-schema'
import { Method, OriginApis } from './types'

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
      name: string
      type: 'text' | 'file'
      required?: boolean
    }[]
    resp?: JSONSchema4
    done: boolean
  }
}

export function convertApiToService(apis: OriginApis): ServiceConvertResult {
  return apis.reduce<ServiceConvertResult>((ret, group) => {
    group.list.forEach(api => {
      const resBody: JSONSchema4 = api.res_body ? JSON.parse(api.res_body) : { properties: {} }
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
        body: api.req_body_form
          ? api.req_body_form.map(body => {
              return {
                name: body.name,
                type: body.type as 'text' | 'file',
                required: Number(body.required) > 0,
              }
            })
          : [],
        resp: resBody,
        done: api.status === 'done',
      }
    })
    return ret
  }, {} as ServiceConvertResult)
}
