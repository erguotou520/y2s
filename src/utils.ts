import { JSONSchema4, JSONSchema4TypeName } from 'json-schema'
import { Method, OriginApis } from './types'

const STRING_PROTOTYPE = '[object String]'
const NUMBER_PROTOTYPE = '[object Number]'
const REGEXP_PROTOTYPE = '[object RegExp]'
const DATE_PROTOTYPE = '[object Date]'
const BOOL_PROTOTYPE = '[object Boolean]'
const ARRAY_PROTOTYPE = '[object Array]'
const OBJECT_PROTOTYPE = '[object Object]'
const FUNCTION_PROTOTYPE = '[object Function]'

function protoString(obj: any) {
  return Object.prototype.toString.call(obj)
}

export function isString(str: any) {
  return protoString(str) === STRING_PROTOTYPE
}

export function isNumber(num: any) {
  return protoString(num) === NUMBER_PROTOTYPE
}

export function isRegExp(reg: any) {
  return protoString(reg) === REGEXP_PROTOTYPE
}

export function isBool(bool: any) {
  return protoString(bool) === BOOL_PROTOTYPE
}

export function isDate(date: any) {
  return protoString(date) === DATE_PROTOTYPE
}

export function isArray(arr: any) {
  return protoString(arr) === ARRAY_PROTOTYPE
}

export function isObject(obj: any) {
  return protoString(obj) === OBJECT_PROTOTYPE
}

export function isFunction(fn: any) {
  return protoString(fn) === FUNCTION_PROTOTYPE
}

// 给有内容的字符串前后加空格
export function wrapSpace(str?: string | undefined) {
  if (!str) return ''
  if (str.length) {
    return ` ${str} `
  }
}

const typeMap: {
  [key in JSONSchema4TypeName]: string
} = {
  number: 'number',
  integer: 'number',
  string: 'string',
  boolean: 'boolean',
  null: 'null',
  any: 'any',
  array: 'array',
  object: 'object',
}

export function converJSONSchemaToResponseStruct(json: JSONSchema4): string {
  let type
  if (typeof json.type === 'string') {
    type = json.type
  } else {
    type = json.type?.[0]
  }
  type = type === 'integer' ? 'number' : type ?? 'any'
  if (json.type === 'object') {
    const requiredFields = (json.required || []) as string[]
    return `{${wrapSpace(
      Object.keys(json.properties!)
        .map(key => {
          const prop = json.properties![key]
          return `${key}${requiredFields.includes(key) ? '' : '?'}: ${converJSONSchemaToResponseStruct(prop)}`
        })
        .join('; ')
    )}}`
  }
  if (json.type === 'array') {
    return `${converJSONSchemaToResponseStruct(json.items!)}[]`
  }
  return type
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

/**
 * 根据要转换的语言来移除字符串中要转换的符号或删除符号间的文字
 * @param str 待替换的字符串
 * @param usingJs 是否要转换为js，默认ts
 */
export function removeJsConvertSymbols(str: string, usingJs: boolean): string {
  if (!usingJs) {
    return str.replace(/(\*#|#\*)/g, '')
  }
  return str.replace(/\*#(([\s\S])*?)#\*/g, '')
}
