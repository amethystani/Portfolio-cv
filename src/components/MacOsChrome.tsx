'use client'

import React from 'react'

type Props = {
  title?: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function MacOsChrome({
  title = 'Animesh \u2014 zsh \u2014 80\u00d724',
  children,
  className = '',
  style,
}: Props) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[10px] ${className}`}
      style={{
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.75), 0 0 0 0.5px rgba(255,255,255,0.08)',
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
        <div className="flex items-center gap-[8px] px-[10px] z-10">
          <div
            title="Close"
            className="rounded-full cursor-default"
            style={{ width: 12, height: 12, background: '#FF5F57', border: '0.5px solid rgba(0,0,0,0.3)' }}
          />
          <div
            title="Minimize"
            className="rounded-full cursor-default"
            style={{ width: 12, height: 12, background: '#FEBC2E', border: '0.5px solid rgba(0,0,0,0.3)' }}
          />
          <div
            title="Maximize"
            className="rounded-full cursor-default"
            style={{ width: 12, height: 12, background: '#28C840', border: '0.5px solid rgba(0,0,0,0.3)' }}
          />
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
