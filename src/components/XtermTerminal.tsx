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
  OPEN_APP_PREFIX,
  OPEN_URL_PREFIX,
  EDIT_PREFIX,
  type InterpreterState,
} from '@/lib/interpreter'
import { getCompletions, writeFileFS } from '@/lib/filesystem'

const COMMANDS = [
  'ls', 'cd', 'pwd', 'cat', 'echo', 'clear', 'whoami', 'help', 'man', 'uname', 'date', 'hostname',
  'exit', 'logout', 'export', 'unset', 'env', 'printenv', 'set', 'alias', 'unalias', 'history',
  'which', 'type', 'command', 'mkdir', 'rmdir', 'touch', 'rm', 'cp', 'mv', 'find', 'tree', 'diff',
  'grep', 'head', 'tail', 'wc', 'sort', 'uniq', 'tr', 'cut', 'sed', 'awk', 'rev', 'tac', 'nl',
  'tee', 'xargs', 'seq', 'printf', 'expr', 'bc', 'base64', 'xxd', 'md5', 'md5sum', 'sha256sum',
  'cal', 'cowsay', 'fortune', 'neofetch', 'screenfetch', 'fastfetch', 'uptime', 'df', 'du', 'ps',
  'kill', 'jobs', 'fg', 'bg', 'chmod', 'chown', 'ln', 'basename', 'dirname', 'realpath', 'readlink',
  'yes', 'true', 'false', 'test', 'sleep', 'ping', 'curl', 'wget', 'ssh', 'scp', 'id', 'groups',
  'w', 'who', 'last', 'su', 'sudo', 'git', 'vim', 'nvim', 'nano', 'vi', 'top', 'htop', 'less', 'more',
  'file', 'stat', 'source', 'open', 'npm', 'npx', 'node', 'python', 'python3', 'pip', 'cargo', 'go',
  'apt', 'brew',
]

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

async function playWelcomeAnimation(term: Terminal, onComplete: () => void) {
  term.write('\x1b[?25l') // hide cursor

  const bannerLines = [
    '',
    '\x1b[32m    _          _                    _     \x1b[0m',
    '\x1b[32m   / \\   _ __ (_)_ __ ___   ___  ___| |__  \x1b[0m',
    '\x1b[32m  / _ \\ | \'_ \\| | \'_ ` _ \\ / _ \\/ __| \'_ \\ \x1b[0m',
    '\x1b[32m / ___ \\| | | | | | | | | |  __/\\__ \\ | | |\x1b[0m',
    '\x1b[32m/_/   \\_\\_| |_|_|_| |_| |_|\\___||___/_| |_|\x1b[0m',
    '',
    '\x1b[1m\x1b[97mWelcome to Animesh\'s Terminal OS\x1b[0m',
    '\x1b[2mType \x1b[0m\x1b[36mhelp\x1b[0m\x1b[2m to see all commands. Use \x1b[0m\x1b[36mnano <file>\x1b[0m\x1b[2m to edit.\x1b[0m',
    '\x1b[2mSupports pipes, redirection, variables, aliases, and more.\x1b[0m',
    ''
  ]

  for (const line of bannerLines) {
    term.write(line + '\r\n')
    await delay(30)
  }

  term.write('\x1b[?25h') // show cursor
  onComplete()
}

// ──────────────── Editor State ────────────────
type EditorState = {
  active: boolean
  filePath: string
  displayPath: string
  lines: string[]
  cursorRow: number
  cursorCol: number
  scrollOffset: number
  modified: boolean
  isNew: boolean
  statusMessage: string
}

type AppLaunchRequest = {
  app: 'terminal' | 'finder' | 'music' | 'safari' | 'preview'
  url?: string
}

type Props = {
  onOpenApp?: (request: AppLaunchRequest) => void
}

function createEditorState(): EditorState {
  return {
    active: false, filePath: '', displayPath: '', lines: [''],
    cursorRow: 0, cursorCol: 0, scrollOffset: 0,
    modified: false, isNew: false, statusMessage: '',
  }
}

