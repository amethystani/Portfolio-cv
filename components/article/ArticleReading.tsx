'use client';

import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { ChevronIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import type { Heading } from '@/lib/posts';

const PHONE = '(max-width: 767px)';
const DESKTOP_RAIL = '(min-width: 1001px)';

/** The fixed header wrapper (the one that slides in once you scroll), if there is one. */
function pinnedHeader(): HTMLElement | undefined {
  return [...document.querySelectorAll('[data-pro-nav]')]
    .map((nav) => nav.parentElement)
    .find((el): el is HTMLElement => !!el && getComputedStyle(el).position === 'fixed');
}

/** Bottom edge of the pinned header, or 0 while it is tucked away. */
const headerBottom = (header: HTMLElement | undefined) =>
  header && !header.inert ? Math.max(0, header.getBoundingClientRect().bottom) : 0;

/** Run `fn` at most once per animation frame. */
function frameThrottle(fn: () => void) {
  let frame = 0;
  const run = () => {
    frame = 0;
    fn();
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(run);
  };
  return Object.assign(schedule, { cancel: () => cancelAnimationFrame(frame) });
}

/** Focus a heading the way a skip link would, without scrolling twice. */
function focusHeading(id: string) {
  const el = document.getElementById(id);
  el?.setAttribute('tabindex', '-1');
  el?.focus({ preventScroll: true });
}

// ---------------------------------------------------------------------------- contents + dock (phones)
/**
 * Tracks which section is being read. On phones it also shows the "Contents / …" dock once the
 * inline contents list has scrolled under the header, and keeps anchor jumps clear of the header.
 */
function useContentsTracking(
  headings: Heading[],
  contents: React.RefObject<HTMLElement | null>,
  dock: React.RefObject<HTMLElement | null>,
) {
  const [active, setActive] = useState(headings[0]?.id ?? '');
  const [dockVisible, setDockVisible] = useState(false);
  const [dockOpen, setDockOpen] = useState(false);

  useEffect(() => {
    const prose = document.getElementById('article-prose');
    const article = prose?.closest<HTMLElement>('.nw-article');
    const phone = matchMedia(PHONE);
    const targets = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => !!el);
    const header = pinnedHeader();
    let measured = false;
    let tops: Array<{ id: string; top: number }> = [];
    let contentsBottom = 0;
    let proseBottom = 0;
    let lastOffset = -1;
    let lastDockTop = -1;

    const update = () => {
      const y = scrollY;
      if (!measured) {
        tops = targets.map((el) => ({ id: el.id, top: el.getBoundingClientRect().top + y }));
        contentsBottom = (contents.current?.getBoundingClientRect().bottom ?? 0) + y;
        proseBottom = (prose?.getBoundingClientRect().bottom ?? 0) + y;
        measured = true;
      }
      const top = phone.matches ? headerBottom(header) : 0;
      const offset = phone.matches ? top + 60 : 150; // how far below the top an anchor lands
      let current = headings[0]?.id ?? '';
      for (const t of tops) if (t.top <= y + offset) current = t.id;
      const showDock =
        phone.matches &&
        headings.length > 0 &&
        !!contents.current &&
        contentsBottom - y <= top &&
        !!prose &&
        proseBottom - y > offset;

      setActive(current);
      if (offset !== lastOffset)
        article?.style.setProperty('--nw-article-scroll-offset', `${(lastOffset = offset)}px`);
      if (top !== lastDockTop)
        dock.current?.style.setProperty('--nw-article-dock-top', `${(lastDockTop = top)}px`);
      setDockVisible(showDock);
      if (!showDock) setDockOpen(false);
    };
    const schedule = frameThrottle(update);
    const remeasure = () => {
      measured = false;
      schedule();
    };

    addEventListener('scroll', schedule, { passive: true, capture: true });
    addEventListener('resize', remeasure);
    const resizes = new ResizeObserver(remeasure);
    [article, prose, contents.current, header].forEach((el) => el && resizes.observe(el));
    prose?.addEventListener('load', remeasure, true);
    prose?.addEventListener('transitionend', remeasure);
    const headerChanges = new MutationObserver(schedule);
    if (header) headerChanges.observe(header, { attributes: true, attributeFilter: ['class', 'inert'] });
    header?.addEventListener('transitionend', schedule);
    update();

    return () => {
      schedule.cancel();
      removeEventListener('scroll', schedule, true);
      removeEventListener('resize', remeasure);
      resizes.disconnect();
      prose?.removeEventListener('load', remeasure, true);
      prose?.removeEventListener('transitionend', remeasure);
      headerChanges.disconnect();
      header?.removeEventListener('transitionend', schedule);
      article?.style.removeProperty('--nw-article-scroll-offset');
    };
  }, [headings, contents, dock]);

  return { active, setActive, dockVisible, dockOpen, setDockOpen };
}

