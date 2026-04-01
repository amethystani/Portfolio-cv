'use client'

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

export default function TerminalPage() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#2C2C2C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        boxSizing: 'border-box',
      }}
    >
      <MacOsChrome
        title="Animesh \u2014 zsh \u2014 80\u00d724"
        style={{
          width: '100%',
          maxWidth: '900px',
          height: '100%',
          maxHeight: '600px',
        }}
      >
        <XtermTerminal />
      </MacOsChrome>
    </div>
  )
}
