/* eslint-disable */
export interface ServiceRequestAndResponseMap {
  '用户@修改用户信息': {
    params: {
      /**
       * @description 用户id
       * @example { id: 123 }
       */
      id: any;
    }
    query: {}
    body: {
      /**
       * @description 名称
       * @example { name: 李四 }
       */
      name?: string | number | boolean
      /**
       * @description 性别
       * @example { gender: 女 }
       */
      gender?: string | number | boolean
      /**
       * @description 年龄
       * @example { age: 34 }
       */
      age?: string | number | boolean
    }
    response: {
      /**
       * @description 用户名称
       */
      name?: string
      /**
       * @description 性别
       */
      gender?: string
      /**
       * @description 年龄
       */
      age?: number
      /**
       * @description id
       */
      id?: string
    }
  }
  '用户@注册用户': {
    params: {}
    query: {}
    body: {
      /**
       * 姓名
       */
      name: string
      /**
       * 密码
       * @description 6-8位
       */
      password: string
      /**
       * 年龄
       * @description 15-120
       */
      age: number
    }
    response: string
  }
  '用户@用户列表': {
    params: {}
    query: {
      /**
       * @description 当前页
       * @example { page: 1 }
       */
      page: any;
      pageSize: any;
      /**
       * @description 搜索关键词
       * @example { keyword: 张 }
       */
      keyword?: any;
      /**
       * @description id集合
       * @example { ids: 1,2,3 }
       */
      ids?: any;
    }
    body: {}
    response: {
      /**
       * @description 总数
       */
      total: number
      /**
       * 数据集
       */
      items: {
        /**
         * @description 用户名称
         */
        name: string
        /**
         * @description 性别
         */
        gender: string
        /**
         * @description 年龄
         */
        age: number
        /**
         * @description id
         */
        id: string
      }[]
    }
  }
  '用户@用户详情': {
    params: {
      /**
       * @description 用户id
       * @example { id: 123 }
       */
      id: any;
    }
    query: {}
    body: {}
    response: {
      /**
       * @description 用户名称
       */
      name?: string
      gender?: string
      /**
       * @description 年龄
       */
      age?: number
      id: string
    }
  }
  '用户@获取用户关注的人数': {
    params: {
      id: any;
    }
    query: {}
    body: {}
    response: number
  }
  '认证@登出': {
    params: {}
    query: {}
    body: {}
    response: {}
  }
  '认证@登录': {
    params: {}
    query: {}
    body: {
      /**
       * @description 用户名
       * @example { username: admin }
       */
      username: string | number | boolean
      /**
       * @description 密码
       * @example { password: pws }
       */
      password: string | number | boolean
      /**
       * @description 记住我
       * @example { rememberMe: 1 }
       */
      rememberMe?: string | number | boolean
    }
    response: {
      /**
       * token
       * @description access token
       */
      token: string
      /**
       * @description id
       */
      id?: string
    }
  }
  'thing@vote': {
    params: {
      /**
       * @description Thing id
       */
      id: any;
      /**
       * @description User id
       */
      userId: any;
    }
    query: {}
    body: {}
    response: {}
  }
  '上传@通用上传': {
    params: {}
    query: {}
    body: FormData
    response: string
  }
}

export type ServiceKeys = keyof ServiceRequestAndResponseMap