// ---------------------------------------------------------------------------- reading rail (wide screens)
type RailSection = { id: string; title: string; excerpt: string };

/** First substantial paragraph of each section, trimmed to about 200 characters. */
function sectionsOf(
  headings: Heading[],
  prose: HTMLElement,
): { elements: HTMLElement[]; sections: RailSection[] } {
  const elements = headings
    .map((h) => document.getElementById(h.id))
    .filter((el): el is HTMLElement => !!el && prose.contains(el));
  const paragraphs = [...prose.querySelectorAll<HTMLElement>('p, li')].filter(
    (p) => !p.closest('figure, blockquote, table, .nw-article-wide'),
  );
  const sections = elements.map((el, i) => {
    const next = elements[i + 1];
    const inSection = paragraphs.filter(
      (p) =>
        el.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING &&
        (!next || p.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING),
    );
    // Measure with whitespace collapsed, so line wrapping in the source HTML never changes the pick.
    const texts = inSection.map((p) => (p.textContent ?? '').replace(/\s+/g, ' ').trim());
    const text = texts.find((t) => t.length >= 100) ?? texts[0] ?? '';
    const excerpt = text.length > 200 ? `${text.slice(0, 200).replace(/\s+\S*$/, '')}…` : text;
    return { id: el.id, title: (el.textContent ?? '').trim(), excerpt };
  });
  return { elements, sections };
}

/**
 * A column of ticks beside the contents list, one per section; hovering one previews the section.
 * It sits fixed in the margin and hides itself when it would collide with the header, the footer,
 * or a full-width figure.
 */
