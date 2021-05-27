/* eslint-disable */
import { RequestAdapter, ServiceReturn } from './yapi.request'
import { ServiceKeys } from './yapi.service.keys'
import { apis } from './yapi.apis'

type PayloadData = Record<string | number, any>

export function createServices(createFunc: RequestAdapter): ServiceReturn {
  const ret = {} as ServiceReturn
  let key: ServiceKeys
  for (key in apis) {
    const api = apis[key]
    // @ts-ignore
    ret[key] = (payload: PayloadData | FormData, extraParams?: any) => {
      let url = api.u
      let body: PayloadData | FormData
      let query: PayloadData = {}
      if (FormData && payload instanceof FormData) {
        body = payload
      } else {
        const _body: PayloadData = { ...(payload || {}) }
        // params
        if (api.p?.length) {
          api.p.forEach(paramKey => {
            delete _body[paramKey]
            url = url.replace(new RegExp(`:${paramKey}|{${paramKey}}`, 'g'),(payload as PayloadData)[paramKey])
          })
        }
        // query
        if (api.q?.length) {
          api.q.forEach(queryKey => {
            if (queryKey in payload) {
              delete _body[queryKey]
              query[queryKey] = (payload as PayloadData)[queryKey]
            }
          })
        }
        body = _body
      }
      return createFunc(url, api.m, query, body, extraParams, api.d > 0)
    }
  }
  return ret as ServiceReturn
}
