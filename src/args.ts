// import minimist, { ParsedArgs } from 'minimist'

const usageString = `usage:
y2s init # Generate y2s config file
y2s update [-y] [--js] # Generate/Update the service files, '-y' overwrite the existing files without confirm, '--js' generate '.js' files rather than '.ts' files
y2s help # Print this help message
`

type Service = 'init' | 'help' | 'update'
const services = ['init', 'help', 'update']

export function parseArgs(_args: string[]): [Service, string[]] {
  // 空命令
  if (!_args.length) {
    console.error(usageString)
    process.exit(-1)
  }
  // 服务
  const service = _args[0]
  if (!services.includes(service)) {
    console.warn('不支持的服务')
    console.error(usageString)
    process.exit(-1)
  }
  // help
  if (service === 'help') {
    console.error(usageString)
    process.exit(0)
  }
  return [service as Service, _args.slice(1)]
}