function ReadingRail({ headings }: { headings: Heading[] }) {
  const rail = useRef<HTMLElement>(null);
  const [sections, setSections] = useState<RailSection[]>([]);
  const [active, setActive] = useState('');
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [preview, setPreview] = useState('');
  const base = useId();

  useEffect(() => {
    const prose = document.getElementById('article-prose');
    const article = prose?.closest<HTMLElement>('.nw-article');
    const contents = article?.querySelector<HTMLElement>('.nw-article-contents');
    const el = rail.current;
    if (!prose || !article || !contents || !el) return;
    const wide = matchMedia(DESKTOP_RAIL);
    const header = pinnedHeader();
    const footer = document.querySelector<HTMLElement>('.nw-page-body > footer');

    let rebuild = true;
    let measured = false;
    let headingEls: HTMLElement[] = [];
    let tops: Array<{ id: string; top: number }> = [];
    let step = 0;
    let left = 0;
    let width = 0;
    let contentsBottom = 0;
    let proseBottom = 0;
    let footerTop = Infinity;
    let figures: Array<{ top: number; bottom: number }> = [];
    let lastBox = '';
    let alive = true;

    const update = () => {
      if (rebuild) {
        const built = sectionsOf(headings, prose);
        headingEls = built.elements;
        setSections(built.sections);
        rebuild = false;
        measured = false;
      }
      const y = scrollY;
      if (!measured) {
        step =
          parseFloat(getComputedStyle(el).getPropertyValue('--nw-article-reading-step')) *
          parseFloat(getComputedStyle(document.documentElement).fontSize);
        const c = contents.getBoundingClientRect();
        const p = prose.getBoundingClientRect();
        const gap = parseFloat(getComputedStyle(article).getPropertyValue('--nw-article-column-gap')) || 40;
        left = c.left;
        width = Math.min(c.width, p.left - gap - left);
        tops = headingEls.map((h) => ({ id: h.id, top: h.getBoundingClientRect().top + y }));
        contentsBottom = c.bottom + y;
        proseBottom = p.bottom + y;
        footerTop = footer ? footer.getBoundingClientRect().top + y : Infinity;
        figures = [...prose.querySelectorAll('.nw-article-wide')].flatMap((fig) => {
          const r = fig.getBoundingClientRect();
          return r.left < left + width && r.right > left ? [{ top: r.top + y, bottom: r.bottom + y }] : [];
        });
        measured = true;
      }
      const top = Math.max(150, headerBottom(header) + 24);
      const height = Math.max(150, tops.length * step);
      const end = top + height;
      const fits =
        wide.matches &&
        tops.length > 0 &&
        width >= 200 &&
        contentsBottom - y <= headerBottom(header) &&
        end <= Math.min(innerHeight - 24, proseBottom - y - 24, footerTop - y - 24) &&
        !figures.some((f) => f.top - y < end + 24 && f.bottom - y > top - 24);
      let current = tops[0]?.id ?? '';
      for (const t of tops) if (t.top <= y + top + 8) current = t.id;
      setActive(current);
      setVisible(fits);

      const box = `${left},${width},${top},${height}`;
      if (box !== lastBox) {
        Object.assign(el.style, {
          left: `${left}px`,
          width: `${width}px`,
          top: `${top}px`,
          height: `${height}px`,
        });
        lastBox = box;
      }
    };
    const schedule = frameThrottle(update);
    const remeasure = () => {
      measured = false;
      schedule();
    };

    const resizes = new ResizeObserver(remeasure);
    [article, prose, contents, header, footer].forEach((n) => n && resizes.observe(n));
    // New text in the article means new sections (edits inside wide figures don't count).
    const textChanges = new MutationObserver((records) => {
      const onlyFigures = records.every((r) =>
        (r.target instanceof Element ? r.target : r.target.parentElement)?.closest('.nw-article-wide'),
      );
      if (onlyFigures) return;
      rebuild = true;
      schedule();
    });
    textChanges.observe(prose, { childList: true, subtree: true, characterData: true });
    const headerChanges = new MutationObserver(schedule);
    if (header) headerChanges.observe(header, { attributes: true, attributeFilter: ['class', 'inert'] });
    header?.addEventListener('transitionend', schedule);
    prose.addEventListener('load', remeasure, true);
    prose.addEventListener('transitionend', remeasure);
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', remeasure);
    wide.addEventListener('change', remeasure);
    document.fonts?.ready.then(() => alive && remeasure());
    update();

    return () => {
      alive = false;
      schedule.cancel();
      resizes.disconnect();
      textChanges.disconnect();
      headerChanges.disconnect();
      header?.removeEventListener('transitionend', schedule);
      prose.removeEventListener('load', remeasure, true);
      prose.removeEventListener('transitionend', remeasure);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', remeasure);
      wide.removeEventListener('change', remeasure);
    };
  }, [headings]);

  const onKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === 'Escape') setDismissed(true);
    const links = [...(rail.current?.querySelectorAll('a') ?? [])];
    const index = links.indexOf(e.currentTarget);
    const target =
      e.key === 'ArrowDown'
        ? (index + 1) % links.length
        : e.key === 'ArrowUp'
          ? (index - 1 + links.length) % links.length
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? links.length - 1
              : -1;
    if (target >= 0) {
      e.preventDefault();
      links[target]?.focus();
    }
  };

  return (
    <nav
      ref={rail}
      className="nw-article-reading-rail"
      aria-label="Reading section previews"
      hidden={!visible}
      data-preview-dismissed={dismissed || undefined}
    >
      {sections.map((section, i) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          aria-label={section.title}
          aria-describedby={section.excerpt ? `${base}-${i}` : undefined}
          aria-current={active === section.id ? 'location' : undefined}
          data-preview={preview === section.id || undefined}
          onKeyDown={onKeyDown}
          onPointerEnter={() => {
            setDismissed(false);
            setPreview(section.id);
          }}
          onFocus={() => {
            setDismissed(false);
            setPreview(section.id);
          }}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            focusHeading(section.id);
            setActive(section.id);
          }}
        >
          <span className="nw-article-reading-tick" aria-hidden="true" />
          <span
            className="nw-article-reading-preview"
            style={{ top: `clamp(0px, calc(${i} * var(--nw-article-reading-step)), calc(100% - 150px))` }}
          >
            <span className="nw-article-reading-title" aria-hidden="true">
              {section.title}
            </span>
            {section.excerpt && (
              <span className="nw-article-reading-excerpt" id={`${base}-${i}`}>
                {section.excerpt}
              </span>
            )}
          </span>
        </a>
      ))}
    </nav>
  );
}

