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
