import { SectionHead } from '@/components/catalogue/SectionHead';
import { CatalogueHero, WRAP } from '@/components/catalogue/CatalogueHero';
import { PageMotion } from '@/components/behavior/PageMotion';
import { Body, Mono, RowTitle } from '@/components/ui/Type';
import { ListDisclosure } from '@/components/ui/ListDisclosure';
import type { Release } from '@/content/releases';
import { longDate } from '@/lib/format';

function ReleaseRow({ release }: { release: Release }) {
  return (
    <article className="nw-catalogue-row nw-release-row">
      <div className="nw-catalogue-tags">
        <Mono className="nw-release-date">{release.date}</Mono>
        <Mono className="nw-release-type">{release.type}</Mono>
        <Mono className="nw-release-size">{release.size ?? '—'}</Mono>
      </div>
      <RowTitle className="nw-catalogue-row-title">
        <a className="nw-catalogue-link" href={release.href}>
          {release.title}
        </a>
      </RowTitle>
      <Body className="nw-catalogue-description">{release.description}</Body>
    </article>
  );
}

export function ReleasesPage({ releases }: { releases: Release[] }) {
  return (
    <>
      <PageMotion kind="catalogue" />
      <main className="nw-catalogue" id="top">
        <CatalogueHero
          className="nw-catalogue-listing-hero"
          eyebrow={`Latest · ${longDate(releases[0].date)}`}
          title="Publications"
        />
        <section aria-labelledby="releases-heading" className={`${WRAP} nw-catalogue-section`}>
          <SectionHead
            id="releases-heading"
            title="Most Recent"
            icon="/assets/nous-web/catalogue/heading-filter.svg"
            link={{ href: '#release-list', label: 'Jump to publications' }}
          />
          <ListDisclosure
            id="release-list"
            pageSize={9}
            itemLabel="publications"
            controlsProps={{ id: 'release-list-more', className: 'nw-release-more', tabIndex: -1 }}
          >
            {releases.map((release) => (
              <ReleaseRow key={`${release.date}-${release.title}`} release={release} />
            ))}
          </ListDisclosure>
        </section>
      </main>
    </>
  );
}
