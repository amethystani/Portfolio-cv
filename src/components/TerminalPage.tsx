'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import MacOsChrome from './MacOsChrome'

const XtermTerminal = dynamic(() => import('./XtermTerminal'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#1E1E1E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#686868',
        fontFamily: '"SF Mono", Monaco, Menlo, monospace',
        fontSize: '13px',
      }}
    >
      Loading terminal...
    </div>
  ),
})

// macOS Terminal dock icon SVG
function TerminalDockIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Open Terminal"
      aria-label="Open Terminal"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15) translateY(-8px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) translateY(0)')}
    >
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Rounded rect background */}
        <rect x="2" y="2" width="60" height="60" rx="14" fill="#000000" stroke="#333" strokeWidth="0.5" />
        {/* Inner glow */}
        <rect x="4" y="4" width="56" height="56" rx="12" fill="url(#termGrad)" />
        {/* Terminal prompt > */}
        <path d="M16 22 L28 32 L16 42" stroke="#00FF41" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Cursor line _ */}
        <line x1="32" y1="42" x2="48" y2="42" stroke="#00FF41" strokeWidth="3.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="termGrad" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#1a1a1a" />
            <stop offset="1" stopColor="#0d0d0d" />
          </linearGradient>
        </defs>
      </svg>
    </button>
  )
}

// Bounce dot indicator under dock icon
function DockDot() {
  return (
    <div style={{
      width: 4, height: 4, borderRadius: '50%',
      background: '#888', margin: '4px auto 0',
    }} />
  )
}

export default function TerminalPage() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)

  const handleClose = useCallback(() => {
    window.location.reload()
  }, [])

  const handleMinimize = useCallback(() => {
    setIsMinimized(true)
  }, [])

  const handleRestore = useCallback(() => {
    setIsMinimized(false)
  }, [])

  const handleMaximize = useCallback(() => {
    setIsMaximized(prev => !prev)
  }, [])

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        background: '#2C2C2C',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isMinimized ? 'flex-end' : 'center',
        padding: isMaximized ? '0' : undefined,
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Minimized: show dock bar at bottom */}
      {isMinimized && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingBottom: '8px',
            zIndex: 100,
          }}
        >
          {/* Dock bar */}
          <div
            style={{
              background: 'rgba(50, 50, 50, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '18px',
              padding: '8px 20px 6px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <TerminalDockIcon onClick={handleRestore} />
            <DockDot />
          </div>
        </div>
      )}

      {/* Terminal window */}
      {!isMinimized && (
        <MacOsChrome
          title="Animesh \u2014 zsh \u2014 80\u00d724"
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          isMaximized={isMaximized}
          style={
            isMaximized
              ? { width: '100%', height: '100%' }
              : {
                  width: 'min(95vw, 900px)',
                  height: 'min(85dvh, 600px)',
                  margin: 'auto',
                }
          }
        >
          <XtermTerminal />
        </MacOsChrome>
      )}
    </div>
  )
}
