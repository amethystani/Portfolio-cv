import React from 'react';

export default function SafariApp() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
      {/* Safari Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', background: '#f6f6f6', borderBottom: '1px solid #ddd', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {/* Back/Forward Arrows */}
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer', opacity: 0.3 }}>
            <path d="M8.5 1L1.5 8L8.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer', opacity: 0.3 }}>
            <path d="M1.5 1L8.5 8L1.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: '#e5e5e5', borderRadius: '6px', padding: '6px 12px', width: '60%', textAlign: 'center', fontSize: '13px', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 5V3.5C2.5 2.11929 3.61929 1 5 1C6.38071 1 7.5 2.11929 7.5 3.5V5M1.5 5H8.5C9.05228 5 9.5 5.44772 9.5 6V10.5C9.5 11.0523 9.05228 11.5 8.5 11.5H1.5C0.947715 11.5 0.5 11.0523 0.5 10.5V6C0.5 5.44772 0.947715 5 1.5 5Z" stroke="#888" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            animeshmishra.us/portfolio
          </div>
        </div>
        <div>
          <button 
            onClick={() => window.open('/portfolio', '_blank')} 
            style={{ 
              background: '#007aff', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '6px', 
              padding: '4px 12px', 
              fontSize: '12px', 
              cursor: 'pointer',
              fontWeight: 500,
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            Open in new tab
          </button>
        </div>
      </div>
      {/* Browser Content */}
      <div style={{ flex: 1, overflow: 'hidden', backgroundColor: '#fff' }}>
        <iframe src="/portfolio" style={{ width: '100%', height: '100%', border: 'none' }} title="Portfolio" />
      </div>
    </div>
  );
}
