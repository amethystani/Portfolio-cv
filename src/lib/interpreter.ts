import {
  vfs, resolvePath, normalizePath, listDir, displayPath,
  getCompletions, expandGlob, mkdirFS, touchFS, writeFileFS,
  rmFS, cpFS, mvFS, findFiles, getTree, getNodeSize, deepCloneNode,
  type DirNode, type FSNode,
} from './filesystem'
import {
  cmdGrep, cmdHead, cmdTail, cmdWc, cmdSort, cmdUniq, cmdTr, cmdCut,
  cmdSed, cmdAwk, cmdRev, cmdTac, cmdNl, cmdSeq, cmdBase64, cmdXxd,
  cmdMd5, cmdPrintf, cmdExpr, cmdBc, cmdCal, cmdCowsay, cmdFortune,
  cmdNeofetch, cmdYes, cmdPing, cmdCurl, cmdSsh, cmdWget,
} from './commands'

const c = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m', italic: '\x1b[3m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', blue: '\x1b[34m',
  magenta: '\x1b[35m', cyan: '\x1b[36m', white: '\x1b[37m',
  brightBlue: '\x1b[94m', brightCyan: '\x1b[96m', brightWhite: '\x1b[97m',
}

export const CLEAR_SENTINEL = '\x00CLEAR\x00'
export const OPEN_URL_PREFIX = '\x00OPEN:'
export const EDIT_PREFIX = '\x00EDIT:'

export type InterpreterState = {
  cwd: string
  history: string[]
  historyIndex: number
  env: Record<string, string>
  aliases: Record<string, string>
  lastExitCode: number
  lastOutput: string
  startTime: number
}

export function createInterpreterState(): InterpreterState {
  return {
    cwd: '/',
    history: [],
    historyIndex: -1,
    env: {
      HOME: '/', USER: 'animesh', SHELL: '/bin/zsh', TERM: 'xterm-256color',
      EDITOR: 'nvim', LANG: 'en_US.UTF-8', PATH: '/usr/local/bin:/usr/bin:/bin',
      HOSTNAME: 'Animesh-MacBook.local', PS1: '%n@%m %~ %% ',
      OLDPWD: '/', SHLVL: '1', LOGNAME: 'animesh',
    },
    aliases: { ll: 'ls -la', la: 'ls -a', '..': 'cd ..', '...': 'cd ../..', cls: 'clear' },
    lastExitCode: 0,
    lastOutput: '',
    startTime: Date.now(),
  }
}

export function getPrompt(state: InterpreterState): string {
  const path = displayPath(state.cwd)
  return `${c.green}animesh@MacBook${c.reset} ${c.brightBlue}${path}${c.reset} ${c.white}%${c.reset} `
}

// ──────────── Main execute: handles ;, &&, ||, pipes, redirection ────────────

export function execute(line: string, state: InterpreterState): string {
  const trimmed = line.trim()
  if (!trimmed) return ''

  if (state.history[state.history.length - 1] !== trimmed) state.history.push(trimmed)
  state.historyIndex = -1

  // Handle !! and !n
  const expanded = expandHistory(trimmed, state)
  if (expanded === null) return `${c.red}bash: !: event not found${c.reset}`

  return executeChain(expanded, state)
}

function expandHistory(line: string, state: InterpreterState): string | null {
  if (line === '!!') return state.history.length >= 2 ? state.history[state.history.length - 2] : null
  if (/^!(\d+)$/.test(line)) {
    const n = parseInt(line.slice(1))
    return state.history[n - 1] ?? null
  }
  if (/^!-(\d+)$/.test(line)) {
    const n = parseInt(line.slice(2))
    return state.history[state.history.length - 1 - n] ?? null
  }
  return line
}

function executeChain(line: string, state: InterpreterState): string {
  // Split on ; && || (respecting quotes)
  const segments = splitChain(line)
  const outputs: string[] = []

  for (const seg of segments) {
    if (seg.op === '&&' && state.lastExitCode !== 0) continue
    if (seg.op === '||' && state.lastExitCode === 0) continue

    const result = executePipeline(seg.cmd.trim(), state)
    if (result) outputs.push(result)
  }

  return outputs.join('\r\n')
}

function splitChain(line: string): Array<{ cmd: string; op: string }> {
  const segments: Array<{ cmd: string; op: string }> = []
  let current = ''
  let inQuote = false
  let quoteChar = ''
  let op = ''

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuote) {
      current += ch
      if (ch === quoteChar) inQuote = false
      continue
    }
    if (ch === '"' || ch === "'") { inQuote = true; quoteChar = ch; current += ch; continue }
    if (ch === ';') { segments.push({ cmd: current, op }); current = ''; op = ';'; continue }
    if (ch === '&' && line[i + 1] === '&') { segments.push({ cmd: current, op }); current = ''; op = '&&'; i++; continue }
    if (ch === '|' && line[i + 1] === '|') { segments.push({ cmd: current, op }); current = ''; op = '||'; i++; continue }
    current += ch
  }
  if (current.trim()) segments.push({ cmd: current, op })
  return segments
}

function executePipeline(line: string, state: InterpreterState): string {
  // Handle output redirection at the end
  let redirectFile = ''
  let appendMode = false
  const redirectMatch = line.match(/^(.*?)\s*(>>|>)\s*(\S+)\s*$/)
  if (redirectMatch) {
    line = redirectMatch[1]
    appendMode = redirectMatch[2] === '>>'
    redirectFile = redirectMatch[3]
  }

  // Split by pipe (not ||)
  const cmds = splitPipes(line)
  let output = ''

  for (const cmd of cmds) {
    output = executeSingle(cmd.trim(), state, output)
    if (output === CLEAR_SENTINEL || output.startsWith(OPEN_URL_PREFIX)) return output
  }

  // Handle redirection
  if (redirectFile) {
    const path = normalizePath(redirectFile, state.cwd)
    const err = writeFileFS(path, output, state.cwd, appendMode)
    if (err) return `${c.red}${err}${c.reset}`
    return ''
  }

  state.lastOutput = output
  return output
}

