'use client'

import { useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import MacOsChrome from './MacOsChrome'
import AppleMusic from './AppleMusic'
import Finder from './Finder'
import SafariApp from './SafariApp'
import PreviewApp from './PreviewApp'

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
      onClick={() => onClick()}
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
      onClick={() => onClick()}
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
      onClick={() => onClick()}
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
function PreviewDockIcon({ onClick, isActive }: { onClick: () => void, isActive?: boolean }) {
  return (
    <button
      onClick={() => onClick()}
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
      <div className="dock-dot" style={{ opacity: isActive ? 1 : 0 }} />
    </button>
  )
}

// macOS Safari dock icon
function SafariDockIcon({ onClick, isActive }: { onClick: () => void, isActive?: boolean }) {
  return (
    <button
      onClick={() => onClick()}
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
      <div className="dock-dot" style={{ opacity: isActive ? 1 : 0 }} />
    </button>
  )
}

type WindowKey = 'terminal' | 'music' | 'finder' | 'safari' | 'preview'

type AppLaunchRequest = {
  app: WindowKey
  url?: string
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

  const [isSafariOpen, setIsSafariOpen] = useState(false)
  const [isSafariMinimized, setIsSafariMinimized] = useState(false)
  const [isSafariMaximized, setIsSafariMaximized] = useState(false)

  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isPreviewMinimized, setIsPreviewMinimized] = useState(false)
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(false)

  const [windowZ, setWindowZ] = useState<Record<WindowKey, number>>({
    terminal: 4,
    music: 5,
    finder: 1,
    safari: 2,
    preview: 3,
  })
  const [safariRequest, setSafariRequest] = useState({ url: '/portfolio', nonce: 0 })
  const [previewRequest, setPreviewRequest] = useState({ url: '/resume.pdf', nonce: 0 })
  const nextZRef = useRef(6)

  const bringToFront = useCallback((windowKey: WindowKey) => {
    setWindowZ((prev) => {
      const next = nextZRef.current++
      if (prev[windowKey] === next) return prev
      return { ...prev, [windowKey]: next }
    })
  }, [])

  const getWindowStyle = useCallback(
    (windowKey: WindowKey, isWindowMaximized: boolean, width: string, height: string) => (
      isWindowMaximized
        ? { width: '100%', height: '100%', position: 'absolute' as const, top: 0, left: 0, zIndex: windowZ[windowKey] }
        : {
            width,
            height,
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            zIndex: windowZ[windowKey],
          }
    ),
    [windowZ]
  )

  const handleClose = useCallback(() => {
    setIsClosed(true)
  }, [])

  const handleMinimize = useCallback(() => {
    setIsMinimized(true)
  }, [])

  const handleRestore = useCallback(() => {
    setIsClosed(false)
    setIsMinimized(false)
    bringToFront('terminal')
  }, [bringToFront])

  const handleMaximize = useCallback(() => {
    setIsMaximized(prev => !prev)
    bringToFront('terminal')
  }, [bringToFront])

  const handleOpenMusic = useCallback(() => {
    setIsMusicOpen(true)
    setIsMusicMinimized(false)
    bringToFront('music')
  }, [bringToFront])
  const handleCloseMusic = useCallback(() => setIsMusicOpen(false), [])
  const handleMinimizeMusic = useCallback(() => setIsMusicMinimized(true), [])
  const handleMaximizeMusic = useCallback(() => {
    setIsMusicMaximized(prev => !prev)
    bringToFront('music')
  }, [bringToFront])

  const handleOpenFinder = useCallback(() => {
    setIsFinderOpen(true)
    setIsFinderMinimized(false)
    bringToFront('finder')
  }, [bringToFront])
  const handleCloseFinder = useCallback(() => setIsFinderOpen(false), [])
  const handleMinimizeFinder = useCallback(() => setIsFinderMinimized(true), [])
  const handleMaximizeFinder = useCallback(() => {
    setIsFinderMaximized(prev => !prev)
    bringToFront('finder')
  }, [bringToFront])

  const handleOpenSafari = useCallback((url?: string) => {
    setIsSafariOpen(true)
    setIsSafariMinimized(false)
    setSafariRequest(prev => ({ url: typeof url === 'string' && url ? url : '/portfolio', nonce: prev.nonce + 1 }))
    bringToFront('safari')
  }, [bringToFront])
  const handleCloseSafari = useCallback(() => setIsSafariOpen(false), [])
  const handleMinimizeSafari = useCallback(() => setIsSafariMinimized(true), [])
  const handleMaximizeSafari = useCallback(() => {
    setIsSafariMaximized(prev => !prev)
    bringToFront('safari')
  }, [bringToFront])

  const handleOpenPreview = useCallback((url?: string) => {
    setIsPreviewOpen(true)
    setIsPreviewMinimized(false)
    setPreviewRequest(prev => ({ url: typeof url === 'string' && url ? url : '/resume.pdf', nonce: prev.nonce + 1 }))
    bringToFront('preview')
  }, [bringToFront])
  const handleClosePreview = useCallback(() => setIsPreviewOpen(false), [])
  const handleMinimizePreview = useCallback(() => setIsPreviewMinimized(true), [])
  const handleMaximizePreview = useCallback(() => {
    setIsPreviewMaximized(prev => !prev)
    bringToFront('preview')
  }, [bringToFront])

  const handleTerminalOpenApp = useCallback((request: AppLaunchRequest) => {
    switch (request.app) {
      case 'terminal':
        handleRestore()
        break
      case 'music':
        handleOpenMusic()
        break
      case 'finder':
        handleOpenFinder()
        break
      case 'safari':
        handleOpenSafari(request.url)
        break
      case 'preview':
        handleOpenPreview(request.url)
        break
    }
  }, [handleOpenFinder, handleOpenMusic, handleOpenPreview, handleOpenSafari, handleRestore])

  const showDock = true

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
        justifyContent: 'center',
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

      {/* Dock bar */}
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
            zIndex: 1000,
          }}
        >
          <div className="mac-dock-container">
            <FinderDockIcon onClick={handleOpenFinder} isActive={isFinderOpen} />
            <TerminalDockIcon onClick={handleRestore} isActive={!isClosed} />
            <AppleMusicDockIcon onClick={handleOpenMusic} isActive={isMusicOpen} />
            <SafariDockIcon onClick={handleOpenSafari} isActive={isSafariOpen} />
            <PreviewDockIcon onClick={handleOpenPreview} isActive={isPreviewOpen} />
          </div>
        </div>
      )}

      {/* Finder window */}
      {(isFinderOpen && !isFinderMinimized) && (
        <MacOsChrome
          title="Finder"
          onMouseDown={() => bringToFront('finder')}
          onClose={handleCloseFinder}
          onMinimize={handleMinimizeFinder}
          onMaximize={handleMaximizeFinder}
          isMaximized={isFinderMaximized}
          style={getWindowStyle('finder', isFinderMaximized, 'min(90vw, 850px)', 'min(80dvh, 550px)')}
        >
          <Finder 
            onOpenTerminal={handleRestore} 
            onOpenMusic={handleOpenMusic} 
            onOpenResume={handleOpenPreview} 
            onOpenPortfolio={handleOpenSafari} 
          />
        </MacOsChrome>
      )}

      {/* Safari window */}
      {(isSafariOpen && !isSafariMinimized) && (
        <MacOsChrome
          title="Safari"
          onMouseDown={() => bringToFront('safari')}
          onClose={handleCloseSafari}
          onMinimize={handleMinimizeSafari}
          onMaximize={handleMaximizeSafari}
          isMaximized={isSafariMaximized}
          style={getWindowStyle('safari', isSafariMaximized, 'min(95vw, 1000px)', 'min(85dvh, 700px)')}
        >
          <SafariApp requestedUrl={safariRequest.url} navigationNonce={safariRequest.nonce} />
        </MacOsChrome>
      )}

      {/* Preview window */}
      {(isPreviewOpen && !isPreviewMinimized) && (
        <MacOsChrome
          title="Preview"
          onMouseDown={() => bringToFront('preview')}
          onClose={handleClosePreview}
          onMinimize={handleMinimizePreview}
          onMaximize={handleMaximizePreview}
          isMaximized={isPreviewMaximized}
          style={getWindowStyle('preview', isPreviewMaximized, 'min(90vw, 850px)', 'min(85dvh, 750px)')}
        >
          <PreviewApp requestedUrl={previewRequest.url} navigationNonce={previewRequest.nonce} />
        </MacOsChrome>
      )}

      {/* Terminal window */}
      {(!isMinimized && !isClosed) && (
        <MacOsChrome
          title="animesh — zsh — 80×24"
          onMouseDown={() => bringToFront('terminal')}
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          isMaximized={isMaximized}
          style={getWindowStyle('terminal', isMaximized, 'min(95vw, 900px)', 'min(85dvh, 600px)')}
        >
          <XtermTerminal onOpenApp={handleTerminalOpenApp} />
        </MacOsChrome>
      )}

      {/* Music window */}
      {(isMusicOpen && !isMusicMinimized) && (
        <MacOsChrome
          title="Apple Music"
          onMouseDown={() => bringToFront('music')}
          onClose={handleCloseMusic}
          onMinimize={handleMinimizeMusic}
          onMaximize={handleMaximizeMusic}
          isMaximized={isMusicMaximized}
          style={getWindowStyle('music', isMusicMaximized, 'min(95vw, 1100px)', 'min(85dvh, 700px)')}
        >
          <AppleMusic />
        </MacOsChrome>
      )}
    </div>
  )
}
