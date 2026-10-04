'use client';

import { type ReactNode, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { mobileMenu, menuSocials, type MenuLink } from '@/content/mobile-menu';
import { researchUi, useResearchUi } from '@/lib/research-ui';

const ASSET = (name: string) => `/assets/nous-web/mobile-menu/${name}.svg`;
const FADE_MS = 300;
const PANEL_MS = 280;
const DESKTOP = '(min-width: 768px)';

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const isInternal = (href: string) => href.startsWith('/');

function MenuAnchor({ link, onNavigate }: { link: MenuLink; onNavigate: () => void }) {
  return isInternal(link.href) ? (
    <Link href={link.href} onClick={onNavigate}>
      {link.label}
    </Link>
  ) : (
    <a
      href={link.href}
      onClick={onNavigate}
      {...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {link.label}
    </a>
  );
}

/** Height-and-fade reveal for an accordion panel; unmounts its children once collapsed. */
function Collapse({
  open,
  id,
  initiallyOpen,
  children,
}: {
  open: boolean;
  id: string;
  initiallyOpen: boolean;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(open);
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useLayoutEffect(() => {
    const skip = first.current && initiallyOpen;
    first.current = false;
    if (open) setMounted(true);
    const el = ref.current;
    if (skip || reducedMotion()) {
      if (!open) setMounted(false);
      return;
    }
    if (!el) return; // a section that is opening animates on the next pass, once its panel exists
    const full = el.scrollHeight;
    const frames = open
      ? [
          { height: '0px', opacity: 0 },
          { height: `${full}px`, opacity: 1 },
        ]
      : [
          { height: `${full}px`, opacity: 1 },
          { height: '0px', opacity: 0 },
        ];
    const animation = el.animate(frames, {
      duration: PANEL_MS,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      fill: 'forwards',
    });
    animation.onfinish = () => !open && setMounted(false);
    return () => animation.cancel();
  }, [open, mounted, initiallyOpen]);

  return mounted ? (
    <div
      ref={ref}
      id={id}
      className="nw-research-accordion-panel"
      style={open ? { height: 'auto', opacity: 1 } : undefined}
    >
      {children}
    </div>
  ) : null;
}

function Accordion({ onNavigate }: { onNavigate: () => void }) {
  const [openTitle, setOpenTitle] = useState<string | null>('About');
  const prefix = useId();
  return (
    <nav className="nw-research-accordion-nav" aria-label="Site navigation">
      {mobileMenu.map((section) => {
        const open = openTitle === section.title;
        const panel = `${prefix}-${section.title}`;
        return (
          <section key={section.title}>
            <button
              type="button"
              className="nw-research-accordion-toggle"
              aria-expanded={open}
              aria-controls={panel}
              onClick={() => setOpenTitle(open ? null : section.title)}
            >
              <span>{section.title}</span>
              <img alt="" src={ASSET('pixel-down')} />
            </button>
            <Collapse open={open} id={panel} initiallyOpen={section.title === 'About'}>
              <div className="nw-research-submenu">
                {section.links.map((link) => (
                  <MenuAnchor key={link.label} link={link} onNavigate={onNavigate} />
                ))}
              </div>
            </Collapse>
          </section>
        );
      })}
    </nav>
  );
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The full-screen menu behind the phone burger button. It fades in over the page, locks scrolling,
 * keeps keyboard focus inside while open, and gives focus back to the burger when it closes.
 * Escape, the close button, any link, or growing past phone width all dismiss it.
 */
export function MobileMenu() {
  const { menu } = useResearchUi();
  const [mounted, setMounted] = useState(false); // client only: it portals into <body>
  const [present, setPresent] = useState(false); // in the DOM (stays through the fade-out)
  const [visible, setVisible] = useState(false); // opacity target
  const root = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const close = useCallback(() => researchUi.closeMenu(), []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (menu.open) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setPresent(true);
      return;
    }
    setVisible(false);
    if (!present) return;
    const timer = setTimeout(() => setPresent(false), reducedMotion() ? 0 : FADE_MS);
    return () => clearTimeout(timer);
  }, [menu.open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fade in once the element exists (a frame later so the transition runs).
  useEffect(() => {
    if (!present || !menu.open) return;
    const id = requestAnimationFrame(() => {
      setVisible(true);
      root.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [present, menu.open]);

  // While open: lock page scroll, make the page inert, trap Tab, close on Escape / wider screens.
  useEffect(() => {
    if (!present || !menu.open) return;
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    const page = [...document.body.children].filter(
      (el) => el !== root.current && !el.contains(root.current),
    );
    page.forEach((el) => el.setAttribute('inert', ''));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab' || !root.current) return;
      const items = [...root.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.getClientRects().length,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === root.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const wide = matchMedia(DESKTOP);
    const onWide = () => wide.matches && close();
    document.addEventListener('keydown', onKey);
    wide.addEventListener('change', onWide);
    return () => {
      document.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', onWide);
      html.style.overflow = previousOverflow;
      page.forEach((el) => el.removeAttribute('inert'));
      // Hand focus back to whichever burger button is on screen.
      const burger = [
        ...document.querySelectorAll<HTMLElement>('button[aria-controls="research-mobile-menu"]'),
      ].find((el) => el.getClientRects().length);
      (burger ?? opener.current)?.focus({ preventScroll: true });
    };
  }, [present, menu.open, close]);

  if (!mounted || !present) return null;
  return createPortal(
    <div
      ref={root}
      id="research-mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Animesh Mishra menu"
      tabIndex={-1}
      data-state={visible ? 'open' : 'closed'}
      className="fixed inset-0 z-[120] flex h-dvh flex-col overflow-y-auto backdrop-blur-xl nous-web nw-research-mobile-menu"
      style={
        {
          '--nw-mobile-menu-art': 'url("/assets/nous-web/mission-reference/mission-header.webp")',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: reducedMotion() ? 'none' : `opacity ${FADE_MS}ms cubic-bezier(0, 0, 0.2, 1)`,
        } as React.CSSProperties
      }
      data-lenis-prevent=""
    >
      <div className="flex items-center justify-between px-[var(--hw-teams-pad-x)] pt-10 pb-5 nw-research-menu-top">
        <Link href="/" aria-label="Animesh Mishra" onClick={close}>
          <Logo aria-hidden="true" weight={9} style={{ width: 120, height: 'auto' }} />
        </Link>
        <div className="flex items-center gap-3">
          <div />
          <button
            aria-label="Close menu"
            className="-mr-2 grid size-11 cursor-pointer place-items-center"
            type="button"
            onClick={close}
          >
            <img alt="" src={ASSET('pixel-close')} />
          </button>
        </div>
      </div>
      <Accordion onNavigate={close} />
      <div className="nw-research-menu-footer">
        <div className="nw-research-menu-socials">
          {menuSocials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
            >
              <span style={{ width: social.width }}>
                <img alt="" src={ASSET('careersContext_imgSocials')} style={{ left: -social.left }} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
