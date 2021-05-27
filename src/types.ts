export interface ConfigRC {
  // yapi地址前缀
  apiPrefix: string
  // yapi的项目token
  token: string
  // yapi的项目id
  projectId: number
  // 生成的service相关文件的存储位置
  outputPath: string
  // 是否保存api.json文件
  saveJson?: boolean
  // 是否覆盖固定生成的几个文件？一般不建议取消，保持文件最新
  overwrite?: boolean
  // 是否对api的分组名和名称进行trim
  trim?: boolean
  // 生成时可忽略的文件集合
  ignoreFiles: string[]
  // 是否使用FormData
  hasFormData?: boolean
  // 解构response返回的数据层级
  dataPath?: null | string | string[]
}

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH'

export interface QueryPath {
  path: string
  params: any[]
}

export interface ReqParam {
  // _id: string
  name: string
  example?: string
  desc?: string
}

export interface ReqQuery {
  required: string
  // _id: string
  name: string
  example?: string
  desc?: string
}

export interface ReqHeader {
  required: string
  // _id: string
  name: string
  value?: string
}

export interface ReqBodyForm {
  required: string
  // _id: string
  name: string
  type: string
  example?: string
  desc?: string
}

export interface ApiItem {
  query_path: QueryPath
  edit_uid: number
  status: 'done' | 'undone'
  type: string
  req_body_is_json_schema: boolean
  res_body_is_json_schema: boolean
  api_opened: boolean
  index: number
  tag: string[]
  // _id: number
  method: Method
  catid: number
  title: string
  path: string
  project_id: number
  req_params: ReqParam[]
  res_body_type: string
  req_query: ReqQuery[]
  req_headers: ReqHeader[]
  req_body_form: ReqBodyForm[]
  desc?: string
  markdown?: string
  res_body: 'json' | 'raw'
  uid: number
  add_time: number
  up_time: number
  __v: number
  req_body_type: 'form' | 'json' | 'file' | 'raw'
  req_body_other: string
}

export interface OriginApiDesc {
  index: number
  name: string
  desc?: string
  add_time: number
  up_time: number
  list: ApiItem[]
}

export type OriginApis = OriginApiDesc[]