export default function XtermTerminal({ onOpenApp }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const stateRef = useRef<InterpreterState>(createInterpreterState())
  const lineBufferRef = useRef<string>('')
  const cursorPosRef = useRef<number>(0)
  const searchModeRef = useRef<boolean>(false)
  const searchQueryRef = useRef<string>('')
  const searchResultRef = useRef<string>('')
  const editorRef = useRef<EditorState>(createEditorState())
  const isBootingRef = useRef<boolean>(true)

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

    setTimeout(() => { try { fitAddon.fit() } catch { } }, 50)

    isBootingRef.current = true
    playWelcomeAnimation(term, () => {
      isBootingRef.current = false
      term.write(getPrompt(stateRef.current))
    })

    const ro = new ResizeObserver(() => {
      try { fitAddon.fit() } catch { }
      if (editorRef.current.active) editorRender(term, editorRef.current)
    })
    ro.observe(containerRef.current)

    term.onData((data) => {
      // ──── Skip if booting ────
      if (isBootingRef.current) return

      // ──── Editor mode ────
      if (editorRef.current.active) {
        handleEditorInput(term, data, editorRef.current, stateRef.current)
        return
      }

      const state = stateRef.current
      let buf = lineBufferRef.current
      let pos = cursorPosRef.current

      for (let i = 0; i < data.length;) {
        const code = data.charCodeAt(i)

        // Reverse search mode
        if (searchModeRef.current) {
          if (code === 13) {
            searchModeRef.current = false
            buf = searchResultRef.current; pos = buf.length
            term.write('\r\x1b[K' + getPrompt(state) + buf)
            i++; continue
          }
          if (code === 3 || code === 27) {
            searchModeRef.current = false; searchQueryRef.current = ''; searchResultRef.current = ''
            buf = ''; pos = 0
            term.write('\r\x1b[K' + getPrompt(state))
            i++; continue
          }
          if (code === 127 || code === 8) {
            searchQueryRef.current = searchQueryRef.current.slice(0, -1)
            updateSearch(term, state); i++; continue
          }
          if (code >= 32) { searchQueryRef.current += data[i]; updateSearch(term, state); i++; continue }
          i++; continue
        }

        if (code === 18) { // Ctrl+R
          searchModeRef.current = true; searchQueryRef.current = ''; searchResultRef.current = ''
          term.write('\r\x1b[K(reverse-i-search)`\': '); i++; continue
        }

        // ESC sequences
        if (data[i] === '\x1b') {
          const seq = data.slice(i, i + 3)
          if (seq === '\x1b[A') { // Up
            if (state.history.length > 0) {
              if (state.historyIndex === -1) state.historyIndex = state.history.length - 1
              else if (state.historyIndex > 0) state.historyIndex--
              clearLine(term, buf, pos); buf = state.history[state.historyIndex]; pos = buf.length; term.write(buf)
            }
            i += 3; continue
          }
          if (seq === '\x1b[B') { // Down
            if (state.historyIndex !== -1) {
              state.historyIndex++
              if (state.historyIndex >= state.history.length) { state.historyIndex = -1; clearLine(term, buf, pos); buf = ''; pos = 0 }
              else { clearLine(term, buf, pos); buf = state.history[state.historyIndex]; pos = buf.length; term.write(buf) }
            }
            i += 3; continue
          }
          if (seq === '\x1b[D') { if (pos > 0) { pos--; term.write('\x1b[D') }; i += 3; continue }
          if (seq === '\x1b[C') { if (pos < buf.length) { pos++; term.write('\x1b[C') }; i += 3; continue }
          if (seq === '\x1b[H' || data.slice(i, i + 4) === '\x1b[1~') {
            if (pos > 0) term.write(`\x1b[${pos}D`); pos = 0; i += seq === '\x1b[H' ? 3 : 4; continue
          }
          if (seq === '\x1b[F' || data.slice(i, i + 4) === '\x1b[4~') {
            if (pos < buf.length) term.write(`\x1b[${buf.length - pos}C`); pos = buf.length; i += seq === '\x1b[F' ? 3 : 4; continue
          }
          if (data.slice(i, i + 4) === '\x1b[3~') { // Delete
            if (pos < buf.length) { buf = buf.slice(0, pos) + buf.slice(pos + 1); term.write(buf.slice(pos) + ' ' + `\x1b[${buf.length - pos + 1}D`) }
            i += 4; continue
          }
          if (data.slice(i, i + 2) === '\x1b\x7f') { // Alt+Backspace
            const np = findWordBoundaryLeft(buf, pos); const d = pos - np
            if (d > 0) { buf = buf.slice(0, np) + buf.slice(pos); pos = np; term.write(`\x1b[${d}D` + buf.slice(pos) + ' '.repeat(d) + `\x1b[${buf.length - pos + d}D`) }
            i += 2; continue
          }
          i++; continue
        }

        if (code === 13) { // Enter
          term.write('\r\n')
          const output = execute(buf, state)
          if (output === CLEAR_SENTINEL) { term.clear() }
          else if (output.startsWith(OPEN_APP_PREFIX)) {
            const request = JSON.parse(output.slice(OPEN_APP_PREFIX.length)) as AppLaunchRequest
            onOpenApp?.(request)
            term.write(`\x1b[32mOpening ${request.url || request.app}...\x1b[0m\r\n`)
          } else if (output.startsWith(OPEN_URL_PREFIX)) {
            const url = output.slice(OPEN_URL_PREFIX.length)
            if (url.startsWith('/portfolio')) window.location.href = url
            else window.open(url, '_blank')
            term.write(`\x1b[32mOpening ${url}...\x1b[0m\r\n`)
          } else if (output.startsWith(EDIT_PREFIX)) {
            const info = JSON.parse(output.slice(EDIT_PREFIX.length))
            editorOpen(term, editorRef.current, info)
            lineBufferRef.current = ''; cursorPosRef.current = 0; return
          } else if (output) {
            term.write(output.replace(/(?<!\r)\n/g, '\r\n') + '\r\n')
          }
          buf = ''; pos = 0; term.write(getPrompt(state)); i++; continue
        }
        if (code === 127 || code === 8) { // Backspace
          if (pos > 0) { buf = buf.slice(0, pos - 1) + buf.slice(pos); pos--; term.write('\x08' + buf.slice(pos) + ' ' + `\x1b[${buf.length - pos + 1}D`) }
          i++; continue
        }
        if (code === 3) { term.write('^C\r\n'); buf = ''; pos = 0; state.historyIndex = -1; term.write(getPrompt(state)); i++; continue }
        if (code === 4) { if (!buf.length) { term.write('\r\n\x1b[2m[Process completed]\x1b[0m\r\n'); term.write(getPrompt(state)) }; i++; continue }
        if (code === 12) { term.clear(); term.write(getPrompt(state) + buf); if (pos < buf.length) term.write(`\x1b[${buf.length - pos}D`); i++; continue }
        if (code === 1) { if (pos > 0) term.write(`\x1b[${pos}D`); pos = 0; i++; continue }
        if (code === 5) { if (pos < buf.length) term.write(`\x1b[${buf.length - pos}C`); pos = buf.length; i++; continue }
        if (code === 21) { // Ctrl+U
          if (pos > 0) { const d = buf.slice(0, pos); buf = buf.slice(pos); term.write(`\x1b[${pos}D` + buf + ' '.repeat(d.length) + `\x1b[${buf.length + d.length}D`); pos = 0 }
          i++; continue
        }
        if (code === 11) { if (pos < buf.length) { const k = buf.length - pos; buf = buf.slice(0, pos); term.write(' '.repeat(k) + `\x1b[${k}D`) }; i++; continue }
        if (code === 23) { // Ctrl+W
          if (pos > 0) { const np = findWordBoundaryLeft(buf, pos); const d = pos - np; buf = buf.slice(0, np) + buf.slice(pos); pos = np; term.write(`\x1b[${d}D` + buf.slice(pos) + ' '.repeat(d) + `\x1b[${buf.length - pos + d}D`) }
          i++; continue
        }
        if (code === 9) { handleTab(term, state, buf, pos, (b, p) => { buf = b; pos = p }); i++; continue }
        if (code >= 32) {
          const ch = data[i]; buf = buf.slice(0, pos) + ch + buf.slice(pos); pos++
          if (pos === buf.length) term.write(ch)
          else term.write(buf.slice(pos - 1) + `\x1b[${buf.length - pos}D`)
        }
        i++
      }
      lineBufferRef.current = buf; cursorPosRef.current = pos
    })

    return () => { ro.disconnect(); term.dispose(); termRef.current = null }
  }, [onOpenApp])

  function updateSearch(term: Terminal, state: InterpreterState) {
    const q = searchQueryRef.current
    const m = [...state.history].reverse().find(h => h.includes(q))
    searchResultRef.current = m || ''
    term.write(`\r\x1b[K(reverse-i-search)\`${q}\': ${m || ''}`)
  }

  return (
    <>
      <style>{`
        .terminal-surface,
        .terminal-surface .xterm,
        .terminal-surface .xterm-screen,
        .terminal-surface .xterm-viewport {
          background: #1E1E1E !important;
        }

        .terminal-surface .xterm {
          height: 100%;
        }
      `}</style>
      <div
        ref={containerRef}
        className="terminal-surface"
        style={{
          width: '100%',
          height: '100%',
          padding: '6px 8px 0',
          boxSizing: 'border-box',
          background: '#1E1E1E',
          overflow: 'hidden',
        }}
      />
    </>
  )
}

