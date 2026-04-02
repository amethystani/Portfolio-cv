'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  requestedUrl?: string
  navigationNonce?: number
}

function normalizeSafariUrl(rawUrl: any): string {
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
      if (frame.contentWindow) {
        frame.contentWindow.location.href = frameUrl
      } else {
        frame.src = frameUrl
      }
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

    if (historyMode === 'push') {
      pushHistoryEntry(normalizedUrl)
    } else {
      updateVisibleUrl(normalizedUrl)
    }

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 14px', background: '#f6f6f6', borderBottom: '1px solid #ddd', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={goBack}
            disabled={!canGoBack}
            title="Go Back"
            style={{ background: 'none', border: 'none', cursor: canGoBack ? 'pointer' : 'default', padding: '6px', color: canGoBack ? '#555' : '#b8b8b8' }}
          >
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 1L1.5 8L8.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={goForward}
            disabled={!canGoForward}
            title="Go Forward"
            style={{ background: 'none', border: 'none', cursor: canGoForward ? 'pointer' : 'default', padding: '6px', color: canGoForward ? '#555' : '#b8b8b8' }}
          >
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 1L8.5 8L1.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={reload}
            title="Reload page"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#666' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-11.45l5.25 5.25" />
            </svg>
          </button>
          <button
            onClick={openHome}
            title="Home"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#666' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11.5 12 4l9 7.5" />
              <path d="M5 10.5V20h14v-9.5" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            navigateTo(addressValue)
          }}
          style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
        >
          <div style={{ background: '#e9e9eb', borderRadius: '8px', padding: '0 12px', width: 'min(100%, 620px)', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #d4d4d8' }}>
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 5V3.5C2.5 2.11929 3.61929 1 5 1C6.38071 1 7.5 2.11929 7.5 3.5V5M1.5 5H8.5C9.05228 5 9.5 5.44772 9.5 6V10.5C9.5 11.0523 9.05228 11.5 8.5 11.5H1.5C0.947715 11.5 0.5 11.0523 0.5 10.5V6C0.5 5.44772 0.947715 5 1.5 5Z" stroke="#888" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              value={addressValue}
              onChange={(event) => setAddressValue(event.target.value)}
              aria-label="Address bar"
              spellCheck={false}
              style={{ flex: 1, border: 'none', background: 'transparent', color: '#333', fontSize: '13px', padding: '8px 0', outline: 'none' }}
            />
            {isLoading && (
              <div style={{ fontSize: '11px', color: '#888', whiteSpace: 'nowrap' }}>
                Loading...
              </div>
            )}
          </div>
        </form>

        <div>
          <button
            onClick={openCurrentInNewTab}
            style={{ background: '#007aff', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 500, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
          >
            Open in new tab
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', backgroundColor: '#fff' }}>
        <iframe
          ref={iframeRef}
          src={toFrameUrl(currentUrl)}
          onLoad={() => {
            attachIframeListeners()
            syncFromIframe()
          }}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Portfolio"
        />
      </div>
    </div>
  )
}
