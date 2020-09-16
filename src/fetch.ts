import axios from 'axios'
import { writeFileSync } from 'fs-extra'
import { join, resolve } from 'path'
import { ConfigRC } from './types'

export async function fetchJson(config: ConfigRC): { [key: string]: any } {
  try {
    const { apiPrefix, projectId, token, outputPath = '/src/services' } = config
    const res = await axios.get(join(apiPrefix, '/api/plugin/export'), {
      params: {
        type: 'json',
        pid: projectId,
        status: 'all',
        isWiki: false,
        token: token,
      },
    })
    if (res.status >= 200 && res.status < 300) {
      const apiFile = resolve(process.cwd(), outputPath, 'api.json')
      writeFileSync(apiFile, res.data, { encoding: 'utf8' })
    }
  } catch (error) {
    console.error('接口数据获取出错，请尝试检查配置')
    console.error(error)
    process.exit(-1)
  }
}
