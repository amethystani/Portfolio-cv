import { portfolio } from '@/content/portfolio';
import Link from 'next/link';
import '@/styles/article-deep.css';
import { PageMotion } from '@/components/behavior/PageMotion';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/icons';
import { ArticleBack } from '@/components/article/ArticleBack';
import { ArticleEmbeds } from '@/components/article/ArticleEmbeds';
import { ArticleReading } from '@/components/article/ArticleReading';
import { ArticleToolbar } from '@/components/article/ArticleToolbar';
import { Mono } from '@/components/ui/Type';
import { WRAP } from '@/components/catalogue/CatalogueHero';
import type { Post } from '@/content/posts';
import { site } from '@/lib/site';
import { articleHeadings, cardTitle, getPost, type Heading } from '@/lib/posts';

const CAPTION =
  'font-[family-name:var(--font-mono)] font-normal text-inherit uppercase leading-none text-cap-trim cap-mono';
const CAPTION_STYLE = {
  fontSize: 'max(11px, calc(11 * var(--nw-u-text)))',
  letterSpacing: 'max(0.44px, calc(0.44 * var(--nw-u-text)))',
};

function Avatar({ avatar }: { avatar: Post['avatar'] }) {
  return (
    <span
      className={`nw-article-avatar${'image' in avatar ? ' nw-article-avatar-portrait' : ''}`}
      aria-hidden="true"
    >
      {'image' in avatar ? (
        <img src={avatar.image} alt="" />
      ) : 'badge' in avatar ? (
        <Logo aria-hidden="true" style={{ width: '100%', height: 'auto', padding: '0 15%' }} />
      ) : (
        avatar.initials
      )}
    </span>
  );
}

/** A picture that is greyscale until it scrolls into view, then fades to colour (second <img> is the colour layer). */
function ColorFrame({
  src,
  alt,
  className,
  loading = 'lazy',
  priority,
}: {
  src: string;
  alt: string;
  className: string;
  loading?: 'eager' | 'lazy';
  priority?: boolean;
}) {
  return (
    <span className={`nw-article-color-frame ${className}`}>
      <img
        className="nw-color-reveal"
        src={src}
        alt={alt}
        loading={loading}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        decoding="async"
      />
      <img
        className="nw-article-color nw-color-reveal"
        src={src}
        alt=""
        aria-hidden="true"
        loading={loading}
        decoding="async"
      />
    </span>
  );
}

function RelatedRow({ post }: { post: Post }) {
  return (
    <article className="nw-blog-related-row">
      <div>
        <span className={CAPTION} style={CAPTION_STYLE}>
          By {post.byline ?? post.author}
        </span>
        <h3>
          <Link href={`/${post.slug}`}>{cardTitle(post)}</Link>
        </h3>
        <p>{post.excerpt}</p>
      </div>
      {post.thumbnail !== null && (post.thumbnail ?? post.cardImage ?? post.cover?.src) && (
        <ColorFrame
          src={(post.thumbnail ?? post.cardImage ?? post.cover?.src)!}
          alt={cardTitle(post)}
          className="nw-article-related-image"
        />
      )}
    </article>
  );
}

/**
 * One blog post. `body` is the HTML from content/posts/<slug>.html; the toolbar, contents dock and
 * listen/share dialogs are client components (ArticleToolbar, ArticleReading).
 */
export function ArticlePage({ post, body }: { post: Post; body: string }) {
  const headings = articleHeadings(body, post.contentsLabels);
  const related = post.related.map(getPost).filter((p): p is Post => Boolean(p));
  return (
    <div>
      <PageMotion kind="article" />
      <ArticleBack />
      <main className={`nw-blog nw-article${post.feature ? ' nw-article-feature' : ''}`}>
        <article>
          <header className={`${WRAP} nw-article-hero`}>
            <div className="nw-article-author">
              <Avatar avatar={post.avatar} />
              <span className={CAPTION} style={CAPTION_STYLE}>
                <span className="nw-blog-muted">By</span>
                {` ${post.author}`}
              </span>
            </div>
            <h1>{post.title}</h1>
            {post.version && (
              <span className={`${CAPTION} nw-article-version`} style={CAPTION_STYLE}>
                {post.version}
              </span>
            )}
            {post.cover && (
              <ColorFrame
                src={post.cover.src}
                alt={post.cover.alt}
                className="nw-article-cover"
                loading="eager"
                priority
              />
            )}
          </header>
          <div className={`${WRAP} nw-article-reading`}>
            <ArticleToolbar
              slug={post.slug}
              title={post.title}
              url={`${site.url}/${post.slug}`}
              publishedTime={post.publishedTime}
              dateLabel={post.dateLabel}
            />
            <ArticleReading headings={headings} />
            <ArticleEmbeds />
            <div className="nw-article-prose" id="article-prose" dangerouslySetInnerHTML={{ __html: body }} />
            {post.sourceTools && (
              <aside className="nw-article-source-tools" aria-labelledby="source-tools-heading">
                <h2 id="source-tools-heading">Interactive research</h2>
                <p>
                  Open the published research tools on their original sites. Embedded explorers and the
                  model-response demo are not connected in this preview.
                </p>
                <ul>
                  {post.sourceTools.map((href, i) => (
                    <li key={href}>
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        Published visualization {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>
            )}
            <aside className="nw-article-attribution">
              <Avatar avatar={post.avatar} />
              <div>
                <span className={CAPTION} style={CAPTION_STYLE}>
                  About the author
                </span>
                <h2>{post.author}</h2>
                <p>ML/NLP researcher in New Delhi, working on evaluation, retrieval and scientific AI.</p>
                <a href={portfolio.links.linkedin}>Follow on LinkedIn</a>
              </div>
            </aside>
          </div>
        </article>
        <section aria-labelledby="related-heading" className={`${WRAP} nw-article-related`}>
          <div className="nw-blog-section-heading">
            <h2 id="related-heading">Related Articles</h2>
            <Button variant="primary" density="cta" href="/blog">
              All articles
            </Button>
          </div>
          {related.map((p) => (
            <RelatedRow key={p.slug} post={p} />
          ))}
        </section>
      </main>
    </div>
  );
}
