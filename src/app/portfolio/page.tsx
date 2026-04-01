import Link from 'next/link'
import MacOsChrome from '@/components/MacOsChrome'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Portfolio \u2014 Animesh",
  description: 'Visual portfolio \u2014 Animesh',
}

const skills = {
  Languages: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL'],
  Frontend: ['React', 'Next.js', 'Tailwind CSS', 'HTML/CSS'],
  Backend: ['Node.js', 'Express', 'FastAPI', 'PostgreSQL', 'Redis'],
  'DevOps & Tools': ['Docker', 'Git', 'GitHub Actions', 'Linux', 'Nginx'],
}

const projects = [
  {
    name: 'Portfolio Site',
    tech: 'Next.js · TypeScript · xterm.js · Tailwind',
    desc: 'This very site. A terminal-first portfolio that runs inside a pixel-perfect macOS Terminal emulator with a full bash-like command interpreter and a mock virtual filesystem.',
    link: '/',
  },
  {
    name: 'Project Alpha',
    tech: 'React · Node.js · PostgreSQL · Docker',
    desc: 'Full-stack web application with real-time WebSocket features, containerized deployment with Docker Compose, and a CI/CD pipeline with GitHub Actions.',
    link: null,
  },
  {
    name: 'Project Beta',
    tech: 'Python · FastAPI · Redis · React',
    desc: 'High-performance REST API with sub-50ms p99 latency, Redis caching layer, comprehensive test coverage, and a React dashboard.',
    link: null,
  },
  {
    name: 'Project Gamma',
    tech: 'Go · gRPC · Kubernetes',
    desc: 'Distributed microservices system with gRPC communication, Kubernetes auto-scaling, distributed tracing with Jaeger, and Istio service mesh.',
    link: null,
  },
]

export default function Portfolio() {
  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        background: '#2C2C2C',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '40px',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      <MacOsChrome
        title="Animesh \u2014 portfolio \u2014 visual"
        style={{ width: '100%', maxWidth: '860px' }}
      >
        <div
          style={{
            padding: '32px 40px',
            fontFamily: '"SF Mono", Monaco, Menlo, Consolas, monospace',
            color: '#F5F5F5',
            overflowY: 'auto',
          }}
        >
          {/* Back link */}
          <div style={{ marginBottom: '32px' }}>
            <Link
              href="/"
              style={{
                color: '#686868',
                textDecoration: 'none',
                fontSize: '12px',
              }}
            >
              <span style={{ color: '#1DC121' }}>animesh@MacBook</span>
              <span style={{ color: '#0A2FC4' }}> ~</span>
              <span style={{ color: '#F5F5F5' }}> % </span>
              <span style={{ color: '#20C5C6' }}>cd ~/</span>
            </Link>
          </div>

          {/* Header */}
          <section style={{ marginBottom: '40px' }}>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 700,
                margin: '0 0 4px',
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
              }}
            >
              Animesh
            </h1>
            <p style={{ fontSize: '14px', color: '#686868', margin: '0 0 16px' }}>
              Software Engineer &amp; Developer &mdash; India
            </p>
            <p style={{ fontSize: '13px', color: '#C7C7C7', lineHeight: 1.7, maxWidth: '600px', margin: 0 }}>
              I build things for the web. Passionate about clean code, great user experiences, and systems that scale. Currently open to new opportunities.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href="https://github.com/amethystani" target="_blank" rel="noopener noreferrer" style={{ color: '#20C5C6', textDecoration: 'none', fontSize: '12px' }}>github.com/amethystani</a>
              <a href="mailto:animesh@example.com" style={{ color: '#20C5C6', textDecoration: 'none', fontSize: '12px' }}>animesh@example.com</a>
              <a href="/resume.pdf" target="_blank" style={{ color: '#FEBC2E', textDecoration: 'none', fontSize: '12px' }}>resume.pdf</a>
            </div>
          </section>

          <Divider label="skills" />

          {/* Skills */}
          <section style={{ marginBottom: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {Object.entries(skills).map(([category, items]) => (
                <div key={category}>
                  <p style={{ fontSize: '11px', color: '#686868', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {category}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {items.map(skill => (
                      <span
                        key={skill}
                        style={{
                          fontSize: '12px',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#C7C7C7',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Divider label="projects" />

          {/* Projects */}
          <section style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {projects.map(project => (
                <div
                  key={project.name}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
                      {project.link ? (
                        <a href={project.link} style={{ color: '#FFFFFF', textDecoration: 'none' }}>{project.name}</a>
                      ) : project.name}
                    </span>
                    <span style={{ fontSize: '11px', color: '#686868' }}>{project.tech}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#9a9a9a', margin: 0, lineHeight: 1.6 }}>
                    {project.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <Divider label="contact" />

          {/* Contact */}
          <section style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '13px', color: '#C7C7C7', lineHeight: 1.7, margin: '0 0 12px' }}>
              Open to interesting projects, collaborations, and opportunities.
            </p>
            <p style={{ fontSize: '13px', margin: 0 }}>
              <a href="mailto:animesh@example.com" style={{ color: '#20C5C6', textDecoration: 'none' }}>animesh@example.com</a>
            </p>
          </section>

          {/* Footer */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
            <p style={{ fontSize: '11px', color: '#686868', margin: 0 }}>
              <span style={{ color: '#1DC121' }}>animesh@MacBook</span>
              <span style={{ color: '#0A2FC4' }}> ~/portfolio</span>
              <span> % </span>
              <Link href="/" style={{ color: '#20C5C6', textDecoration: 'none' }}>cd ~/</Link>
              {'  '}
              <span style={{ color: '#686868' }}># back to terminal</span>
            </p>
          </div>
        </div>
      </MacOsChrome>
    </div>
  )
}

function Divider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
      <span style={{ fontSize: '11px', color: '#686868', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
        # {label}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
    </div>
  )
}
