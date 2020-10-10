import { Apis } from './yapi.api'

export const apis: Apis = {
  '用户@用户列表': {
    u: '/users',
    m: 'GET',
    q: {
      size: { type: 'number', required: 1 },
      pageSize: { type: 'number', required: 1 },
    },
  },
  '用户@用户详情': {
    u: '/users/:id',
    m: 'GET',
    p: {
      id: { type: 'number' },
    },
  },
}
