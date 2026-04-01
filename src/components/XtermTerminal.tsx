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

const WELCOME_BANNER = [
  '',
  '\x1b[32m    _          _                    _     \x1b[0m',
  '\x1b[32m   / \\   _ __ (_)_ __ ___   ___  ___| |__  \x1b[0m',
  '\x1b[32m  / _ \\ | \'_ \\| | \'_ ` _ \\ / _ \\/ __| \'_ \\ \x1b[0m',
  '\x1b[32m / ___ \\| | | | | | | | | |  __/\\__ \\ | | |\x1b[0m',
  '\x1b[32m/_/   \\_\\_| |_|_|_| |_| |_|\\___||___/_| |_|\x1b[0m',
  '',
  '\x1b[1m\x1b[97mWelcome to Animesh\'s MacBook\x1b[0m',
  '\x1b[2mType \x1b[0m\x1b[36mhelp\x1b[0m\x1b[2m to see available commands.\x1b[0m',
  '\x1b[2mType \x1b[0m\x1b[36mcat about.txt\x1b[0m\x1b[2m to learn about me.\x1b[0m',
  '',
].join('\r\n')

export default function XtermTerminal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const stateRef = useRef<InterpreterState>(createInterpreterState())
  const lineBufferRef = useRef<string>('')
  const cursorPosRef = useRef<number>(0)

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
      scrollback: 1000,
      convertEol: false,
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()

    term.loadAddon(fitAddon)
    term.loadAddon(webLinksAddon)
    term.open(containerRef.current)

    termRef.current = term
    fitAddonRef.current = fitAddon

    // Fit after a short delay to ensure the container has dimensions
    setTimeout(() => {
      try { fitAddon.fit() } catch {}
    }, 50)

    // Write welcome banner and first prompt
    term.write(WELCOME_BANNER)
    term.write(getPrompt(stateRef.current))

    // ResizeObserver to keep terminal fit
    const ro = new ResizeObserver(() => {
      try { fitAddon.fit() } catch {}
    })
    ro.observe(containerRef.current)

    // Handle input
    term.onData((data) => {
      const state = stateRef.current
      let buf = lineBufferRef.current
      let pos = cursorPosRef.current

      for (let i = 0; i < data.length; ) {
        const code = data.charCodeAt(i)

        // ESC sequences
        if (data[i] === '\x1b') {
          const seq = data.slice(i, i + 3)
          // Arrow up
          if (seq === '\x1b[A') {
            if (state.history.length > 0) {
              if (state.historyIndex === -1) {
                state.historyIndex = state.history.length - 1
              } else if (state.historyIndex > 0) {
                state.historyIndex--
              }
              const entry = state.history[state.historyIndex]
              clearLine(term, buf, pos)
              buf = entry
              pos = buf.length
              term.write(buf)
            }
            i += 3
            continue
          }
          // Arrow down
          if (seq === '\x1b[B') {
            if (state.historyIndex !== -1) {
              state.historyIndex++
              if (state.historyIndex >= state.history.length) {
                state.historyIndex = -1
                clearLine(term, buf, pos)
                buf = ''
                pos = 0
              } else {
                const entry = state.history[state.historyIndex]
                clearLine(term, buf, pos)
                buf = entry
                pos = buf.length
                term.write(buf)
              }
            }
            i += 3
            continue
          }
          // Arrow left
          if (seq === '\x1b[D') {
            if (pos > 0) {
              pos--
              term.write('\x1b[D')
            }
            i += 3
            continue
          }
          // Arrow right
          if (seq === '\x1b[C') {
            if (pos < buf.length) {
              pos++
              term.write('\x1b[C')
            }
            i += 3
            continue
          }
          // Home (beginning of line)
          if (seq === '\x1b[H' || data.slice(i, i + 4) === '\x1b[1~') {
            const skip = pos
            pos = 0
            if (skip > 0) term.write(`\x1b[${skip}D`)
            i += seq === '\x1b[H' ? 3 : 4
            continue
          }
          // End (end of line)
          if (seq === '\x1b[F' || data.slice(i, i + 4) === '\x1b[4~') {
            const skip = buf.length - pos
            pos = buf.length
            if (skip > 0) term.write(`\x1b[${skip}C`)
            i += seq === '\x1b[F' ? 3 : 4
            continue
          }
          // Delete key
          if (data.slice(i, i + 4) === '\x1b[3~') {
            if (pos < buf.length) {
              buf = buf.slice(0, pos) + buf.slice(pos + 1)
              // Rewrite from cursor to end
              term.write(buf.slice(pos) + ' ' + `\x1b[${buf.length - pos + 1}D`)
            }
            i += 4
            continue
          }
          i++
          continue
        }

        // Enter
        if (code === 13) {
          term.write('\r\n')
          const output = execute(buf, state)
          if (output === CLEAR_SENTINEL) {
            term.clear()
          } else if (output.startsWith(OPEN_URL_PREFIX)) {
            const url = output.slice(OPEN_URL_PREFIX.length)
            if (url.startsWith('/portfolio')) {
              window.location.href = url
            } else {
              window.open(url, '_blank')
            }
            term.write(`\x1b[32mOpening ${url}...\x1b[0m\r\n`)
          } else if (output) {
            term.write(output + '\r\n')
          }
          buf = ''
          pos = 0
          term.write(getPrompt(state))
          i++
          continue
        }

        // Backspace
        if (code === 127 || code === 8) {
          if (pos > 0) {
            buf = buf.slice(0, pos - 1) + buf.slice(pos)
            pos--
            term.write('\x08' + buf.slice(pos) + ' ' + `\x1b[${buf.length - pos + 1}D`)
          }
          i++
          continue
        }

        // Ctrl+C
        if (code === 3) {
          term.write('^C\r\n')
          buf = ''
          pos = 0
          state.historyIndex = -1
          term.write(getPrompt(state))
          i++
          continue
        }

        // Ctrl+L (clear)
        if (code === 12) {
          term.clear()
          term.write(getPrompt(state))
          i++
          continue
        }

        // Ctrl+A (beginning of line)
        if (code === 1) {
          if (pos > 0) term.write(`\x1b[${pos}D`)
          pos = 0
          i++
          continue
        }

        // Ctrl+E (end of line)
        if (code === 5) {
          if (pos < buf.length) term.write(`\x1b[${buf.length - pos}C`)
          pos = buf.length
          i++
          continue
        }

        // Ctrl+U (clear line)
        if (code === 21) {
          clearLine(term, buf, pos)
          buf = ''
          pos = 0
          i++
          continue
        }

        // Tab completion
        if (code === 9) {
          const parts = buf.slice(0, pos).split(' ')
          if (parts.length >= 2) {
            const partial = parts[parts.length - 1]
            const completions = getCompletions(partial, state.cwd)
            if (completions.length === 1) {
              const completion = completions[0]
              const prefix = parts.slice(0, -1).join(' ') + ' '
              const newBuf = prefix + completion + buf.slice(pos)
              clearLine(term, buf, pos)
              buf = newBuf
              pos = prefix.length + completion.length
              term.write(buf)
              const back = buf.length - pos
              if (back > 0) term.write(`\x1b[${back}D`)
            } else if (completions.length > 1) {
              term.write('\r\n' + completions.join('  ') + '\r\n')
              term.write(getPrompt(state))
              term.write(buf)
              const back = buf.length - pos
              if (back > 0) term.write(`\x1b[${back}D`)
            }
          }
          i++
          continue
        }

        // Printable chars
        if (code >= 32) {
          const ch = data[i]
          buf = buf.slice(0, pos) + ch + buf.slice(pos)
          pos++
          if (pos === buf.length) {
            term.write(ch)
          } else {
            // Insert mode: rewrite from cursor
            term.write(buf.slice(pos - 1) + `\x1b[${buf.length - pos}D`)
          }
        }

        i++
      }

      lineBufferRef.current = buf
      cursorPosRef.current = pos
    })

    return () => {
      ro.disconnect()
      term.dispose()
      termRef.current = null
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        padding: '4px',
        boxSizing: 'border-box',
        background: '#1E1E1E',
      }}
    />
  )
}

function clearLine(term: Terminal, buf: string, pos: number) {
  // Move cursor to start of typed input, clear to end
  if (pos > 0) term.write(`\x1b[${pos}D`)
  if (buf.length > 0) term.write('\x1b[K')
}
