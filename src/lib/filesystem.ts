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
      content: `Name:     Animesh
Role:     Software Engineer & Developer
Location: India

I'm a software engineer with a passion for building things that live on the
internet. I care about clean code, great user experiences, and systems that
scale. Currently open to new opportunities.

I enjoy working across the stack — from designing APIs to crafting pixel-
perfect UIs. This very site is a testament to that obsession with detail.

When I'm not coding I'm usually reading, listening to music, or exploring
new technologies.

Type 'cat skills.txt' to see my technical skills.
Type 'ls projects/' to see what I've built.`,
    },
    'skills.txt': {
      type: 'file',
      content: `Languages
---------
  TypeScript  JavaScript  Python  Go  SQL

Frontend
--------
  React       Next.js     Tailwind CSS   HTML/CSS
  Framer Motion           Three.js

Backend
-------
  Node.js     Express     FastAPI    PostgreSQL
  Redis       REST APIs   GraphQL

DevOps & Tools
--------------
  Docker      Git         GitHub Actions
  Linux       Nginx       Vercel

Currently Learning
------------------
  Rust        WebAssembly  Systems programming`,
    },
    'contact.txt': {
      type: 'file',
      content: `Email:    animesh@example.com
GitHub:   https://github.com/amethystani
LinkedIn: https://linkedin.com/in/animesh

Feel free to reach out — I'm always happy to chat about
interesting projects, collaborations, or opportunities.

open portfolio    — view the visual portfolio
open resume.pdf   — download my resume`,
    },
    'resume.pdf': {
      type: 'file',
      content: '[PDF] Resume — use "open resume.pdf" to download/view',
    },
    'projects': {
      type: 'dir',
      children: {
        'portfolio-site.md': {
          type: 'file',
          content: `# Portfolio Site (this site)

Tech: Next.js, TypeScript, xterm.js, Tailwind CSS

A terminal-first portfolio website that runs inside an authentic
macOS Terminal emulator. Built with xterm.js for the terminal
experience, a custom command interpreter, and a mock virtual
filesystem for navigation.

Features:
  - Pixel-perfect macOS terminal window chrome
  - Full bash-like command interpreter (ls, cd, cat, open, ...)
  - Mock VFS for portfolio content navigation
  - Separate visual portfolio page accessible via terminal
  - Tab completion and command history

GitHub: https://github.com/amethystani/Portfolio-cv`,
        },
        'project-alpha.md': {
          type: 'file',
          content: `# Project Alpha

Tech: React, Node.js, PostgreSQL, Docker

A full-stack web application with real-time features.
Built with a focus on performance and scalability.

Key highlights:
  - Real-time updates via WebSockets
  - Containerized deployment with Docker Compose
  - CI/CD pipeline with GitHub Actions
  - 99.9% uptime SLA`,
        },
        'project-beta.md': {
          type: 'file',
          content: `# Project Beta

Tech: Python, FastAPI, Redis, React

A high-performance REST API backend with a React dashboard.
Designed to handle thousands of concurrent requests.

Key highlights:
  - Sub-50ms response times at p99
  - Redis caching layer
  - Comprehensive test coverage (>90%)
  - OpenAPI documentation`,
        },
        'project-gamma.md': {
          type: 'file',
          content: `# Project Gamma

Tech: Go, gRPC, Kubernetes

A distributed microservices system built with Go and gRPC.
Deployed on Kubernetes with auto-scaling.

Key highlights:
  - gRPC communication between services
  - Kubernetes deployment with HPA
  - Distributed tracing with Jaeger
  - Service mesh with Istio`,
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
