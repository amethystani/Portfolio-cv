export type FileNode = {
  type: 'file'
  content: string
  permissions?: string
  created?: string
  modified?: string
  size?: number
}

export type DirNode = {
  type: 'dir'
  children: Record<string, FSNode>
  permissions?: string
  created?: string
  modified?: string
}

export type FSNode = FileNode | DirNode

function now(): string {
  return new Date().toISOString()
}

function mkFile(content: string): FileNode {
  return { type: 'file', content, permissions: '-rw-r--r--', created: now(), modified: now(), size: content.length }
}

function mkDir(children: Record<string, FSNode>): DirNode {
  return { type: 'dir', children, permissions: 'drwxr-xr-x', created: now(), modified: now() }
}

export const vfs: DirNode = {
  type: 'dir',
  children: {
    'about.txt': mkFile(`Animesh
-------
Software Engineer  |  India

I build things for the web — products that are fast, reliable, and actually
pleasant to use. I care deeply about the craft: clean architecture, thoughtful
UX, and code that future-me won't hate.

I'm comfortable across the full stack, but my instinct leans toward systems
thinking — how pieces connect, where things break, why they scale (or don't).

This site is a small example of that obsession. It's a real terminal emulator
running in a browser, with a custom command interpreter and a virtual
filesystem. Probably overkill for a portfolio. That's the point.

Currently open to full-time roles and interesting contract work.

---
  cat skills.txt      — technical skills
  ls projects/        — things I've built
  cat contact.txt     — get in touch
  open portfolio      — visual portfolio page`),

    'skills.txt': mkFile(`Languages
---------
  TypeScript    JavaScript    Python    Go    SQL    Bash

Frontend
--------
  React         Next.js       Tailwind CSS    Framer Motion
  HTML/CSS      Three.js      WebGL

Backend
-------
  Node.js       Express       FastAPI         tRPC
  PostgreSQL    Redis         Prisma          GraphQL
  REST APIs     WebSockets

Infrastructure & DevOps
------------------------
  Docker        Kubernetes    GitHub Actions  Terraform
  Linux         Nginx         Vercel          AWS (EC2, S3, RDS, Lambda)

Tools
-----
  Git           Neovim        tmux            Figma (enough to be useful)
  Postman       Datadog       Sentry

Currently Exploring
-------------------
  Rust          WebAssembly   Edge computing`),

    'contact.txt': mkFile(`Let's talk.

  GitHub    →  github.com/amethystani
  LinkedIn  →  linkedin.com/in/amethystani
  Email     →  hi@animesh.dev

I'm most responsive over email. Response time: usually same day.

I'm interested in:
  - Senior / lead engineering roles
  - Interesting contract or consulting work
  - Open source collaboration
  - Conversations about systems, UX, and building things well

---
  open portfolio    — view the visual portfolio
  open resume.pdf   — view / download my resume`),

    'resume.pdf': mkFile('[binary PDF] Use "open resume.pdf" to open in a new tab.'),

    'now.txt': mkFile(`What I'm doing now  (updated April 2026)

  - Building: side projects exploring edge runtimes and local-first apps
  - Reading: "Designing Data-Intensive Applications" — Kleppmann
  - Learning: Rust (slowly, but getting there)
  - Location: India

This is a /now page. Inspired by nownownow.com.`),

    '.bashrc': mkFile(`# Animesh's .bashrc
export EDITOR=nvim
export LANG=en_US.UTF-8
alias ll='ls -la'
alias la='ls -a'
alias ..='cd ..'
alias ...='cd ../..'
alias cls='clear'`),

    '.bash_history': mkFile(`ls
cat about.txt
cd projects
ls -la
cat portfolio-terminal.md
cd ..
help`),

    '.config': mkDir({
      'nvim': mkDir({
        'init.lua': mkFile(`-- Animesh's Neovim config
vim.g.mapleader = " "
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.expandtab = true`),
      }),
      'git': mkDir({
        'config': mkFile(`[user]
  name = Animesh
  email = hi@animesh.dev
[core]
  editor = nvim
[init]
  defaultBranch = main
[alias]
  co = checkout
  br = branch
  st = status
  lg = log --oneline --graph --decorate`),
      }),
    }),

    '.ssh': mkDir({
      'known_hosts': mkFile(`github.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...
gitlab.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA...`),
    }),

    'projects': mkDir({
      'README.md': mkFile(`Projects
--------
  portfolio-terminal.md   — this site
  synapse.md              — realtime collaborative notes
  deploykit.md            — self-hosted deployment tool
  vizql.md                — SQL query visualizer

Run 'cat <filename>' to read about each project.`),

      'portfolio-terminal.md': mkFile(`# portfolio-terminal

A portfolio site disguised as a macOS terminal.

Tech stack:
  Next.js 14 · TypeScript · xterm.js · Tailwind CSS

What it does:
  Runs a real terminal emulator (xterm.js) in the browser with a custom
  bash-like interpreter and a mock virtual filesystem. All portfolio
  content is navigable via standard Unix commands.

  Features: tab completion, command history (↑↓), cursor movement,
  Ctrl+A/E/L/C, man pages, ls/cd/cat/open/echo/pwd/whoami.

Why:
  Most developer portfolios are forgettable. This one you have to use.

  github.com/amethystani/Portfolio-cv`),

      'synapse.md': mkFile(`# Synapse

Realtime collaborative note-taking with a local-first architecture.

Tech stack:
  Next.js · Y.js · Hocuspocus · PostgreSQL · Tiptap · Vercel

What it does:
  Multiplayer document editing with CRDTs (Y.js) for conflict-free merging.
  Notes sync instantly across devices and work fully offline — changes merge
  automatically when reconnected.

  Supports rich text, inline code blocks, slash commands, and shared cursors.

Scale:
  Handles 100+ concurrent editors per document without coordination overhead.

Status: private beta`),

      'deploykit.md': mkFile(`# DeployKit

Self-hosted deployment platform for small teams who don't want to pay
Heroku prices or manage raw Kubernetes.

Tech stack:
  Go · Docker API · Caddy · PostgreSQL · React

What it does:
  Git-push deploys to your own VPS. Caddy handles SSL automatically.
  Includes a dashboard for env vars, logs, rollbacks, and health checks.

  One binary, one config file, one server. No YAML sprawl.

Why:
  Fly.io is great. Railway is great. But sometimes you want the machine
  to be yours. DeployKit is for that.

Status: open source — github.com/amethystani/deploykit`),

      'vizql.md': mkFile(`# VizQL

Interactive SQL query visualizer and explainer.

Tech stack:
  React · Monaco Editor · PostgreSQL · pg_query (WASM) · D3.js

What it does:
  Paste a SQL query, get back an interactive execution plan diagram.
  Highlights expensive nodes, estimates row counts, and suggests indexes.

  Runs the query parser in WebAssembly (pg_query compiled to WASM) so
  parse trees are available instantly, in-browser, with no server round-trip.

Use case:
  Useful for teaching SQL internals, debugging slow queries, and impressing
  people in code reviews.

Status: live at vizql.animesh.dev`),
    }),

    'Documents': mkDir({
      'notes.txt': mkFile(`Random dev notes
================
- Remember to set up CI/CD for the portfolio
- Look into Bun as an alternative runtime
- Try out Drizzle ORM for the next project
- Edge functions are getting really fast now`),
    }),

    'Downloads': mkDir({}),

    'Desktop': mkDir({}),

    'tmp': mkDir({}),
  },
  permissions: 'drwxr-xr-x',
  created: now(),
  modified: now(),
}

