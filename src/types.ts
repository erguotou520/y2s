export interface ConfigRC {
  apiPrefix: string
  token: string
  projectId: number
  outputPath?: string
}

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH'

// export interface

export interface ApiDesc {
  query_path: {
    path: string
    params: string[]
  }
  status: 'undone' | 'done'
  method: Method
  title: string
  desc: string
  path: string
  req_params: string[]
  req_query: []
  res_body: {}
  up_time: number
}

export interface ApiCategoryDesc {
  name: string
  desc: string
  up_time: number
  list: []
}

export interface ApiConfig {}