// ──────────────── Tab Completion ────────────────
function handleTab(term: Terminal, state: InterpreterState, buf: string, pos: number, set: (b: string, p: number) => void) {
  const parts = buf.slice(0, pos).split(' ')
  if (parts.length === 1) {
    const partial = parts[0]
    const matches = COMMANDS.filter(c => c.startsWith(partial))
    if (matches.length === 1) {
      clearLine(term, buf, pos); const nb = matches[0] + ' ' + buf.slice(pos); const np = matches[0].length + 1
      term.write(nb); if (np < nb.length) term.write(`\x1b[${nb.length - np}D`); set(nb, np)
    } else if (matches.length > 1) {
      const cp = commonPrefix(matches)
      if (cp.length > partial.length) { clearLine(term, buf, pos); const nb = cp + buf.slice(pos); term.write(nb); if (cp.length < nb.length) term.write(`\x1b[${nb.length - cp.length}D`); set(nb, cp.length) }
      else { term.write('\r\n' + matches.join('  ') + '\r\n' + getPrompt(state) + buf); if (pos < buf.length) term.write(`\x1b[${buf.length - pos}D`); set(buf, pos) }
    }
  } else {
    const partial = parts[parts.length - 1]
    const completions = getCompletions(partial, state.cwd)
    if (completions.length === 1) {
      const pfx = parts.slice(0, -1).join(' ') + ' '; const sfx = buf.slice(pos)
      clearLine(term, buf, pos); const nb = pfx + completions[0] + sfx; const np = pfx.length + completions[0].length
      term.write(nb); if (np < nb.length) term.write(`\x1b[${nb.length - np}D`); set(nb, np)
    } else if (completions.length > 1) {
      const cp = commonPrefix(completions)
      if (cp.length > partial.length) {
        const pfx = parts.slice(0, -1).join(' ') + ' '; const sfx = buf.slice(pos)
        clearLine(term, buf, pos); const nb = pfx + cp + sfx; const np = pfx.length + cp.length
        term.write(nb); if (np < nb.length) term.write(`\x1b[${nb.length - np}D`); set(nb, np)
      } else {
        term.write('\r\n' + completions.join('  ') + '\r\n' + getPrompt(state) + buf)
        if (pos < buf.length) term.write(`\x1b[${buf.length - pos}D`); set(buf, pos)
      }
    }
  }
}

