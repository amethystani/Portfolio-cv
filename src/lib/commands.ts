// Text-processing / utility commands used by the interpreter pipeline
// Each function receives (args: string[], stdin: string) and returns string output

const c = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  blue: '\x1b[34m', cyan: '\x1b[36m', white: '\x1b[37m',
  brightBlue: '\x1b[94m', brightCyan: '\x1b[96m', brightWhite: '\x1b[97m',
  magenta: '\x1b[35m',
}

export function cmdGrep(args: string[], stdin: string): string {
  const flags = args.filter(a => a.startsWith('-'))
  const rest = args.filter(a => !a.startsWith('-'))
  if (rest.length === 0) return `${c.red}grep: missing pattern${c.reset}`
  const pattern = rest[0]
  const ignoreCase = flags.some(f => f.includes('i'))
  const invert = flags.some(f => f.includes('v'))
  const count = flags.some(f => f.includes('c'))
  const lineNum = flags.some(f => f.includes('n'))
  const re = new RegExp(pattern, ignoreCase ? 'gi' : 'g')
  const lines = stdin.split('\n')
  let matched = lines.map((line, i) => ({ line, num: i + 1, match: re.test(line) }))
  matched = matched.filter(m => invert ? !m.match : m.match)
  if (count) return String(matched.length)
  return matched.map(m => {
    const prefix = lineNum ? `${c.green}${m.num}${c.reset}:` : ''
    // Highlight matches
    re.lastIndex = 0
    const highlighted = m.line.replace(new RegExp(pattern, ignoreCase ? 'gi' : 'g'),
      match => `${c.red}${c.bold}${match}${c.reset}`)
    return prefix + highlighted
  }).join('\n')
}

export function cmdHead(args: string[], stdin: string): string {
  let n = 10
  const nFlag = args.findIndex(a => a === '-n')
  if (nFlag >= 0 && args[nFlag + 1]) n = parseInt(args[nFlag + 1]) || 10
  else if (args[0] && args[0].startsWith('-') && !isNaN(parseInt(args[0].slice(1)))) n = parseInt(args[0].slice(1))
  return stdin.split('\n').slice(0, n).join('\n')
}

export function cmdTail(args: string[], stdin: string): string {
  let n = 10
  const nFlag = args.findIndex(a => a === '-n')
  if (nFlag >= 0 && args[nFlag + 1]) n = parseInt(args[nFlag + 1]) || 10
  else if (args[0] && args[0].startsWith('-') && !isNaN(parseInt(args[0].slice(1)))) n = parseInt(args[0].slice(1))
  const lines = stdin.split('\n')
  return lines.slice(Math.max(0, lines.length - n)).join('\n')
}

export function cmdWc(args: string[], stdin: string): string {
  const flags = args.filter(a => a.startsWith('-'))
  const lines = stdin.split('\n')
  const lineCount = lines.length
  const wordCount = stdin.trim() ? stdin.trim().split(/\s+/).length : 0
  const charCount = stdin.length
  if (flags.some(f => f.includes('l'))) return `${lineCount}`
  if (flags.some(f => f.includes('w'))) return `${wordCount}`
  if (flags.some(f => f.includes('c') || f.includes('m'))) return `${charCount}`
  return `  ${lineCount}  ${wordCount}  ${charCount}`
}

export function cmdSort(args: string[], stdin: string): string {
  const reverse = args.includes('-r')
  const numeric = args.includes('-n')
  const unique = args.includes('-u')
  let lines = stdin.split('\n')
  if (unique) lines = Array.from(new Set(lines))
  lines.sort((a, b) => {
    if (numeric) return parseFloat(a) - parseFloat(b)
    return a.localeCompare(b)
  })
  if (reverse) lines.reverse()
  return lines.join('\n')
}

export function cmdUniq(args: string[], stdin: string): string {
  const count = args.includes('-c')
  const dupsOnly = args.includes('-d')
  const lines = stdin.split('\n')
  const result: Array<{ line: string; count: number }> = []
  for (const line of lines) {
    if (result.length > 0 && result[result.length - 1].line === line) {
      result[result.length - 1].count++
    } else {
      result.push({ line, count: 1 })
    }
  }
  let filtered = dupsOnly ? result.filter(r => r.count > 1) : result
  return filtered.map(r => count ? `  ${r.count} ${r.line}` : r.line).join('\n')
}

