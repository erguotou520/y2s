import { writeFileSync } from 'fs'
import { ensureFileSync, existsSync } from 'fs-extra'
import { prompt } from 'inquirer'
import { resolve, parse } from 'path'
import { readConfig } from './config'

const pwd = process.cwd()
export const configFilePath = resolve(pwd, '.y2src.js')

export let serviceFilePath: string
export let serviceDescriptionFilePath: string
export let serviceKeysDescriptionFilePath: string
export let apiDescriptionFilePath: string
export let apiRequestDescriptionFilePath: string
export let apisFilePath: string
export let apiJsonFilePath: string

/**
 * 初始化service目录的相关文件的存储路径
 * @param outputPath service目录的相关文件的存储路径
 */
export function initFilePath(outputPath: string) {
  const serviceFolder = resolve(process.cwd(), outputPath)
  serviceFilePath = resolve(serviceFolder, 'yapi.services.ts')
  serviceDescriptionFilePath = resolve(serviceFolder, 'yapi.services.d.ts')
  serviceKeysDescriptionFilePath = resolve(serviceFolder, 'yapi.service.keys.d.ts')
  apiRequestDescriptionFilePath = resolve(serviceFolder, 'yapi.request.d.ts')
  apiDescriptionFilePath = resolve(serviceFolder, 'yapi.api.d.ts')
  apisFilePath = resolve(serviceFolder, 'yapi.apis.ts')
  apiJsonFilePath = resolve(serviceFolder, 'yapi.apis.json')
}

/**
 * 写文件
 * @param filePath 要写文件的路径
 * @param content 要写入的字符串
 * @param rewriteMsg 文件已存在时的提示语
 * @param overwrite 是否直接覆盖内容
 */
export async function writeToFile(
  filePath: string,
  content: string,
  rewriteMsg?: string,
  overwrite = false
): Promise<boolean> {
  const filename = parse(filePath).base
  if (existsSync(filePath)) {
    const config = readConfig()
    // 判断该文件是否ignore
    if (config?.ignoreFiles?.includes(filename)) {
      return true
    }
    // 是否命令行设置了覆盖模式
    if (overwrite) {
      writeFileSync(filePath, content, {
        encoding: 'utf8',
      })
      return true
    } else {
      const ret = await prompt({
        type: 'confirm',
        name: 'rewrite',
        message: rewriteMsg || `文件${filename}已存在，是否覆盖？`,
      })
      if (ret.rewrite) {
        writeFileSync(filePath, content, {
          encoding: 'utf8',
        })
        return true
      }
      return false
    }
  } else {
    ensureFileSync(filePath)
    writeFileSync(filePath, content, {
      encoding: 'utf8',
    })
    return true
  }
}
