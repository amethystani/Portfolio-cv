// Converts a fragment of the captured, server-rendered nousresearch.com HTML into JSX.
//
//   node tools/html-to-jsx.mjs <page.html> <selector> [--name=Hero] [--out=file.tsx]
//
// Selector: a tag, #id, .class or a combination (e.g. `section#mission`, `main`, `.hw-footer-reveal`).
// It is a one-off generator: the output is meant to be read, split and edited by hand.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { parse } from 'parse5';
import prettier from 'prettier';
import { safeRel } from '../../tools/paths.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SITE = path.join(ROOT, 'site');

// ---------------------------------------------------------------- attribute naming
const RENAME = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', colspan: 'colSpan', rowspan: 'rowSpan',
  srcset: 'srcSet', crossorigin: 'crossOrigin', fetchpriority: 'fetchPriority', autoplay: 'autoPlay',
  playsinline: 'playsInline', datetime: 'dateTime', maxlength: 'maxLength', readonly: 'readOnly',
  autocomplete: 'autoComplete', spellcheck: 'spellCheck', referrerpolicy: 'referrerPolicy',
  allowfullscreen: 'allowFullScreen', frameborder: 'frameBorder', inputmode: 'inputMode',
  enterkeyhint: 'enterKeyHint', contenteditable: 'contentEditable', usemap: 'useMap', novalidate: 'noValidate',
  'xlink:href': 'xlinkHref', 'xml:space': 'xmlSpace', 'xmlns:xlink': 'xmlnsXlink', charset: 'charSet',
  'http-equiv': 'httpEquiv', 'accept-charset': 'acceptCharset', controlslist: 'controlsList',
  disablepictureinpicture: 'disablePictureInPicture', disableremoteplayback: 'disableRemotePlayback',
  popovertarget: 'popoverTarget', fetchPriority: 'fetchPriority',
};
const NUMERIC = new Set(['tabIndex', 'colSpan', 'rowSpan', 'maxLength', 'rows', 'cols', 'size']);
const BOOLEAN = new Set(['hidden', 'disabled', 'controls', 'loop', 'muted', 'autoPlay', 'playsInline', 'async', 'defer',
  'checked', 'selected', 'required', 'readOnly', 'multiple', 'open', 'inert', 'allowFullScreen', 'disablePictureInPicture']);

function attrName(n) {
  if (RENAME[n]) return RENAME[n];
  if (/^(data|aria)-/.test(n)) return n;
  if (n.includes('-')) return n.replace(/-([a-z])/g, (_, c) => c.toUpperCase()); // stroke-width -> strokeWidth
  return n;
}

// ---------------------------------------------------------------- url rewriting
const ASSET_RE = /^https:\/\/web-assets\.nousresearch\.com\/portal\/[0-9a-f]{40}\/(assets\/.*|logo-favicon\.png)$/;
const EXTERNAL_MAP = fs.existsSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'external-map.json')) ? JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'external-map.json'), 'utf8')) : {};
const EXTERNAL_HOSTS = ['5jdxmo9ix2ncv3a2.public.blob.vercel-storage.com', 'substackcdn.com', 'lh7-rt.googleusercontent.com', 'pbs.twimg.com'];

export function rewriteUrl(v) {
  let m;
  if ((m = ASSET_RE.exec(v.replace(/\?v=[0-9a-f]+$/, '')))) return '/' + m[1];
  if (v === 'https://hermes-assets.nousresearch.com/hermes-desktop.mp4') return '/media/hermes-desktop.mp4';
  try {
    const u = new URL(v);
    const mapped = EXTERNAL_MAP[u.hostname + decodeURIComponent(u.pathname)];
    if (mapped) return mapped;
    if (EXTERNAL_HOSTS.includes(u.hostname)) {
      return '/assets/external/' + safeRel(`${u.hostname}${decodeURIComponent(u.pathname)}`);
    }
    if (u.hostname === 'nousresearch-com-backup.vercel.app' && /\.(png|jpe?g|webp|gif|svg|avif)$/i.test(u.pathname)) {
      return '/assets/external/' + safeRel(`${u.hostname}${decodeURIComponent(u.pathname)}`);
    }
    if (u.origin === 'https://nousresearch.com') return (u.pathname + u.search + u.hash) || '/';
  } catch { /* relative or malformed: leave */ }
  return v;
}

