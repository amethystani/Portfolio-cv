'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  requestedUrl?: string
  navigationNonce?: number
}

function normalizeSafariUrl(rawUrl: unknown): string {
  const value = String(rawUrl || '').trim()
  const normalizedDomainValue = value.replace(/^https?:\/\//, '').replace(/^www\./, '')

  if (!value) return '/portfolio'
  if (normalizedDomainValue === 'animeshmishra.us') return '/portfolio'
  if (normalizedDomainValue.startsWith('animeshmishra.us/')) {
    return normalizedDomainValue.slice('animeshmishra.us'.length)
  }
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  if (value === 'portfolio') return '/portfolio'
  if (value.startsWith('portfolio#') || value.startsWith('portfolio?')) return `/${value}`
  if (value.startsWith('#')) return `/portfolio${value}`
  if (value === '/') return '/portfolio'
  if (value.startsWith('/')) return value

  return `https://${value}`
}

function isInternalUrl(url: string): boolean {
  return url.startsWith('/')
}

function toDisplayUrl(url: string): string {
  if (isInternalUrl(url)) return `animeshmishra.us${url}`
  return url
}

function toFrameUrl(url: string): string {
  return isInternalUrl(url) ? url : '/portfolio'
}

export default function SafariApp({
  requestedUrl = '/portfolio',
  navigationNonce = 0,
}: Props) {
  const initialUrl = useMemo(() => normalizeSafariUrl(requestedUrl), [requestedUrl])
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const historyRef = useRef<string[]>([initialUrl])
  const historyIndexRef = useRef(0)
  const ignoreNextSyncRef = useRef<string | null>(null)
  const iframeListenerCleanupRef = useRef<(() => void) | null>(null)

  const [currentUrl, setCurrentUrl] = useState(initialUrl)
  const [addressValue, setAddressValue] = useState(toDisplayUrl(initialUrl))
  const [isLoading, setIsLoading] = useState(true)
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)

  const syncNavButtons = useCallback(() => {
    setCanGoBack(historyIndexRef.current > 0)
    setCanGoForward(historyIndexRef.current < historyRef.current.length - 1)
  }, [])

  const updateVisibleUrl = useCallback((nextUrl: string) => {
    setCurrentUrl(nextUrl)
    setAddressValue(toDisplayUrl(nextUrl))
    syncNavButtons()
  }, [syncNavButtons])

  const pushHistoryEntry = useCallback((nextUrl: string) => {
    const currentIndex = historyIndexRef.current
    const currentEntry = historyRef.current[currentIndex]

    if (currentEntry === nextUrl) {
      updateVisibleUrl(nextUrl)
      return
    }

    historyRef.current = [...historyRef.current.slice(0, currentIndex + 1), nextUrl]
    historyIndexRef.current = historyRef.current.length - 1
    updateVisibleUrl(nextUrl)
  }, [updateVisibleUrl])

  const navigateIframe = useCallback((nextUrl: string) => {
    const frame = iframeRef.current
    if (!frame) return

    const frameUrl = toFrameUrl(nextUrl)

    try {
      if (frame.contentWindow) frame.contentWindow.location.href = frameUrl
      else frame.src = frameUrl
    } catch {
      frame.src = frameUrl
    }
  }, [])

  const navigateTo = useCallback((rawUrl: string, historyMode: 'push' | 'jump' = 'push') => {
    const normalizedUrl = normalizeSafariUrl(rawUrl)

    if (!isInternalUrl(normalizedUrl)) {
      window.open(normalizedUrl, '_blank', 'noopener,noreferrer')
      return
    }

    setIsLoading(true)

    if (historyMode === 'push') pushHistoryEntry(normalizedUrl)
    else updateVisibleUrl(normalizedUrl)

    ignoreNextSyncRef.current = normalizedUrl
    navigateIframe(normalizedUrl)
  }, [navigateIframe, pushHistoryEntry, updateVisibleUrl])

  const syncFromIframe = useCallback(() => {
    const frameWindow = iframeRef.current?.contentWindow
    if (!frameWindow) return

    try {
      const nextUrl = `${frameWindow.location.pathname}${frameWindow.location.search}${frameWindow.location.hash}` || '/portfolio'

      if (ignoreNextSyncRef.current === nextUrl) {
        ignoreNextSyncRef.current = null
        updateVisibleUrl(nextUrl)
        setIsLoading(false)
        return
      }

      pushHistoryEntry(nextUrl)
      setIsLoading(false)
    } catch {
      setIsLoading(false)
    }
  }, [pushHistoryEntry, updateVisibleUrl])

  const attachIframeListeners = useCallback(() => {
    iframeListenerCleanupRef.current?.()

    const frameWindow = iframeRef.current?.contentWindow
    if (!frameWindow) return

    const handleLocationChange = () => {
      syncFromIframe()
    }

    frameWindow.addEventListener('hashchange', handleLocationChange)
    frameWindow.addEventListener('popstate', handleLocationChange)

    iframeListenerCleanupRef.current = () => {
      frameWindow.removeEventListener('hashchange', handleLocationChange)
      frameWindow.removeEventListener('popstate', handleLocationChange)
    }
  }, [syncFromIframe])

  useEffect(() => {
    syncNavButtons()

    return () => {
      iframeListenerCleanupRef.current?.()
    }
  }, [syncNavButtons])

  useEffect(() => {
    const nextUrl = normalizeSafariUrl(requestedUrl)

    if (navigationNonce === 0 && historyRef.current[0] === nextUrl) {
      updateVisibleUrl(nextUrl)
      return
    }

    navigateTo(nextUrl)
  }, [navigateTo, navigationNonce, requestedUrl, updateVisibleUrl])

  const goBack = useCallback(() => {
    if (historyIndexRef.current <= 0) return

    historyIndexRef.current -= 1
    const nextUrl = historyRef.current[historyIndexRef.current]
    setIsLoading(true)
    ignoreNextSyncRef.current = nextUrl
    updateVisibleUrl(nextUrl)
    navigateIframe(nextUrl)
  }, [navigateIframe, updateVisibleUrl])

  const goForward = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return

    historyIndexRef.current += 1
    const nextUrl = historyRef.current[historyIndexRef.current]
    setIsLoading(true)
    ignoreNextSyncRef.current = nextUrl
    updateVisibleUrl(nextUrl)
    navigateIframe(nextUrl)
  }, [navigateIframe, updateVisibleUrl])

  const reload = useCallback(() => {
    setIsLoading(true)

    try {
      iframeRef.current?.contentWindow?.location.reload()
    } catch {
      navigateIframe(currentUrl)
    }
  }, [currentUrl, navigateIframe])

  const openHome = useCallback(() => {
    navigateTo('/portfolio')
  }, [navigateTo])

  const openCurrentInNewTab = useCallback(() => {
    window.open(isInternalUrl(currentUrl) ? currentUrl : normalizeSafariUrl(currentUrl), '_blank', 'noopener,noreferrer')
  }, [currentUrl])

  return (
    <div className="safari-shell">
      <style>{`
        .safari-shell {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #ffffff;
          overflow: hidden;
        }
        .safari-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 12px;
          background: linear-gradient(180deg, #f7f7f8 0%, #efeff1 100%);
          border-bottom: 1px solid #d7d7db;
          flex-wrap: wrap;
        }
        .safari-toolbar-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .safari-control-cluster {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          padding: 3px;
          border-radius: 999px;
          background: #e5e5e8;
          border: 1px solid #d3d4d8;
        }
        .safari-control {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 999px;
          background: none;
          color: #495057;
          cursor: pointer;
        }
        .safari-control:disabled {
          color: #aeb6be;
          cursor: default;
        }
        .safari-address-form {
          flex: 1 1 420px;
          display: flex;
          justify-content: center;
          min-width: 0;
        }
        .safari-address-pill {
          width: min(100%, 720px);
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          min-height: 38px;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid #d4d7dc;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.85);
        }
        .safari-address-input {
          flex: 1;
          border: none;
          background: transparent;
          color: #2f353b;
          font-size: 13px;
          outline: none;
          min-width: 0;
        }
        .safari-status {
          font-size: 11px;
          color: #7c8791;
          white-space: nowrap;
        }
        .safari-action-button {
          border: 1px solid #d3d6dc;
          background: #ffffff;
          color: #2f353b;
          border-radius: 999px;
          cursor: pointer;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 500;
        }
        .safari-frame-area {
          flex: 1;
          min-height: 0;
          background: #ffffff;
        }
        .safari-frame {
          width: 100%;
          height: 100%;
          border: none;
          background: #ffffff;
        }
        .safari-mobile-bar {
          display: none;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 8px 12px calc(8px + env(safe-area-inset-bottom));
          background: rgba(247,247,248,0.98);
          border-top: 1px solid #d7d7db;
          backdrop-filter: blur(18px);
        }
        @media (max-width: 768px) {
          .safari-toolbar {
            padding: 8px 10px;
            gap: 8px;
          }
          .safari-toolbar-group--desktop {
            display: none;
          }
          .safari-address-form {
            flex-basis: 100%;
          }
          .safari-address-pill {
            min-height: 36px;
          }
          .safari-mobile-bar {
            display: flex;
          }
        }
      `}</style>

      <div className="safari-toolbar">
        <div className="safari-toolbar-group safari-toolbar-group--desktop">
          <div className="safari-control-cluster">
            <button className="safari-control" onClick={goBack} disabled={!canGoBack} title="Back">
              <svg width="12" height="16" viewBox="0 0 10 16" fill="none">
                <path d="M8.5 1L1.5 8L8.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="safari-control" onClick={goForward} disabled={!canGoForward} title="Forward">
              <svg width="12" height="16" viewBox="0 0 10 16" fill="none">
                <path d="M1.5 1L8.5 8L1.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="safari-control" onClick={reload} title="Reload">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-11.45l5.25 5.25" />
              </svg>
            </button>
            <button className="safari-control" onClick={openHome} title="Home">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11.5 12 4l9 7.5" />
                <path d="M5 10.5V20h14v-9.5" />
              </svg>
            </button>
          </div>
        </div>

        <form
          className="safari-address-form"
          onSubmit={(event) => {
            event.preventDefault()
            navigateTo(addressValue)
          }}
        >
          <div className="safari-address-pill">
            <svg width="11" height="13" viewBox="0 0 10 12" fill="none">
              <path d="M2.5 5V3.5C2.5 2.11929 3.61929 1 5 1C6.38071 1 7.5 2.11929 7.5 3.5V5M1.5 5H8.5C9.05228 5 9.5 5.44772 9.5 6V10.5C9.5 11.0523 9.05228 11.5 8.5 11.5H1.5C0.947715 11.5 0.5 11.0523 0.5 10.5V6C0.5 5.44772 0.947715 5 1.5 5Z" stroke="#7B8790" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              value={addressValue}
              onChange={(event) => setAddressValue(event.target.value)}
              aria-label="Address bar"
              spellCheck={false}
              className="safari-address-input"
            />
            <span className="safari-status">{isLoading ? 'Loading...' : 'Secure'}</span>
          </div>
        </form>

        <div className="safari-toolbar-group safari-toolbar-group--desktop">
          <button className="safari-action-button" onClick={openCurrentInNewTab}>
            Open in new tab
          </button>
        </div>
      </div>

      <div className="safari-frame-area">
        <iframe
          ref={iframeRef}
          src={toFrameUrl(currentUrl)}
          onLoad={() => {
            attachIframeListeners()
            syncFromIframe()
          }}
          className="safari-frame"
          title="Safari page"
        />
      </div>

      <div className="safari-mobile-bar">
        <button className="safari-control" onClick={goBack} disabled={!canGoBack} title="Back">
          <svg width="12" height="16" viewBox="0 0 10 16" fill="none">
            <path d="M8.5 1L1.5 8L8.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="safari-control" onClick={goForward} disabled={!canGoForward} title="Forward">
          <svg width="12" height="16" viewBox="0 0 10 16" fill="none">
            <path d="M1.5 1L8.5 8L1.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="safari-control" onClick={reload} title="Reload">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-11.45l5.25 5.25" />
          </svg>
        </button>
        <button className="safari-control" onClick={openHome} title="Home">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11.5 12 4l9 7.5" />
            <path d="M5 10.5V20h14v-9.5" />
          </svg>
        </button>
        <button className="safari-control" onClick={openCurrentInNewTab} title="Open">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7" />
            <path d="M8 7h9v9" />
          </svg>
        </button>
      </div>
    </div>
  )
}
