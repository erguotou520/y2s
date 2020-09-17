import { configFile } from './config'
import { writeToFile } from './file'
import { initConfigFileTemplate } from './template'

export async function init() {
  await writeToFile(configFile, initConfigFileTemplate, '配置文件已存在，是否覆盖？')
}
