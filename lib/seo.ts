import type { Metadata } from 'next';
import { site } from './site';

type PageMeta = {
  /** Full <title>. Not suffixed automatically: pass e.g. "Writing | Animesh Mishra". */
  title: string;
  /** Shown in og:title / twitter:title; defaults to `title`. */
  shareTitle?: string;
  description?: string;
  /** Path starting with "/", used for the canonical URL and og:url. */
  path: string;
  image?: string;
  /** Alt text for the share image; defaults to the site name (or the title, for articles). */
  imageAlt?: string;
  /** Pixel size of the share image; defaults to the 1200×630 card for website pages. */
  imageSize?: { width: number; height: number };
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
};

/** Builds the title, canonical, Open Graph and Twitter tags for one page. */
export function pageMetadata({
  title,
  shareTitle,
  description = site.description,
  path,
  image,
  imageAlt,
  imageSize,
  type = 'website',
  publishedTime,
  author,
}: PageMeta): Metadata {
  const ogTitle = shareTitle ?? title;
  const size = imageSize ?? (type === 'website' ? { width: 1200, height: 630 } : {});
  const alt = imageAlt ?? (type === 'website' ? site.name : ogTitle);
  // every page gets a share image: its own, or the site card
  const images = [{ url: image ?? site.ogImage, ...(image ? size : { width: 1200, height: 630 }), alt }];
  return {
    title: { absolute: title },
    description,
    ...(author ? { authors: [{ name: author }] } : {}),
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      siteName: site.name,
      type,
      images,
      ...(type === 'article' ? { publishedTime, authors: author ? [author] : undefined } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images,
    },
  };
}