export function cmdTr(args: string[], stdin: string): string {
  const deleteMode = args.includes('-d')
  const rest = args.filter(a => !a.startsWith('-'))
  if (deleteMode && rest.length >= 1) {
    const chars = rest[0]
    let result = stdin
    for (const ch of chars) result = result.split(ch).join('')
    return result
  }
  if (rest.length < 2) return `${c.red}tr: missing operand${c.reset}`
  const [set1, set2] = rest
  let result = ''
  for (const ch of stdin) {
    const idx = set1.indexOf(ch)
    result += idx >= 0 ? (set2[Math.min(idx, set2.length - 1)] || '') : ch
  }
  return result
}

export function cmdCut(args: string[], stdin: string): string {
  const dIdx = args.indexOf('-d')
  const delim = dIdx >= 0 && args[dIdx + 1] ? args[dIdx + 1] : '\t'
  const fIdx = args.indexOf('-f')
  if (fIdx < 0 || !args[fIdx + 1]) return `${c.red}cut: missing field${c.reset}`
  const fieldSpec = args[fIdx + 1]
  const fields = fieldSpec.split(',').map(f => parseInt(f) - 1)
  return stdin.split('\n').map(line => {
    const parts = line.split(delim)
    return fields.map(f => parts[f] || '').join(delim)
  }).join('\n')
}

export function cmdSed(args: string[], stdin: string): string {
  const rest = args.filter(a => !a.startsWith('-'))
  if (rest.length === 0) return `${c.red}sed: missing expression${c.reset}`
  const expr = rest[0]
  const match = expr.match(/^s\/((?:[^/\\]|\\.)*)\/([^/]*)\/(g?)$/)
  if (!match) return `${c.red}sed: invalid expression${c.reset}`
  const [, pattern, replacement, globalFlag] = match
  const re = new RegExp(pattern, globalFlag ? 'g' : '')
  return stdin.split('\n').map(line => line.replace(re, replacement)).join('\n')
}

