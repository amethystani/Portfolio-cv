import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { site } from '@/lib/site';

// Stylesheets, in the order the original site loads them. 01-06 are the design system (Tailwind
// output + the nw-/hw-/hermes- component styles); page-specific sheets are imported by the pages.
import '@/styles/01-base.css';
import '@/styles/02-frame.css';
import '@/styles/03-kbd.css';
import '@/styles/04-ui-modules.css';
import '@/styles/05-research-navigation.css';
import '@/styles/06-app.css';
import '@/styles/07-badge-theme.css';
import '@/styles/08-surfaces.css';
import '@/styles/09-prose-table.css';
import '@/styles/custom.css';
import '@/styles/pixel-ui.css';

import { FilmGrain } from '@/components/chrome/FilmGrain';
import { Frame } from '@/components/chrome/Frame';
import { FooterReveal } from '@/components/behavior/FooterReveal';
import { SmoothScroll } from '@/components/behavior/SmoothScroll';
import { ThemeToggle } from '@/components/behavior/ThemeToggle';
import { Composer } from '@/components/research/Composer';
import { MobileMenu } from '@/components/research/MobileMenu';
import { ResearchNavigation } from '@/components/research/ResearchNavigation';
import { ResearchUiController } from '@/components/research/ResearchUiController';
import { themeInitScript } from '@/lib/theme';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
  description: site.description,
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: site.faviconIco, sizes: 'any' },
      { url: site.favicon, type: 'image/png' },
    ],
    shortcut: site.faviconIco,
    apple: site.appleIcon,
  },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#9a0002' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen">
        <div className="hermes-web min-h-dvh w-full bg-[var(--hermes-primary)] text-[var(--hermes-white)] hw-teams-page my-0 nw-research-shell">
          <div className="bg-hermes mx-auto min-h-dvh w-full md:w-[var(--hw-teams-page-w)] nous-web-viewport relative">
            <div className="nous-web min-h-screen">{children}</div>
          </div>
          <FilmGrain />
          <Frame />
        </div>
        <SmoothScroll />
        <FooterReveal />
        <ResearchUiController />
        <ResearchNavigation />
        <Composer />
        <MobileMenu />
        <ThemeToggle />
      </body>
    </html>
  );
}
