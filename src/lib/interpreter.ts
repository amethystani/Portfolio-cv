import {
  vfs,
  resolvePath,
  normalizePath,
  listDir,
  displayPath,
  getCompletions,
  type DirNode,
} from './filesystem'

// ANSI color codes
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  brightBlue: '\x1b[94m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
}

export const CLEAR_SENTINEL = '\x00CLEAR\x00'
export const OPEN_URL_PREFIX = '\x00OPEN:'

export type InterpreterState = {
  cwd: string
  history: string[]
  historyIndex: number
}

export function createInterpreterState(): InterpreterState {
  return { cwd: '/', history: [], historyIndex: -1 }
}

export function getPrompt(state: InterpreterState): string {
  const path = displayPath(state.cwd)
  return `${c.green}animesh@MacBook${c.reset} ${c.brightBlue}${path}${c.reset} ${c.white}%${c.reset} `
}

export function execute(line: string, state: InterpreterState): string {
  const trimmed = line.trim()
  if (!trimmed) return ''

  // Add to history
  if (state.history[state.history.length - 1] !== trimmed) {
    state.history.push(trimmed)
  }
  state.historyIndex = -1

  const tokens = parseTokens(trimmed)
  if (tokens.length === 0) return ''

  const [cmd, ...args] = tokens

  switch (cmd) {
    case 'ls':
      return cmdLs(args, state)
    case 'cd':
      return cmdCd(args, state)
    case 'pwd':
      return displayPath(state.cwd)
    case 'cat':
      return cmdCat(args, state)
    case 'open':
      return cmdOpen(args, state)
    case 'echo':
      return args.join(' ')
    case 'clear':
      return CLEAR_SENTINEL
    case 'whoami':
      return 'animesh'
    case 'help':
      return cmdHelp()
    case 'man':
      return cmdMan(args)
    case 'uname':
      return args.includes('-a')
        ? 'Darwin MacBook 23.0.0 Darwin Kernel Version 23.0.0 arm64'
        : 'Darwin'
    case 'date':
      return new Date().toString()
    case 'hostname':
      return 'Animesh-MacBook.local'
    case 'exit':
    case 'logout':
      return `${c.dim}[Process completed]${c.reset}`
    default:
      return `${c.red}bash: ${cmd}: command not found${c.reset}\nType ${c.cyan}'help'${c.reset} to see available commands.`
  }
}

function parseTokens(line: string): string[] {
  const tokens: string[] = []
  let current = ''
  let inQuote = false
  let quoteChar = ''
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuote) {
      if (ch === quoteChar) {
        inQuote = false
      } else {
        current += ch
      }
    } else if (ch === '"' || ch === "'") {
      inQuote = true
      quoteChar = ch
    } else if (ch === ' ') {
      if (current) {
        tokens.push(current)
        current = ''
      }
    } else {
      current += ch
    }
  }
  if (current) tokens.push(current)
  return tokens
}

function cmdLs(args: string[], state: InterpreterState): string {
  const flags = args.filter(a => a.startsWith('-'))
  const paths = args.filter(a => !a.startsWith('-'))
  const showAll = flags.some(f => f.includes('a'))
  const longFormat = flags.some(f => f.includes('l'))

  const targetPath = paths[0] ? normalizePath(paths[0], state.cwd) : state.cwd
  const node = resolvePath(targetPath, state.cwd)

  if (!node) {
    return `${c.red}ls: ${paths[0] || '.'}: No such file or directory${c.reset}`
  }
  if (node.type === 'file') {
    return formatEntry(paths[0] || targetPath, node, longFormat)
  }

  const entries = listDir(node as DirNode)
  const visible = showAll
    ? [{ name: '.', node: { type: 'dir' as const, children: {} } }, { name: '..', node: { type: 'dir' as const, children: {} } }, ...entries]
    : entries

  if (longFormat) {
    const lines = ['total ' + visible.length]
    for (const { name, node: n } of visible) {
      lines.push(formatEntry(name, n, true))
    }
    return lines.join('\r\n')
  }

  // Short format: color dirs blue, files white
  const parts = visible.map(({ name, node: n }) =>
    n.type === 'dir'
      ? `${c.brightBlue}${c.bold}${name}/${c.reset}`
      : `${c.brightWhite}${name}${c.reset}`
  )
  return parts.join('  ')
}

function formatEntry(name: string, node: { type: string }, long: boolean): string {
  const isDir = node.type === 'dir'
  if (long) {
    const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--'
    const size = isDir ? '-' : '4096'
    const date = 'Apr  1 00:00'
    const colored = isDir
      ? `${c.brightBlue}${c.bold}${name}/${c.reset}`
      : `${c.brightWhite}${name}${c.reset}`
    return `${c.dim}${perms}  1 animesh  staff  ${size.padStart(5)}  ${date}${c.reset}  ${colored}`
  }
  return isDir ? `${c.brightBlue}${c.bold}${name}/${c.reset}` : `${c.brightWhite}${name}${c.reset}`
}

function cmdCd(args: string[], state: InterpreterState): string {
  const target = args[0] ?? '~'
  const newPath = target === '~' || target === '' ? '/' : normalizePath(target, state.cwd)
  const node = resolvePath(newPath, state.cwd)
  if (!node) {
    return `${c.red}cd: ${target}: No such file or directory${c.reset}`
  }
  if (node.type !== 'dir') {
    return `${c.red}cd: ${target}: Not a directory${c.reset}`
  }
  state.cwd = newPath
  return ''
}