// ──────────────────────────────── Path Resolution ────────────────────────────────

export function resolvePath(path: string, cwd: string): FSNode | null {
  const parts = normalizePath(path, cwd).split('/').filter(Boolean)
  let node: FSNode = vfs
  for (const part of parts) {
    if (node.type !== 'dir') return null
    const child: FSNode | undefined = node.children[part]
    if (!child) return null
    node = child
  }
  return node
}

export function normalizePath(path: string, cwd: string): string {
  if (path === '~' || path === '') return '/'
  let base = path.startsWith('/') ? '' : cwd
  if (path.startsWith('~/')) {
    base = '/'
    path = path.slice(2)
  }
  const parts = [...base.split('/').filter(Boolean), ...path.split('/').filter(Boolean)]
  const resolved: string[] = []
  for (const part of parts) {
    if (part === '..') {
      resolved.pop()
    } else if (part !== '.') {
      resolved.push(part)
    }
  }
  return '/' + resolved.join('/')
}

export function listDir(node: DirNode): Array<{ name: string; node: FSNode }> {
  return Object.entries(node.children).map(([name, n]) => ({ name, node: n }))
}

export function displayPath(path: string): string {
  if (path === '/') return '~'
  return '~' + path
}

// ──────────────────────────────── Glob Expansion ────────────────────────────────

