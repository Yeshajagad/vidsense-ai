const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)

const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

export default function StatusCard({ job }) {
  if (!job) return null

  const statusClass = {
    processing: 'status-processing',
    done:       'status-done',
    error:      'status-error',
  }[job.status] || ''

  return (
    <div className={`card ${statusClass}`} style={{ marginTop: 24, padding: 24 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        {/* Icon */}
        <div style={{ marginTop: 2, flexShrink: 0 }}>
          {job.status === 'processing' && (
            <div className="spinner" style={{ borderTopColor: '#3b82f6', borderColor: 'rgba(59,130,246,0.2)' }} />
          )}
          {job.status === 'done'  && <CheckIcon />}
          {job.status === 'error' && <ErrorIcon />}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 15 }}>
            {job.status === 'processing' && 'Processing your video…'}
            {job.status === 'done'       && 'Done! Your video is ready'}
            {job.status === 'error'      && 'Something went wrong'}
          </p>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{job.message}</p>

          {/* Progress bar */}
          {job.status === 'processing' && <div className="progress-bar" />}

          {/* Download */}
          {job.status === 'done' && job.output_file && (
            <a
              href={`${API}/api/download/${job.output_file}`}
              download
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 16,
                padding: '10px 20px',
                background: 'rgba(34,197,94,0.15)',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: 12,
                color: '#4ade80',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
            >
              <DownloadIcon /> Download Video
            </a>
          )}

          {/* Chapters */}
          {job.chapters?.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <p style={{
                color: '#94a3b8',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <ClockIcon /> Generated Chapters
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {job.chapters.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
                    <span style={{ color: '#60a5fa', fontFamily: 'monospace', minWidth: 40 }}>{c.timestamp}</span>
                    <span style={{ color: '#cbd5e1' }}>{c.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}