function cmdCat(args: string[], state: InterpreterState): string {
  if (args.length === 0) {
    return `${c.red}cat: missing operand${c.reset}`
  }
  const results: string[] = []
  for (const arg of args) {
    const targetPath = normalizePath(arg, state.cwd)
    const node = resolvePath(targetPath, state.cwd)
    if (!node) {
      results.push(`${c.red}cat: ${arg}: No such file or directory${c.reset}`)
    } else if (node.type === 'dir') {
      results.push(`${c.red}cat: ${arg}: Is a directory${c.reset}`)
    } else if (arg.endsWith('.pdf')) {
      results.push(
        `${c.yellow}[binary file]${c.reset} Use ${c.cyan}'open ${arg}'${c.reset} to view this PDF.`
      )
    } else {
      results.push(node.content)
    }
  }
  return results.join('\r\n')
}

function cmdOpen(args: string[], state: InterpreterState): string {
  if (args.length === 0) {
    return `${c.red}open: missing argument${c.reset}`
  }
  const target = args[0]

  if (target === 'portfolio') {
    return OPEN_URL_PREFIX + '/portfolio'
  }

  const targetPath = normalizePath(target, state.cwd)
  const node = resolvePath(targetPath, state.cwd)

  if (!node) {
    return `${c.red}open: ${target}: No such file or directory${c.reset}`
  }

  if (node.type === 'dir') {
    return `${c.red}open: ${target}: Is a directory${c.reset}`
  }

  if (target.endsWith('.pdf') || targetPath.endsWith('.pdf')) {
    return OPEN_URL_PREFIX + '/resume.pdf'
  }

  return `${c.yellow}Opening ${target}...${c.reset}\r\n` + node.content
}

function cmdHelp(): string {
  return [
    `${c.bold}${c.brightWhite}Available commands:${c.reset}`,
    '',
    `  ${c.cyan}ls${c.reset} ${c.dim}[-la] [path]${c.reset}        List directory contents`,
    `  ${c.cyan}cd${c.reset} ${c.dim}[path]${c.reset}              Change directory`,
    `  ${c.cyan}pwd${c.reset}                     Print working directory`,
    `  ${c.cyan}cat${c.reset} ${c.dim}<file>...${c.reset}          Print file contents`,
    `  ${c.cyan}open${c.reset} ${c.dim}<file|portfolio>${c.reset}  Open file or navigate to portfolio`,
    `  ${c.cyan}echo${c.reset} ${c.dim}<text>${c.reset}            Print text`,
    `  ${c.cyan}whoami${c.reset}                  Print current user`,
    `  ${c.cyan}uname${c.reset} ${c.dim}[-a]${c.reset}             Print system info`,
    `  ${c.cyan}date${c.reset}                    Print current date/time`,
    `  ${c.cyan}hostname${c.reset}                Print hostname`,
    `  ${c.cyan}clear${c.reset}                   Clear the terminal`,
    `  ${c.cyan}man${c.reset} ${c.dim}<command>${c.reset}           Show manual for command`,
    `  ${c.cyan}help${c.reset}                    Show this help message`,
    '',
    `${c.dim}Tips:${c.reset}`,
    `  ${c.dim}Use Tab for auto-completion${c.reset}`,
    `  ${c.dim}Use Up/Down arrows for command history${c.reset}`,
    `  ${c.dim}Try: cat about.txt  |  ls projects/  |  open portfolio${c.reset}`,
  ].join('\r\n')
}

function cmdMan(args: string[]): string {
  if (args.length === 0) {
    return `${c.red}man: missing argument${c.reset}`
  }
  const manPages: Record<string, string> = {
    ls: [
      `${c.bold}LS(1)${c.reset}`,
      '',
      `${c.bold}NAME${c.reset}`,
      '       ls -- list directory contents',
      '',
      `${c.bold}SYNOPSIS${c.reset}`,
      '       ls [-la] [path ...]',
      '',
      `${c.bold}DESCRIPTION${c.reset}`,
      '       For each operand that names a file of a type other than',
      '       directory, ls displays its name. For each operand that',
      '       names a file of type directory, ls displays the names of',
      '       files in the directory.',
      '',
      `${c.bold}OPTIONS${c.reset}`,
      '       -l      Use long format listing.',
      '       -a      Include directory entries starting with a dot (.).',
    ].join('\r\n'),
    cd: [
      `${c.bold}CD(1)${c.reset}`,
      '',
      `${c.bold}NAME${c.reset}`,
      '       cd -- change directory',
      '',
      `${c.bold}SYNOPSIS${c.reset}`,
      '       cd [path]',
      '',
      `${c.bold}DESCRIPTION${c.reset}`,
      '       Change the current working directory to path.',
      '       If no path is given, cd changes to the home directory (~).',
    ].join('\r\n'),
    cat: [
      `${c.bold}CAT(1)${c.reset}`,
      '',
      `${c.bold}NAME${c.reset}`,
      '       cat -- concatenate and print files',
      '',
      `${c.bold}SYNOPSIS${c.reset}`,
      '       cat [file ...]',
      '',
      `${c.bold}DESCRIPTION${c.reset}`,
      '       The cat utility reads files sequentially, writing them to',
      '       the standard output. For PDF files, use open instead.',
    ].join('\r\n'),
    open: [
      `${c.bold}OPEN(1)${c.reset}`,
      '',
      `${c.bold}NAME${c.reset}`,
      '       open -- open a file or URL',
      '',
      `${c.bold}SYNOPSIS${c.reset}`,
      '       open <file|portfolio>',
      '',
      `${c.bold}DESCRIPTION${c.reset}`,
      '       Opens a file or navigates to a section.',
      '       "open resume.pdf" opens the PDF in a new tab.',
      '       "open portfolio" navigates to the visual portfolio page.',
    ].join('\r\n'),
  }

  const page = manPages[args[0]]
  if (!page) {
    return `${c.red}man: no manual entry for ${args[0]}${c.reset}`
  }
  return page
}

export { getCompletions }
