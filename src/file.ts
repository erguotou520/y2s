import { writeFileSync } from 'fs'
import { ensureFileSync, existsSync } from 'fs-extra'
import { prompt } from 'inquirer'
import { resolve, parse } from 'path'

const pwd = process.cwd()
export const configFilePath = resolve(pwd, '.y2src.js')

export let serviceFilePath: string
export let apiDescriptionFilePath: string
export let apisFilePath: string

/**
 * 初始化service目录的相关文件的存储路径
 * @param outputPath service目录的相关文件的存储路径
 */
export function initFilePath(outputPath: string) {
  const serviceFolder = resolve(process.cwd(), outputPath)
  serviceFilePath = resolve(serviceFolder, 'yapi.services.ts')
  apiDescriptionFilePath = resolve(serviceFolder, 'yapi.api.d.ts')
  apisFilePath = resolve(serviceFolder, 'yapi.apis.ts')
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
  try {
    if (existsSync(filePath) && !overwrite) {
      const { base } = parse(filePath)
      const ret = await prompt({
        type: 'confirm',
        name: 'rewrite',
        message: rewriteMsg || `文件${base}已存在，是否覆盖？`,
      })
      if (ret.rewrite) {
        writeFileSync(filePath, content, {
          encoding: 'utf8',
        })
        return true
      }
      return false
    } else {
      ensureFileSync(filePath)
      writeFileSync(filePath, content, {
        encoding: 'utf8',
      })
      return true
    }
  } catch (error) {
    console.error(error)
    process.exit(-1)
  }
}
