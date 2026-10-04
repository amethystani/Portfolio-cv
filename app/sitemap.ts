import type { MetadataRoute } from 'next';
import { jobs } from '@/content/jobs';
import { posts } from '@/content/posts';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/blog', '/releases', '/careers', ...jobs.map((j) => `/careers/${j.slug}`), ...posts.map((p) => `/${p.slug}`)];
  return paths.map((path) => ({ url: `${site.url}${path === '/' ? '' : path}` }));
}