// ──────────────── Nano-like Editor ────────────────
function editorOpen(term: Terminal, ed: EditorState, info: { path: string; displayPath: string; content: string; isNew: boolean }) {
  ed.active = true
  ed.filePath = info.path
  ed.displayPath = info.displayPath
  ed.lines = info.content ? info.content.split('\n') : ['']
  ed.cursorRow = 0
  ed.cursorCol = 0
  ed.scrollOffset = 0
  ed.modified = false
  ed.isNew = info.isNew
  ed.statusMessage = info.isNew ? '[ New File ]' : ''
  editorRender(term, ed)
}

function editorRender(term: Terminal, ed: EditorState) {
  const rows = term.rows
  const cols = term.cols
  const editableRows = rows - 3 // 1 title bar + content + 2 status lines at bottom

  // Adjust scroll so cursor is visible
  if (ed.cursorRow < ed.scrollOffset) ed.scrollOffset = ed.cursorRow
  if (ed.cursorRow >= ed.scrollOffset + editableRows) ed.scrollOffset = ed.cursorRow - editableRows + 1

  term.write('\x1b[?25l') // Hide cursor during render
  term.write('\x1b[H')    // Move to home

  // Title bar (inverted)
  const title = `  GNU nano   ${ed.displayPath}${ed.modified ? ' (modified)' : ''}`
  term.write(`\x1b[7m${title.padEnd(cols)}\x1b[0m\r\n`)

  // Content lines
  for (let r = 0; r < editableRows; r++) {
    const lineIdx = ed.scrollOffset + r
    if (lineIdx < ed.lines.length) {
      const line = ed.lines[lineIdx]
      const visible = line.slice(0, cols)
      term.write(visible + '\x1b[K\r\n')
    } else {
      term.write('\x1b[K\r\n')
    }
  }

  // Status bar (2 lines at bottom)
  const statusLine1 = ed.statusMessage || `  Line ${ed.cursorRow + 1}/${ed.lines.length}, Col ${ed.cursorCol + 1}`
  term.write(`\x1b[7m${statusLine1.padEnd(cols)}\x1b[0m\r\n`)

  const shortcuts = '^O Save   ^X Exit   ^K Cut Line   ^U Paste'
  term.write(`\x1b[7m${shortcuts.padEnd(cols)}\x1b[0m`)

  // Position cursor
  const screenRow = ed.cursorRow - ed.scrollOffset + 2 // +2 for title bar (1-indexed)
  const screenCol = Math.min(ed.cursorCol + 1, cols)
  term.write(`\x1b[${screenRow};${screenCol}H`)
  term.write('\x1b[?25h') // Show cursor
}