function splitPipes(line: string): string[] {
  const parts: string[] = []
  let current = ''
  let inQuote = false
  let quoteChar = ''
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuote) { current += ch; if (ch === quoteChar) inQuote = false; continue }
    if (ch === '"' || ch === "'") { inQuote = true; quoteChar = ch; current += ch; continue }
    if (ch === '|' && line[i + 1] !== '|') { parts.push(current); current = ''; continue }
    current += ch
  }
  if (current.trim()) parts.push(current)
  return parts
}

// ──────────── Single command execution ────────────

function executeSingle(line: string, state: InterpreterState, stdin: string): string {
  // Variable expansion
  line = expandVars(line, state)

  const tokens = parseTokens(line)
  if (tokens.length === 0) return ''

  let [cmd, ...args] = tokens

  // Alias expansion (max 10 depth to prevent loops)
  for (let depth = 0; depth < 10; depth++) {
    if (state.aliases[cmd]) {
      const expanded = parseTokens(state.aliases[cmd])
      cmd = expanded[0]
      args = [...expanded.slice(1), ...args]
    } else break
  }

  // Glob expansion for file args
  args = args.flatMap(a => (a.includes('*') || a.includes('?')) ? expandGlob(a, state.cwd) : [a])

  state.env.PWD = state.cwd
  state.env['?'] = String(state.lastExitCode)

  try {
    const result = dispatchCommand(cmd, args, state, stdin)
    state.lastExitCode = 0
    return result
  } catch (e) {
    state.lastExitCode = 1
    return `${c.red}${e}${c.reset}`
  }
}

function expandVars(line: string, state: InterpreterState): string {
  // Replace $VAR and ${VAR}
  return line.replace(/\$\{([^}]+)\}|\$([A-Za-z_?][A-Za-z0-9_]*)/g, (_, g1, g2) => {
    const key = g1 || g2
    return state.env[key] ?? ''
  })
}

function parseTokens(line: string): string[] {
  const tokens: string[] = []
  let current = ''
  let inQuote = false
  let quoteChar = ''
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuote) {
      if (ch === quoteChar) inQuote = false
      else current += ch
    } else if (ch === '"' || ch === "'") { inQuote = true; quoteChar = ch }
    else if (ch === ' ' || ch === '\t') { if (current) { tokens.push(current); current = '' } }
    else if (ch === '\\' && i + 1 < line.length) { current += line[++i] }
    else current += ch
  }
  if (current) tokens.push(current)
  return tokens
}

// ──────────── Command dispatch ────────────

