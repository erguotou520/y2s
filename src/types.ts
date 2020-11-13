export interface ConfigRC {
  apiPrefix: string
  token: string
  projectId: number
  outputPath: string
  saveJson?: boolean
  overwrite?: boolean
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

export interface List {
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
}

export interface OriginApiDesc {
  index: number
  name: string
  desc?: string
  add_time: number
  up_time: number
  list: List[]
}

export type OriginApis = OriginApiDesc[]
