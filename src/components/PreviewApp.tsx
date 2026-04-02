'use client'

import React, { useEffect, useMemo, useState } from 'react'

type Props = {
  requestedUrl?: string
  navigationNonce?: number
}

const MIN_ZOOM = 50
const MAX_ZOOM = 200
const ZOOM_STEP = 10

function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom))
}

function buildPdfUrl(fileUrl: string, page: number, zoom: number): string {
  return `${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&page=${page}&zoom=${zoom}`
}

export default function PreviewApp({
  requestedUrl = '/resume.pdf',
  navigationNonce = 0,
}: Props) {
  const safeRequestedUrl = typeof requestedUrl === 'string' && requestedUrl ? requestedUrl : '/resume.pdf'
  const [zoom, setZoom] = useState(100)
  const [page, setPage] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    setZoom(100)
    setPage(1)
    setRotation(0)
  }, [navigationNonce, safeRequestedUrl])

  const pdfUrl = useMemo(() => buildPdfUrl(safeRequestedUrl, page, zoom), [page, safeRequestedUrl, zoom])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ebebeb', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 14px', background: '#f5f5f7', borderBottom: '1px solid #d1d1d6', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setShowSidebar((prev) => !prev)}
            title={showSidebar ? 'Hide sidebar' : 'Show sidebar'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#555' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="9" y1="4" x2="9" y2="20" />
            </svg>
          </button>
          <div style={{ fontSize: '13px', color: '#333', fontWeight: 600 }}>
            resume.pdf
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#e3e3e8', borderRadius: '8px', overflow: 'hidden' }}>
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              style={{ background: 'none', border: 'none', borderRight: '1px solid #d1d1d6', padding: '6px 10px', fontSize: '13px', color: '#555', cursor: 'pointer' }}
            >
              Prev
            </button>
            <input
              aria-label="Page number"
              type="number"
              min={1}
              value={page}
              onChange={(event) => setPage(Math.max(1, Number(event.target.value) || 1))}
              style={{ width: '54px', border: 'none', textAlign: 'center', fontSize: '12px', color: '#333', background: 'transparent', outline: 'none' }}
            />
            <button
              onClick={() => setPage((prev) => prev + 1)}
              style={{ background: 'none', border: 'none', borderLeft: '1px solid #d1d1d6', padding: '6px 10px', fontSize: '13px', color: '#555', cursor: 'pointer' }}
            >
              Next
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: '#e3e3e8', borderRadius: '8px', overflow: 'hidden' }}>
            <button
              onClick={() => setZoom((prev) => clampZoom(prev - ZOOM_STEP))}
              style={{ background: 'none', border: 'none', borderRight: '1px solid #d1d1d6', padding: '6px 12px', fontSize: '16px', color: '#555', cursor: 'pointer' }}
            >
              -
            </button>
            <button
              onClick={() => setZoom(100)}
              style={{ background: 'none', border: 'none', padding: '6px 12px', fontSize: '12px', color: '#333', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              {zoom}%
            </button>
            <button
              onClick={() => setZoom((prev) => clampZoom(prev + ZOOM_STEP))}
              style={{ background: 'none', border: 'none', borderLeft: '1px solid #d1d1d6', padding: '6px 12px', fontSize: '16px', color: '#555', cursor: 'pointer' }}
            >
              +
            </button>
          </div>

          <button
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            style={{ background: '#ffffff', border: '1px solid #d1d1d6', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: '#333', cursor: 'pointer' }}
          >
            Rotate
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => window.open(safeRequestedUrl, '_blank', 'noopener,noreferrer')}
            style={{ background: '#007aff', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 500, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
          >
            Open Original PDF
          </button>
          <a
            href={safeRequestedUrl}
            download
            style={{ background: '#fff', color: '#333', border: '1px solid #d1d1d6', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500, textDecoration: 'none' }}
          >
            Download
          </a>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {showSidebar && (
          <aside style={{ width: '220px', background: '#f5f5f7', borderRight: '1px solid #d1d1d6', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7d7d82', marginBottom: '8px' }}>Document</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#222' }}>resume.pdf</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Preview replica with working controls</div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #dbdbe0', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Viewing state</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#333' }}>
                <span>Page {page}</span>
                <span>Zoom {zoom}%</span>
                <span>Rotation {rotation}°</span>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #dbdbe0', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Quick actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => {
                    setPage(1)
                    setZoom(100)
                    setRotation(0)
                  }}
                  style={{ background: '#f6f6f8', border: '1px solid #dedee3', borderRadius: '8px', padding: '8px 10px', textAlign: 'left', fontSize: '12px', cursor: 'pointer', color: '#333' }}
                >
                  Reset View
                </button>
                <button
                  onClick={() => setZoom(140)}
                  style={{ background: '#f6f6f8', border: '1px solid #dedee3', borderRadius: '8px', padding: '8px 10px', textAlign: 'left', fontSize: '12px', cursor: 'pointer', color: '#333' }}
                >
                  Fit Better in Window
                </button>
              </div>
            </div>
          </aside>
        )}

        <div style={{ flex: 1, padding: '24px', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', background: 'linear-gradient(180deg, #ededf0 0%, #e1e1e6 100%)' }}>
          <div
            style={{
              width: '100%',
              maxWidth: rotation % 180 === 0 ? '850px' : '1100px',
              minHeight: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              transform: `rotate(${rotation}deg) scale(${rotation % 180 === 0 ? 1 : 0.82})`,
              transformOrigin: 'center top',
              transition: 'transform 0.2s ease',
            }}
          >
            <iframe
              key={`${pdfUrl}-${navigationNonce}`}
              src={pdfUrl}
              style={{ width: '100%', maxWidth: '850px', height: '100%', minHeight: '900px', background: '#fff', boxShadow: '0 18px 40px rgba(0,0,0,0.18)', border: 'none', borderRadius: '6px' }}
              title="Resume PDF"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