function dispatchCommand(cmd: string, args: string[], state: InterpreterState, stdin: string): string {
  switch (cmd) {
    case 'ls': return cmdLs(args, state)
    case 'cd': return cmdCd(args, state)
    case 'pwd': return displayPath(state.cwd)
    case 'cat': return cmdCat(args, state, stdin)
    case 'open': return cmdOpen(args, state)
    case 'echo': return cmdEcho(args)
    case 'clear': return CLEAR_SENTINEL
    case 'whoami': return state.env.USER || 'animesh'
    case 'help': return cmdHelp()
    case 'man': return cmdMan(args)
    case 'uname': return cmdUname(args)
    case 'date': return new Date().toString()
    case 'hostname': return state.env.HOSTNAME || 'Animesh-MacBook.local'
    case 'exit': case 'logout': return `${c.dim}[Process completed]${c.reset}`
    case 'export': return cmdExport(args, state)
    case 'unset': return cmdUnset(args, state)
    case 'env': case 'printenv': return cmdEnv(args, state)
    case 'set': return cmdSet(state)
    case 'alias': return cmdAlias(args, state)
    case 'unalias': return cmdUnalias(args, state)
    case 'history': return cmdHistory(state)
    case 'which': case 'type': case 'command': return cmdWhich(args)
    case 'mkdir': return cmdMkdir(args, state)
    case 'rmdir': return cmdRmdir(args, state)
    case 'touch': return cmdTouch(args, state)
    case 'rm': return cmdRm(args, state)
    case 'cp': return cmdCp(args, state)
    case 'mv': return cmdMv(args, state)
    case 'find': return cmdFind(args, state)
    case 'tree': return cmdTree(args, state)
    case 'diff': return cmdDiff(args, state)
    case 'head': return cmdHead(args, stdin || readFileArg(args, state))
    case 'tail': return cmdTail(args, stdin || readFileArg(args, state))
    case 'grep': return cmdGrep(args, stdin || readFileArgForGrep(args, state))
    case 'wc': return cmdWc(args, stdin || readFileArg(args, state))
    case 'sort': return cmdSort(args, stdin || readFileArg(args, state))
    case 'uniq': return cmdUniq(args, stdin || readFileArg(args, state))
    case 'tr': return cmdTr(args, stdin)
    case 'cut': return cmdCut(args, stdin || readFileArg(args, state))
    case 'sed': return cmdSed(args, stdin || readFileArg(args, state))
    case 'awk': return cmdAwk(args, stdin || readFileArg(args, state))
    case 'rev': return cmdRev(args, stdin || readFileArg(args, state))
    case 'tac': return cmdTac(args, stdin || readFileArg(args, state))
    case 'nl': return cmdNl(args, stdin || readFileArg(args, state))
    case 'tee': return cmdTee(args, state, stdin)
    case 'xargs': return cmdXargs(args, state, stdin)
    case 'seq': return cmdSeq(args)
    case 'printf': return cmdPrintf(args)
    case 'expr': return cmdExpr(args)
    case 'bc': return cmdBc(args, stdin)
    case 'base64': return cmdBase64(args, stdin)
    case 'xxd': return cmdXxd(args, stdin)
    case 'md5': case 'md5sum': case 'sha256sum': return cmdMd5(args, stdin)
    case 'cal': return cmdCal()
    case 'cowsay': return cmdCowsay(args)
    case 'fortune': return cmdFortune()
    case 'neofetch': case 'screenfetch': case 'fastfetch': return cmdNeofetch()
    case 'uptime': return cmdUptime(state)
    case 'df': return cmdDf()
    case 'du': return cmdDu(args, state)
    case 'ps': return cmdPs()
    case 'kill': return `${c.dim}[simulated] kill: ${args[0] || 'PID'}: No such process${c.reset}`
    case 'jobs': return ''
    case 'fg': case 'bg': return `${c.red}${cmd}: no current job${c.reset}`
    case 'chmod': return cmdChmod(args)
    case 'chown': return `${c.red}chown: operation not permitted${c.reset}`
    case 'ln': return `${c.dim}ln: simulated${c.reset}`
    case 'basename': return args[0] ? args[0].split('/').pop()! : ''
    case 'dirname': { const p = args[0]?.split('/') || []; p.pop(); return p.join('/') || '/' }
    case 'realpath': return args[0] ? normalizePath(args[0], state.cwd) : state.cwd
    case 'readlink': return args[0] ? normalizePath(args[0], state.cwd) : ''
    case 'yes': return cmdYes(args)
    case 'true': state.lastExitCode = 0; return ''
    case 'false': state.lastExitCode = 1; return ''
    case 'test': case '[': return cmdTest(args, state)
    case 'sleep': return `${c.dim}[sleep ${args[0] || '0'}s — simulated]${c.reset}`
    case 'ping': return cmdPing(args)
    case 'curl': return cmdCurl(args)
    case 'wget': return cmdWget(args)
    case 'ssh': return cmdSsh(args)
    case 'scp': return `${c.red}scp: connection refused [simulated]${c.reset}`
    case 'id': return `uid=501(animesh) gid=20(staff) groups=20(staff),80(admin)`
    case 'groups': return 'staff admin'
    case 'w': case 'who': return `animesh  console  Apr  1 00:00`
    case 'last': return `animesh  ttys000  :0   Apr  1 00:00   still logged in`
    case 'su': case 'sudo': return `${c.red}${cmd}: permission denied [simulated]${c.reset}`
    case 'apt': case 'apt-get': case 'brew': return `${c.dim}${cmd}: simulated — no package manager available${c.reset}`
    case 'npm': case 'npx': case 'node': case 'python': case 'python3':
    case 'pip': case 'pip3': case 'cargo': case 'go': case 'rustc':
    case 'gcc': case 'g++': case 'make': case 'cmake':
      return `${c.dim}${cmd}: command available in a real terminal [simulated]${c.reset}`
    case 'git': return cmdGit(args)
    case 'vim': case 'nvim': case 'nano': case 'vi':
      return cmdNanoEdit(cmd, args, state)
    case 'top': case 'htop': return `${c.dim}${cmd}: interactive mode not available. Use 'ps' instead${c.reset}`
    case 'less': case 'more': return stdin || `${c.dim}${cmd}: use 'cat' to view files${c.reset}`
    case 'file': return cmdFile(args, state)
    case 'stat': return cmdStat(args, state)
    case 'source': case '.': return `${c.dim}source: simulated${c.reset}`
    default:
      state.lastExitCode = 127
      return `${c.red}zsh: command not found: ${cmd}${c.reset}\r\nType ${c.cyan}'help'${c.reset} to see available commands.`
  }
}

// ──────────── Helper: read file from last non-flag arg ────────────

function readFileArg(args: string[], state: InterpreterState): string {
  const fileArgs = args.filter(a => !a.startsWith('-'))
  const last = fileArgs[fileArgs.length - 1]
  if (!last) return ''
  const node = resolvePath(normalizePath(last, state.cwd), state.cwd)
  if (!node || node.type !== 'file') return ''
  return node.content
}

function readFileArgForGrep(args: string[], state: InterpreterState): string {
  const nonFlags = args.filter(a => !a.startsWith('-'))
  if (nonFlags.length < 2) return ''
  const file = nonFlags[nonFlags.length - 1]
  const node = resolvePath(normalizePath(file, state.cwd), state.cwd)
  if (!node || node.type !== 'file') return ''
  return node.content
}

// ──────────── Individual commands ────────────

