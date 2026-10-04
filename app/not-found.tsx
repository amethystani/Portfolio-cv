import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/chrome/Footer';
import { Header } from '@/components/chrome/Header';
import { PinnedHeader } from '@/components/chrome/PinnedHeader';

import '@/styles/editorial.css';

export const metadata: Metadata = {
  title: { absolute: 'Page not found | Animesh Mishra' },
  robots: { index: false, follow: true },
};

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Publications', href: '/releases' },
  { label: 'Experience', href: '/careers' },
  { label: 'Writing', href: '/blog' },
];

/** Any unknown address: the site's header and footer, a way back, and the search palette one click away. */
export default function NotFound() {
  return (
    <div className="nw-editorial">
      <Header />
      <PinnedHeader />
      <main className="nw-page-body nf">
        <p className="nf-code" aria-hidden="true">
          404
        </p>
        <h1 className="nf-title">This page does not exist</h1>
        <p className="nf-copy">The link may be old, or the address mistyped. Search the site, or start from one of these:</p>
        <button type="button" className="nf-search" data-composer-target="Questions" aria-controls="research-composer">
          Search the site
          <kbd>/</kbd>
        </button>
        <ul className="nf-links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
