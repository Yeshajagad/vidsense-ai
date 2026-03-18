import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import DropZone from '../components/DropZone.jsx'
import StatusCard from '../components/StatusCard.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const SUGGESTIONS = [
  'Remove all silences',
  'Add captions to the video',
  'Blur all faces',
  'Speed up the video 1.5x',
  'Generate chapters',
  'Add calm background music',
  'Censor the word damn',
  'Remove silences and add captions',
]

const SendIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

export default function VideoEditor() {
  const [file, setFile]       = useState(null)
  const [prompt, setPrompt]   = useState('')
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
          if (data.status === 'done')  toast.success('Video processed!')
          if (data.status === 'error') toast.error('Error: ' + data.message)
        }
      } catch {
        clearInterval(pollRef.current)
      }
    }, 2500)
    return () => clearInterval(pollRef.current)
  }, [jobId])

  const handleSubmit = async () => {
    if (!file)   return toast.error('Upload a video first')
    if (!prompt.trim()) return toast.error('Enter an editing prompt')

    setLoading(true)
    setJob(null)
    setJobId(null)

    const form = new FormData()
    form.append('file',   file)
    form.append('prompt', prompt)

    try {
      const { data } = await axios.post(`${API}/api/edit`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setJobId(data.job_id)
      toast.success('Job started!')
    } catch (err) {
      setLoading(false)
      toast.error(err?.response?.data?.detail || 'Failed to start job')
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
          Video Editor
        </h1>
        <p style={{ color: '#64748b', fontSize: 16 }}>
          Upload a video, describe what you want — AI handles the rest.
        </p>
      </div>

      {/* Step 1 */}
      <div style={{ marginBottom: 28 }}>
        <label style={{
          display: 'block',
          color: '#94a3b8',
          fontSize: 13,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 12,
        }}>
          Step 1 — Upload Video
        </label>
        <DropZone onFile={setFile} accept="video" file={file} />
      </div>

      {/* Step 2 */}
      <div style={{ marginBottom: 20 }}>
        <label style={{
          display: 'block',
          color: '#94a3b8',
          fontSize: 13,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 12,
        }}>
          Step 2 — Describe Your Edits
        </label>
        <textarea
          className="input-area"
          rows={3}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder='e.g. "Remove silences and add captions"'
          onKeyDown={e => {
            if (e.key === 'Enter' && e.metaKey) handleSubmit()
          }}
        />
      </div>

      {/* Suggestions */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: '#475569', fontSize: 12, marginBottom: 10 }}>✦ Quick suggestions</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SUGGESTIONS.map(s => (
            <button key={s} className="chip" onClick={() => setPrompt(s)}>{s}</button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading
          ? <><span className="spinner" /> Processing…</>
          : <><SendIcon /> Process Video</>
        }
      </button>

      <StatusCard job={job} />
    </div>
  )
}