export function expandGlob(pattern: string, cwd: string): string[] {
  const lastSlash = pattern.lastIndexOf('/')
  let dirPart = ''
  let globPart = pattern
  if (lastSlash >= 0) {
    dirPart = pattern.slice(0, lastSlash + 1)
    globPart = pattern.slice(lastSlash + 1)
  }

  if (!globPart.includes('*') && !globPart.includes('?')) return [pattern]

  const dirPath = dirPart ? normalizePath(dirPart, cwd) : cwd
  const dirNode = resolvePath(dirPath, cwd)
  if (!dirNode || dirNode.type !== 'dir') return [pattern]

  const regex = globToRegex(globPart)
  const matches = Object.keys(dirNode.children).filter(name => regex.test(name))

  if (matches.length === 0) return [pattern] // No match: return pattern as-is (bash behavior)
  return matches.sort().map(m => dirPart + m)
}

function globToRegex(glob: string): RegExp {
  let regex = ''
  for (const ch of glob) {
    if (ch === '*') regex += '.*'
    else if (ch === '?') regex += '.'
    else if ('.+^${}()|[]\\'.includes(ch)) regex += '\\' + ch
    else regex += ch
  }
  return new RegExp('^' + regex + '$')
}

// ──────────────────────────────── Tab Completion ────────────────────────────────

export function getCompletions(partial: string, cwd: string): string[] {
  const lastSlash = partial.lastIndexOf('/')
  const dirPart = lastSlash >= 0 ? partial.slice(0, lastSlash + 1) : ''
  const namePart = lastSlash >= 0 ? partial.slice(lastSlash + 1) : partial

  const dirPath = dirPart ? normalizePath(dirPart, cwd) : cwd
  const dirNode = resolvePath(dirPath, cwd)
  if (!dirNode || dirNode.type !== 'dir') return []

  return Object.entries(dirNode.children)
    .filter(([name]) => name.startsWith(namePart))
    .map(([name, node]) => dirPart + name + (node.type === 'dir' ? '/' : ''))
}

// ──────────────────────────────── Filesystem Mutations ────────────────────────────────

function getParentAndName(path: string, cwd: string): { parent: DirNode; name: string } | null {
  const abs = normalizePath(path, cwd)
  const parts = abs.split('/').filter(Boolean)
  if (parts.length === 0) return null // Can't operate on root
  const name = parts.pop()!
  let node: FSNode = vfs
  for (const part of parts) {
    if (node.type !== 'dir') return null
    const child = node.children[part]
    if (!child) return null
    node = child
  }
  if (node.type !== 'dir') return null
  return { parent: node, name }
}

export function mkdirFS(path: string, cwd: string, recursive = false): string | null {
  if (recursive) {
    const abs = normalizePath(path, cwd)
    const parts = abs.split('/').filter(Boolean)
    let node: FSNode = vfs
    for (const part of parts) {
      if (node.type !== 'dir') return `mkdir: ${path}: Not a directory`
      if (!node.children[part]) {
        node.children[part] = mkDir({})
      } else if (node.children[part].type !== 'dir') {
        return `mkdir: ${part}: Not a directory`
      }
      node = node.children[part]
    }
    return null
  }

  const result = getParentAndName(path, cwd)
  if (!result) return `mkdir: ${path}: Invalid path`
  if (result.parent.children[result.name]) return `mkdir: ${path}: File exists`
  result.parent.children[result.name] = mkDir({})
  return null
}

export function touchFS(path: string, cwd: string): string | null {
  const result = getParentAndName(path, cwd)
  if (!result) return `touch: ${path}: Invalid path`
  if (result.parent.children[result.name]) {
    // Touch an existing file => update modified time
    const node = result.parent.children[result.name]
    if (node.type === 'file') node.modified = now()
    else if (node.type === 'dir') node.modified = now()
    return null
  }
  result.parent.children[result.name] = mkFile('')
  return null
}

export function writeFileFS(path: string, content: string, cwd: string, append = false): string | null {
  const result = getParentAndName(path, cwd)
  if (!result) return `write: ${path}: Invalid path`
  const existing = result.parent.children[result.name]
  if (existing && existing.type === 'dir') return `write: ${path}: Is a directory`
  if (append && existing && existing.type === 'file') {
    existing.content += content
    existing.modified = now()
    existing.size = existing.content.length
  } else {
    result.parent.children[result.name] = mkFile(content)
  }
  return null
}

