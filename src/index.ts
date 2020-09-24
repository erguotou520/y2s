import { parseArgs } from './args'
import { init } from './init'
import { update } from './update'

export function run(_args: string[]) {
  const [service, otherArgs] = parseArgs(_args)
  if (service === 'init') {
    init()
  } else if (service === 'update') {
    update(otherArgs)
  }
}
