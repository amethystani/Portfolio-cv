import { Logo } from '@/components/icons';
import { portfolio } from '@/content/portfolio';

/** The closing strip: tagline, copyright, the three marks and legal links. `home` adds the home page's extra styling. */
export function SignoffFooter({ home = false }: { home?: boolean }) {
  return (
    <footer className={`text-[var(--hw-teams-ink)]${home ? ' nw-home-signoff' : ''} bg-transparent`}>
      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)] grid *:col-start-1 *:row-start-1">
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--hpv2-type-label)',
            fontWeight: '500',
            lineHeight: '1',
            letterSpacing: '0',
            textTransform: 'uppercase',
          }}
          className="relative flex flex-wrap items-center gap-x-20 gap-y-6 self-end py-[60px] max-md:gap-x-6 max-md:py-10"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-[1em] max-md:order-2 max-md:basis-[calc(50%-12px)]">
            <p>Research and building cool stuff</p>
            <p>© 2026, Animesh Mishra</p>
          </div>
          <div className="flex items-center gap-5 max-md:order-1 max-md:basis-full max-md:justify-center">
            <Logo role="img" aria-label="Animesh Mishra" weight={9} style={{ height: 48, width: 'auto', flexShrink: 0 }} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-end gap-[1em] text-right max-md:order-3 max-md:basis-[calc(50%-12px)]">
            <p>
              <span>
                <a className="underline decoration-from-font" href={portfolio.links.github}>
                  GitHub
                </a>
              </span>
              <span>
                <span className="mx-2">|</span>
                <a className="underline decoration-from-font" href={portfolio.links.linkedin}>
                  LinkedIn
                </a>
              </span>
            </p>
            <p>New Delhi, India</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