export function cmdAwk(args: string[], stdin: string): string {
  const rest = args.filter(a => !a.startsWith('-'))
  if (rest.length === 0) return `${c.red}awk: missing program${c.reset}`
  const program = rest[0]
  // Support basic {print $N} patterns
  const printMatch = program.match(/^\{print\s+(.+)\}$/)
  if (printMatch) {
    const fields = printMatch[1].split(/[,\s]+/)
    return stdin.split('\n').map(line => {
      const parts = line.trim().split(/\s+/)
      return fields.map(f => {
        if (f === '$0') return line
        const n = parseInt(f.replace('$', ''))
        return isNaN(n) ? f.replace(/"/g, '') : (parts[n - 1] || '')
      }).join(' ')
    }).join('\n')
  }
  // Support /pattern/ {print}
  const filterMatch = program.match(/^\/(.*?)\/\s*\{print\s*(.*?)\}$/)
  if (filterMatch) {
    const re = new RegExp(filterMatch[1])
    return stdin.split('\n').filter(l => re.test(l)).join('\n')
  }
  return `${c.red}awk: unsupported program (basic {print $N} and /pattern/{print} only)${c.reset}`
}

export function cmdRev(_args: string[], stdin: string): string {
  return stdin.split('\n').map(l => l.split('').reverse().join('')).join('\n')
}

export function cmdTac(_args: string[], stdin: string): string {
  return stdin.split('\n').reverse().join('\n')
}

export function cmdNl(_args: string[], stdin: string): string {
  return stdin.split('\n').map((l, i) => `  ${i + 1}\t${l}`).join('\n')
}

export function cmdSeq(args: string[]): string {
  const nums = args.map(Number).filter(n => !isNaN(n))
  let start = 1, step = 1, end = 1
  if (nums.length === 1) { end = nums[0] }
  else if (nums.length === 2) { start = nums[0]; end = nums[1] }
  else if (nums.length >= 3) { start = nums[0]; step = nums[1]; end = nums[2] }
  const result: number[] = []
  if (step > 0) for (let i = start; i <= end; i += step) result.push(i)
  else if (step < 0) for (let i = start; i >= end; i += step) result.push(i)
  return result.join('\n')
}

export function cmdBase64(args: string[], stdin: string): string {
  const decode = args.includes('-d') || args.includes('--decode') || args.includes('-D')
  if (decode) {
    try { return atob(stdin.trim()) } catch { return `${c.red}base64: invalid input${c.reset}` }
  }
  return btoa(stdin)
}

export function cmdXxd(args: string[], stdin: string): string {
  const lines: string[] = []
  for (let i = 0; i < stdin.length; i += 16) {
    const chunk = stdin.slice(i, i + 16)
    const hex = Array.from(chunk).map(ch => ch.charCodeAt(0).toString(16).padStart(2, '0')).join(' ')
    const ascii = Array.from(chunk).map(ch => ch.charCodeAt(0) >= 32 && ch.charCodeAt(0) < 127 ? ch : '.').join('')
    lines.push(`${i.toString(16).padStart(8, '0')}: ${hex.padEnd(47)}  ${ascii}`)
  }
  return lines.join('\n')
}

export function cmdMd5(_args: string[], stdin: string): string {
  // Simple hash simulation (djb2)
  let hash = 5381
  for (let i = 0; i < stdin.length; i++) {
    hash = ((hash << 5) + hash + stdin.charCodeAt(i)) & 0xffffffff
  }
  return Math.abs(hash).toString(16).padStart(32, '0')
}

export function cmdPrintf(args: string[]): string {
  if (args.length === 0) return ''
  let fmt = args[0]
  const params = args.slice(1)
  let pi = 0
  fmt = fmt.replace(/%s/g, () => params[pi++] || '')
  fmt = fmt.replace(/%d/g, () => String(parseInt(params[pi++] || '0')))
  fmt = fmt.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\')
  return fmt
}

export function cmdExpr(args: string[]): string {
  try {
    const expr = args.join(' ')
    // Only allow safe math expressions
    if (!/^[\d\s+\-*/().%]+$/.test(expr)) return `${c.red}expr: syntax error${c.reset}`
    const result = Function(`"use strict"; return (${expr})`)()
    return String(Math.floor(result))
  } catch { return `${c.red}expr: syntax error${c.reset}` }
}

export function cmdBc(_args: string[], stdin: string): string {
  try {
    const expr = stdin.trim() || ''
    if (!expr) return ''
    if (!/^[\d\s+\-*/().%^]+$/.test(expr)) return `${c.red}(standard_in) 1: syntax error${c.reset}`
    const result = Function(`"use strict"; return (${expr.replace('^', '**')})`)()
    return String(result)
  } catch { return `${c.red}(standard_in) 1: syntax error${c.reset}` }
}

export function cmdCal(): string {
  const now = new Date()
  const month = now.toLocaleString('en', { month: 'long' })
  const year = now.getFullYear()
  const firstDay = new Date(year, now.getMonth(), 1).getDay()
  const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate()
  const today = now.getDate()
  const header = `    ${month} ${year}`
  const dayHeader = 'Su Mo Tu We Th Fr Sa'
  let body = ''
  let day = 1
  for (let w = 0; w < 6 && day <= daysInMonth; w++) {
    let week = ''
    for (let d = 0; d < 7; d++) {
      if ((w === 0 && d < firstDay) || day > daysInMonth) { week += '   '; continue }
      const ds = String(day).padStart(2, ' ')
      week += day === today ? `${c.bold}${c.red}${ds}${c.reset} ` : ds + ' '
      day++
    }
    body += week.trimEnd() + '\n'
  }
  return header + '\n' + dayHeader + '\n' + body.trimEnd()
}

export function cmdCowsay(args: string[]): string {
  const msg = args.join(' ') || 'moo'
  const border = '-'.repeat(msg.length + 2)
  return [
    ` ${border}`,
    `< ${msg} >`,
    ` ${border}`,
    '        \\   ^__^',
    '         \\  (oo)\\_______',
    '            (__)\\       )\\/\\',
    '                ||----w |',
    '                ||     ||',
  ].join('\n')
}

export function cmdFortune(): string {
  const fortunes = [
    'The best way to predict the future is to implement it.',
    'Talk is cheap. Show me the code. — Linus Torvalds',
    'First, solve the problem. Then, write the code. — John Johnson',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand. — Martin Fowler',
    'Simplicity is the soul of efficiency. — Austin Freeman',
    'Programs must be written for people to read, and only incidentally for machines to execute. — Abelson & Sussman',
    "It's not a bug, it's an undocumented feature.",
    'There are only two hard things in CS: cache invalidation and naming things.',
    'The best error message is the one that never shows up.',
    "Code is like humor. When you have to explain it, it's bad. — Cory House",
    'Fix the cause, not the symptom. — Steve Maguire',
    'Premature optimization is the root of all evil. — Donald Knuth',
  ]
  return fortunes[Math.floor(Math.random() * fortunes.length)]
}

export function cmdNeofetch(): string {
  const upMinutes = Math.floor(Math.random() * 1440) + 60
  const hours = Math.floor(upMinutes / 60)
  const mins = upMinutes % 60
  return [
    `${c.green}                    'c.       ${c.bold}animesh${c.reset}@${c.bold}MacBook${c.reset}`,
    `${c.green}                 ,xNMM.       ${c.reset}─────────────────`,
    `${c.green}               .OMMMMo        ${c.bold}OS${c.reset}: macOS Sequoia 15.4`,
    `${c.green}               OMMM0,         ${c.bold}Host${c.reset}: MacBook Pro (Apple M3)`,
    `${c.green}     .;loddo:' loolloddol;.   ${c.bold}Kernel${c.reset}: Darwin 24.0.0`,
    `${c.green}   cKMMMMMMMMMMNWMMMMMMMMMM0: ${c.bold}Uptime${c.reset}: ${hours} hours, ${mins} mins`,
    `${c.green} .KMMMMMMMMMMMMMMMMMMMMMMMWd. ${c.bold}Packages${c.reset}: 247 (brew)`,
    `${c.green} XMMMMMMMMMMMMMMMMMMMMMMMX.  ${c.bold}Shell${c.reset}: zsh 5.9`,
    `${c.green};MMMMMMMMMMMMMMMMMMMMMMMM:   ${c.bold}Terminal${c.reset}: xterm.js`,
    `${c.green}:MMMMMMMMMMMMMMMMMMMMMMMM:   ${c.bold}CPU${c.reset}: Apple M3`,
    `${c.green}.MMMMMMMMMMMMMMMMMMMMMMMMX.  ${c.bold}Memory${c.reset}: 4.2 GiB / 8 GiB`,
    `${c.green} kMMMMMMMMMMMMMMMMMMMMMMMMWd.`,
    `${c.green} .XMMMMMMMMMMMMMMMMMMMMMMMMk ${c.reset}`,
    `${c.green}  .XMMMMMMMMMMMMMMMMMMMMK.  ${c.reset}`,
    `${c.green}    kMMMMMMMMMMMMMMMMMMd.    `,
    `${c.green}     ;KMMMMMMMWXXWMMMKo.    ${c.reset}`,
  ].join('\n')
}

export function cmdYes(args: string[]): string {
  const text = args.join(' ') || 'y'
  return Array(20).fill(text).join('\n') + `\n${c.dim}[interrupted — showing 20 lines]${c.reset}`
}

export function cmdPing(args: string[]): string {
  const host = args.filter(a => !a.startsWith('-'))[0] || 'localhost'
  const lines = [`PING ${host} (127.0.0.1): 56 data bytes`]
  for (let i = 0; i < 4; i++) {
    const ms = (Math.random() * 30 + 5).toFixed(3)
    lines.push(`64 bytes from 127.0.0.1: icmp_seq=${i} ttl=64 time=${ms} ms`)
  }
  lines.push('', `--- ${host} ping statistics ---`)
  lines.push('4 packets transmitted, 4 packets received, 0.0% packet loss')
  return lines.join('\n')
}

export function cmdCurl(args: string[]): string {
  const url = args.filter(a => !a.startsWith('-'))[0]
  if (!url) return `${c.red}curl: missing URL${c.reset}`
  return `${c.dim}<!DOCTYPE html>\n<html>\n<head><title>${url}</title></head>\n<body><h1>Hello from ${url}</h1></body>\n</html>${c.reset}\n${c.dim}[simulated — no actual network request]${c.reset}`
}

export function cmdSsh(args: string[]): string {
  const host = args[0] || ''
  return `${c.yellow}ssh: connect to host ${host || '???'}: Connection refused${c.reset}\n${c.dim}[simulated — this is a browser terminal]${c.reset}`
}

export function cmdWget(args: string[]): string {
  const url = args.filter(a => !a.startsWith('-'))[0]
  if (!url) return `${c.red}wget: missing URL${c.reset}`
  return `${c.dim}--2026-04-01 00:00:00--  ${url}\nResolving ${url}... 127.0.0.1\nConnecting to ${url}|127.0.0.1|:443... connected.\nHTTP request sent, awaiting response... 200 OK\nLength: 1024 (1.0K) [text/html]\nSaving to: 'index.html'\n\nindex.html          100%[==================>]  1.00K  --.-KB/s    in 0s\n\n${c.reset}${c.dim}[simulated — no actual download]${c.reset}`
}
