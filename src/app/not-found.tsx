import Link from 'next/link'
import MacOsChrome from '@/components/MacOsChrome'

export default function NotFound() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#2C2C2C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        boxSizing: 'border-box',
      }}
    >
      <MacOsChrome
        title="Animesh \u2014 zsh \u2014 error"
        style={{ width: '100%', maxWidth: '600px', height: 'auto' }}
      >
        <div
          style={{
            padding: '24px',
            fontFamily: '"SF Mono", Monaco, Menlo, monospace',
            fontSize: '13px',
            color: '#F5F5F5',
            lineHeight: 1.6,
          }}
        >
          <p style={{ color: '#C51E14' }}>bash: 404: No such file or directory</p>
          <p style={{ color: '#686868', marginTop: '8px' }}>
            The page you were looking for does not exist.
          </p>
          <p style={{ marginTop: '16px' }}>
            <Link
              href="/"
              style={{ color: '#20C5C6', textDecoration: 'none' }}
            >
              cd ~/
            </Link>
            {'  '}
            <span style={{ color: '#686868' }}># return home</span>
          </p>
        </div>
      </MacOsChrome>
    </div>
  )
}
