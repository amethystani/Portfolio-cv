'use client'

import { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import '@xterm/xterm/css/xterm.css'
import {
  execute,
  createInterpreterState,
  getPrompt,
  CLEAR_SENTINEL,
  OPEN_URL_PREFIX,
  type InterpreterState,
} from '@/lib/interpreter'
import { getCompletions } from '@/lib/filesystem'

const COMMANDS = [
  'ls','cd','pwd','cat','echo','clear','whoami','help','man','uname','date','hostname',
  'exit','logout','export','unset','env','printenv','set','alias','unalias','history',
  'which','type','command','mkdir','rmdir','touch','rm','cp','mv','find','tree','diff',
  'grep','head','tail','wc','sort','uniq','tr','cut','sed','awk','rev','tac','nl',
  'tee','xargs','seq','printf','expr','bc','base64','xxd','md5','md5sum','sha256sum',
  'cal','cowsay','fortune','neofetch','screenfetch','fastfetch','uptime','df','du','ps',
  'kill','jobs','fg','bg','chmod','chown','ln','basename','dirname','realpath','readlink',
  'yes','true','false','test','sleep','ping','curl','wget','ssh','scp','id','groups',
  'w','who','last','su','sudo','git','vim','nvim','nano','vi','top','htop','less','more',
  'file','stat','source','open','npm','npx','node','python','python3','pip','cargo','go',
  'apt','brew',
]

const WELCOME_BANNER = [
  '',
  '\x1b[32m    _          _                    _     \x1b[0m',
  '\x1b[32m   / \\   _ __ (_)_ __ ___   ___  ___| |__  \x1b[0m',
  '\x1b[32m  / _ \\ | \'_ \\| | \'_ ` _ \\ / _ \\/ __| \'_ \\ \x1b[0m',
  '\x1b[32m / ___ \\| | | | | | | | | |  __/\\__ \\ | | |\x1b[0m',
  '\x1b[32m/_/   \\_\\_| |_|_|_| |_| |_|\\___||___/_| |_|\x1b[0m',
  '',
  '\x1b[1m\x1b[97mWelcome to Animesh\'s Terminal\x1b[0m',
  '\x1b[2mType \x1b[0m\x1b[36mhelp\x1b[0m\x1b[2m to see all commands.\x1b[0m',
  '\x1b[2mType \x1b[0m\x1b[36mneofetch\x1b[0m\x1b[2m for system info.\x1b[0m',
  '\x1b[2mSupports pipes, redirection, variables, aliases, and more.\x1b[0m',
  '',
].join('\r\n')

export default function XtermTerminal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const stateRef = useRef<InterpreterState>(createInterpreterState())
  const lineBufferRef = useRef<string>('')
  const cursorPosRef = useRef<number>(0)
  const searchModeRef = useRef<boolean>(false)
  const searchQueryRef = useRef<string>('')
  const searchResultRef = useRef<string>('')

  useEffect(() => {
    if (!containerRef.current || termRef.current) return

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: '"SF Mono", Monaco, Menlo, Consolas, "Courier New", monospace',
      fontSize: 13,
      lineHeight: 1.4,
      letterSpacing: 0,
      theme: {
        background: '#1E1E1E',
        foreground: '#F5F5F5',
        cursor: '#F5F5F5',
        cursorAccent: '#1E1E1E',
        selectionBackground: 'rgba(255, 255, 255, 0.2)',
        black: '#000000',
        red: '#C51E14',
        green: '#1DC121',
        yellow: '#C7C329',
        blue: '#0A2FC4',
        magenta: '#C839C5',
        cyan: '#20C5C6',
        white: '#C7C7C7',
        brightBlack: '#686868',
        brightRed: '#FD6F6B',
        brightGreen: '#67F86F',
        brightYellow: '#FFFA72',
        brightBlue: '#6A76FB',
        brightMagenta: '#FD7CFC',
        brightCyan: '#68FDFE',
        brightWhite: '#FFFFFF',
      },
      allowTransparency: false,
      scrollback: 5000,
      convertEol: false,
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()
    term.loadAddon(fitAddon)
    term.loadAddon(webLinksAddon)
    term.open(containerRef.current)
    termRef.current = term
    fitAddonRef.current = fitAddon

    setTimeout(() => { try { fitAddon.fit() } catch {} }, 50)

    term.write(WELCOME_BANNER)
    term.write(getPrompt(stateRef.current))

    const ro = new ResizeObserver(() => { try { fitAddon.fit() } catch {} })
    ro.observe(containerRef.current)

    term.onData((data) => {
      const state = stateRef.current
      let buf = lineBufferRef.current
      let pos = cursorPosRef.current

      for (let i = 0; i < data.length; ) {
        const code = data.charCodeAt(i)

        // ──── Reverse search mode (Ctrl+R) ────
        if (searchModeRef.current) {
          if (code === 13) {
            // Enter: accept search result
            searchModeRef.current = false
            buf = searchResultRef.current
            pos = buf.length
            term.write('\r\x1b[K' + getPrompt(state) + buf)
            i++; continue
          }
          if (code === 3 || code === 27) {
            // Ctrl+C or Escape: cancel search
            searchModeRef.current = false
            searchQueryRef.current = ''
            searchResultRef.current = ''
            buf = ''
            pos = 0
            term.write('\r\x1b[K' + getPrompt(state))
            i++; continue
          }
          if (code === 127 || code === 8) {
            // Backspace in search
            searchQueryRef.current = searchQueryRef.current.slice(0, -1)
            updateSearch(term, state)
            i++; continue
          }
          if (code >= 32) {
            searchQueryRef.current += data[i]
            updateSearch(term, state)
            i++; continue
          }
          i++; continue
        }

        // ──── Ctrl+R: start reverse search ────
        if (code === 18) {
          searchModeRef.current = true
          searchQueryRef.current = ''
          searchResultRef.current = ''
          term.write('\r\x1b[K(reverse-i-search)`\': ')
          i++; continue
        }

        // ESC sequences
        if (data[i] === '\x1b') {
          const seq = data.slice(i, i + 3)
          // Arrow up
          if (seq === '\x1b[A') {
            if (state.history.length > 0) {
              if (state.historyIndex === -1) state.historyIndex = state.history.length - 1
              else if (state.historyIndex > 0) state.historyIndex--
              const entry = state.history[state.historyIndex]
              clearLine(term, buf, pos)
              buf = entry; pos = buf.length
              term.write(buf)
            }
            i += 3; continue
          }
          // Arrow down
          if (seq === '\x1b[B') {
            if (state.historyIndex !== -1) {
              state.historyIndex++
              if (state.historyIndex >= state.history.length) {
                state.historyIndex = -1
                clearLine(term, buf, pos); buf = ''; pos = 0
              } else {
                const entry = state.history[state.historyIndex]
                clearLine(term, buf, pos); buf = entry; pos = buf.length; term.write(buf)
              }
            }
            i += 3; continue
          }
          // Arrow left
          if (seq === '\x1b[D') {
            if (pos > 0) { pos--; term.write('\x1b[D') }
            i += 3; continue
          }
          // Arrow right
          if (seq === '\x1b[C') {
            if (pos < buf.length) { pos++; term.write('\x1b[C') }
            i += 3; continue
          }
          // Home
          if (seq === '\x1b[H' || data.slice(i, i + 4) === '\x1b[1~') {
            if (pos > 0) term.write(`\x1b[${pos}D`)
            pos = 0
            i += seq === '\x1b[H' ? 3 : 4; continue
          }
          // End
          if (seq === '\x1b[F' || data.slice(i, i + 4) === '\x1b[4~') {
            if (pos < buf.length) term.write(`\x1b[${buf.length - pos}C`)
            pos = buf.length
            i += seq === '\x1b[F' ? 3 : 4; continue
          }
          // Delete key
          if (data.slice(i, i + 4) === '\x1b[3~') {
            if (pos < buf.length) {
              buf = buf.slice(0, pos) + buf.slice(pos + 1)
              term.write(buf.slice(pos) + ' ' + `\x1b[${buf.length - pos + 1}D`)
            }
            i += 4; continue
          }
          // Alt+Left (word left)
          if (data.slice(i, i + 3) === '\x1b\x62' || data.slice(i, i + 6) === '\x1b[1;3D') {
            const newPos = findWordBoundaryLeft(buf, pos)
            const move = pos - newPos
            if (move > 0) term.write(`\x1b[${move}D`)
            pos = newPos
            i += data.slice(i, i + 6) === '\x1b[1;3D' ? 6 : 2; continue
          }
          // Alt+Right (word right)
          if (data.slice(i, i + 3) === '\x1b\x66' || data.slice(i, i + 6) === '\x1b[1;3C') {
            const newPos = findWordBoundaryRight(buf, pos)
            const move = newPos - pos
            if (move > 0) term.write(`\x1b[${move}C`)
            pos = newPos
            i += data.slice(i, i + 6) === '\x1b[1;3C' ? 6 : 2; continue
          }
          // Alt+Backspace (delete word left)
          if (data.slice(i, i + 2) === '\x1b\x7f') {
            const newPos = findWordBoundaryLeft(buf, pos)
            const deleted = pos - newPos
            if (deleted > 0) {
              buf = buf.slice(0, newPos) + buf.slice(pos)
              pos = newPos
              term.write(`\x1b[${deleted}D` + buf.slice(pos) + ' '.repeat(deleted) + `\x1b[${buf.length - pos + deleted}D`)
            }
            i += 2; continue
          }
          i++; continue
        }

        // Enter
        if (code === 13) {
          term.write('\r\n')
          const output = execute(buf, state)
          if (output === CLEAR_SENTINEL) {
            term.clear()
          } else if (output.startsWith(OPEN_URL_PREFIX)) {
            const url = output.slice(OPEN_URL_PREFIX.length)
            if (url.startsWith('/portfolio')) window.location.href = url
            else window.open(url, '_blank')
            term.write(`\x1b[32mOpening ${url}...\x1b[0m\r\n`)
          } else if (output) {
            // Convert \n to \r\n for xterm
            term.write(output.replace(/(?<!\r)\n/g, '\r\n') + '\r\n')
          }
          buf = ''; pos = 0
          term.write(getPrompt(state))
          i++; continue
        }

        // Backspace
        if (code === 127 || code === 8) {
          if (pos > 0) {
            buf = buf.slice(0, pos - 1) + buf.slice(pos)
            pos--
            term.write('\x08' + buf.slice(pos) + ' ' + `\x1b[${buf.length - pos + 1}D`)
          }
          i++; continue
        }

        // Ctrl+C
        if (code === 3) {
          term.write('^C\r\n')
          buf = ''; pos = 0; state.historyIndex = -1
          term.write(getPrompt(state))
          i++; continue
        }

        // Ctrl+D (EOF / exit if line empty)
        if (code === 4) {
          if (buf.length === 0) {
            term.write('\r\n\x1b[2m[Process completed]\x1b[0m\r\n')
            term.write(getPrompt(state))
          }
          i++; continue
        }

        // Ctrl+L (clear)
        if (code === 12) {
          term.clear()
          term.write(getPrompt(state) + buf)
          if (pos < buf.length) term.write(`\x1b[${buf.length - pos}D`)
          i++; continue
        }

        // Ctrl+A (home)
        if (code === 1) {
          if (pos > 0) term.write(`\x1b[${pos}D`)
          pos = 0; i++; continue
        }

        // Ctrl+E (end)
        if (code === 5) {
          if (pos < buf.length) term.write(`\x1b[${buf.length - pos}C`)
          pos = buf.length; i++; continue
        }

        // Ctrl+U (clear from cursor to start)
        if (code === 21) {
          if (pos > 0) {
            const deleted = buf.slice(0, pos)
            buf = buf.slice(pos)
            term.write(`\x1b[${pos}D` + buf + ' '.repeat(deleted.length) + `\x1b[${buf.length + deleted.length}D`)
            pos = 0
          }
          i++; continue
        }

        // Ctrl+K (kill from cursor to end)
        if (code === 11) {
          if (pos < buf.length) {
            const killed = buf.length - pos
            buf = buf.slice(0, pos)
            term.write(' '.repeat(killed) + `\x1b[${killed}D`)
          }
          i++; continue
        }

        // Ctrl+W (delete word backward)
        if (code === 23) {
          if (pos > 0) {
            const newPos = findWordBoundaryLeft(buf, pos)
            const deleted = pos - newPos
            buf = buf.slice(0, newPos) + buf.slice(pos)
            pos = newPos
            term.write(`\x1b[${deleted}D` + buf.slice(pos) + ' '.repeat(deleted) + `\x1b[${buf.length - pos + deleted}D`)
          }
          i++; continue
        }

        // Tab completion
        if (code === 9) {
          const parts = buf.slice(0, pos).split(' ')
          if (parts.length === 1) {
            // Complete command name
            const partial = parts[0]
            const matches = COMMANDS.filter(c => c.startsWith(partial))
            if (matches.length === 1) {
              clearLine(term, buf, pos)
              buf = matches[0] + ' ' + buf.slice(pos)
              pos = matches[0].length + 1
              term.write(buf)
              if (pos < buf.length) term.write(`\x1b[${buf.length - pos}D`)
            } else if (matches.length > 1) {
              // Find common prefix
              const common = commonPrefix(matches)
              if (common.length > partial.length) {
                clearLine(term, buf, pos)
                buf = common + buf.slice(pos)
                pos = common.length
                term.write(buf)
                if (pos < buf.length) term.write(`\x1b[${buf.length - pos}D`)
              } else {
                term.write('\r\n' + matches.join('  ') + '\r\n')
                term.write(getPrompt(state) + buf)
                if (pos < buf.length) term.write(`\x1b[${buf.length - pos}D`)
              }
            }
          } else {
            const partial = parts[parts.length - 1]
            const completions = getCompletions(partial, state.cwd)
            if (completions.length === 1) {
              const completion = completions[0]
              const prefix = parts.slice(0, -1).join(' ') + ' '
              const suffix = buf.slice(pos)
              clearLine(term, buf, pos)
              buf = prefix + completion + suffix
              pos = prefix.length + completion.length
              term.write(buf)
              if (pos < buf.length) term.write(`\x1b[${buf.length - pos}D`)
            } else if (completions.length > 1) {
              const common = commonPrefix(completions)
              if (common.length > partial.length) {
                const prefix = parts.slice(0, -1).join(' ') + ' '
                const suffix = buf.slice(pos)
                clearLine(term, buf, pos)
                buf = prefix + common + suffix
                pos = prefix.length + common.length
                term.write(buf)
                if (pos < buf.length) term.write(`\x1b[${buf.length - pos}D`)
              } else {
                term.write('\r\n' + completions.join('  ') + '\r\n')
                term.write(getPrompt(state) + buf)
                if (pos < buf.length) term.write(`\x1b[${buf.length - pos}D`)
              }
            }
          }
          i++; continue
        }

        // Printable chars
        if (code >= 32) {
          const ch = data[i]
          buf = buf.slice(0, pos) + ch + buf.slice(pos)
          pos++
          if (pos === buf.length) {
            term.write(ch)
          } else {
            term.write(buf.slice(pos - 1) + `\x1b[${buf.length - pos}D`)
          }
        }
        i++
      }

      lineBufferRef.current = buf
      cursorPosRef.current = pos
    })

    return () => { ro.disconnect(); term.dispose(); termRef.current = null }
  }, [])

  function updateSearch(term: Terminal, state: InterpreterState) {
    const query = searchQueryRef.current
    const match = [...state.history].reverse().find(h => h.includes(query))
    searchResultRef.current = match || ''
    term.write(`\r\x1b[K(reverse-i-search)\`${query}\': ${match || ''}`)
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%', height: '100%', padding: '4px',
        boxSizing: 'border-box', background: '#1E1E1E',
      }}
    />
  )
}

function clearLine(term: Terminal, buf: string, pos: number) {
  if (pos > 0) term.write(`\x1b[${pos}D`)
  if (buf.length > 0) term.write('\x1b[K')
}

function findWordBoundaryLeft(buf: string, pos: number): number {
  let p = pos - 1
  while (p > 0 && buf[p - 1] === ' ') p--
  while (p > 0 && buf[p - 1] !== ' ') p--
  return Math.max(0, p)
}

function findWordBoundaryRight(buf: string, pos: number): number {
  let p = pos
  while (p < buf.length && buf[p] === ' ') p++
  while (p < buf.length && buf[p] !== ' ') p++
  return p
}

function commonPrefix(strings: string[]): string {
  if (strings.length === 0) return ''
  let prefix = strings[0]
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].startsWith(prefix)) prefix = prefix.slice(0, -1)
  }
  return prefix
}
