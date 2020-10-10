import { CreateServiceFunction, ServiceKeys, ServiceReturn } from './yapi.api'
import { apis } from './yapi.apis'

export function createServices(createFunc: CreateServiceFunction): ServiceReturn {
  const ret = {} as ServiceReturn
  let key: ServiceKeys
  for (key in apis) {
    const api = apis[key]
    let url = api.u
    // @ts-ignore
    ret[key] = (payload?: { [key: string]: any } = {}) => {
      const body = { ...payload }
      // params
      if (api.p?.length) {
        api.p.forEach(paramKey => {
          delete body[paramKey]
          url = url.replace(new RegExp(`:${paramKey}|{${paramKey}}`, 'g'), payload[paramKey])
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
