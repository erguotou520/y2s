import axios from 'axios'
import ora from 'ora'
import { OriginApis, ConfigRC, Method } from './types'
import { apiJsonFilePath, writeToFile } from './file'

export async function fetchJson(config: ConfigRC): Promise<OriginApis | undefined> {
  const { apiPrefix, projectId, token } = config
  const spinner = ora({ text: 'Fetching yapi configs...', spinner: 'bouncingBar' }).start()
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
    if (config.saveJson) {
      await writeToFile(apiJsonFilePath, JSON.stringify(res.data, null, 2), undefined, true)
    }
    return res.data as OriginApis
  }
}
