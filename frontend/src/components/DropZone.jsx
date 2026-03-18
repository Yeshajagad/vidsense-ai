import { useDropzone } from 'react-dropzone'

const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#64748b' }}>
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
)

const FileVideoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <polygon points="10 11 16 14.5 10 18 10 11"/>
  </svg>
)

const FileDocIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
)

const ACCEPT = {
  video: { 'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'] },
  doc:   {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt'],
  },
}

export default function DropZone({ onFile, accept = 'video', file }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPT[accept],
    maxFiles: 1,
    onDrop: (accepted) => { if (accepted[0]) onFile(accepted[0]) },
  })

  const isVideo = accept === 'video'
  const hint    = isVideo ? 'MP4, MOV, AVI, MKV, WEBM' : 'PDF, DOCX, TXT'
  const Icon    = file ? (isVideo ? FileVideoIcon : FileDocIcon) : null

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'active' : ''}`}
    >
      <input {...getInputProps()} />

      {file ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: isVideo ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {Icon && <Icon />}
          </div>
          <div>
            <p style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>{file.name}</p>
            <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB · Click or drop to replace
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <UploadIcon />
          <div>
            <p style={{ color: '#cbd5e1', fontWeight: 500, fontSize: 15 }}>
              {isDragActive ? 'Drop it here!' : `Drop your ${isVideo ? 'video' : 'document'} here`}
            </p>
            <p style={{ color: '#475569', fontSize: 13, marginTop: 6 }}>{hint} supported</p>
          </div>
          <div style={{
            padding: '8px 20px',
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: 10,
            color: '#93c5fd',
            fontSize: 13,
            fontWeight: 500,
          }}>
            Browse Files
          </div>
        </div>
      )}
    </div>
  )
}