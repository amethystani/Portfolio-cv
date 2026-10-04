import { CareersPage } from '@/components/catalogue/Careers';
import { jobs } from '@/content/jobs';
import { pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata = pageMetadata({
  title: `Experience | ${site.name}`,
  description: `Research and industry experience of ${site.name}: Nous Research, ClerkTree, Complexity Science Hub Vienna and more.`,
  path: '/careers',
  image: site.ogImage,
});

export default function Careers() {
  return <CareersPage jobs={jobs} />;
}