function cmdLs(args: string[], state: InterpreterState): string {
  const flags = args.filter(a => a.startsWith('-'))
  const paths = args.filter(a => !a.startsWith('-'))
  const showAll = flags.some(f => f.includes('a'))
  const longFormat = flags.some(f => f.includes('l'))
  const humanReadable = flags.some(f => f.includes('h'))
  const recursive = flags.some(f => f.includes('R'))

  const target = paths[0] ? normalizePath(paths[0], state.cwd) : state.cwd
  const node = resolvePath(target, state.cwd)
  if (!node) return `${c.red}ls: ${paths[0] || '.'}: No such file or directory${c.reset}`
  if (node.type === 'file') return formatEntry(paths[0] || target, node, longFormat, humanReadable)

  const entries = listDir(node as DirNode)
  let visible = showAll
    ? [{ name: '.', node: { type: 'dir' as const, children: {} } }, { name: '..', node: { type: 'dir' as const, children: {} } }, ...entries]
    : entries.filter(e => !e.name.startsWith('.'))

  if (longFormat) {
    const lines = [`total ${visible.length}`]
    for (const e of visible) lines.push(formatEntry(e.name, e.node, true, humanReadable))
    return lines.join('\r\n')
  }
  return visible.map(e => e.node.type === 'dir' ? `${c.brightBlue}${c.bold}${e.name}/${c.reset}` : `${c.brightWhite}${e.name}${c.reset}`).join('  ')
}

function formatEntry(name: string, node: FSNode, long: boolean, humanReadable = false): string {
  const isDir = node.type === 'dir'
  if (!long) return isDir ? `${c.brightBlue}${c.bold}${name}/${c.reset}` : `${c.brightWhite}${name}${c.reset}`
  const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--'
  const rawSize = isDir ? 0 : getNodeSize(node)
  const size = humanReadable ? humanSize(rawSize) : String(rawSize).padStart(5)
  const date = 'Apr  1 00:00'
  const colored = isDir ? `${c.brightBlue}${c.bold}${name}/${c.reset}` : `${c.brightWhite}${name}${c.reset}`
  return `${c.dim}${perms}  1 animesh  staff  ${size}  ${date}${c.reset}  ${colored}`
}

function humanSize(bytes: number): string {
  if (bytes < 1024) return bytes + 'B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'K'
  return (bytes / 1024 / 1024).toFixed(1) + 'M'
}

function cmdCd(args: string[], state: InterpreterState): string {
  const target = args[0] ?? '~'
  if (target === '-') {
    const old = state.env.OLDPWD || '/'
    state.env.OLDPWD = state.cwd
    state.cwd = old
    return displayPath(state.cwd)
  }
  const newPath = target === '~' || target === '' ? '/' : normalizePath(target, state.cwd)
  const node = resolvePath(newPath, state.cwd)
  if (!node) return `${c.red}cd: ${target}: No such file or directory${c.reset}`
  if (node.type !== 'dir') return `${c.red}cd: ${target}: Not a directory${c.reset}`
  state.env.OLDPWD = state.cwd
  state.cwd = newPath
  state.env.PWD = newPath
  return ''
}

function cmdCat(args: string[], state: InterpreterState, stdin: string): string {
  if (args.length === 0 && stdin) return stdin
  if (args.length === 0) return `${c.red}cat: missing operand${c.reset}`
  const numberLines = args.includes('-n')
  const fileArgs = args.filter(a => !a.startsWith('-'))
  const results: string[] = []
  for (const arg of fileArgs) {
    if (arg === '-') { results.push(stdin); continue }
    const node = resolvePath(normalizePath(arg, state.cwd), state.cwd)
    if (!node) { results.push(`${c.red}cat: ${arg}: No such file or directory${c.reset}`); continue }
    if (node.type === 'dir') { results.push(`${c.red}cat: ${arg}: Is a directory${c.reset}`); continue }
    if (arg.endsWith('.pdf')) { results.push(`${c.yellow}[binary file]${c.reset} Use ${c.cyan}'open ${arg}'${c.reset} to view.`); continue }
    let content = node.content
    if (numberLines) content = content.split('\n').map((l, i) => `  ${i + 1}\t${l}`).join('\n')
    results.push(content)
  }
  return results.join('\r\n')
}

function cmdOpen(args: string[], state: InterpreterState): string {
  if (args.length === 0) return `${c.red}open: missing argument${c.reset}`
  const target = args[0]
  if (target === 'portfolio') return OPEN_URL_PREFIX + '/portfolio'
  if (target.startsWith('http://') || target.startsWith('https://')) return OPEN_URL_PREFIX + target
  const node = resolvePath(normalizePath(target, state.cwd), state.cwd)
  if (!node) return `${c.red}open: ${target}: No such file or directory${c.reset}`
  if (node.type === 'dir') return `${c.red}open: ${target}: Is a directory${c.reset}`
  if (target.endsWith('.pdf')) return OPEN_URL_PREFIX + '/resume.pdf'
  return `${c.yellow}Opening ${target}...${c.reset}\r\n` + node.content
}

function cmdEcho(args: string[]): string {
  const noNewline = args[0] === '-n'
  const rest = noNewline ? args.slice(1) : args
  let text = rest.join(' ')
  text = text.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\')
  return text
}

function cmdExport(args: string[], state: InterpreterState): string {
  if (args.length === 0) {
    return Object.entries(state.env).map(([k, v]) => `declare -x ${k}="${v}"`).join('\r\n')
  }
  for (const arg of args) {
    const eq = arg.indexOf('=')
    if (eq > 0) {
      state.env[arg.slice(0, eq)] = arg.slice(eq + 1)
    }
  }
  return ''
}

function cmdUnset(args: string[], state: InterpreterState): string {
  for (const a of args) delete state.env[a]
  return ''
}

function cmdEnv(args: string[], state: InterpreterState): string {
  if (args.length > 0) return state.env[args[0]] ?? ''
  return Object.entries(state.env).map(([k, v]) => `${k}=${v}`).join('\r\n')
}

function cmdSet(state: InterpreterState): string {
  return Object.entries(state.env).map(([k, v]) => `${k}=${v}`).join('\r\n')
}

