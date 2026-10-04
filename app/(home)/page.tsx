import { PageMotion } from '@/components/behavior/PageMotion';
import { JsonLd } from '@/components/JsonLd';
import { Affiliations } from '@/components/home/Affiliations';
import { Announcements } from '@/components/home/Announcements';
import { PortfolioHero } from '@/components/home/PortfolioHero';
import { SearchBar } from '@/components/home/SearchBar';
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
  // the 1200x630 signature card unfurls cleanly everywhere (a square WebP portrait does not on LinkedIn)
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
              email: `mailto:${portfolio.email}`,
              address: { '@type': 'PostalAddress', addressLocality: 'New Delhi', addressCountry: 'IN' },
              alumniOf: { '@type': 'CollegeOrUniversity', name: 'Shiv Nadar Institution of Eminence' },
              knowsAbout: [
                'Natural language processing',
                'Machine learning evaluation',
                'Retrieval-augmented generation',
                'Scientific AI',
                'Machine translation evaluation',
              ],
              sameAs: site.sameAs,
            },
            {
              '@id': `${site.url}/#website`,
              '@type': 'WebSite',
              name: site.name,
              url: `${site.url}/`,
              author: { '@id': `${site.url}/#person` },
            },
          ],
        }}
      />
      <PageMotion kind="home" />
      <main className="nw-page-body">
        <PortfolioHero />
        <SearchBar />
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
