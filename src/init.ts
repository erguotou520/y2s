import { configFilePath } from './file'
import { writeToFile } from './file'
import { initConfigFileTemplate } from './template'

export async function init(overwrite: boolean) {
  await writeToFile(configFilePath, initConfigFileTemplate, '配置文件已存在，是否覆盖？', overwrite)
}
