'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/icons';
import { posts } from '@/content/posts';

/** Only the real posts count as articles: an unknown address (the 404 page) must keep the home logo, or the
 *  404 page, which is built ahead under /_not-found, would render differently in the browser (hydration error). */
const ARTICLES = new Set(posts.map((p) => `/${p.slug}`));
export const isArticlePath = (pathname: string) => ARTICLES.has(pathname);

function Badges({ className = 'nw-research-badge' }: { className?: string }) {
  return <Logo aria-hidden="true" weight={9} className={className} />;
}

/**
 * The logo in the main header. It links home, except on blog articles where it becomes the logo above
 * the word "Blog" (on desktop) that links back to the blog index.
 */
export function BrandLink() {
  const article = isArticlePath(usePathname());
  if (article) {
    return (
      <Link href="/blog" className="nw-research-brand-link" aria-label="Blog">
        <span className="nw-research-blog-mark max-md:hidden">
          <Logo aria-hidden="true" weight={9} style={{ width: 96, height: 'auto' }} />
          <span>Blog</span>
        </span>
        <span className="md:hidden">
          <Badges />
        </span>
      </Link>
    );
  }
  return (
    <Link href="/" className="nw-research-brand-link" aria-label="Animesh Mishra home">
      <span>
        <Badges />
      </span>
    </Link>
  );
}
