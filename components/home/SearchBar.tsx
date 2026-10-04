import Link from 'next/link';
import { PixelSearch } from '@/components/icons';

const QUICK = [
  { label: 'Publications', href: '/releases' },
  { label: 'Experience', href: '/careers' },
  { label: 'Writing', href: '/blog' },
  { label: 'Venues', href: '/#affiliations' },
];

/**
 * The home page's search bar. It is a button that opens the site-wide search palette (the same one the header's
 * Search button and Cmd/Ctrl+K open); the palette covers the bar in place while it is on screen.
 */
export function SearchBar() {
  return (
    <section className="hs" aria-label="Search the site">
      <button
        type="button"
        className="hs-bar px-box"
        data-composer-target="Questions"
        aria-controls="research-composer"
        aria-expanded="false"
        aria-label="Search the site"
      >
        <PixelSearch />
        <span className="hs-text">Search publications, experience, posts...</span>
        <span className="hs-keys" aria-hidden="true">
          <kbd>⌘</kbd>
          <kbd>K</kbd>
        </span>
      </button>
      <p className="hs-quick">
        <span>Jump to</span>
        {QUICK.map((q) => (
          <Link key={q.href} href={q.href} className="px-box">
            {q.label}
          </Link>
        ))}
      </p>
    </section>
  );
}
