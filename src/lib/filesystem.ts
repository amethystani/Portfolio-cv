export type FileNode = {
  type: 'file'
  content: string
}

export type DirNode = {
  type: 'dir'
  children: Record<string, FSNode>
}

export type FSNode = FileNode | DirNode

export const vfs: DirNode = {
  type: 'dir',
  children: {
    'about.txt': {
      type: 'file',
      content: `Animesh
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
  open portfolio      — visual portfolio page`,
    },

    'skills.txt': {
      type: 'file',
      content: `Languages
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
  Rust          WebAssembly   Edge computing`,
    },

    'contact.txt': {
      type: 'file',
      content: `Let's talk.

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
  open resume.pdf   — view / download my resume`,
    },

    'resume.pdf': {
      type: 'file',
      content: '[binary PDF] Use "open resume.pdf" to open in a new tab.',
    },

    'now.txt': {
      type: 'file',
      content: `What I'm doing now  (updated April 2026)

  - Building: side projects exploring edge runtimes and local-first apps
  - Reading: "Designing Data-Intensive Applications" — Kleppmann
  - Learning: Rust (slowly, but getting there)
  - Location: India

This is a /now page. Inspired by nownownow.com.`,
    },

    'projects': {
      type: 'dir',
      children: {
        'README.md': {
          type: 'file',
          content: `Projects
--------
  portfolio-terminal.md   — this site
  synapse.md              — realtime collaborative notes
  deploykit.md            — self-hosted deployment tool
  vizql.md                — SQL query visualizer

Run 'cat <filename>' to read about each project.`,
        },

        'portfolio-terminal.md': {
          type: 'file',
          content: `# portfolio-terminal

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

  github.com/amethystani/Portfolio-cv`,
        },

        'synapse.md': {
          type: 'file',
          content: `# Synapse

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

Status: private beta`,
        },

        'deploykit.md': {
          type: 'file',
          content: `# DeployKit

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

Status: open source — github.com/amethystani/deploykit`,
        },

        'vizql.md': {
          type: 'file',
          content: `# VizQL

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

Status: live at vizql.animesh.dev`,
        },
      },
    },
  },
}

// Resolve a path string to an FSNode, returning null if not found
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

// Normalize a path relative to cwd, returning absolute path
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

// List children of a directory node
export function listDir(node: DirNode): Array<{ name: string; node: FSNode }> {
  return Object.entries(node.children).map(([name, n]) => ({ name, node: n }))
}

// Get the display path (replace root with ~)
export function displayPath(path: string): string {
  if (path === '/') return '~'
  return '~' + path
}

// Get completions for a partial name in the given cwd
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
