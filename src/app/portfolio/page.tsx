import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Animesh | Portfolio',
  description: 'Animesh - Software Engineer',
};

const navLinks = [
  'Home',
  'Overview',
  'People',
  'Research',
  'Experience',
  'Hobbies',
  'Imprint',
  'Privacy Policy',
];

export default function PortfolioReplica() {
  return (
    <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', minHeight: '100vh', backgroundColor: '#fff', color: '#333' }}>
      <style>{`
        .nav-link {
          color: #aaa;
          text-decoration: none;
          font-weight: normal;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: #fff;
        }
        .nav-link.active {
          color: #fff;
          font-weight: bold;
        }
      `}</style>

      {/* Top Navbar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#000', 
        color: '#fff', 
        padding: '12px 24px',
        fontSize: '14px'
      }}>
        <div>
          <span style={{ fontSize: '18px', fontWeight: 300, color: '#e0e0e0' }}>Animesh</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {navLinks.map((link, idx) => (
            <a 
              key={link} 
              href="#" 
              className={`nav-link ${idx === 0 ? 'active' : ''}`}
            >
              {link}
            </a>
          ))}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" style={{ cursor: 'pointer' }}>
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
        padding: '60px 20px',
        borderBottom: '1px solid #ddd'
      }}>
        <h1 style={{ fontSize: '42px', fontWeight: 300, margin: 0, letterSpacing: '0.02em' }}>Animesh</h1>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 20px', lineHeight: 1.7, fontSize: '15px', color: '#222' }}>
        <p style={{ marginBottom: '20px' }}>
          I am a <strong>software engineer</strong> working in <strong>full-stack development</strong>. My work lies at the intersection of <strong>frontend architectures, backend scalability,</strong> and <strong>cloud orchestration</strong>, with the goal of developing solutions that contribute to high-performance, resilient applications.
        </p>
        
        <p style={{ marginBottom: '20px' }}>
          Currently, I&apos;m working on complex web applications utilizing <a href="#" style={{ color: '#277093', textDecoration: 'none', borderBottom: '1px solid currentColor' }}>React</a> and <a href="#" style={{ color: '#277093', textDecoration: 'none', borderBottom: '1px solid currentColor' }}>Next.js</a> alongside Node.js backends. Our aim is to understand under which conditions systems can scale efficiently while maintaining a clean, accessible layout and optimal user experience.
        </p>

        <p style={{ marginBottom: '20px' }}>
          In the past year, I have focused heavily on building interactive visual experiences and simulated environments (like the terminal you just came from) where I combined graphical UI concepts with CLI functionalities. I have worked with <a href="#" style={{ color: '#277093', textDecoration: 'none', borderBottom: '1px solid currentColor' }}>TypeScript</a> and <a href="#" style={{ color: '#277093', textDecoration: 'none', borderBottom: '1px solid currentColor' }}>PostgreSQL</a> on producing high-resolution, data-driven interfaces by inferring best practices from modern design frameworks.
        </p>

        <p style={{ marginBottom: '20px' }}>
          My recent projects involve distributed microservices systems with <a href="#" style={{ color: '#277093', textDecoration: 'none', borderBottom: '1px solid currentColor' }}>Go</a>, gRPC communication, Kubernetes auto-scaling, and Redis caching. During this time, I investigated the effects of network structure on rendering, state management, and human navigation. I collaborate with several amazing engineers on open-source initiatives and aim to keep learning every day.
        </p>

        <hr style={{ border: 0, borderTop: '1px solid #eee', margin: '40px 0' }} />
        
        <div style={{ textAlign: 'center' }}>
          <Link href="/" style={{ color: '#277093', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to Terminal
          </Link>
        </div>
      </main>
    </div>
  );
}