function cmdAlias(args: string[], state: InterpreterState): string {
  if (args.length === 0) return Object.entries(state.aliases).map(([k, v]) => `alias ${k}='${v}'`).join('\r\n')
  for (const arg of args) {
    const eq = arg.indexOf('=')
    if (eq > 0) state.aliases[arg.slice(0, eq)] = arg.slice(eq + 1)
    else if (state.aliases[arg]) return `alias ${arg}='${state.aliases[arg]}'`
    else return `${c.red}alias: ${arg}: not found${c.reset}`
  }
  return ''
}

function cmdUnalias(args: string[], state: InterpreterState): string {
  for (const a of args) delete state.aliases[a]
  return ''
}

function cmdHistory(state: InterpreterState): string {
  return state.history.map((h, i) => `  ${String(i + 1).padStart(4)}  ${h}`).join('\r\n')
}

function cmdWhich(args: string[]): string {
  const builtins = ['ls','cd','pwd','cat','echo','clear','whoami','help','man','uname','date','hostname',
    'exit','export','unset','env','printenv','alias','unalias','history','which','type','mkdir','rmdir',
    'touch','rm','cp','mv','find','tree','diff','grep','head','tail','wc','sort','uniq','tr','cut',
    'sed','awk','rev','tac','nl','tee','xargs','seq','printf','expr','bc','base64','xxd','md5','cal',
    'cowsay','fortune','neofetch','uptime','df','du','ps','kill','jobs','chmod','basename','dirname',
    'realpath','yes','true','false','test','sleep','ping','curl','wget','ssh','id','groups','file','stat',
    'open','set','git']
  return args.map(a => builtins.includes(a) ? `${a}: shell built-in command` : `${c.red}${a} not found${c.reset}`).join('\r\n')
}

function cmdMkdir(args: string[], state: InterpreterState): string {
  const recursive = args.includes('-p')
  const dirs = args.filter(a => !a.startsWith('-'))
  return dirs.map(d => mkdirFS(d, state.cwd, recursive)).filter(Boolean).join('\r\n')
}

function cmdRmdir(args: string[], state: InterpreterState): string {
  return args.filter(a => !a.startsWith('-')).map(d => {
    const node = resolvePath(normalizePath(d, state.cwd), state.cwd)
    if (!node) return `${c.red}rmdir: ${d}: No such file or directory${c.reset}`
    if (node.type !== 'dir') return `${c.red}rmdir: ${d}: Not a directory${c.reset}`
    if (Object.keys((node as DirNode).children).length > 0) return `${c.red}rmdir: ${d}: Directory not empty${c.reset}`
    return rmFS(d, state.cwd) || ''
  }).filter(Boolean).join('\r\n')
}

function cmdTouch(args: string[], state: InterpreterState): string {
  return args.filter(a => !a.startsWith('-')).map(f => touchFS(f, state.cwd)).filter(Boolean).join('\r\n')
}

function cmdRm(args: string[], state: InterpreterState): string {
  const recursive = args.some(a => a.startsWith('-') && a.includes('r'))
  const force = args.some(a => a.startsWith('-') && a.includes('f'))
  const files = args.filter(a => !a.startsWith('-'))
  return files.map(f => {
    const err = rmFS(f, state.cwd, recursive)
    if (err && !force) return `${c.red}${err}${c.reset}`
    return ''
  }).filter(Boolean).join('\r\n')
}

function cmdCp(args: string[], state: InterpreterState): string {
  const files = args.filter(a => !a.startsWith('-'))
  if (files.length < 2) return `${c.red}cp: missing destination${c.reset}`
  const dest = files.pop()!
  return files.map(f => { const e = cpFS(f, dest, state.cwd); return e ? `${c.red}${e}${c.reset}` : '' }).filter(Boolean).join('\r\n')
}

function cmdMv(args: string[], state: InterpreterState): string {
  const files = args.filter(a => !a.startsWith('-'))
  if (files.length < 2) return `${c.red}mv: missing destination${c.reset}`
  const dest = files.pop()!
  return files.map(f => { const e = mvFS(f, dest, state.cwd); return e ? `${c.red}${e}${c.reset}` : '' }).filter(Boolean).join('\r\n')
}

function cmdFind(args: string[], state: InterpreterState): string {
  const startPath = args[0] && !args[0].startsWith('-') ? args[0] : '.'
  const nameIdx = args.indexOf('-name')
  const typeIdx = args.indexOf('-type')
  const namePat = nameIdx >= 0 ? args[nameIdx + 1] : null
  const typePat = typeIdx >= 0 ? args[typeIdx + 1] : null

  return findFiles(startPath, state.cwd, (name, node) => {
    if (typePat === 'f' && node.type !== 'file') return false
    if (typePat === 'd' && node.type !== 'dir') return false
    if (namePat) {
      const re = new RegExp('^' + namePat.replace(/\*/g, '.*').replace(/\?/g, '.') + '$')
      if (!re.test(name)) return false
    }
    return true
  }).map(p => displayPath(p)).join('\r\n')
}

function cmdTree(args: string[], state: InterpreterState): string {
  const path = args[0] || '.'
  const entries = getTree(path, state.cwd)
  if (entries.length === 0) return `${c.red}tree: ${path}: No such directory${c.reset}`
  const lines = [displayPath(normalizePath(path, state.cwd))]
  let dirs = 0, files = 0
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]
    const nextSameDepth = entries.slice(i + 1).findIndex(x => x.depth <= e.depth)
    const isLast = nextSameDepth === -1 || entries[i + nextSameDepth]?.depth < e.depth
    const prefix = '│   '.repeat(Math.max(0, e.depth - 1)) + (e.depth > 0 ? (isLast ? '└── ' : '├── ') : (i === entries.length - 1 ? '└── ' : '├── '))
    const name = e.type === 'dir' ? `${c.brightBlue}${c.bold}${e.path}${c.reset}` : e.path
    lines.push(prefix + name)
    if (e.type === 'dir') dirs++; else files++
  }
  lines.push('', `${dirs} directories, ${files} files`)
  return lines.join('\r\n')
}

