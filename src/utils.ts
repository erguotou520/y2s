import { JSONSchema4 } from 'json-schema'
import { readConfig } from './config'
import { ApiItem, ConfigRC, Method, OriginApis, ReqBodyForm, ReqParam, ReqQuery } from './types'

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

/**
 * 将Json Schema格式的返回值转换成我们需要的格式
 * @param json json schema格式的数据
 * @param spaceBefore 前置空格数
 */
export function converJSONSchemaToTypescriptStruct(json: JSONSchema4, spaceBefore: number): string {
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
          return `${comments}${fieldKey}${
            requiredFields.includes(key) ? '' : '?'
          }: ${converJSONSchemaToTypescriptStruct(prop, spaceBefore + 2)}`
        })
        .join('\n'),
      spaceBefore
    )}}`
  }
  if (json.type === 'array') {
    try {
      return `${converJSONSchemaToTypescriptStruct(json.items!, spaceBefore)}[]`
    } catch (error) {
      console.error('JSON schema解析失败！')
      throw error
    }
  }
  return type
}

/**
 * 对接口数据中的body做转化
 * @param api 接口返回数据
 */
function getReqBody(api: ApiItem): ReqBodyForm[] | JSONSchema4 | null {
  switch (api.req_body_type) {
    case 'form':
      return api.req_body_form
    case 'json':
      if (!api.req_body_other) {
        return null
      }
      return JSON.parse(api.req_body_other) as JSONSchema4
    default:
      return null
  }
}

const FormTypeMap = { text: 'string | number | boolean', file: 'File' }

/**
 * 将body转化为字符串
 * @param api 待转化的service item
 * @param spaceBefore 前置空格数
 */
export function convertBodyToString(api: ServiceItem, spaceBefore: number): string {
  if (api.type === 'form') {
    if ((api.body as ReqBodyForm[])?.some(item => item.type === 'file')) {
      const config = readConfig()
      return config?.hasFormData === false ? 'any' : 'FormData'
    }
    return (
      '{' +
      wrapNewline(
        (api.body as ReqBodyForm[])
          ?.map(b => {
            return `${generateCommonComment(b)}${b.name}${Number(b.required) > 0 ? '' : '?'}: ${
              FormTypeMap[b.type as 'file' | 'text'] ?? '{}'
            }`
          })
          .join('\n'),
        spaceBefore
      ) +
      '}'
    )
  }
  if (api.type === 'json') {
    if (api.body) {
      return converJSONSchemaToTypescriptStruct(api.body as JSONSchema4, spaceBefore)
    }
    // 为null时返回空
    return '{}'
  }
  return '{}'
}

interface ServiceItem {
  url: string
  method: Method
  query?: ReqQuery[]
  params?: ReqParam[]
  // 暂时不支持raw格式的数据处理
  type?: 'json' | 'form' | 'file' | 'raw'
  body?: ReqBodyForm[] | JSONSchema4 | null
  resp?: JSONSchema4
  done: boolean
}

interface ServiceConvertResult {
  [key: string]: ServiceItem
}

/**
 * 将Api集合转换成service
 * @param apis Api集合
 */
export function convertApiToService(apis: OriginApis, config: ConfigRC): ServiceConvertResult {
  const sameTitleCacheMap: {
    [key: string]: 1
  } = {}
  return apis.reduce<ServiceConvertResult>((ret, group) => {
    group.list.forEach(api => {
      const resBody: JSONSchema4 = api.res_body ? JSON.parse(api.res_body) : { properties: {} }
      let key = `${group.name}@${api.title}`
      // trim
      if (config.trim) {
        key = key.replace(/ /g, '')
      }
      // 重名时试图添加method
      const sameTitleApi = group.list.find(_api => _api !== api && _api.title === api.title)
      if (sameTitleApi) {
        // method也一致
        if (sameTitleApi.method === api.method) {
          // 相同title的只提示一次
          if (!sameTitleCacheMap[key]) {
            sameTitleCacheMap[key] = 1
            console.error(
              `\x1B[41m\x1B[37mFind same api: ${group.name}@${api.title}, previous api(s) will be overwritten!!!\x1B[0m\x1B[0m`
            )
          }
        } else {
          // 相同title的只提示一次
          if (!sameTitleCacheMap[key]) {
            sameTitleCacheMap[key] = 1
            console.warn(
              `\x1B[33mFind same api with different method: ${group.name}@${api.title}, will add @{method} suffix.\x1B[0m`
            )
          }
        }
        // 添加method
        key = `${key}@${api.method.toLowerCase()}`
      }
      ret[key] = {
        url: api.path,
        method: api.method,
        query: api.req_query ?? [],
        params: api.req_params ?? [],
        type: api.req_body_type,
        body: getReqBody(api),
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

interface CommonCommentItem {
  name: string
  item?: string
  title?: string
  desc?: string
  example?: string
}

/**
 * 为通用对象生成注释
 * @param item 待生成注释的对象
 */
export function generateCommonComment(item: CommonCommentItem): string {
  return generateComment(
    [
      { value: item.title },
      { symbol: 'description', value: item.desc },
      { symbol: 'example', value: item.example ? `{ ${item.name}: ${item.example} }` : '' },
    ],
    4
  )
}
