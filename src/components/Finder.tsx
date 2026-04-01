import React, { useState } from 'react';
import Image from 'next/image';

type FinderProps = {
  onOpenTerminal?: () => void;
  onOpenMusic?: () => void;
  onOpenResume?: () => void;
  onOpenPortfolio?: () => void;
};

export default function Finder({ onOpenTerminal, onOpenMusic, onOpenResume, onOpenPortfolio }: FinderProps) {
  const [activeTab, setActiveTab] = useState('Applications');

  const apps = [
    { name: 'Terminal', icon: '/terminal-2021-06-03.png.webp', action: onOpenTerminal },
    { name: 'Apple Music', icon: '/Apple_Music_Symbol_2.webp', action: onOpenMusic },
    { name: 'Safari', icon: '/safari-icon.svg', action: onOpenPortfolio },
  ];

  const docs = [
    { name: 'resume.pdf', icon: '/previewicon.png', action: onOpenResume },
  ];

  const sidebarItems = [
    { id: 'Recents', label: 'Recents', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { id: 'Applications', label: 'Applications', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
    { id: 'Desktop', label: 'Desktop', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
    { id: 'Documents', label: 'Documents', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
    { id: 'Downloads', label: 'Downloads', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> },
  ];

  const currentFiles = activeTab === 'Applications' ? apps : (activeTab === 'Documents' ? docs : []);

  return (
    <>
      <style>{`
        .finder-container {
          display: flex;
          width: 100%;
          height: 100%;
          background-color: #1E1E1E;
          color: #ECECEC;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          overflow: hidden;
        }
        .finder-sidebar {
          width: 200px;
          background-color: rgba(30,30,30,0.8);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255,255,255,0.1);
          display: flex;
          flex-direction: column;
          padding: 10px 0;
        }
        .finder-main {
          flex: 1;
          background-color: #1E1E1E;
          display: flex;
          flex-direction: column;
        }
        .finder-toolbar {
          height: 52px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          padding: 0 16px;
          justify-content: space-between;
        }
        @media (max-width: 600px) {
          .finder-sidebar {
            display: none !important;
          }
          .finder-toolbar {
            padding: 0 8px;
          }
        }
      `}</style>
      <div className="finder-container">
        {/* Sidebar */}
        <div className="finder-sidebar">
          <div style={{ padding: '0 12px 6px', fontSize: '11px', fontWeight: 600, color: '#999' }}>Favorites</div>
          {sidebarItems.map(item => (
            <div 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{ 
                padding: '6px 12px', 
                margin: '0 8px 2px',
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                fontSize: '13px',
                borderRadius: '6px',
                backgroundColor: activeTab === item.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <div style={{ color: activeTab === item.id ? '#FA586A' : '#0a84ff' }}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Main View */}
        <div className="finder-main">
          {/* Toolbar Area */}
          <div className="finder-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{activeTab}</span>
            </div>
            <div>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '6px',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                width: '120px'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.3-4.3"></path></svg>
                <span style={{ fontSize: '12px', color: '#999', marginLeft: '6px', display: 'flex' }}>Search</span>
              </div>
            </div>
          </div>

          {/* Files Grid */}
          <div style={{
            flex: 1,
            padding: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            alignContent: 'flex-start',
            overflowY: 'auto'
          }}>
            {currentFiles.length === 0 ? (
              <div style={{ width: '100%', textAlign: 'center', color: '#666', marginTop: '60px' }}>
                No files here.
              </div>
            ) : (
              currentFiles.map(file => (
                <div 
                  key={file.name}
                  onClick={() => {
                    if (file.action) file.action();
                  }}
                  style={{
                    width: '90px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: file.action ? 'pointer' : 'default',
                    opacity: file.action ? 1 : 0.5
                  }}
                >
                  <div style={{
                    width: '64px',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    padding: '8px'
                  }}>
                    <Image src={file.icon} width={48} height={48} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt={file.name} draggable={false} unoptimized />
                  </div>
                  <span style={{ fontSize: '12px', textAlign: 'center', wordBreak: 'break-word', lineHeight: '1.2' }}>{file.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
