import { readConfig } from './config'
import { fetchJson } from './fetch'

// 更新数据
export async function update(otherArgs: string[]) {
  const config = readConfig()
  if (config) {
    const apiJson = await fetchJson(config, otherArgs.includes('-y'))
    console.log('Done!')
  }
}
