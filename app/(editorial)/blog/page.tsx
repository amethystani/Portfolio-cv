import { BlogIndex } from '@/components/blog/BlogIndex';
import { archivePosts, featuredPosts } from '@/lib/posts';
import { pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata = pageMetadata({
  title: `Writing | ${site.name}`,
  description: `Posts and notes from ${site.name}: research, projects and conference write-ups.`,
  path: '/blog',
  image: site.ogImage,
});

export default function BlogPage() {
  return <BlogIndex featured={featuredPosts} archive={archivePosts} />;
}
