import { writeFileSync } from 'fs'
import { existsSync } from 'fs-extra'
import { prompt } from 'inquirer'
import { configFile } from './config'
import { initConfigFileTemplate } from './template'

function writeConfigFile(file: string) {
  return writeFileSync(file, initConfigFileTemplate, {
    encoding: 'utf8',
  })
}

export async function init() {
  try {
    if (existsSync(configFile)) {
      const ret = await prompt({
        type: 'confirm',
        name: 'rewrite',
        message: '配置文件已存在，是否覆盖？',
      })
      if (ret.rewrite) {
        writeConfigFile(configFile)
      }
    } else {
      writeConfigFile(configFile)
    }
  } catch (error) {
    console.error(error)
    process.exit(-1)
  }
}
