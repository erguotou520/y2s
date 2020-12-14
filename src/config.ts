import { existsSync } from 'fs-extra'
import { configFilePath } from './file'
import { ConfigRC } from './types'
import { isNumber, isObject, isString } from './utils'

let _config: ConfigRC

// 读取配置
export function readConfig(): ConfigRC | undefined {
  if (_config) {
    return _config
  }
  try {
    if (!existsSync(configFilePath)) {
      console.error('.y2src.js文件不存在，请先创建，或者使用y2s init命令生成')
      process.exit(-1)
    }
    const config = require(configFilePath)
    if (isObject(config) && isString(config.apiPrefix) && isString(config.token) && isNumber(config.projectId)) {
      config.outputPath = config.outputPath ?? 'src/services'
      _config = config as ConfigRC
      return _config
    }
  } catch (error) {
    console.error('.y2src.js文件读取错误，请检查配置')
    console.error(error)
    process.exit(-1)
  }
}
