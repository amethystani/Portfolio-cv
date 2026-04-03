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
    'about.txt': mkFile(`Animesh Mishra
--------------
ML Engineer  |  India

I work across machine learning systems, research engineering, and data-heavy
software. A lot of my recent work has involved building pipelines, evaluation
workflows, and applied AI systems that need to hold up outside experiments.

My background is a mix of research and implementation: large-scale data
processing, multi-model evaluation, synthetic-data workflows, forecasting,
retrieval systems, and end-to-end product prototypes.

I like problems that sit between theory and systems work: where the modeling
matters, but the infrastructure and the product surface matter just as much.

This terminal is another version of the portfolio. Instead of cards and pages,
you can inspect the same profile through files, folders, and commands.

Currently interested in ML engineering, research engineering, evaluation, and
data infrastructure roles.

---
  cat skills.txt      — technical skills
  ls projects/        — selected work
  cat contact.txt     — get in touch
  open portfolio      — visual portfolio page`),

    'skills.txt': mkFile(`Languages
---------
  Python (primary)    SQL    Java    LaTeX

Machine Learning
----------------
  PyTorch             HuggingFace Transformers
  XGBoost             Scikit-learn
  LangChain           Ollama
  FlashAttention-2    Triton kernels

Data & Pretraining
------------------
  Datatrove           FineWeb / FineWebEDU
  FinePDFs            CommonCrawl processing
  Dataset deduplication and quality filtering
  Synthetic-data workflows with NeMo DataDesigner

Evaluation
----------
  Multi-model ablation harnesses
  LLM-as-judge evaluation
  Factuality and validity audits
  ICC / ANOVA / Gauge R&R style statistical evaluation

Systems & Infrastructure
------------------------
  Apache Kafka         Dask
  Spark (familiar)     Docker
  Kubernetes           AWS EKS
  FastAPI              Redis
  Git

Data Science
------------
  Pandas               NumPy
  GeoPandas            Matplotlib
  NetworkX             Folium`),

    'contact.txt': mkFile(`Get in touch
-----------

  GitHub    →  github.com/amethystani
  LinkedIn  →  linkedin.com/in/animeshmishra0
  Email     →  am847@snu.edu.in
  Location  →  India

Most reliable contact channel: email.

Best fit conversations:
  - ML engineering and research engineering roles
  - Data infrastructure and evaluation systems
  - Research collaborations
  - Applied AI products and experimentation

---
  open portfolio    — view the visual portfolio
  open resume.pdf   — view / download the resume`),

    'resume.pdf': mkFile('[binary PDF] Use "open resume.pdf" to open in a new tab.'),

    'now.txt': mkFile(`What I'm doing now  (updated April 2026)

  - Building: portfolio updates, applied ML systems, and research-heavy tools
  - Focus: evaluation workflows, data pipelines, and practical AI products
  - Exploring: statistical modeling, retrieval systems, and efficient inference
  - Location: India

This is a lightweight /now page in terminal form.`),

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
  name = Animesh Mishra
  email = am847@snu.edu.in
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
  portfolio-terminal.md         — terminal-style portfolio
  llm-bias.md                   — scholarly bias evaluation platform
  legalnexus.md                 — legal reasoning and retrieval system
  evpredai.md                   — EV demand forecasting and placement
  bips-pkd.md                   — edge inference acceleration

Run 'cat <filename>' to read about each project.`),

      'portfolio-terminal.md': mkFile(`# portfolio-terminal

A portfolio site disguised as a macOS terminal.

Tech stack:
  Next.js 14 · TypeScript · xterm.js · Tailwind CSS

What it does:
  Runs a real terminal emulator in the browser with a custom bash-like
  interpreter and a mock virtual filesystem. Portfolio content is navigable
  through commands like ls, cat, open, grep, and tree.

  Features: tab completion, command history, shell-style navigation,
  mock files, and a second visual portfolio view.

Why:
  I wanted the site to reflect how I like to work: inspectable, interactive,
  and a little more systems-minded than a standard portfolio.

  github.com/amethystani/Portfolio-cv`),

      'llm-bias.md': mkFile(`# Scholarly Bias In LLMs

Research platform for measuring factual accuracy gaps in how large language
models describe scholars.

Focus:
  Multi-model evaluation across biography and genealogy tasks
  Structured scoring with human raters and automated checks
  Bias analysis across gender, geography, discipline, and career stage

Built at:
  Complexity Science Hub Vienna

Why it matters:
  It treats bias as an accuracy and representation problem, not just a
  prompting problem.

Repo:
  github.com/amethystani/csh-llmbias-website`),

      'legalnexus.md': mkFile(`# LegalNexus

Hyperbolic multi-agent legal reasoning and retrieval system.

What it does:
  Encodes legal cases in hyperbolic space so authority structure and semantic
  similarity both matter during retrieval.

Core ideas:
  HGCN embeddings
  Multi-agent citation graph construction
  Argument structure extraction
  Temporal relevance scoring

Outcome:
  Built as a research-heavy retrieval system rather than a plain RAG wrapper.

Repo:
  github.com/amethystani/legalnexus-backend`),

      'evpredai.md': mkFile(`# EVPredAI

Forecasting and placement system for EV charging demand.

What it does:
  Combines geospatial features, time-series modeling, and spatial statistics
  to estimate charging demand and recommend where infrastructure should go.

Methods:
  XGBoost
  SARIMA
  Moran's I and LISA
  GeoPandas / Folium / OpenStreetMap

Context:
  Built with Exicom Group around real operator needs and geospatial workflows.

Repo:
  github.com/amethystani/EVPredAI`),

      'bips-pkd.md': mkFile(`# BIPS-PKD

Backbone-Integrated Partial Split with Progressive Knowledge Distillation.

What it does:
  Improves edge inference efficiency by replacing dense frame-by-frame
  execution with patch-based activation and an event-driven NSGS runtime.

Focus:
  Partial split architecture
  Distillation from teacher to student
  Runtime-aware execution on constrained devices

Why it matters:
  The project is about making model deployment cheaper and more practical on
  edge hardware, not just improving a benchmark table.

Repo:
  github.com/amethystani/NSGSAlgorithm`),
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
    const childNode: FSNode | undefined = node.children[part]
    if (!childNode) return null
    node = childNode
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