export function rmFS(path: string, cwd: string, recursive = false): string | null {
  const result = getParentAndName(path, cwd)
  if (!result) return `rm: ${path}: Invalid path`
  const node = result.parent.children[result.name]
  if (!node) return `rm: ${path}: No such file or directory`
  if (node.type === 'dir' && !recursive) return `rm: ${path}: is a directory`
  delete result.parent.children[result.name]
  return null
}

export function cpFS(src: string, dest: string, cwd: string): string | null {
  const srcNode = resolvePath(normalizePath(src, cwd), cwd)
  if (!srcNode) return `cp: ${src}: No such file or directory`
  if (srcNode.type === 'dir') return `cp: ${src}: is a directory (use cp -r)`

  const destResult = getParentAndName(dest, cwd)
  if (!destResult) return `cp: ${dest}: Invalid path`

  // Check if dest is existing dir
  const destNode = resolvePath(normalizePath(dest, cwd), cwd)
  if (destNode && destNode.type === 'dir') {
    const srcName = src.split('/').pop()!
    destNode.children[srcName] = mkFile(srcNode.content)
    return null
  }

  destResult.parent.children[destResult.name] = mkFile(srcNode.content)
  return null
}

export function mvFS(src: string, dest: string, cwd: string): string | null {
  const srcResult = getParentAndName(src, cwd)
  if (!srcResult) return `mv: ${src}: Invalid path`
  const srcNode = srcResult.parent.children[srcResult.name]
  if (!srcNode) return `mv: ${src}: No such file or directory`

  // Check if dest is existing dir
  const destNode = resolvePath(normalizePath(dest, cwd), cwd)
  if (destNode && destNode.type === 'dir') {
    const srcName = src.split('/').pop()!
    ;(destNode as DirNode).children[srcName] = srcNode
    delete srcResult.parent.children[srcResult.name]
    return null
  }

  const destResult = getParentAndName(dest, cwd)
  if (!destResult) return `mv: ${dest}: Invalid path`
  destResult.parent.children[destResult.name] = srcNode
  delete srcResult.parent.children[srcResult.name]
  return null
}

// Deep clone for cp -r
export function deepCloneNode(node: FSNode): FSNode {
  if (node.type === 'file') {
    return { ...node }
  }
  const children: Record<string, FSNode> = {}
  for (const [k, v] of Object.entries(node.children)) {
    children[k] = deepCloneNode(v)
  }
  return { ...node, children }
}

// Tree-walk to find files matching a pattern
export function findFiles(
  startPath: string,
  cwd: string,
  predicate: (name: string, node: FSNode, path: string) => boolean
): string[] {
  const abs = normalizePath(startPath, cwd)
  const startNode = resolvePath(abs, cwd)
  if (!startNode) return []

  const results: string[] = []

  function walk(node: FSNode, currentPath: string) {
    if (predicate(currentPath.split('/').pop() || '', node, currentPath)) {
      results.push(currentPath)
    }
    if (node.type === 'dir') {
      for (const [name, child] of Object.entries(node.children)) {
        walk(child, currentPath === '/' ? '/' + name : currentPath + '/' + name)
      }
    }
  }

  walk(startNode, abs === '/' ? '/' : abs)
  return results
}

// Get all paths recursively for tree command
export function getTree(path: string, cwd: string): Array<{ path: string; type: 'file' | 'dir'; depth: number }> {
  const abs = normalizePath(path, cwd)
  const startNode = resolvePath(abs, cwd)
  if (!startNode || startNode.type !== 'dir') return []

  const results: Array<{ path: string; type: 'file' | 'dir'; depth: number }> = []

  function walk(node: DirNode, depth: number) {
    const entries = Object.entries(node.children).sort(([a], [b]) => a.localeCompare(b))
    for (const [name, child] of entries) {
      results.push({ path: name, type: child.type, depth })
      if (child.type === 'dir') {
        walk(child, depth + 1)
      }
    }
  }

  walk(startNode, 0)
  return results
}

// Get size of node (recursive for dirs)
export function getNodeSize(node: FSNode): number {
  if (node.type === 'file') return node.content.length
  let total = 0
  for (const child of Object.values(node.children)) {
    total += getNodeSize(child)
  }
  return total
}
