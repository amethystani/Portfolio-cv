import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Animesh | Portfolio',
  description: 'Animesh - Software Engineer',
};

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Overview', href: '#overview' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
  { name: 'Privacy Policy', href: '#privacy' },
];

export default function PortfolioReplica() {
  return (
    <div className={inter.className} style={{ minHeight: '100vh', backgroundColor: '#fff', color: '#333', scrollBehavior: 'smooth' }}>
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        .nav-link {
          color: #bebebe;
          text-decoration: none;
          font-weight: 400;
          transition: color 0.2s ease, text-shadow 0.2s ease;
          font-size: 14px;
        }
        .nav-link:hover {
          color: #fff;
          text-shadow: 0 0 8px rgba(255,255,255,0.4);
        }
        .nav-link.active {
          color: #fff;
          font-weight: 600;
        }
        .custom-anchor {
          color: #277093;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-bottom 0.2s;
          font-weight: 500;
        }
        .custom-anchor:hover {
          border-bottom: 1px solid #277093;
        }
        .project-card {
          padding: 24px;
          border-radius: 8px;
          border: 1px solid #eaeaea;
          background: #fafafa;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .project-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }
        .footer-link {
          color: #aaa;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: #fff;
        }
      `}</style>

      {/* Top Navbar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#000', 
        color: '#fff', 
        padding: '16px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div>
          <span style={{ fontSize: '20px', fontWeight: 300, color: '#f0f0f0', letterSpacing: '0.5px' }}>Animesh</span>
        </div>
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {navLinks.map((link, idx) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={`nav-link ${idx === 0 ? 'active' : ''}`}
            >
              {link.name}
            </a>
          ))}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" style={{ cursor: 'pointer', transition: 'stroke 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.stroke = '#fff'} onMouseLeave={(e) => e.currentTarget.style.stroke = '#aaa'}>
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.3-4.3"></path>
          </svg>
        </div>
      </nav>

      {/* Hero Banner */}
      <header style={{ 
        backgroundColor: '#277093', 
        color: '#fff', 
        textAlign: 'center', 
        padding: '80px 20px',
        boxShadow: 'inset 0 -10px 20px auto'
      }}>
        <h1 style={{ fontSize: '48px', fontWeight: 300, margin: 0, letterSpacing: '0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Animesh</h1>
        <p style={{ marginTop: '16px', fontSize: '18px', color: '#e0f0f5', fontWeight: 300 }}>Software Engineer &amp; Full-Stack Developer</p>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', lineHeight: 1.8, fontSize: '16px', color: '#333' }}>
        
        {/* Overview Section */}
        <section id="overview" style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '24px' }}>Overview</h2>
          <p style={{ marginBottom: '20px' }}>
            I am a <strong>software engineer</strong> working in <strong>full-stack development</strong>. My work lies at the intersection of <strong>frontend architectures, backend scalability,</strong> and <strong>cloud orchestration</strong>, with the goal of developing solutions that contribute to high-performance, resilient applications.
          </p>
          <p style={{ marginBottom: '20px' }}>
            Currently, I am building complex, data-driven web applications utilizing <a href="#" className="custom-anchor">React</a> and <a href="#" className="custom-anchor">Next.js</a> alongside Node.js backends. Our aim is to understand under which conditions systems can scale efficiently while maintaining a clean, accessible layout and optimal user experience.
          </p>
        </section>

        {/* Projects Section */}
        <section id="projects" style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '24px' }}>Research & Projects</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            <div className="project-card">
              <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>MacBook Terminal OS</h3>
              <p style={{ fontSize: '14px', margin: 0, color: '#555' }}>
                Engineered an interactive visual experience (the terminal you just came from) where I combined graphical UI concepts with robust CLI functionalities. Built with <a href="#" className="custom-anchor">TypeScript</a> and <a href="#" className="custom-anchor">xterm.js</a> to replicate high-fidelity macOS environments natively in the browser.
              </p>
            </div>

            <div className="project-card">
              <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>Distributed Microservices</h3>
              <p style={{ fontSize: '14px', margin: 0, color: '#555' }}>
                My recent infrastructure projects involve deploying systems with <a href="#" className="custom-anchor">Go</a>, gRPC communication, Kubernetes auto-scaling, and Redis caching. Investigated the effects of network latency on rendering, state management, and human navigation.
              </p>
            </div>

          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '24px' }}>Experience</h2>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <strong>Full Stack Developer</strong>
                <span style={{ fontSize: '14px', color: '#666' }}>2025 – Present</span>
              </div>
              <p style={{ margin: 0, color: '#444' }}>Producing high-resolution interfaces and scalable backends by inferring best practices from modern design frameworks. Working deeply with containerized environments and CI/CD operations.</p>
            </li>
            <li>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <strong>Open Source Contributor</strong>
                <span style={{ fontSize: '14px', color: '#666' }}>2021 – 2025</span>
              </div>
              <p style={{ margin: 0, color: '#444' }}>Collaborated with incredible engineers worldwide on open-source initiatives to enhance library stability and developer experience across the web-development ecosystem.</p>
            </li>
          </ul>
        </section>

        <section id="contact" style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '24px' }}>Contact</h2>
          <p>
            I am always open to interesting projects, collaborations, and opportunities. You can reach out to me directly at: <br/>
            <a href="mailto:animesh@example.com" className="custom-anchor" style={{ fontWeight: 600, fontSize: '18px', marginTop: '12px', display: 'inline-block' }}>animesh@example.com</a>
          </p>
        </section>

        <hr style={{ border: 0, borderTop: '1px solid #e0e0e0', margin: '40px 0' }} />
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" className="custom-anchor" style={{ fontSize: '15px', fontWeight: 600, padding: '12px 24px', backgroundColor: '#f0f5f8', borderRadius: '30px' }}>
            ← Return to macOS Terminal
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer id="privacy" style={{ 
        backgroundColor: '#0a0a0a', 
        color: '#888', 
        padding: '32px 20px', 
        textAlign: 'center',
        fontSize: '13px',
        borderTop: '1px solid #222'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Animesh. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <a href="#" className="footer-link">Imprint</a>
            <span style={{ color: '#444' }}>|</span>
            <a href="#" className="footer-link">Privacy Policy</a>
            <span style={{ color: '#444' }}>|</span>
            <a href="https://github.com/amethystani" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
