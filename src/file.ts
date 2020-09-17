import { writeFileSync } from 'fs'
import { existsSync } from 'fs-extra'
import { prompt } from 'inquirer'

/**
 * 写文件
 * @param filePath 要写文件的路径
 * @param rewriteMsg 文件已存在时的提示语
 */
export async function writeToFile(filePath: string, content: string, rewriteMsg?: string): Promise<boolean> {
  try {
    if (existsSync(filePath)) {
      const ret = await prompt({
        type: 'confirm',
        name: 'rewrite',
        message: rewriteMsg || '文件已存在，是否覆盖？',
      })
      if (ret.rewrite) {
        writeFileSync(filePath, content, {
          encoding: 'utf8',
        })
        return true
      }
      return false
    } else {
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