// ---------------------------------------------------------------- <Button> detection
const BTN = JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../components/ui/button-styles.json'), 'utf8'));
const toks = (s) => s.split(/\s+/).filter(Boolean);
const hasAll = (have, want) => toks(want).every((t) => have.includes(t));

/** Returns { variant, size, density, extras } when the element is exactly what <Button> renders. */
function matchButton(n) {
  const a = Object.fromEntries((n.attrs || []).map((x) => [x.name, x.value]));
  if (a['data-slot'] !== 'button' || !a.class) return null;
  const have = toks(a.class);
  const variant = a['data-variant'];
  const size = a['data-size'];
  if (!BTN.variants[variant] || !BTN.sizes[size] || variant === 'icon' || variant === 'outline') return null;
  const kids = (n.childNodes || []).filter((k) => k.tagName || (k.nodeName === '#text' && k.value.trim()));
  if (kids.length !== 2 || kids[0].tagName !== 'span' || !(toks(attrsOf(kids[1]).class || '').includes('hermes-button-hover-border'))) return null;
  if (attrsOf(kids[0]).class !== (variant === 'editorial-disclosure' ? BTN.labelNoTrim : BTN.label)) return null;
  if (!hasAll(have, BTN.base) || !hasAll(have, BTN.variants[variant]) || !hasAll(have, BTN.sizes[size])) return null;
  let density = 'compact';
  let used = [BTN.base, BTN.variants[variant], BTN.sizes[size]];
  if (size === 'm') {
    density = hasAll(have, BTN.density.cta) ? 'cta' : hasAll(have, BTN.density.compact) ? 'compact' : null;
    if (!density) return null;
    used.push(BTN.density[density]);
  }
  const usedSet = new Set(toks(used.join(' ')));
  const extras = have.filter((t) => !usedSet.has(t));
  return { variant, size, density, extras, label: kids[0], attrs: a };
}

// ---------------------------------------------------------------- tree helpers
const attrsOf = (n) => Object.fromEntries((n.attrs || []).map((a) => [a.name, a.value]));
const walkAll = (n, fn) => { fn(n); (n.childNodes || []).forEach((c) => walkAll(c, fn)); if (n.content) walkAll(n.content, fn); };

function matcher(sel) {
  const tag = /^[a-z][a-z0-9]*/i.exec(sel)?.[0]?.toLowerCase();
  const id = /#([\w-]+)/.exec(sel)?.[1];
  const classes = [...sel.matchAll(/\.([\w-]+)/g)].map((m) => m[1]);
  return (n) => {
    if (!n.tagName) return false;
    const a = attrsOf(n);
    if (tag && n.tagName !== tag) return false;
    if (id && a.id !== id) return false;
    const have = (a.class || '').split(/\s+/);
    return classes.every((c) => have.includes(c));
  };
}

export function findNode(root, sel) {
  const test = matcher(sel);
  let hit = null;
  walkAll(root, (n) => { if (!hit && test(n)) hit = n; });
  return hit;
}

// ---------------------------------------------------------------- svg -> icon components
// Distinct top-level <svg> elements are pulled out into components/icons/<Name>.tsx so the page
// components stay readable. tools/svg-names.json maps a content hash to a friendly component name.
const REGISTRY_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'svg-names.json');
const registry = fs.existsSync(REGISTRY_FILE) ? JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8')) : {};
export const icons = new Map(); // component name -> { viewBox, xmlns, inner }

// ---------------------------------------------------------------- emitters
const q = (s) => JSON.stringify(s);

