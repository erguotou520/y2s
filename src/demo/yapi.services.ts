import { CreateServiceFunction, ServiceKeys, ServiceReturn } from './yapi.api'
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
