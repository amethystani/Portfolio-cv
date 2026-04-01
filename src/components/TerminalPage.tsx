'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import MacOsChrome from './MacOsChrome'
import AppleMusic from './AppleMusic'
import Finder from './Finder'

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

// macOS Finder dock icon
function FinderDockIcon({ onClick, isActive }: { onClick: () => void, isActive?: boolean }) {
  return (
    <button
      onClick={onClick}
      title="Finder"
      aria-label="Finder"
      className="dock-item"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        outline: 'none',
      }}
    >
      <div className="dock-icon" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
        <Image 
          src="/Finder.png" 
          alt="Finder" 
          width={60}
          height={60}
          style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.15)' }} 
          unoptimized
        />
      </div>
      <div className="dock-dot" style={{ opacity: isActive ? 1 : 0 }} />
    </button>
  )
}

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
      <div className="dock-icon" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
        <Image 
          src="/terminal-2021-06-03.png.webp" 
          alt="Terminal" 
          width={60}
          height={60}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          unoptimized
        />
      </div>
      <div className="dock-dot" style={{ opacity: isActive ? 1 : 0 }} />
    </button>
  )
}

// Apple Music dock icon
function AppleMusicDockIcon({ onClick, isActive }: { onClick: () => void, isActive?: boolean }) {
  return (
    <button
      onClick={onClick}
      title="Apple Music"
      aria-label="Apple Music"
      className="dock-item"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        outline: 'none',
      }}
    >
      <div className="dock-icon" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
        <Image 
          src="/Apple_Music_Symbol_2.webp" 
          alt="Apple Music" 
          width={60}
          height={60}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          unoptimized
        />
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
        <Image 
          src="/previewicon.png" 
          alt="resume.pdf" 
          width={60}
          height={60}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          unoptimized
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
        <Image 
          src="/safari-icon.svg" 
          alt="Portfolio" 
          width={60}
          height={60}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          unoptimized
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

  const [isMusicOpen, setIsMusicOpen] = useState(false)
  const [isMusicMinimized, setIsMusicMinimized] = useState(false)
  const [isMusicMaximized, setIsMusicMaximized] = useState(false)

  const [isFinderOpen, setIsFinderOpen] = useState(false)
  const [isFinderMinimized, setIsFinderMinimized] = useState(false)
  const [isFinderMaximized, setIsFinderMaximized] = useState(false)

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

  const handleOpenMusic = useCallback(() => {
    setIsMusicOpen(true)
    setIsMusicMinimized(false)
  }, [])
  const handleCloseMusic = useCallback(() => setIsMusicOpen(false), [])
  const handleMinimizeMusic = useCallback(() => setIsMusicMinimized(true), [])
  const handleMaximizeMusic = useCallback(() => setIsMusicMaximized(prev => !prev), [])

  const handleOpenFinder = useCallback(() => {
    setIsFinderOpen(true)
    setIsFinderMinimized(false)
  }, [])
  const handleCloseFinder = useCallback(() => setIsFinderOpen(false), [])
  const handleMinimizeFinder = useCallback(() => setIsFinderMinimized(true), [])
  const handleMaximizeFinder = useCallback(() => setIsFinderMaximized(prev => !prev), [])

  const handleOpenResume = useCallback(() => {
    window.open('/resume.pdf', '_blank')
  }, [])

  const handleOpenPortfolio = useCallback(() => {
    window.open('/portfolio', '_blank')
  }, [])

  const showDock = (isMinimized || isClosed) && (!isMusicOpen || isMusicMinimized) && (!isFinderOpen || isFinderMinimized)

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        background: '#2C2C2C',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isMinimized || isClosed ? 'flex-end' : 'center',
        padding: isMaximized && !isClosed && !isMinimized ? '0' : undefined,
        boxSizing: 'border-box',
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
            <FinderDockIcon onClick={handleOpenFinder} isActive={isFinderOpen && !isFinderMinimized} />
            <TerminalDockIcon onClick={handleRestore} isActive={!isClosed} />
            <AppleMusicDockIcon onClick={handleOpenMusic} isActive={isMusicOpen && !isMusicMinimized} />
            <SafariDockIcon onClick={handleOpenPortfolio} />
            <PreviewDockIcon onClick={handleOpenResume} />
          </div>
        </div>
      )}

      {/* Finder window */}
      {(isFinderOpen && !isFinderMinimized) && (
        <MacOsChrome
          title="Finder"
          onClose={handleCloseFinder}
          onMinimize={handleMinimizeFinder}
          onMaximize={handleMaximizeFinder}
          isMaximized={isFinderMaximized}
          style={
            isFinderMaximized
              ? { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }
              : {
                  width: 'min(90vw, 850px)',
                  height: 'min(80dvh, 550px)',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                }
          }
        >
          <Finder 
            onOpenTerminal={handleRestore} 
            onOpenMusic={handleOpenMusic} 
            onOpenResume={handleOpenResume} 
            onOpenPortfolio={handleOpenPortfolio} 
          />
        </MacOsChrome>
      )}

      {/* Terminal window */}
      {(!isMinimized && !isClosed) && (
        <MacOsChrome
          title="animesh — zsh — 80×24"
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          isMaximized={isMaximized}
          style={
            isMaximized
              ? { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }
              : {
                  width: 'min(95vw, 900px)',
                  height: 'min(85dvh, 600px)',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }
          }
        >
          <XtermTerminal />
        </MacOsChrome>
      )}

      {/* Music window */}
      {(isMusicOpen && !isMusicMinimized) && (
        <MacOsChrome
          title="Apple Music"
          onClose={handleCloseMusic}
          onMinimize={handleMinimizeMusic}
          onMaximize={handleMaximizeMusic}
          isMaximized={isMusicMaximized}
          style={
            isMusicMaximized
              ? { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }
              : {
                  width: 'min(95vw, 1100px)',
                  height: 'min(85dvh, 700px)',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }
          }
        >
          <AppleMusic />
        </MacOsChrome>
      )}
    </div>
  )
}
