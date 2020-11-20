/* eslint-disable */
import { Apis } from './yapi.api'

export const apis: Apis = {
  '用户@修改用户信息': {
    u: '/users/:id',
    m: 'POST',
    p: ['id'],
    d: 0
  },
  '用户@用户列表': {
    u: '/users',
    m: 'GET',
    q: ['page', 'pageSize', 'keyword', 'ids'],
    d: 0
  },
  '用户@用户详情': {
    u: '/users/:id',
    m: 'GET',
    p: ['id'],
    d: 0
  },
  '用户@获取用户关注的人数': {
    u: '/users/:id/starsCount',
    m: 'GET',
    p: ['id'],
    d: 0
  },
  '认证@登出': {
    u: '/logout',
    m: 'POST',
    d: 1
  },
  '认证@登录': {
    u: '/login',
    m: 'POST',
    d: 1
  },
  'thing@vote': {
    u: '/thing/:id/:userId/vote',
    m: 'GET',
    p: ['id', 'userId'],
    d: 0
  }
}
