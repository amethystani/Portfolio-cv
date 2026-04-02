'use client'

import React, { useState } from 'react'

type Props = {
  title?: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onMouseDown?: () => void
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
  isMaximized?: boolean
}

export default function MacOsChrome({
  title = 'Animesh \u2014 zsh \u2014 80\u00d724',
  children,
  className = '',
  style,
  onMouseDown,
  onClose,
  onMinimize,
  onMaximize,
  isMaximized = false,
}: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`flex flex-col overflow-hidden ${isMaximized ? '' : 'rounded-[10px]'} ${className}`}
      onMouseDown={onMouseDown}
      style={{
        boxShadow: isMaximized ? 'none' : '0 20px 60px rgba(0, 0, 0, 0.75), 0 0 0 0.5px rgba(255,255,255,0.08)',
        background: '#1E1E1E',
        ...style,
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center relative select-none"
        style={{
          background: 'linear-gradient(to bottom, #424242, #363636)',
          height: '28px',
          borderBottom: '1px solid #1a1a1a',
          flexShrink: 0,
        }}
      >
        {/* Traffic light buttons */}
        <div
          className="flex items-center gap-[8px] px-[10px] z-10"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Close (Red) */}
          <div
            title="Close"
            role="button"
            tabIndex={0}
            onClick={onClose}
            className="rounded-full cursor-pointer relative flex items-center justify-center"
            style={{ width: 12, height: 12, background: '#FF5F57', border: '0.5px solid rgba(0,0,0,0.3)' }}
          >
            {hovered && (
              <svg width="6" height="6" viewBox="0 0 6 6" fill="none" style={{ position: 'absolute' }}>
                <line x1="0.5" y1="0.5" x2="5.5" y2="5.5" stroke="#4D0000" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="5.5" y1="0.5" x2="0.5" y2="5.5" stroke="#4D0000" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
            )}
          </div>
          {/* Minimize (Yellow) */}
          <div
            title="Minimize"
            role="button"
            tabIndex={0}
            onClick={onMinimize}
            className="rounded-full cursor-pointer relative flex items-center justify-center"
            style={{ width: 12, height: 12, background: '#FEBC2E', border: '0.5px solid rgba(0,0,0,0.3)' }}
          >
            {hovered && (
              <svg width="6" height="1" viewBox="0 0 6 1" fill="none" style={{ position: 'absolute' }}>
                <line x1="0.5" y1="0.5" x2="5.5" y2="0.5" stroke="#985600" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            )}
          </div>
          {/* Maximize (Green) */}
          <div
            title={isMaximized ? "Restore" : "Maximize"}
            role="button"
            tabIndex={0}
            onClick={onMaximize}
            className="rounded-full cursor-pointer relative flex items-center justify-center"
            style={{ width: 12, height: 12, background: '#28C840', border: '0.5px solid rgba(0,0,0,0.3)' }}
          >
            {hovered && (
              <svg width="6" height="6" viewBox="0 0 8 8" fill="none" style={{ position: 'absolute' }}>
                {isMaximized ? (
                  <>
                    <polyline points="2,6 2,2 6,2" fill="none" stroke="#006500" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="6,2 6,6 2,6" fill="none" stroke="#006500" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                ) : (
                  <>
                    <polyline points="1,5 1,1 5,1" fill="none" stroke="#006500" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="7,3 7,7 3,7" fill="none" stroke="#006500" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                )}
              </svg>
            )}
          </div>
        </div>

        {/* Centered title */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            fontFamily: '-apple-system, "Helvetica Neue", Arial, sans-serif',
            fontSize: '13px',
            fontWeight: 400,
            color: '#9a9a9a',
            letterSpacing: '0.01em',
          }}
        >
          {title}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col min-h-0">
        {children}
      </div>
    </div>
  )
}
