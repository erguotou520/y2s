import { JSONSchema4, JSONSchema4TypeName } from 'json-schema'

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
