import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import DropZone from '../components/DropZone.jsx'
import StatusCard from '../components/StatusCard.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const WandIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/>
    <path d="M17.8 11.8L19 13"/><path d="M15 9h0"/><path d="M17.8 6.2L19 5"/>
    <path d="M3 21l9-9"/><path d="M12.2 6.2L11 5"/>
  </svg>
)

const steps = [
  { num: '1', label: 'Extract Text' },
  { num: '2', label: 'Build Script' },
  { num: '3', label: 'Add Narration' },
  { num: '4', label: 'Render Video' },
]

export default function DocToVideo() {
  const [file, setFile]       = useState(null)
  const [jobId, setJobId]     = useState(null)
  const [job, setJob]         = useState(null)
  const [loading, setLoading] = useState(false)
  const pollRef               = useRef(null)

  useEffect(() => {
    if (!jobId) return
    pollRef.current = setInterval(async () => {
      try {
        const { data } = await axios.get(`${API}/api/status/${jobId}`)
        setJob(data)
        if (data.status === 'done' || data.status === 'error') {
          clearInterval(pollRef.current)
          setLoading(false)
          if (data.status === 'done')  toast.success('Video generated!')
          if (data.status === 'error') toast.error(data.message)
        }
      } catch {
        clearInterval(pollRef.current)
      }
    }, 2500)
    return () => clearInterval(pollRef.current)
  }, [jobId])

  const handleSubmit = async () => {
    if (!file) return toast.error('Upload a document first')
    setLoading(true)
    setJob(null)
    setJobId(null)

    const form = new FormData()
    form.append('file', file)

    try {
      const { data } = await axios.post(`${API}/api/doc-to-video`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setJobId(data.job_id)
      toast.success('Conversion started!')
    } catch (err) {
      setLoading(false)
      toast.error(err?.response?.data?.detail || 'Failed to start conversion')
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 40,
          color: 'white',
          marginBottom: 8,
        }}>
          Doc → Video
        </h1>
        <p style={{ color: '#64748b', fontSize: 16 }}>
          Upload any document and get a narrated explainer video in minutes.
        </p>
      </div>

      {/* Pipeline steps */}
      <div style={{
        background: '#0e1420',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20,
        padding: '24px 28px',
        marginBottom: 32,
      }}>
        <p style={{
          color: '#475569',
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 20,
        }}>
          How it works
        </p>
        <div style={{ display: 'flex', gap: 0 }}>
          {steps.map((s, i) => (
            <div key={s.num} className="step-item">
              <div className="step-num">{s.num}</div>
              <p style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500, textAlign: 'center' }}>{s.label}</p>
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: 18,
                  left: '75%',
                  width: '50%',
                  height: 1,
                  background: 'rgba(255,255,255,0.07)',
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Supported formats */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 24,
        flexWrap: 'wrap',
      }}>
        {['PDF', 'DOCX', 'TXT'].map(f => (
          <span key={f} className="tag" style={{
            background: 'rgba(139,92,246,0.1)',
            borderColor: 'rgba(139,92,246,0.25)',
            color: '#c4b5fd',
          }}>
            {f}
          </span>
        ))}
        <span style={{ color: '#475569', fontSize: 13, alignSelf: 'center', marginLeft: 4 }}>
          supported formats
        </span>
      </div>

      {/* Upload */}
      <div style={{ marginBottom: 32 }}>
        <DropZone onFile={setFile} accept="doc" file={file} />
      </div>

      {/* Submit */}
      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={loading}
        style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
      >
        {loading
          ? <><span className="spinner" /> Converting…</>
          : <><WandIcon /> Generate Video</>
        }
      </button>

      <StatusCard job={job} />
    </div>
  )
}