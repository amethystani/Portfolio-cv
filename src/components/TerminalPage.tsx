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

// macOS Terminal dock icon SVG and styles
function TerminalDockIcon({ onClick, isActive }: { onClick: () => void, isActive?: boolean }) {
  return (
    <button
      onClick={onClick}
      title="Terminal"
      aria-label="Terminal"
      className="dock-item"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        outline: 'none',
      }}
    >
      <div className="dock-icon">
        <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Base rounded square */}
          <rect x="2" y="2" width="60" height="60" rx="14" fill="#1C1C1E" />
          {/* Top window bar */}
          <path d="M2 16C2 8.26801 8.26801 2 16 2H48C55.732 2 62 8.26801 62 16V22H2V16Z" fill="#D2D2D2" />
          {/* Traffic Light Buttons */}
          <circle cx="10" cy="12" r="3.5" fill="#FF5F56" />
          <circle cx="21" cy="12" r="3.5" fill="#FFBD2E" />
          <circle cx="32" cy="12" r="3.5" fill="#27C93F" />
          {/* Terminal Text `>_` */}
          <text x="8" y="46" fill="#E5E5E5" fontFamily="Courier, monospace" fontSize="18" fontWeight="bold">&gt;_</text>
          {/* Subtle outline highlight */}
          <rect x="2" y="2" width="60" height="60" rx="14" stroke="#000000" strokeWidth="1" />
        </svg>
      </div>
      <div className="dock-dot" style={{ opacity: isActive ? 1 : 0 }} />
    </button>
  )
}

// macOS Preview dock icon SVG
function PreviewDockIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="resume.pdf"
      aria-label="resume.pdf"
      className="dock-item"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        outline: 'none',
      }}
    >
      <div className="dock-icon">
        <img 
          src="/previewicon.png" 
          alt="resume.pdf" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
        />
      </div>
      <div className="dock-dot" style={{ opacity: 0 }} />
    </button>
  )
}

// macOS Safari dock icon
function SafariDockIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Portfolio Site"
      aria-label="Portfolio Site"
      className="dock-item"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        outline: 'none',
      }}
    >
      <div className="dock-icon">
        <img 
          src="/Apple Safari.svg" 
          alt="Portfolio" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
        />
      </div>
      <div className="dock-dot" style={{ opacity: 0 }} />
    </button>
  )
}

export default function TerminalPage() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isClosed, setIsClosed] = useState(false)

  const handleClose = useCallback(() => {
    setIsClosed(true)
  }, [])

  const handleMinimize = useCallback(() => {
    setIsMinimized(true)
  }, [])

  const handleRestore = useCallback(() => {
    setIsClosed(false)
    setIsMinimized(false)
  }, [])

  const handleMaximize = useCallback(() => {
    setIsMaximized(prev => !prev)
  }, [])

  const handleOpenResume = useCallback(() => {
    window.open('/resume.pdf', '_blank')
  }, [])

  const handleOpenPortfolio = useCallback(() => {
    window.open('/portfolio', '_blank')
  }, [])

  const showDock = isMinimized || isClosed

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        background: '#2C2C2C',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isMinimized || isClosed ? 'flex-end' : 'center',
        padding: isMaximized && !isClosed && !isMinimized ? '0' : undefined,
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <style>{`
        .mac-dock-container {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 8px 12px;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          display: flex;
          align-items: flex-end;
          gap: 12px;
          height: 76px;
        }
        .dock-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          height: 100%;
          margin-bottom: 2px;
        }
        .dock-icon {
          width: 60px;
          height: 60px;
          transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
          transform-origin: bottom center;
        }
        .dock-item:hover .dock-icon {
          transform: scale(1.3) translateY(-8px);
          margin: 0 10px;
        }
        .dock-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.8);
          position: absolute;
          bottom: -6px;
        }
      `}</style>

      {/* Dock bar - shown when minimized or closed */}
      {showDock && (
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
          <div className="mac-dock-container">
            <TerminalDockIcon onClick={handleRestore} isActive={!isClosed} />
            <SafariDockIcon onClick={handleOpenPortfolio} />
            <PreviewDockIcon onClick={handleOpenResume} />
          </div>
        </div>
      )}

      {/* Terminal window */}
      {!showDock && (
        <MacOsChrome
          title="animesh — zsh — 80×24"
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
