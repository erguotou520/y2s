import axios from 'axios'
import { writeFileSync, ensureDirSync, existsSync } from 'fs-extra'
import { join, resolve } from 'path'
import { writeToFile } from './file'
import { ConfigRC } from './types'

export async function fetchJson(config: ConfigRC): Promise<{ [key: string]: any } | undefined> {
  const { apiPrefix, projectId, token, outputPath = 'src/services' } = config
  let res
  try {
    res = await axios.get('/api/plugin/export', {
      baseURL: apiPrefix,
      responseType: 'json',
      timeout: 60,
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
    console.error('接口数据获取出错，请尝试检查配置')
    console.error(error)
    process.exit(-1)
  }
  if (res.status >= 200 && res.status < 300) {
    const serviceFolder = resolve(process.cwd(), outputPath)
    const apiFile = resolve(serviceFolder, 'api.json')
    ensureDirSync(serviceFolder)
    await writeToFile(apiFile, res.data, 'api.json文件已存在，是否覆盖？')
    return res.data
  }
}
