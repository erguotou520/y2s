import axios from 'axios'
import { ensureDirSync } from 'fs-extra'
import { resolve } from 'path'
import ora from 'ora'
import { writeToFile } from './file'
import { ConfigRC } from './types'

export async function fetchJson(config: ConfigRC): Promise<{ [key: string]: any } | undefined> {
  const { apiPrefix, projectId, token, outputPath = 'src/services' } = config
  const spinner = ora({ text: 'Downloading api json', spinner: 'bouncingBar' }).start()
  let res
  try {
    res = await axios.get('/api/plugin/export', {
      baseURL: apiPrefix,
      responseType: 'json',
      timeout: 60000,
      timeoutErrorMessage: 'Yapi接口请求超时',
      params: {
        type: 'json',
        pid: projectId,
        status: 'all',
        isWiki: false,
        token: token,
      },
    })
  } catch (error) {
    console.error(error.code, '接口数据获取出错，请尝试检查配置')
    console.error(error.message)
    console.error(error.stack)
    process.exit(-1)
  }
  spinner.stop()
  if (res.status >= 200 && res.status < 300) {
    const serviceFolder = resolve(process.cwd(), outputPath)
    const apiFile = resolve(serviceFolder, 'api.json')
    ensureDirSync(serviceFolder)
    await writeToFile(apiFile, JSON.stringify(res.data, null, 2), 'api.json文件已存在，是否覆盖？')
    return res.data
  }
}
