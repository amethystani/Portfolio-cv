'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  requestedUrl?: string
  navigationNonce?: number
}

const MIN_ZOOM = 50
const MAX_ZOOM = 200
const ZOOM_STEP = 10
const BASE_PAGE_WIDTH = 816
const BASE_PAGE_HEIGHT = 1056

function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom))
}

function buildPdfUrl(fileUrl: string, page: number): string {
  return `${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&page=${page}`
}

export default function PreviewApp({
  requestedUrl = '/resume.pdf',
  navigationNonce = 0,
}: Props) {
  const safeRequestedUrl = typeof requestedUrl === 'string' && requestedUrl ? requestedUrl : '/resume.pdf'
  const stageRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(100)
  const [page, setPage] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    setZoom(100)
    setPage(1)
    setRotation(0)
  }, [navigationNonce, safeRequestedUrl])

  useEffect(() => {
    const syncLayoutMode = () => {
      setShowSidebar(window.innerWidth >= 960)
    }

    syncLayoutMode()
    window.addEventListener('resize', syncLayoutMode)

    return () => {
      window.removeEventListener('resize', syncLayoutMode)
    }
  }, [])

  const pdfUrl = useMemo(() => buildPdfUrl(safeRequestedUrl, page), [page, safeRequestedUrl])

  const scale = zoom / 100
  const scaledWidth = BASE_PAGE_WIDTH * scale
  const scaledHeight = BASE_PAGE_HEIGHT * scale
  const quarterTurn = rotation % 180 !== 0
  const canvasWidth = quarterTurn ? scaledHeight : scaledWidth
  const canvasHeight = quarterTurn ? scaledWidth : scaledHeight

  const fitToWindow = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return

    const availableWidth = Math.max(240, stage.clientWidth - 32)
    const availableHeight = Math.max(280, stage.clientHeight - 32)
    const fitWidth = availableWidth / (quarterTurn ? BASE_PAGE_HEIGHT : BASE_PAGE_WIDTH)
    const fitHeight = availableHeight / (quarterTurn ? BASE_PAGE_WIDTH : BASE_PAGE_HEIGHT)
    setZoom(clampZoom(Math.floor(Math.min(fitWidth, fitHeight) * 100)))
  }, [quarterTurn])

  return (
    <div className="preview-shell">
      <style>{`
        .preview-shell {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #ebecef;
          color: #20242a;
          overflow: hidden;
        }
        .preview-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 8px 14px;
          background: linear-gradient(180deg, #f7f7f9 0%, #ededf1 100%);
          border-bottom: 1px solid #d2d6dc;
          flex-wrap: wrap;
        }
        .preview-toolbar-start,
        .preview-toolbar-center,
        .preview-toolbar-end {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .preview-filename {
          font-size: 13px;
          font-weight: 600;
          color: #30363c;
        }
        .preview-group {
          display: inline-flex;
          align-items: center;
          border-radius: 10px;
          background: #e3e5ea;
          border: 1px solid #d0d4da;
          overflow: hidden;
        }
        .preview-button {
          border: none;
          background: none;
          color: #49535c;
          cursor: pointer;
          padding: 7px 10px;
          font-size: 12px;
          line-height: 1;
        }
        .preview-button:disabled {
          color: #9aa4ad;
          cursor: default;
        }
        .preview-button + .preview-button,
        .preview-page-input + .preview-button,
        .preview-button + .preview-page-input {
          border-left: 1px solid #d0d4da;
        }
        .preview-page-input {
          width: 54px;
          border: none;
          background: transparent;
          text-align: center;
          font-size: 12px;
          color: #2d3339;
          outline: none;
          padding: 7px 0;
        }
        .preview-pill-button {
          border: 1px solid #d0d4da;
          background: #ffffff;
          color: #313840;
          border-radius: 10px;
          cursor: pointer;
          padding: 7px 11px;
          font-size: 12px;
          font-weight: 500;
        }
        .preview-primary {
          background: #0a84ff;
          color: #ffffff;
          border-color: #0a84ff;
        }
        .preview-body {
          flex: 1;
          min-height: 0;
          display: flex;
        }
        .preview-sidebar {
          width: 220px;
          flex: 0 0 220px;
          background: #f6f7f9;
          border-right: 1px solid #d5d9df;
          padding: 18px 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .preview-sidebar-card {
          background: #ffffff;
          border: 1px solid #dde2e7;
          border-radius: 14px;
          padding: 13px;
        }
        .preview-sidebar-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #7a8590;
          margin-bottom: 8px;
        }
        .preview-sidebar-text {
          font-size: 13px;
          color: #2f363d;
          line-height: 1.65;
        }
        .preview-stage {
          flex: 1;
          min-width: 0;
          min-height: 0;
          overflow: auto;
          background: linear-gradient(180deg, #eceef2 0%, #dfe3e9 100%);
          padding: 16px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        .preview-canvas {
          position: relative;
          flex: 0 0 auto;
          margin: auto;
        }
        .preview-page-shell {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: center center;
          transition: transform 0.2s ease;
        }
        .preview-page-frame {
          width: 100%;
          height: 100%;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 18px 42px rgba(16, 24, 40, 0.18);
          overflow: hidden;
        }
        .preview-iframe {
          width: 100%;
          height: 100%;
          border: none;
          background: #ffffff;
        }
        @media (max-width: 900px) {
          .preview-toolbar {
            padding: 8px 10px;
          }
          .preview-toolbar-start,
          .preview-toolbar-center,
          .preview-toolbar-end {
            width: 100%;
            justify-content: flex-start;
          }
        }
        @media (max-width: 768px) {
          .preview-toolbar {
            gap: 8px;
          }
          .preview-filename {
            font-size: 12px;
          }
          .preview-button,
          .preview-page-input,
          .preview-pill-button {
            font-size: 11px;
          }
          .preview-stage {
            padding: 10px;
          }
        }
      `}</style>

      <div className="preview-toolbar">
        <div className="preview-toolbar-start">
          <button
            className="preview-pill-button"
            onClick={() => setShowSidebar((prev) => !prev)}
            title={showSidebar ? 'Hide sidebar' : 'Show sidebar'}
          >
            {showSidebar ? 'Sidebar On' : 'Sidebar Off'}
          </button>
          <div className="preview-filename">resume.pdf</div>
        </div>

        <div className="preview-toolbar-center">
          <div className="preview-group">
            <button
              className="preview-button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Prev
            </button>
            <input
              aria-label="Page number"
              className="preview-page-input"
              type="number"
              min={1}
              value={page}
              onChange={(event) => setPage(Math.max(1, Number(event.target.value) || 1))}
            />
            <button
              className="preview-button"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>

          <div className="preview-group">
            <button
              className="preview-button"
              onClick={() => setZoom((prev) => clampZoom(prev - ZOOM_STEP))}
              disabled={zoom <= MIN_ZOOM}
            >
              -
            </button>
            <button
              className="preview-button"
              onClick={() => setZoom(100)}
            >
              {zoom}%
            </button>
            <button
              className="preview-button"
              onClick={() => setZoom((prev) => clampZoom(prev + ZOOM_STEP))}
              disabled={zoom >= MAX_ZOOM}
            >
              +
            </button>
          </div>

          <button
            className="preview-pill-button"
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
          >
            Rotate
          </button>

          <button
            className="preview-pill-button"
            onClick={fitToWindow}
          >
            Fit
          </button>
        </div>

        <div className="preview-toolbar-end">
          <button
            className="preview-pill-button preview-primary"
            onClick={() => window.open(safeRequestedUrl, '_blank', 'noopener,noreferrer')}
          >
            Open PDF
          </button>
          <a
            href={safeRequestedUrl}
            download
            className="preview-pill-button"
            style={{ textDecoration: 'none' }}
          >
            Download
          </a>
        </div>
      </div>

      <div className="preview-body">
        {showSidebar ? (
          <aside className="preview-sidebar">
            <div className="preview-sidebar-card">
              <div className="preview-sidebar-label">Document</div>
              <div className="preview-sidebar-text">resume.pdf</div>
            </div>

            <div className="preview-sidebar-card">
              <div className="preview-sidebar-label">Viewing State</div>
              <div className="preview-sidebar-text">
                Page {page}
                <br />
                Zoom {zoom}%
                <br />
                Rotation {rotation}deg
              </div>
            </div>

            <div className="preview-sidebar-card">
              <div className="preview-sidebar-label">Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  className="preview-pill-button"
                  onClick={() => {
                    setPage(1)
                    setZoom(100)
                    setRotation(0)
                  }}
                >
                  Reset View
                </button>
                <button
                  className="preview-pill-button"
                  onClick={fitToWindow}
                >
                  Fit to Window
                </button>
              </div>
            </div>
          </aside>
        ) : null}

        <div ref={stageRef} className="preview-stage">
          <div
            className="preview-canvas"
            style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
          >
            <div
              className="preview-page-shell"
              style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              }}
            >
              <div className="preview-page-frame">
                <iframe
                  key={`${pdfUrl}-${navigationNonce}`}
                  src={pdfUrl}
                  className="preview-iframe"
                  title="Resume PDF"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
