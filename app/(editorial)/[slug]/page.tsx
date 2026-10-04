import { notFound } from 'next/navigation';
import { ArticlePage } from '@/components/article/ArticlePage';
import { allPosts, getPost, getPostBody } from '@/lib/posts';
import { pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

import '@/styles/article.css';

type Params = { slug: string };

// Only the slugs listed in content/posts.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: `${post.title} | ${site.name}`,
    shareTitle: post.title,
    description: post.description,
    path: `/${post.slug}`,
    image: post.ogImage ?? post.cover?.src,
    type: 'article',
    publishedTime: post.publishedTime,
    author: post.author,
  });
}

export default async function Post({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return <ArticlePage post={post} body={getPostBody(post.slug)} />;
}
