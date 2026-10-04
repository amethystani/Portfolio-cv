import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SectionHead } from '@/components/catalogue/SectionHead';
import { CatalogueHero, WRAP } from '@/components/catalogue/CatalogueHero';
import { PageMotion } from '@/components/behavior/PageMotion';
import { Body, Mono, RowTitle, SectionTitle } from '@/components/ui/Type';
import { ListDisclosure } from '@/components/ui/ListDisclosure';
import { applicationChecklist, recruitingEmail, type Job } from '@/content/jobs';

const mailto = (subject?: string) =>
  `mailto:${recruitingEmail}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;

/** Large statement text next to the careers photo. */
function Statement({ children }: { children: string }) {
  return (
    <p
      className="font-[family-name:var(--font-rules-gothic-cmp)] font-normal text-inherit uppercase text-cap-trim cap-rules"
      style={
        {
          fontFamily: 'var(--font-rules-gothic-cmp)',
          '--nw-display-size': 'max(16px, calc(48 * var(--nw-u-text)))',
          fontSize: 'var(--nw-display-size)',
          lineHeight: '1.2',
        } as CSSProperties
      }
    >
      {children}
    </p>
  );
}

function RoleRow({ job }: { job: Job }) {
  return (
    <article className="nw-catalogue-row nw-role-row">
      <div className="nw-catalogue-tags">
        <Mono>{job.employment}</Mono>
        <Mono className="nw-role-mobile-location">{job.location}</Mono>
      </div>
      <RowTitle className="nw-catalogue-row-title">
        <Link className="nw-catalogue-link" href={`/careers/${job.slug}`}>
          {job.title}
        </Link>
      </RowTitle>
      <Body className="nw-catalogue-description">{job.summary}</Body>
      <Mono className="nw-role-location">{job.location}</Mono>
      <a
        href={mailto(job.title)}
        className="nw-catalogue-link nw-role-apply"
        aria-label={`Get in touch about ${job.title}`}
      >
        <Mono>Get in touch</Mono>
      </a>
    </article>
  );
}

/** The "How to apply" block, shared by the careers index and every job page. */
function ApplySection({ subject }: { subject?: string }) {
  return (
    <section
      id="apply"
      aria-labelledby="apply-heading"
      className={`${WRAP} nw-catalogue-section nw-career-apply`}
    >
      <SectionHead
        id="apply-heading"
        title="Get in touch"
        icon="/assets/nous-web/catalogue/careersContext_imgMail.svg"
        link={{ href: mailto(subject), label: 'Email Animesh' }}
      />
      <Button variant="ghost" className="nw-catalogue-message" href={mailto(subject)}>
        Send a message
      </Button>
      <div className="nw-career-apply-copy">
        <Body>
          {'Email '}
          <a className="nw-catalogue-link" href={mailto(subject)}>
            {recruitingEmail}
          </a>
          {' if you work in any of these areas and want to talk shop:'}
        </Body>
        <Body as="ul">
          {applicationChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </Body>
      </div>
    </section>
  );
}

export function CareersPage({ jobs }: { jobs: Job[] }) {
  return (
    <>
      <PageMotion kind="catalogue" />
      <main className="nw-catalogue" id="top">
        <CatalogueHero eyebrow={`${jobs.length} roles and projects`} title="Experience">
          <div className="nw-career-intro">
            <Body>
              RESEARCH: NLP and ML evaluation, scientific AI, and the measurements used to judge language
              models. Papers at EMNLP 2026 Main, WMT 2026 and Digital Discovery.
            </Body>
            <Body>
              WORK: open-source contributions at Nous Research, research at Complexity Science Hub Vienna
              and DRDO, and co-founding ClerkTree. Looking for my next research role before a PhD.
            </Body>
          </div>
        </CatalogueHero>
        <div className={`${WRAP} nw-career-art`}>
          <img
            src="/assets/nous-web/catalogue/careersContext_imgImage6.webp"
            alt=""
            width={1080}
            height={1080}
            decoding="async"
          />
          <div className="nw-career-art-copy">
            <Statement>Fast, high-output environments over slow academic ones.</Statement>
            <Statement>Looking for my next research role before a PhD.</Statement>
          </div>
        </div>
        <section aria-labelledby="roles-heading" className={`${WRAP} nw-catalogue-section`}>
          <SectionHead
            id="roles-heading"
            title="Roles"
            icon="/assets/nous-web/catalogue/careersContext_imgContact.svg"
            link={{ href: '#role-list', label: 'Jump to roles' }}
          />
          <ListDisclosure
            id="role-list"
            pageSize={9}
            itemLabel="roles"
            buttonClassName="nw-catalogue-more nw-role-more"
            paginationMedia={{ query: '(max-width: 767px)', overflowClassName: 'nw-role-overflow' }}
          >
            {jobs.map((job) => (
              <RoleRow key={job.slug} job={job} />
            ))}
          </ListDisclosure>
        </section>
        <ApplySection />
      </main>
    </>
  );
}

export function JobPage({ job }: { job: Job }) {
  return (
    <>
      <PageMotion kind="catalogue" />
      <main className="nw-catalogue" id="top">
        <CatalogueHero eyebrow={job.eyebrow} title={job.title}>
          <div className="nw-career-intro">
            {job.intro.map((paragraph) => (
              <Body key={paragraph}>{paragraph}</Body>
            ))}
          </div>
        </CatalogueHero>
        {job.sections.map((section) => {
          const id = `${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-heading`;
          return (
            <section key={section.heading} aria-labelledby={id} className={`${WRAP} nw-catalogue-section`}>
              <div className="nw-catalogue-section-head">
                <SectionTitle id={id}>{section.heading}</SectionTitle>
              </div>
              <Body as="ul" className="nw-role-details">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </Body>
            </section>
          );
        })}
        <ApplySection subject={job.subject} />
        <nav aria-label="All experience" className={`${WRAP} nw-catalogue-section nw-role-back`}>
          <Link className="nw-catalogue-link" href="/careers#role-list">
            <Mono>All experience</Mono>
          </Link>
        </nav>
      </main>
    </>
  );
}
