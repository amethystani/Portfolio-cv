import { PageMotion } from '@/components/behavior/PageMotion';
import { JsonLd } from '@/components/JsonLd';
import { Affiliations } from '@/components/home/Affiliations';
import { Announcements } from '@/components/home/Announcements';
import { PortfolioHero } from '@/components/home/PortfolioHero';
import { HermesBlock } from '@/components/home/HermesBlock';
import { Mission } from '@/components/home/Mission';
import { PerspectiveStatement } from '@/components/home/PerspectiveStatement';
import { Signoff } from '@/components/home/Signoff';
import { pageMetadata } from '@/lib/seo';
import { statement } from '@/content/home';
import { portfolio } from '@/content/portfolio';
import { site } from '@/lib/site';

import '@/styles/affiliations.css';
import '@/styles/perspective.css';
import '@/styles/home-announcements.css';
import '@/styles/portfolio.css';
import '@/styles/poster-edges.css';
import '@/styles/home-orb.css';

export const metadata = pageMetadata({
  title: `${portfolio.name} | ${portfolio.role}`,
  description: site.homeDescription,
  path: '/',
  image: portfolio.poster.src,
  imageAlt: portfolio.poster.alt,
  imageSize: { width: portfolio.poster.width, height: portfolio.poster.height },
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@id': `${site.url}/#person`,
              '@type': 'Person',
              name: portfolio.name,
              jobTitle: portfolio.role,
              image: `${site.url}${portfolio.poster.src}`,
              url: `${site.url}/`,
            },
          ],
        }}
      />
      <PageMotion kind="home" />
      <main className="nw-page-body">
        <PortfolioHero />
        <Mission />
        <PerspectiveStatement label={statement.label} text={statement.text} />
        <Affiliations />
        <HermesBlock />
        <Announcements />
        <Signoff />
      </main>
    </>
  );
}