function cmdDiff(args: string[], state: InterpreterState): string {
  const files = args.filter(a => !a.startsWith('-'))
  if (files.length < 2) return `${c.red}diff: missing operand${c.reset}`
  const n1 = resolvePath(normalizePath(files[0], state.cwd), state.cwd)
  const n2 = resolvePath(normalizePath(files[1], state.cwd), state.cwd)
  if (!n1 || n1.type !== 'file') return `${c.red}diff: ${files[0]}: No such file${c.reset}`
  if (!n2 || n2.type !== 'file') return `${c.red}diff: ${files[1]}: No such file${c.reset}`
  const l1 = n1.content.split('\n'), l2 = n2.content.split('\n')
  if (n1.content === n2.content) return ''
  const lines: string[] = []
  const max = Math.max(l1.length, l2.length)
  for (let i = 0; i < max; i++) {
    if (l1[i] !== l2[i]) {
      if (l1[i] !== undefined) lines.push(`${c.red}< ${l1[i]}${c.reset}`)
      lines.push('---')
      if (l2[i] !== undefined) lines.push(`${c.green}> ${l2[i]}${c.reset}`)
    }
  }
  return lines.join('\r\n')
}

function cmdTee(args: string[], state: InterpreterState, stdin: string): string {
  const append = args.includes('-a')
  const files = args.filter(a => !a.startsWith('-'))
  for (const f of files) writeFileFS(normalizePath(f, state.cwd), stdin, state.cwd, append)
  return stdin
}

function cmdXargs(args: string[], state: InterpreterState, stdin: string): string {
  if (args.length === 0 || !stdin.trim()) return ''
  const cmd = args[0]
  const cmdArgs = args.slice(1)
  const items = stdin.trim().split(/\s+/)
  return items.map(item => executeSingle(`${cmd} ${cmdArgs.join(' ')} ${item}`, state, '')).filter(Boolean).join('\r\n')
}

function cmdUname(args: string[]): string {
  if (args.includes('-a')) return 'Darwin Animesh-MacBook.local 24.0.0 Darwin Kernel Version 24.0.0: arm64'
  if (args.includes('-s')) return 'Darwin'
  if (args.includes('-n')) return 'Animesh-MacBook.local'
  if (args.includes('-r')) return '24.0.0'
  if (args.includes('-m')) return 'arm64'
  return 'Darwin'
}

function cmdUptime(state: InterpreterState): string {
  const elapsed = Math.floor((Date.now() - state.startTime) / 1000)
  const h = Math.floor(elapsed / 3600), m = Math.floor((elapsed % 3600) / 60)
  return `up ${h}:${String(m).padStart(2, '0')}, 1 user, load averages: 1.23 1.45 1.67`
}

function cmdDf(): string {
  return [
    'Filesystem     Size  Used  Avail  Use%  Mounted on',
    '/dev/disk1s1   460G  127G   333G   28%  /',
    'tmpfs          4.0G   0B   4.0G    0%  /tmp',
  ].join('\r\n')
}

function cmdDu(args: string[], state: InterpreterState): string {
  const path = args.filter(a => !a.startsWith('-'))[0] || '.'
  const node = resolvePath(normalizePath(path, state.cwd), state.cwd)
  if (!node) return `${c.red}du: ${path}: No such file or directory${c.reset}`
  const size = getNodeSize(node)
  return `${size}\t${displayPath(normalizePath(path, state.cwd))}`
}

function cmdPs(): string {
  return [
    '  PID TTY          TIME CMD',
    '    1 ttys000  00:00:00 zsh',
    ' 1337 ttys000  00:00:00 node',
    ' 1338 ttys000  00:00:00 ps',
  ].join('\r\n')
}

function cmdChmod(args: string[]): string {
  if (args.length < 2) return `${c.red}chmod: missing operand${c.reset}`
  return `${c.dim}chmod: permissions updated (simulated)${c.reset}`
}

function cmdTest(args: string[], state: InterpreterState): string {
  const a = args.filter(x => x !== ']')
  if (a.length === 0) { state.lastExitCode = 1; return '' }
  if (a[0] === '-z') { state.lastExitCode = (a[1] || '').length === 0 ? 0 : 1; return '' }
  if (a[0] === '-n') { state.lastExitCode = (a[1] || '').length > 0 ? 0 : 1; return '' }
  if (a[0] === '-f') { const n = resolvePath(normalizePath(a[1] || '', state.cwd), state.cwd); state.lastExitCode = n && n.type === 'file' ? 0 : 1; return '' }
  if (a[0] === '-d') { const n = resolvePath(normalizePath(a[1] || '', state.cwd), state.cwd); state.lastExitCode = n && n.type === 'dir' ? 0 : 1; return '' }
  if (a[0] === '-e') { const n = resolvePath(normalizePath(a[1] || '', state.cwd), state.cwd); state.lastExitCode = n ? 0 : 1; return '' }
  if (a.length >= 3) {
    if (a[1] === '=') { state.lastExitCode = a[0] === a[2] ? 0 : 1; return '' }
    if (a[1] === '!=') { state.lastExitCode = a[0] !== a[2] ? 0 : 1; return '' }
    if (a[1] === '-eq') { state.lastExitCode = parseInt(a[0]) === parseInt(a[2]) ? 0 : 1; return '' }
    if (a[1] === '-ne') { state.lastExitCode = parseInt(a[0]) !== parseInt(a[2]) ? 0 : 1; return '' }
    if (a[1] === '-gt') { state.lastExitCode = parseInt(a[0]) > parseInt(a[2]) ? 0 : 1; return '' }
    if (a[1] === '-lt') { state.lastExitCode = parseInt(a[0]) < parseInt(a[2]) ? 0 : 1; return '' }
  }
  state.lastExitCode = 1; return ''
}

