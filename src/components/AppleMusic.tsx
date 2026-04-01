import React, { useState, useRef, useEffect } from 'react';

export default function AppleMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      flex: 1, // take remaining height of MacOsChrome
      height: '100%',
      backgroundColor: '#1E1E1E',
      color: '#FFFFFF',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <audio ref={audioRef} src="/song.mp3" preload="auto" />

      {/* Sidebar */}
      <div style={{
        width: '260px',
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '0 8px 16px', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.3-4.3"></path></svg>
          <span style={{ fontSize: '13px' }}>Search</span>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <li style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FA586A' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Home</span>
          </li>
          <li style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/></svg>
            <span style={{ fontSize: '14px' }}>New</span>
          </li>
          <li style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12a4 4 0 018 0"/></svg>
            <span style={{ fontSize: '14px' }}>Radio</span>
          </li>
        </ul>

        {/* Library Section */}
        <div style={{ marginTop: '24px', padding: '0 8px', fontSize: '11px', color: '#999', fontWeight: 600 }}>Library</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {["Recently Added", "Artists", "Albums", "Songs", "Music Videos"].map((item) => (
            <li key={item} style={{ padding: '6px 8px', fontSize: '14px', opacity: 0.8, display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
              {item}
            </li>
          ))}
        </ul>

        {/* Playlists */}
        <div style={{ marginTop: '24px', padding: '0 8px', fontSize: '11px', color: '#999', fontWeight: 600 }}>Playlists</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            "Tame Impala Essentials",
            "The Slow Rush",
            "Currents",
            "Lonerism",
            "InnerSpeaker",
            "Live Versions"
          ].map((item) => (
            <li key={item} style={{ padding: '6px 8px', fontSize: '14px', opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        backgroundColor: '#1E1E1E',
        padding: '32px 40px',
        overflowY: 'auto',
        position: 'relative',
        paddingBottom: '120px' // Added padding to prevent cutting off the bottom for the floating bar
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 24px 0' }}>Home</h1>

        <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0', opacity: 0.9 }}>Top Picks for You</h2>
        
        {/* Horizontal Cards Area */}
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
          {/* Card 1: JACKBOYS 2 */}
          <div style={{
            minWidth: '240px',
            height: '280px',
            background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
            borderRadius: '12px',
            padding: '20px',
            position: 'relative',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Listen Again</span>
            <span style={{ fontSize: '16px', fontWeight: 700 }}>JACKBOYS 2 🅴</span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>JACKBOYS, Travis Scott</span>
          </div>

          {/* Card 2: Discovery Station */}
          <div style={{
            minWidth: '240px',
            height: '280px',
            background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 50%, #10B981 100%)',
            borderRadius: '12px',
            padding: '20px',
            position: 'relative',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}>
            <div style={{ position: 'absolute', top: 16, right: 16 }}>
              <span style={{ fontWeight: 700, fontSize: '12px' }}>Music</span>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Made for You</span>
            <span style={{ fontSize: '16px', fontWeight: 700 }}>Discovery Station</span>
          </div>

          {/* Card 3: LINKIN PARK */}
          <div style={{
            minWidth: '240px',
            height: '280px',
            backgroundColor: '#506354',
            borderRadius: '12px',
            padding: '20px',
            position: 'relative',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}>
            <div style={{ position: 'absolute', top: 16, right: 16 }}>
              <span style={{ fontWeight: 700, fontSize: '12px' }}>Music</span>
            </div>
             {/* Collage mock */}
             <div style={{ position: 'absolute', width: '100%', height: '100%', top:0, left:0, overflow:'hidden', borderRadius:'12px', opacity: 0.3 }}>
               <div style={{ position:'absolute', top: '10%', left: '10%', width:'80px', height:'80px', borderRadius:'50%', background:'#333' }}></div>
               <div style={{ position:'absolute', top: '40%', right: '10%', width:'60px', height:'60px', borderRadius:'50%', background:'#222' }}></div>
             </div>

             <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', position: 'relative' }}>Featuring LINKIN PARK</span>
             <span style={{ fontSize: '16px', fontWeight: 700, position: 'relative' }}>LINKIN PARK & Similar Artists</span>
          </div>
        </div>

        <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '20px 0 16px 0', opacity: 0.9 }}>Recently Played</h2>
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
          {Array(4).fill(0).map((_, i) => (
             <div key={i} style={{ width: '160px', height: '160px', backgroundColor: '#333', borderRadius: '8px', flexShrink: 0, backgroundImage: 'url(/previewicon.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.5 }}></div>
          ))}
        </div>
      </div>

      {/* Floating Playback Bar */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: 'calc(260px + (100% - 260px) / 2)',
        transform: 'translateX(-50%)',
        width: 'min(90%, 640px)',
        height: '60px',
        background: 'rgba(45, 45, 45, 0.7)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        zIndex: 100,
      }}>
        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#FFF' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 20L9 12l10-8v16zM5 19h2V5H5v14z"/></svg>
          <button 
            onClick={togglePlay} 
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', padding: 0 }}
          >
            {isPlaying ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5 4l10 8-10 8V4zM19 5h-2v14h2V5z"/></svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
        </div>

        {/* Song Info */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', overflow: 'hidden' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#888', borderRadius: '4px', flexShrink: 0, marginRight: '12px' }}>
            <img src="/Apple_Music_Symbol_2.webp" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', filter: 'brightness(0.8)' }} alt="Album Art" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden' }}>
              Tame Impala - Borderline (Official Audio)
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              tameimpalaVEVO — Tame Impala - Borderline
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#FFF', opacity: 0.8 }}>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#FA586A' }}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
        </div>
      </div>
    </div>
  );
}
