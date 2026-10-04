'use client';

import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ExternalLinkIcon } from '@/components/icons';
import { Mono } from '@/components/ui/Type';
import { type NavLink, type NavSection, navPanels } from '@/content/research-navigation';
import { researchUi, useResearchUi } from '@/lib/research-ui';
import { PromoBanner } from './PromoBanner';

const MARGIN = 16; // keep this far from the window edge
const GAP = 8; // space between the trigger and the panel

function SubnavLink({ link, described }: { link: NavLink; described: boolean }) {
  const label = link.muted ? (
    <span className="nw-subnav-label">
      <span className="nw-label-muted">{link.muted}</span>
      <span> {link.label}</span>
    </span>
  ) : (
    <span className="nw-subnav-label">{link.label}</span>
  );
  const body = (
    <>
      {label}
      {link.description && <span className="nw-subnav-description">{link.description}</span>}
      {/* ↗ leaves the site; the same arrow turned to → stays on it */}
      <ExternalLinkIcon className={`block shrink-0 size-4${link.href.startsWith('/') ? ' rotate-45' : ''}`} />
    </>
  );
  if (link.href.startsWith('/')) {
    return (
      <Link
        className="nw-subnav-link"
        data-description={described}
        href={link.href}
        onClick={() => researchUi.closeNav()}
      >
        {body}
      </Link>
    );
  }
  return (
    <a
      className="nw-subnav-link"
      data-description={described}
      href={link.href}
      {...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {body}
    </a>
  );
}

function Section({ section }: { section: NavSection }) {
  const isShop = Boolean(section.merch);
  return (
    <section className="nw-subnav-section" {...(isShop ? { 'data-shop': 'true' } : {})}>
      <div className="nw-subnav-group">
        <div className="nw-subnav-category">
          <Mono>{section.category}</Mono>
        </div>
        <span
          className="font-[family-name:var(--font-rules-gothic-cmp)] font-medium text-inherit uppercase text-cap-trim cap-rules nw-subnav-heading"
          style={
            {
              fontFamily: 'var(--font-rules-gothic-cmp)',
              '--nw-display-size': 'max(12px, calc(36 * var(--nw-u-text)))',
              fontSize: 'var(--nw-display-size)',
              lineHeight: '0.9',
            } as CSSProperties
          }
        >
          {section.heading}
        </span>
        <div className="nw-subnav-links">
          {section.links.map((link) => (
            <SubnavLink key={link.href + link.label} link={link} described={Boolean(link.description)} />
          ))}
        </div>
      </div>
      {section.merch && (
        <div className="nw-subnav-merch" aria-hidden="true">
          {section.merch.map((src) => (
            <img key={src} alt="" src={src} />
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * The dropdown under the header's About / Work / Elsewhere / Contact triggers. It is portalled into
 * <body> after hydration; CSS handles the open/close fade through the data-open attribute.
 */
export function ResearchNavigation() {
  const { nav } = useResearchUi();
  const { open, panel, trigger, focus } = nav;
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [box, setBox] = useState<{ left: number; top: number; width: number; maxHeight: number }>();

  useEffect(() => setMounted(true), []);

  // Sit under the trigger: left-aligned for the two left triggers, right-aligned for the two right ones.
  useLayoutEffect(() => {
    if (!open || !trigger) return;
    const place = () => {
      const rect = trigger.getBoundingClientRect();
      const width = Math.min(720, innerWidth - 2 * MARGIN);
      const alignRight = rect.left + rect.width / 2 > innerWidth / 2;
      const left = Math.min(
        Math.max(alignRight ? rect.right - width : rect.left, MARGIN),
        innerWidth - width - MARGIN,
      );
      const top = rect.bottom + GAP;
      setBox({ left, top, width, maxHeight: innerHeight - top - MARGIN });
    };
    place();
    addEventListener('resize', place);
    return () => removeEventListener('resize', place);
  }, [open, panel, trigger]);

  // Keyboard users who opened the panel land on its first link.
  useLayoutEffect(() => {
    if (!open || !focus) return;
    const id = requestAnimationFrame(() =>
      ref.current?.querySelector<HTMLElement>('.nw-subnav-link')?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(id);
  }, [open, focus, panel]);

  // Dismiss: Escape, a click outside, or the pointer drifting away for a moment.
  useEffect(() => {
    if (!open) return;
    const panelEl = ref.current;
    const bar = trigger?.closest('[data-pro-nav]');
    let timer: ReturnType<typeof setTimeout> | undefined;
    const hoverCapable = matchMedia('(hover: hover) and (pointer: fine)');
    const cancel = () => {
      clearTimeout(timer);
      timer = undefined;
    };
    const leaveSoon = () => {
      if (hoverCapable.matches && timer === undefined) timer = setTimeout(() => researchUi.closeNav(), 300);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !panelEl || !bar) return;
      const inside = (r: DOMRect, pad = 0) =>
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top - pad &&
        e.clientY <= r.bottom + pad;
      const triggers = [...bar.querySelectorAll<HTMLElement>('[data-research-target]')]
        .filter((t) => t.getClientRects().length)
        .map((t) => t.getBoundingClientRect());
      const overTriggers =
        triggers.length > 0 &&
        e.clientX >= Math.min(...triggers.map((r) => r.left)) &&
        e.clientX <= Math.max(...triggers.map((r) => r.right)) &&
        e.clientY >= Math.min(...triggers.map((r) => r.top)) - 8 &&
        e.clientY <= Math.max(...triggers.map((r) => r.bottom)) + 8;
      if (overTriggers || inside(panelEl.getBoundingClientRect())) cancel();
      else leaveSoon();
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target;
      if (
        target instanceof Node &&
        !panelEl?.contains(target) &&
        !(target instanceof Element && target.closest('[data-research-target]'))
      )
        researchUi.closeNav();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        researchUi.closeNav();
        trigger?.focus({ preventScroll: true });
      }
    };
    const onScroll = () => {
      cancel();
      researchUi.closeNav();
    };
    document.addEventListener('pointermove', onMove, { passive: true, capture: true });
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('blur', leaveSoon);
    return () => {
      cancel();
      document.removeEventListener('pointermove', onMove, true);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
      removeEventListener('scroll', onScroll);
      removeEventListener('blur', leaveSoon);
    };
  }, [open, trigger]);

  // Arrow keys / Home / End move between the links.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    const links = [...(ref.current?.querySelectorAll<HTMLElement>('.nw-subnav-link') ?? [])];
    const index = links.indexOf(e.target as HTMLElement);
    if (index < 0 || !links.length) return;
    e.preventDefault();
    const next =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? links.length - 1
          : (index + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
    links[next]?.focus();
  };

  if (!mounted) return null;
  const data = navPanels[panel];
  return createPortal(
    <div
      ref={ref}
      id="research-navigation"
      className="nous-web nw-research-navigation"
      data-open={open}
      data-preset={panel}
      data-direction="down"
      aria-hidden={!open}
      aria-label={`${panel} navigation`}
      role="region"
      data-lenis-prevent=""
      onKeyDown={onKeyDown}
      style={
        {
          '--nw-shop-divider': 'url("/assets/nous-web/composer/menuCode_imgDottedLine.svg")',
          transformOrigin: '50% 0%',
          bottom: 'auto',
          ...(box
            ? {
                left: box.left,
                top: box.top,
                width: box.width,
                '--nw-composer-width': `${box.width}px`,
                maxHeight: box.maxHeight,
              }
            : {}),
        } as CSSProperties
      }
    >
      <PromoBanner active={open} preset={panel} />
      <nav className="nw-research-navigation-groups" aria-label={`${panel} destinations`}>
        {data.sections.map((section) => (
          <Section key={section.heading} section={section} />
        ))}
      </nav>
    </div>,
    document.body,
  );
}
