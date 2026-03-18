import { Link } from 'react-router-dom'

const features = [
  {
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
    title: 'Silence Remover',
    desc: 'Auto-detect and strip awkward pauses, long silences, and dead air from any video.',
  },
  {
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Auto Captions',
    desc: 'Whisper-powered transcription burns subtitles directly into your video file.',
  },
  {
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.1)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    title: 'Object Blur',
    desc: 'YOLOv8 detects and blurs faces, license plates, cars, and any named object.',
  },
  {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      </svg>
    ),
    title: 'Word Censorship',
    desc: 'Detect specific spoken words and replace them with a crisp beep tone automatically.',
  },
  {
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    ),
    title: 'Background Music',
    desc: 'Emotion-aware music selection that matches the mood and tone of your video.',
  },
  {
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.1)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
      </svg>
    ),
    title: 'Chapter Generator',
    desc: 'Auto-generate YouTube-style timestamps and chapter titles from your content.',
  },
]

const prompts = [
  'Remove all silences',
  'Add captions',
  'Blur all faces',
  'Speed up 1.5x',
  'Censor the word damn',
  'Generate chapters',
  'Add calm music',
]

export default function Home() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '96px 0 80px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          <span className="tag">✦ AI-Powered Video Editing</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(42px, 7vw, 80px)',
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          lineHeight: 1.05,
          color: 'white',
          marginBottom: 24,
          letterSpacing: '-1px',
        }}>
          Edit Videos With<br />
          <span className="grad">Natural Language</span>
        </h1>

        <p style={{
          color: '#64748b',
          fontSize: 18,
          lineHeight: 1.7,
          maxWidth: 560,
          margin: '0 auto 40px',
        }}>
          Type what you want. VidSense AI understands your intent and applies the right edits — no timeline dragging required.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link to="/editor" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            color: 'white',
            borderRadius: 14,
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 15,
            textDecoration: 'none',
            boxShadow: '0 0 40px rgba(59,130,246,0.3)',
            transition: 'opacity 0.2s',
          }}>
            🎬 Start Editing
          </Link>
          <Link to="/doc-video" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 28px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#cbd5e1',
            borderRadius: 14,
            fontFamily: 'Syne, sans-serif',
            fontWeight: 600,
            fontSize: 15,
            textDecoration: 'none',
          }}>
            📄 Doc → Video
          </Link>
        </div>
      </div>

      {/* Prompt chips */}
      <div style={{
        background: '#0e1420',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20,
        padding: '20px 24px',
        marginBottom: 80,
        textAlign: 'center',
      }}>
        <p style={{ color: '#475569', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
          Try saying
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {prompts.map(p => (
            <span key={p} className="chip">{p}</span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ paddingBottom: 100 }}>
        <h2 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 36,
          fontWeight: 800,
          color: 'white',
          textAlign: 'center',
          marginBottom: 48,
        }}>
          Everything you need,{' '}
          <span className="grad">nothing you don't</span>
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
        }}>
          {features.map(({ icon, title, desc, bg }) => (
            <div key={title} className="card" style={{ padding: 24 }}>
              <div className="feat-icon" style={{ background: bg }}>
                {icon}
              </div>
              <h3 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: 16,
                color: 'white',
                marginBottom: 8,
              }}>
                {title}
              </h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}