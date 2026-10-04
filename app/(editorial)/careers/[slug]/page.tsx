import { notFound } from 'next/navigation';
import { JobPage } from '@/components/catalogue/Careers';
import { jobs } from '@/content/jobs';
import { pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const job = jobs.find((j) => j.slug === slug);
  if (!job) return {};
  return pageMetadata({
    title: `${job.title} | ${site.name}`,
    shareTitle: job.title,
    description: job.summary,
    path: `/careers/${job.slug}`,
  });
}

export default async function Job({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const job = jobs.find((j) => j.slug === slug);
  if (!job) notFound();
  return <JobPage job={job} />;
}
