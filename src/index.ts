import { parseArgs } from './args'
import { init } from './init'
import { update } from './update'

export function run(_args: string[]) {
  const [service, otherArgs] = parseArgs(_args)
  // 是否有覆写参数
  const overwrite = otherArgs.includes('-y')
  if (service === 'init') {
    init(overwrite)
  } else if (service === 'update') {
    update({ overwrite, usingJs: otherArgs.includes('--js') })
  }
}