function cmdGit(args: string[]): string {
  if (args.length === 0) return `${c.dim}usage: git <command> [<args>]${c.reset}`
  return `${c.dim}git ${args[0]}: simulated — not a real git repository${c.reset}`
}

function cmdFile(args: string[], state: InterpreterState): string {
  return args.map(a => {
    const node = resolvePath(normalizePath(a, state.cwd), state.cwd)
    if (!node) return `${a}: No such file or directory`
    if (node.type === 'dir') return `${a}: directory`
    if (a.endsWith('.pdf')) return `${a}: PDF document`
    if (a.endsWith('.md')) return `${a}: Markdown document, UTF-8 text`
    if (a.endsWith('.txt')) return `${a}: ASCII text`
    if (a.endsWith('.ts') || a.endsWith('.tsx')) return `${a}: TypeScript source, UTF-8 text`
    if (a.endsWith('.js') || a.endsWith('.jsx')) return `${a}: JavaScript source, UTF-8 text`
    if (a.endsWith('.json')) return `${a}: JSON data, UTF-8 text`
    if (a.endsWith('.lua')) return `${a}: Lua source, UTF-8 text`
    return `${a}: UTF-8 text`
  }).join('\r\n')
}

function cmdStat(args: string[], state: InterpreterState): string {
  return args.filter(a => !a.startsWith('-')).map(a => {
    const node = resolvePath(normalizePath(a, state.cwd), state.cwd)
    if (!node) return `stat: ${a}: No such file or directory`
    const size = node.type === 'file' ? node.content.length : 0
    const type = node.type === 'dir' ? 'Directory' : 'Regular File'
    return [
      `  File: ${a}`, `  Size: ${size}\tBlocks: ${Math.ceil(size / 512)}\t${type}`,
      `  Access: ${node.permissions || (node.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--')}`,
      `  Modify: ${node.modified || 'unknown'}`, `  Birth: ${node.created || 'unknown'}`,
    ].join('\r\n')
  }).join('\r\n')
}

function cmdHelp(): string {
  return [
    `${c.bold}${c.brightWhite}Animesh's Terminal — Full Command Reference${c.reset}`,
    '',
    `${c.yellow}Navigation & Files${c.reset}`,
    `  ${c.cyan}ls${c.reset} ${c.dim}[-laRh]${c.reset}  ${c.cyan}cd${c.reset}  ${c.cyan}pwd${c.reset}  ${c.cyan}cat${c.reset} ${c.dim}[-n]${c.reset}  ${c.cyan}tree${c.reset}  ${c.cyan}find${c.reset}  ${c.cyan}file${c.reset}  ${c.cyan}stat${c.reset}  ${c.cyan}open${c.reset}`,
    '',
    `${c.yellow}File Operations${c.reset}`,
    `  ${c.cyan}mkdir${c.reset} ${c.dim}[-p]${c.reset}  ${c.cyan}rmdir${c.reset}  ${c.cyan}touch${c.reset}  ${c.cyan}rm${c.reset} ${c.dim}[-rf]${c.reset}  ${c.cyan}cp${c.reset}  ${c.cyan}mv${c.reset}  ${c.cyan}diff${c.reset}  ${c.cyan}chmod${c.reset}`,
    '',
    `${c.yellow}Text Processing${c.reset}`,
    `  ${c.cyan}grep${c.reset} ${c.dim}[-ivnc]${c.reset}  ${c.cyan}head${c.reset}  ${c.cyan}tail${c.reset}  ${c.cyan}wc${c.reset}  ${c.cyan}sort${c.reset}  ${c.cyan}uniq${c.reset}  ${c.cyan}tr${c.reset}  ${c.cyan}cut${c.reset}  ${c.cyan}sed${c.reset}  ${c.cyan}awk${c.reset}`,
    `  ${c.cyan}rev${c.reset}  ${c.cyan}tac${c.reset}  ${c.cyan}nl${c.reset}  ${c.cyan}tee${c.reset}  ${c.cyan}xargs${c.reset}`,
    '',
    `${c.yellow}Shell Features${c.reset}`,
    `  ${c.cyan}echo${c.reset}  ${c.cyan}printf${c.reset}  ${c.cyan}export${c.reset}  ${c.cyan}unset${c.reset}  ${c.cyan}env${c.reset}  ${c.cyan}alias${c.reset}  ${c.cyan}history${c.reset}  ${c.cyan}which${c.reset}  ${c.cyan}test${c.reset}`,
    `  ${c.dim}Pipes: cmd1 | cmd2    Chain: cmd1 ; cmd2 ; cmd3${c.reset}`,
    `  ${c.dim}Redirect: cmd > file  Append: cmd >> file${c.reset}`,
    `  ${c.dim}Logic: cmd1 && cmd2   Or: cmd1 || cmd2${c.reset}`,
    `  ${c.dim}Variables: $VAR  Globs: *.txt  History: !! !n${c.reset}`,
    '',
    `${c.yellow}Utilities${c.reset}`,
    `  ${c.cyan}seq${c.reset}  ${c.cyan}expr${c.reset}  ${c.cyan}bc${c.reset}  ${c.cyan}base64${c.reset}  ${c.cyan}xxd${c.reset}  ${c.cyan}md5${c.reset}  ${c.cyan}cal${c.reset}  ${c.cyan}sleep${c.reset}  ${c.cyan}yes${c.reset}  ${c.cyan}true${c.reset}  ${c.cyan}false${c.reset}`,
    '',
    `${c.yellow}System Info${c.reset}`,
    `  ${c.cyan}whoami${c.reset}  ${c.cyan}id${c.reset}  ${c.cyan}uname${c.reset}  ${c.cyan}hostname${c.reset}  ${c.cyan}date${c.reset}  ${c.cyan}uptime${c.reset}  ${c.cyan}df${c.reset}  ${c.cyan}du${c.reset}  ${c.cyan}ps${c.reset}  ${c.cyan}neofetch${c.reset}`,
    '',
    `${c.yellow}Fun${c.reset}`,
    `  ${c.cyan}cowsay${c.reset}  ${c.cyan}fortune${c.reset}  ${c.cyan}ping${c.reset}  ${c.cyan}curl${c.reset}  ${c.cyan}ssh${c.reset}  ${c.cyan}git${c.reset}`,
    '',
    `${c.yellow}Shortcuts${c.reset}`,
    `  ${c.dim}Tab${c.reset} complete  ${c.dim}↑↓${c.reset} history  ${c.dim}Ctrl+R${c.reset} search  ${c.dim}Ctrl+A/E${c.reset} home/end`,
    `  ${c.dim}Ctrl+W${c.reset} del word  ${c.dim}Ctrl+K${c.reset} kill line  ${c.dim}Ctrl+U${c.reset} clear line  ${c.dim}Ctrl+L${c.reset} clear`,
    `  ${c.dim}Ctrl+C${c.reset} cancel  ${c.dim}Ctrl+D${c.reset} EOF`,
    '',
    `${c.dim}Try: cat about.txt | grep -i web | head -3${c.reset}`,
    `${c.dim}Try: ls projects/ | wc -l${c.reset}`,
    `${c.dim}Try: neofetch${c.reset}`,
  ].join('\r\n')
}

