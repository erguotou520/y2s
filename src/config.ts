import { existsSync } from 'fs-extra'
import { resolve } from 'path'
import { ConfigRC } from './types'
import { isNumber, isObject, isString } from './utils'

const pwd = process.cwd()
export const configFile = resolve(pwd, '.y2src.js')

// 读取配置
export function readConfig(): ConfigRC | undefined {
  try {
    if (!existsSync(configFile)) {
      console.error('.y2src.js文件不存在，请先创建，或者使用y2s init命令生成')
      process.exit(-1)
    }
    const config = require(configFile)
    if (isObject(config) && isString(config.apiPrefix) && isString(config.token) && isNumber(config.projectId)) {
      return config as ConfigRC
    }
  } catch (error) {
    console.error('.y2src.js文件读取错误，请检查配置')
    console.error(error)
    process.exit(-1)
  }
}