let cutBuffer = ''

function handleEditorInput(term: Terminal, data: string, ed: EditorState, interpState: InterpreterState) {
  for (let i = 0; i < data.length;) {
    const code = data.charCodeAt(i)

    // ESC sequences (arrow keys)
    if (data[i] === '\x1b') {
      const seq = data.slice(i, i + 3)
      if (seq === '\x1b[A') { // Up
        if (ed.cursorRow > 0) { ed.cursorRow--; ed.cursorCol = Math.min(ed.cursorCol, ed.lines[ed.cursorRow].length) }
        editorRender(term, ed); i += 3; continue
      }
      if (seq === '\x1b[B') { // Down
        if (ed.cursorRow < ed.lines.length - 1) { ed.cursorRow++; ed.cursorCol = Math.min(ed.cursorCol, ed.lines[ed.cursorRow].length) }
        editorRender(term, ed); i += 3; continue
      }
      if (seq === '\x1b[C') { // Right
        if (ed.cursorCol < ed.lines[ed.cursorRow].length) ed.cursorCol++
        else if (ed.cursorRow < ed.lines.length - 1) { ed.cursorRow++; ed.cursorCol = 0 }
        editorRender(term, ed); i += 3; continue
      }
      if (seq === '\x1b[D') { // Left
        if (ed.cursorCol > 0) ed.cursorCol--
        else if (ed.cursorRow > 0) { ed.cursorRow--; ed.cursorCol = ed.lines[ed.cursorRow].length }
        editorRender(term, ed); i += 3; continue
      }
      // Home
      if (seq === '\x1b[H' || data.slice(i, i + 4) === '\x1b[1~') {
        ed.cursorCol = 0; editorRender(term, ed); i += seq === '\x1b[H' ? 3 : 4; continue
      }
      // End
      if (seq === '\x1b[F' || data.slice(i, i + 4) === '\x1b[4~') {
        ed.cursorCol = ed.lines[ed.cursorRow].length; editorRender(term, ed)
        i += seq === '\x1b[F' ? 3 : 4; continue
      }
      // Delete key
      if (data.slice(i, i + 4) === '\x1b[3~') {
        const line = ed.lines[ed.cursorRow]
        if (ed.cursorCol < line.length) {
          ed.lines[ed.cursorRow] = line.slice(0, ed.cursorCol) + line.slice(ed.cursorCol + 1)
          ed.modified = true
        } else if (ed.cursorRow < ed.lines.length - 1) {
          ed.lines[ed.cursorRow] = line + ed.lines[ed.cursorRow + 1]
          ed.lines.splice(ed.cursorRow + 1, 1)
          ed.modified = true
        }
        ed.statusMessage = ''; editorRender(term, ed); i += 4; continue
      }
      // Page Up / Page Down
      if (data.slice(i, i + 4) === '\x1b[5~') { // Page Up
        ed.cursorRow = Math.max(0, ed.cursorRow - (term.rows - 3))
        ed.cursorCol = Math.min(ed.cursorCol, ed.lines[ed.cursorRow].length)
        editorRender(term, ed); i += 4; continue
      }
      if (data.slice(i, i + 4) === '\x1b[6~') { // Page Down
        ed.cursorRow = Math.min(ed.lines.length - 1, ed.cursorRow + (term.rows - 3))
        ed.cursorCol = Math.min(ed.cursorCol, ed.lines[ed.cursorRow].length)
        editorRender(term, ed); i += 4; continue
      }
      i++; continue
    }

    // Ctrl+X — Exit editor
    if (code === 24) {
      ed.active = false
      // Clear screen and return to shell
      term.write('\x1b[2J\x1b[H')
      term.write(getPrompt(interpState))
      i++; continue
    }

    // Ctrl+O — Save
    if (code === 15) {
      const content = ed.lines.join('\n')
      const err = writeFileFS(ed.filePath, content, interpState.cwd, false)
      if (err) {
        ed.statusMessage = `Error: ${err}`
      } else {
        ed.modified = false
        ed.isNew = false
        ed.statusMessage = `[ Wrote ${ed.lines.length} lines to ${ed.displayPath} ]`
      }
      editorRender(term, ed); i++; continue
    }

    // Ctrl+K — Cut line
    if (code === 11) {
      cutBuffer = ed.lines[ed.cursorRow]
      if (ed.lines.length > 1) {
        ed.lines.splice(ed.cursorRow, 1)
        if (ed.cursorRow >= ed.lines.length) ed.cursorRow = ed.lines.length - 1
      } else {
        ed.lines[0] = ''
      }
      ed.cursorCol = Math.min(ed.cursorCol, ed.lines[ed.cursorRow].length)
      ed.modified = true; ed.statusMessage = '[ Cut 1 line ]'
      editorRender(term, ed); i++; continue
    }

    // Ctrl+U — Paste (uncut)
    if (code === 21) {
      if (cutBuffer) {
        ed.lines.splice(ed.cursorRow, 0, cutBuffer)
        ed.cursorRow++
        ed.modified = true; ed.statusMessage = '[ Pasted 1 line ]'
      }
      editorRender(term, ed); i++; continue
    }

    // Ctrl+G — Help
    if (code === 7) {
      ed.statusMessage = '^O=Save ^X=Exit ^K=Cut ^U=Paste Arrows=Move'
      editorRender(term, ed); i++; continue
    }

    // Enter — insert new line
    if (code === 13) {
      const line = ed.lines[ed.cursorRow]
      const before = line.slice(0, ed.cursorCol)
      const after = line.slice(ed.cursorCol)
      ed.lines[ed.cursorRow] = before
      ed.lines.splice(ed.cursorRow + 1, 0, after)
      ed.cursorRow++; ed.cursorCol = 0; ed.modified = true; ed.statusMessage = ''
      editorRender(term, ed); i++; continue
    }

    // Backspace
    if (code === 127 || code === 8) {
      if (ed.cursorCol > 0) {
        const line = ed.lines[ed.cursorRow]
        ed.lines[ed.cursorRow] = line.slice(0, ed.cursorCol - 1) + line.slice(ed.cursorCol)
        ed.cursorCol--; ed.modified = true
      } else if (ed.cursorRow > 0) {
        const prevLen = ed.lines[ed.cursorRow - 1].length
        ed.lines[ed.cursorRow - 1] += ed.lines[ed.cursorRow]
        ed.lines.splice(ed.cursorRow, 1)
        ed.cursorRow--; ed.cursorCol = prevLen; ed.modified = true
      }
      ed.statusMessage = ''; editorRender(term, ed); i++; continue
    }

    // Tab — insert 2 spaces
    if (code === 9) {
      const line = ed.lines[ed.cursorRow]
      ed.lines[ed.cursorRow] = line.slice(0, ed.cursorCol) + '  ' + line.slice(ed.cursorCol)
      ed.cursorCol += 2; ed.modified = true; ed.statusMessage = ''
      editorRender(term, ed); i++; continue
    }

    // Ctrl+C — cancel (do nothing, just clear status)
    if (code === 3) {
      ed.statusMessage = ''; editorRender(term, ed); i++; continue
    }

    // Printable characters
    if (code >= 32) {
      const ch = data[i]
      const line = ed.lines[ed.cursorRow]
      ed.lines[ed.cursorRow] = line.slice(0, ed.cursorCol) + ch + line.slice(ed.cursorCol)
      ed.cursorCol++; ed.modified = true; ed.statusMessage = ''
      editorRender(term, ed)
    }
    i++
  }
}

// ──────────────── Utilities ────────────────
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

function commonPrefix(strings: string[]): string {
  if (strings.length === 0) return ''
  let prefix = strings[0]
  for (let i = 1; i < strings.length; i++) while (!strings[i].startsWith(prefix)) prefix = prefix.slice(0, -1)
  return prefix
}
