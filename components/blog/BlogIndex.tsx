import Link from 'next/link';
import { SectionHead } from '@/components/catalogue/SectionHead';
import { CatalogueHero, WRAP } from '@/components/catalogue/CatalogueHero';
import { PageMotion } from '@/components/behavior/PageMotion';
import { Body, Mono, RowTitle } from '@/components/ui/Type';
import { ListDisclosure } from '@/components/ui/ListDisclosure';
import { HermesBlock } from '@/components/home/HermesBlock';
import type { Post } from '@/content/posts';
import { cardTitle } from '@/lib/posts';

function Byline({ author, className }: { author: string; className?: string }) {
  return (
    <Mono size={13} tracking={0.52} className={className}>
      <span className="nw-blog-muted">By</span>
      {` ${author}`}
    </Mono>
  );
}

/** Large card for a featured post. */
function FeatureCard({ post }: { post: Post }) {
  const loading = post.eagerCard ? 'eager' : 'lazy';
  return (
    <article className="nw-blog-feature">
      <figure className="nw-blog-feature-art" data-blog-reveal="true">
        <Link tabIndex={-1} aria-hidden="true" href={`/${post.slug}`}>
          <img className="nw-color-reveal" src={post.cardImage} alt="" loading={loading} decoding="async" />
          <img
            className="nw-blog-color nw-color-reveal"
            src={post.cardImage}
            alt=""
            aria-hidden="true"
            loading={loading}
            decoding="async"
          />
        </Link>
      </figure>
      <div className="nw-blog-snippet">
        <div data-blog-reveal="true">
          <Byline author={post.byline ?? post.author} />
        </div>
        <div data-blog-reveal="true">
          <RowTitle as="h2" size={28}>
            <Link className="nw-catalogue-link" href={`/${post.slug}`}>
              {cardTitle(post)}
            </Link>
          </RowTitle>
        </div>
        <div data-blog-reveal="true">
          <Body className="nw-blog-excerpt">{post.excerpt}</Body>
        </div>
      </div>
    </article>
  );
}

function ArchiveRow({ post }: { post: Post }) {
  return (
    <article className="nw-catalogue-row nw-blog-archive-row">
      <RowTitle size={24} className="nw-catalogue-row-title" data-blog-reveal="">
        <Link className="nw-catalogue-link" href={`/${post.slug}`}>
          {cardTitle(post)}
        </Link>
      </RowTitle>
      <Body className="nw-catalogue-description nw-blog-excerpt" data-blog-reveal="">
        {post.excerpt}
      </Body>
      <div className="nw-blog-byline" data-blog-reveal="true">
        <Byline author={post.byline ?? post.author} />
      </div>
    </article>
  );
}

export function BlogIndex({ featured, archive }: { featured: Post[]; archive: Post[] }) {
  return (
    <>
      <PageMotion kind="blog" />
      <main className="nw-blog-index nw-catalogue" id="main">
        <CatalogueHero eyebrow="Research & notes" title="Writing" />
        <div>
          <section aria-label="Featured articles" className={`${WRAP} nw-catalogue-section nw-blog-featured`}>
            {featured.map((post) => (
              <FeatureCard key={post.slug} post={post} />
            ))}
          </section>
          <section aria-labelledby="blog-archive-heading" className={`${WRAP} nw-catalogue-section`}>
            <SectionHead
              id="blog-archive-heading"
              title="Archive"
              icon="/assets/nous-web/blog/heading-book.svg"
              data-blog-reveal="true"
            />
            <ListDisclosure
              id="blog-archive-list"
              pageSize={9}
              itemLabel="archive articles"
              buttonClassName="nw-catalogue-more nw-archive-more"
              paginationMedia={{ query: '(max-width: 767px)', overflowClassName: 'nw-archive-overflow' }}
            >
              {archive.map((post) => (
                <ArchiveRow key={post.slug} post={post} />
              ))}
            </ListDisclosure>
          </section>
        </div>
      </main>
      <HermesBlock />
    </>
  );
}