let usedStyleCast = false;
function styleObject(css) {
  const out = [];
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim().replace(/https?:\/\/[^'")\s]+/g, (u) => rewriteUrl(u));
    if (!prop) continue;
    const key = prop.startsWith('--') ? q(prop) : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out.push(`${key}: ${q(val)}`);
  }
  const custom = out.some((o) => o.startsWith('"--'));
  if (custom) usedStyleCast = true;
  return custom ? `{{ ${out.join(', ')} } as CSSProperties}` : `{{ ${out.join(', ')} }}`;
}

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

export function toJsx(root, { internalLinks = true } = {}) {
  const idMap = new Map();
  const usedIcons = new Set();
  let usedLink = false;
  let usedButton = false;
  const stableId = (v) => {
    if (!/^_R_/.test(v)) return v;
    if (!idMap.has(v)) idMap.set(v, `ui-${idMap.size + 1}`);
    return idMap.get(v);
  };

  function attrs(n, isLink) {
    const parts = [];
    for (const { name, value } of n.attrs || []) {
      if (name === 'data-nimg' || name === 'data-dpl-id') continue;
      const key = attrName(name);
      let v = value;
      if (name === 'id' || name === 'aria-controls' || name === 'aria-labelledby' || name === 'aria-describedby' || name === 'for' || name === 'popovertarget') v = stableId(v);
      if (name === 'src' || name === 'href' || name === 'poster' || name === 'data' || name === 'content' || name === 'srcset' || name === 'xlink:href') {
        v = name === 'srcset' ? v.split(',').map((s) => { const [u, ...r] = s.trim().split(/\s+/); return [rewriteUrl(u), ...r].join(' '); }).join(', ') : rewriteUrl(v);
      }
      if (name === 'style') { parts.push(`style=${styleObject(v)}`); continue; }
      if (BOOLEAN.has(key) && (v === '' || v === key.toLowerCase())) { parts.push(key); continue; }
      if (NUMERIC.has(key) && /^-?\d+$/.test(v) && !(key === 'size' && n.tagName !== 'input')) { parts.push(`${key}={${v}}`); continue; }
      if (name === 'value' && n.tagName === 'input') { parts.push(`defaultValue=${q(v)}`); continue; }
      parts.push(/["\n{}\\<>&]/.test(v) ? `${key}={${q(v)}}` : `${key}="${v}"`);
    }
    return parts.length ? ' ' + parts.join(' ') : '';
  }

  function node(n, inSvg = false) {
    if (n.nodeName === '#text') {
      const t = n.value;
      if (!t.trim() && /\n/.test(t)) return '';
      if (/[{}<>&\n]/.test(t) || /^\s|\s$/.test(t)) return `{${q(t)}}`;
      return t;
    }
    if (!n.tagName) return '';
    const tag = n.tagName;
    if (tag === 'script' || tag === 'link' || tag === 'meta' || tag === 'noscript' || tag === 'template') return '';
    const a = attrsOf(n);
    const btn = (tag === 'a' || tag === 'button') ? matchButton(n) : null;
    if (btn) {
      usedButton = true;
      const pass = (n.attrs || []).filter((x) => !['class', 'data-slot', 'data-variant', 'data-size', 'role', 'tabindex'].includes(x.name) && !(x.name === 'type' && x.value === 'button'));
      const rest = attrs({ ...n, attrs: pass }, false);
      const props = [`variant="${btn.variant}"`, btn.size !== 'm' ? `size="${btn.size}"` : '', btn.size === 'm' && btn.density === 'cta' ? 'density="cta"' : '', btn.extras.length ? `className="${btn.extras.join(' ')}"` : ''].filter(Boolean).join(' ');
      const label = (btn.label.childNodes || []).filter((c) => c.nodeName !== '#comment').map((c) => node(c, inSvg)).join('');
      return `<Button ${props}${rest}>${label}</Button>`;
    }
    const isLink = internalLinks && tag === 'a' && a.href && /^\/(?!\/)/.test(rewriteUrl(a.href)) && !a.target;
    const name = isLink ? 'Link' : tag;
    if (isLink) usedLink = true;
    const at = attrs(n, isLink);
    if (VOID.has(tag)) return `<${name}${at} />`;
    // merge adjacent text nodes (React inserts <!-- --> between them)
    const kids = [];
    for (const c of n.childNodes || []) {
      if (c.nodeName === '#comment') continue;
      const last = kids[kids.length - 1];
      if (c.nodeName === '#text' && last && last.nodeName === '#text') kids[kids.length - 1] = { nodeName: '#text', value: last.value + c.value };
      else kids.push(c);
    }
    const inner = kids.map((k) => node(k, inSvg || tag === 'svg')).join('');
    if (tag === 'svg' && !inSvg) {
      const hash = crypto.createHash('sha1').update(inner + (a.viewBox || '')).digest('hex').slice(0, 8);
      const name = registry[hash] || `Svg${hash.slice(0, 6)}`;
      icons.set(name, { hash, viewBox: a.viewBox, xmlns: a.xmlns, inner });
      const rest = attrs({ ...n, attrs: (n.attrs || []).filter((x) => x.name !== 'xmlns' && x.name !== 'viewBox') }, false);
      usedIcons.add(name);
      return `<${name}${rest} />`;
    }
    if (tag === 'style') return `<style>{${q(kids.map((k) => k.value || '').join(''))}}</style>`;
    return inner ? `<${name}${at}>${inner}</${name}>` : `<${name}${at} />`;
  }

  const jsx = node(root);
  return { jsx, usedLink, usedButton, usedIcons: [...usedIcons], usedStyleCast };
}

export async function format(src) {
  return prettier.format(src, { parser: 'typescript', singleQuote: true, printWidth: 110 });
}

export async function writeIcons(dir) {
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, i] of icons) {
    const src = `import type { SVGProps } from 'react';\n\n/** hash ${i.hash} */\nexport function ${name}(props: SVGProps<SVGSVGElement>) {\n  return (\n    <svg xmlns="${i.xmlns || 'http://www.w3.org/2000/svg'}" viewBox="${i.viewBox}" {...props}>${i.inner}</svg>\n  );\n}\n`;
    fs.writeFileSync(path.join(dir, `${name}.tsx`), await format(src));
  }
  const names = fs.readdirSync(dir).filter((f) => /\.tsx$/.test(f)).map((f) => f.replace('.tsx', '')).sort();
  fs.writeFileSync(path.join(dir, 'index.ts'), names.map((n) => `export { ${n} } from './${n}';`).join('\n') + '\n');
}

// ---------------------------------------------------------------- CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [file, selector, ...flags] = process.argv.slice(2);
  const opt = Object.fromEntries(flags.map((f) => f.replace(/^--/, '').split('=')));
  const html = fs.readFileSync(path.isAbsolute(file) ? file : path.join(SITE, file), 'utf8');
  const doc = parse(html);
  const node = findNode(doc, selector);
  if (!node) { console.error('selector not found:', selector); process.exit(1); }
  const { jsx, usedLink, usedButton, usedIcons, usedStyleCast } = toJsx(node);
  const name = opt.name || 'Generated';
  const imports = [usedStyleCast ? "import type { CSSProperties } from 'react';" : '', usedLink ? "import Link from 'next/link';" : '', usedButton ? "import { Button } from '@/components/ui/Button';" : '', usedIcons.length ? `import { ${usedIcons.sort().join(', ')} } from '@/components/icons';` : ''].filter(Boolean).join('\n');
  const body = `${imports}${imports ? '\n\n' : ''}export default function ${name}() {\n  return (\n    ${jsx}\n  );\n}\n`;
  await writeIcons(path.join(path.dirname(fileURLToPath(import.meta.url)), '../components/icons'));
  const out = await format(body);
  if (opt.out) { fs.mkdirSync(path.dirname(opt.out), { recursive: true }); fs.writeFileSync(opt.out, out); console.error('wrote', opt.out, out.length, 'bytes'); }
  else process.stdout.write(out);
}