function cmdMan(args: string[]): string {
  if (args.length === 0) return `${c.red}man: missing argument${c.reset}`
  const manPages: Record<string, string> = {
    ls: `${c.bold}LS(1)${c.reset}\n\n${c.bold}NAME${c.reset}\n  ls -- list directory contents\n\n${c.bold}SYNOPSIS${c.reset}\n  ls [-laRh] [path ...]\n\n${c.bold}OPTIONS${c.reset}\n  -l  Long format\n  -a  Show hidden files\n  -R  Recursive\n  -h  Human-readable sizes`,
    cd: `${c.bold}CD(1)${c.reset}\n\n${c.bold}NAME${c.reset}\n  cd -- change directory\n\n${c.bold}SYNOPSIS${c.reset}\n  cd [path]\n  cd -    (go to previous dir)\n  cd ~    (go home)`,
    cat: `${c.bold}CAT(1)${c.reset}\n\n${c.bold}NAME${c.reset}\n  cat -- concatenate and print files\n\n${c.bold}SYNOPSIS${c.reset}\n  cat [-n] [file ...]\n\n${c.bold}OPTIONS${c.reset}\n  -n  Number output lines`,
    grep: `${c.bold}GREP(1)${c.reset}\n\n${c.bold}NAME${c.reset}\n  grep -- search for patterns\n\n${c.bold}SYNOPSIS${c.reset}\n  grep [-ivnc] pattern [file]\n\n${c.bold}OPTIONS${c.reset}\n  -i  Case insensitive\n  -v  Invert match\n  -n  Show line numbers\n  -c  Count matches`,
    find: `${c.bold}FIND(1)${c.reset}\n\n${c.bold}NAME${c.reset}\n  find -- search for files\n\n${c.bold}SYNOPSIS${c.reset}\n  find [path] [-name pattern] [-type f|d]`,
    sed: `${c.bold}SED(1)${c.reset}\n\n${c.bold}NAME${c.reset}\n  sed -- stream editor\n\n${c.bold}SYNOPSIS${c.reset}\n  sed 's/pattern/replacement/[g]'`,
    awk: `${c.bold}AWK(1)${c.reset}\n\n${c.bold}NAME${c.reset}\n  awk -- pattern processing\n\n${c.bold}SYNOPSIS${c.reset}\n  awk '{print $N}'\n  awk '/pattern/{print}'`,
    open: `${c.bold}OPEN(1)${c.reset}\n\n${c.bold}NAME${c.reset}\n  open -- open files or URLs\n\n${c.bold}SYNOPSIS${c.reset}\n  open <file|portfolio|URL>`,
  }
  return manPages[args[0]] ?? `${c.red}man: no manual entry for ${args[0]}${c.reset}`
}

function cmdNanoEdit(cmd: string, args: string[], state: InterpreterState): string {
  if (args.length === 0) return `${c.red}${cmd}: missing filename${c.reset}`
  const filePath = args[0]
  const absPath = normalizePath(filePath, state.cwd)
  const node = resolvePath(absPath, state.cwd)
  let content = ''
  let isNew = false
  if (node) {
    if (node.type === 'dir') return `${c.red}${cmd}: ${filePath}: Is a directory${c.reset}`
    content = node.content
  } else {
    isNew = true
  }
  // Return a sentinel the terminal component picks up
  return EDIT_PREFIX + JSON.stringify({ path: absPath, displayPath: filePath, content, isNew })
}

export { getCompletions }
