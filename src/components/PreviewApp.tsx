import React from 'react';

export default function PreviewApp() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ebebeb', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
      {/* Preview Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', background: '#f5f5f7', borderBottom: '1px solid #d1d1d6', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#555' }}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
          </svg>
          <div style={{ fontSize: '13px', color: '#333', fontWeight: 500 }}>
            resume.pdf
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', background: '#e3e3e8', borderRadius: '6px', overflow: 'hidden' }}>
            <button style={{ background: 'none', border: 'none', borderRight: '1px solid #d1d1d6', padding: '4px 12px', fontSize: '16px', color: '#555', cursor: 'pointer' }}>-</button>
            <div style={{ padding: '4px 12px', fontSize: '12px', color: '#333', display: 'flex', alignItems: 'center' }}>100%</div>
            <button style={{ background: 'none', border: 'none', borderLeft: '1px solid #d1d1d6', padding: '4px 12px', fontSize: '16px', color: '#555', cursor: 'pointer' }}>+</button>
          </div>
          <button 
            onClick={() => window.open('/resume.pdf', '_blank')} 
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
            Open Original PDF
          </button>
        </div>
      </div>
      {/* PDF Content Area */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
        <iframe 
          src="/resume.pdf#toolbar=0&navpanes=0&scrollbar=0" 
          style={{ width: '100%', maxWidth: '850px', height: '100%', minHeight: '800px', background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', border: 'none', borderRadius: '4px' }} 
          title="Resume PDF" 
        />
      </div>
    </div>
  );
}
