import { readConfig } from './config'
import { fetchJson } from './fetch'
import { apiDescriptionFilePath, apisFilePath, initFilePath, serviceFilePath, writeToFile } from './file'
import { convertApiToService } from './service'
import { apiDescriptionFileTemplate, apisFileTemplate, servicesFileTemplate } from './template'

// interface RequestAndResponseMap {
//   [key: string]: {
//     request: { [key1: string]: any }
//     response: { [key2: string]: any }
//   }
// }

// 更新数据
export async function update(overwrite: boolean) {
  const config = readConfig()
  if (config) {
    const apiJson = await fetchJson(config)
    if (typeof apiJson !== 'undefined') {
      // 初始化service目录的相关文件的存储路径
      initFilePath(config.outputPath)
      // 根据api获取service配置数据
      // const services = convertApiToService(apiJson)
      // // 生成yapi.services.ts文件
      // await writeToFile(serviceFilePath, servicesFileTemplate, undefined, overwrite)
      // // 生成yapi.api.d.ts文件
      // const serviceKeys = Object.keys(services)
      // await writeToFile(
      //   apiDescriptionFilePath,
      //   apiDescriptionFileTemplate.replace('$$1', `\'${serviceKeys.join("' | '")}\'`).replace(
      //     '$$2',
      //     serviceKeys
      //       .reduce<string[]>((arr, key) => {
      //         const api = services[key]
      //         arr.push(`${key}: { request: {${
      //           api.query.
      //         }}, response: {} }`)
      //         return arr
      //       }, [])
      //       .join('\n  ')
      //   ),
      //   undefined,
      //   overwrite
      // )
      // // 生成yapi.apis.ts文件
      // await writeToFile(apisFilePath, apisFileTemplate.replace('$$1', ''), undefined, overwrite)
      // console.log('Done!')
    }
  }
}
