import { JSONSchema4, JSONSchema4TypeName } from 'json-schema'
import { Method, OriginApis, ReqBodyForm, ReqParam, ReqQuery } from './types'

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

/**
 * 填充一定数量的空格
 * @param count 空格数量
 */
export function fillSpace(count: number): string {
  return [...Array(count)].fill(' ').join('')
}

/**
 * 给有内容的字符串前后加空格
 * @param str 字符串
 */
export function wrapSpace(str?: string) {
  if (!str) return ''
  if (str.length) {
    return ` ${str} `
  }
}

/**
 * 给有内容的字符串前后加换行
 * @param str 字符串
 * @param spaceBefore 当前行锁进的空格数
 * @param withPrefixSpace 换行后是否要追加空格
 */
export function wrapNewline(str: string | undefined, spaceBefore: number, withPrefixSpace = false): string {
  if (!str) return ''
  if (str.length) {
    return `\n${withPrefixSpace ? fillSpace(spaceBefore + 2) : ''}${str}\n${fillSpace(spaceBefore)}`
  }
  return ''
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

/**
 * 将Json Schema格式的返回值转换成我们需要的格式
 * @param json json schema格式的数据
 */
export function converJSONSchemaToResponseStruct(json: JSONSchema4, spaceBefore: number): string {
  let type
  if (typeof json.type === 'string') {
    type = json.type
  } else {
    type = json.type?.[0]
  }
  type = type === 'integer' ? 'number' : type ?? 'any'
  if (json.type === 'object') {
    const requiredFields = (json.required || []) as string[]
    return `{${wrapNewline(
      Object.keys(json.properties || {})
        .map(key => {
          const prop = json.properties![key]
          // 注释
          const comments = generateComment(
            [{ value: prop.title }, { symbol: 'description', value: prop.description }],
            spaceBefore
          )
          // key
          const fieldKey = /^\w+$/.test(key) ? key : `'${key}'`
          // 如果非纯字母+数字，需要套一层引号
          return `${comments}${fieldKey}${requiredFields.includes(key) ? '' : '?'}: ${converJSONSchemaToResponseStruct(
            prop,
            spaceBefore + 2
          )}`
        })
        .join('\n'),
      spaceBefore
    )}}`
  }
  if (json.type === 'array') {
    return `${converJSONSchemaToResponseStruct(json.items!, spaceBefore)}[]`
  }
  return type
}

interface ServiceConvertResult {
  [key: string]: {
    url: string
    method: Method
    query?: ReqQuery[]
    params?: ReqParam[]
    body?: ReqBodyForm[]
    resp?: JSONSchema4
    done: boolean
  }
}

/**
 * 将Api集合转换成service
 * @param apis Api集合
 */
export function convertApiToService(apis: OriginApis): ServiceConvertResult {
  return apis.reduce<ServiceConvertResult>((ret, group) => {
    group.list.forEach(api => {
      const resBody: JSONSchema4 = api.res_body ? JSON.parse(api.res_body) : { properties: {} }
      ret[`${group.name}@${api.title}`] = {
        url: api.path,
        method: api.method,
        query: api.req_query ?? [],
        params: api.req_params ?? [],
        body: api.req_body_form ?? [],
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

interface CommentItem {
  symbol?: string
  key?: string
  value?: string
}

/**
 * 根据注释的内容生成注释字符串
 * @param commentItems 注释的内容
 * @param spaceBefore 当前锁进的空格的长度
 */
export function generateComment(commentItems: CommentItem[], spaceBefore: number): string {
  const prefixSpace = fillSpace(spaceBefore + 2)
  const arr = commentItems.reduce<string[]>((strs, item) => {
    if (item.value) {
      strs.push(
        [prefixSpace, '*', item.symbol ? `@${item.symbol}` : '', item.key ? `{${item.key}}` : '', item.value ?? '']
          // 过滤空字符串
          .filter(item => item)
          .join(' ')
      )
    }
    return strs
  }, [])
  // 空内容
  if (!arr.length) return prefixSpace
  arr.unshift(`${prefixSpace}/**`)
  arr.push(`${prefixSpace} */`)
  arr.push(prefixSpace)
  return arr.join('\n')
}
