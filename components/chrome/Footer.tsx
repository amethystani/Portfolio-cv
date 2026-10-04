import { portfolio } from '@/content/portfolio';
import { ArtShader } from './ArtShader';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { GitHubIcon, LinkedInIcon, Logo } from '@/components/icons';
import { footerColumns, type FooterLink } from '@/content/footer';

const CONTAINER =
  'mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)]';
const LINK_CLASS = 'group -ml-1 inline-flex self-start py-[var(--hw-teams-footer-row-pad)] whitespace-nowrap';

function FooterChipLink({ label, href, prefix, newTab }: FooterLink) {
  const chip = (
    <span
      data-chip=""
      data-tone="plain"
      className="inline-flex h-[var(--hpv2-chip-h)] shrink-0 items-center gap-1.5 rounded-r-xs px-1.5 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 transition-colors duration-150 ease-out group-hover:bg-[var(--hw-fg)] group-hover:text-[var(--hermes-primary)] group-hover:duration-0"
    >
      {prefix ? (
        <span>
          <span className="opacity-60">{prefix}</span>
          {label}
        </span>
      ) : (
        label
      )}
    </span>
  );
  const internal = href.startsWith('/');
  return (
    <li className="flex">
      {internal ? (
        <Link className={LINK_CLASS} href={href}>
          {chip}
        </Link>
      ) : (
        <a
          className={LINK_CLASS}
          href={href}
          {...(newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
        >
          {chip}
        </a>
      )}
    </li>
  );
}

/**
 * Footer. On desktop the page content is "lifted" off it: the sticky footer sits behind the page
 * (`hw-footer-reveal`) and is revealed as you scroll to the bottom; --hw-footer-opacity/-lift are
 * driven by FooterReveal.
 */
export function Footer() {
  return (
    <div className="hw-footer-reveal md:-mt-[100dvh]">
      <footer className="hw-footer-soften bg-hermes text-[var(--hw-fg)] opacity-[calc(0.4+0.6*var(--hw-footer-opacity,0))] md:sticky md:top-0 md:flex md:min-h-dvh md:translate-y-[var(--hw-footer-lift,0px)] md:flex-col md:pb-[var(--hw-frame)] md:motion-reduce:translate-y-0">
        <div className="relative isolate h-[70dvh] max-h-[890px] min-h-[420px] bg-inherit md:aspect-[1310/890] md:h-auto md:max-h-none md:min-h-0 md:flex-auto">
          <div className="hw-noise absolute inset-0">
            <img
              alt=""
              className="absolute inset-0 size-full object-cover object-top"
              crossOrigin="anonymous"
              decoding="async"
              loading="lazy"
              src="/assets/nous-web/footer-field.webp"
            />
            <ArtShader
              className="pointer-events-none absolute inset-0 size-full"
              src="/assets/nous-web/footer-field.webp"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_bottom,transparent,var(--hermes-primary)_86%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 translate-y-[calc(32%+(1-var(--hw-footer-opacity,0))*45%)] opacity-[var(--hw-footer-opacity,0)] will-change-[translate,opacity] motion-reduce:translate-y-[32%] motion-reduce:opacity-100"
          >
            <p
              className={`fit-text ${CONTAINER} hw-ghost hw-teams-ghost-white hw-teams-gothic text-center font-normal`}
              style={{ '--fit-max': 'var(--hw-teams-ghost-word)', '--fit-min': '1em' } as CSSProperties}
            >
              <span>
                <span>Animesh Mishra</span>
              </span>
              <span aria-hidden="true">Animesh Mishra</span>
            </p>
          </div>
        </div>

        <div
          className={`${CONTAINER} hw-teams-footer-grid font-[family-name:var(--font-mono)] uppercase relative grid grid-cols-2 gap-x-6 gap-y-10 pb-10 text-[length:var(--hw-teams-label-sm)] leading-none tracking-normal md:grid-cols-[minmax(0,320px)_repeat(4,minmax(0,1fr))] md:gap-5`}
        >
          <div className="flex flex-col gap-5 max-md:col-span-2">
            <Logo aria-hidden="true" weight={9} style={{ width: 168, height: 'auto' }} />
            <p>Research and building cool stuff.</p>
            <a
              className="underline decoration-from-font opacity-60 hover:opacity-100"
              href={`mailto:${portfolio.email}`}
            >
              {portfolio.email}
            </a>
          </div>
          {footerColumns.map((column) => (
            <div key={column.title} className="hw-teams-footer-column flex flex-col gap-5">
              <p className="opacity-60">{column.group}</p>
              <p className="hw-teams-footer-title font-[family-name:var(--font-display)] text-[length:var(--hw-teams-faq-q)] leading-[1.4] tracking-normal normal-case">
                {column.title}
              </p>
              <ul className="-my-[var(--hw-teams-footer-row-pad)] flex flex-col">
                {column.links.map((link) => (
                  <FooterChipLink key={link.label} {...link} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className={`${CONTAINER} font-[family-name:var(--font-mono)] uppercase grid grid-cols-2 gap-5 py-10 text-[length:var(--hw-teams-label-sm)] leading-none tracking-normal md:grid-cols-[minmax(0,320px)_repeat(4,minmax(0,1fr))]`}
        >
          <div className="flex items-center max-md:col-span-2">
            <a
              aria-label="LinkedIn"
              className="py-2 pr-2 hover:opacity-60"
              href={portfolio.links.linkedin}
              rel="noopener noreferrer"
              target="_blank"
            >
              <LinkedInIcon className="size-5" fill="none" />
            </a>
            <a
              aria-label="GitHub"
              className="p-2 hover:opacity-60"
              href={portfolio.links.github}
              rel="noopener noreferrer"
              target="_blank"
            >
              <GitHubIcon className="size-5" fill="none" />
            </a>
          </div>
          <p className="max-md:order-1">© 2026, Animesh Mishra</p>
          <p className="opacity-60">New Delhi, India</p>
          <p className="opacity-60">{portfolio.role}</p>
          <p className="max-md:order-1">
            <span>
              <a className="underline decoration-from-font" href="/releases">
                Publications
              </a>
            </span>
            <span>
              <span className="mx-2">|</span>
              <a className="underline decoration-from-font" href="/blog">
                Writing
              </a>
            </span>
          </p>
        </div>
      </footer>
      <div aria-hidden="true" className="h-dvh max-md:hidden" />
    </div>
  );
}