// ---------------------------------------------------------------------------- the three navs
/**
 * Article navigation: the "Contents" list beside the text, the preview rail on wide screens and the
 * "Contents / …" dock that drops down on phones. All three share the heading list.
 */
export function ArticleReading({ headings }: { headings: Heading[] }) {
  const contents = useRef<HTMLElement>(null);
  const dock = useRef<HTMLElement>(null);
  const dockButton = useRef<HTMLButtonElement>(null);
  const { active, setActive, dockVisible, dockOpen, setDockOpen } = useContentsTracking(
    headings,
    contents,
    dock,
  );

  // The open dock closes on Escape or a tap elsewhere.
  useEffect(() => {
    if (!dockOpen) return;
    const onDown = (e: PointerEvent) => {
      if (e.target instanceof Node && !dock.current?.contains(e.target)) setDockOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setDockOpen(false);
      dockButton.current?.focus();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [dockOpen, setDockOpen]);

  const links = headings.map((heading) => (
    <a
      key={heading.id}
      href={`#${heading.id}`}
      aria-current={active === heading.id ? 'location' : undefined}
      onClick={() => {
        setDockOpen(false);
        setActive(heading.id);
        focusHeading(heading.id);
      }}
    >
      {heading.text}
    </a>
  ));

  return (
    <>
      <nav
        ref={contents}
        className="nw-article-contents"
        aria-label="Article contents"
        hidden={headings.length === 0}
      >
        <h2>Contents</h2>
        {links}
      </nav>
      <ReadingRail headings={headings} />
      <nav ref={dock} className="nw-article-dock" aria-label="Quick article contents" hidden={!dockVisible}>
        <Button
          ref={dockButton}
          variant="outline"
          bare
          aria-expanded={dockOpen}
          aria-controls="article-dock-list"
          onClick={() => setDockOpen((open) => !open)}
        >
          <span className="leading-none whitespace-nowrap cap-mono text-cap-trim relative -top-[var(--hpv2-cap-nudge)] cap-fallback:top-[var(--hpv2-nudge)]!">
            Contents / {headings.find((h) => h.id === active)?.text ?? 'Introduction'}
          </span>
          <span
            aria-hidden="true"
            className="relative inline-flex shrink-0 self-center order-last size-[var(--hpv2-icon)]"
            style={{ height: '0' }}
          >
            <span className="absolute top-1/2 flex -translate-y-1/2 items-center justify-center size-[var(--hpv2-icon)]">
              <ChevronIcon fill="currentColor" aria-hidden="true" className="block shrink-0 size-full" />
            </span>
          </span>
        </Button>
        <div id="article-dock-list" hidden={!dockOpen} className="nw-article-dock-list">
          {links}
        </div>
      </nav>
    </>
  );
}
