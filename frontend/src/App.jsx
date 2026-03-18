import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import VideoEditor from './pages/VideoEditor.jsx'
import DocToVideo from './pages/DocToVideo.jsx'

export default function App() {
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL
    if (!apiUrl) return
    const ping = () => fetch(`${apiUrl}/`).catch(() => {})
    ping()
    const id = setInterval(ping, 10 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/editor"    element={<VideoEditor />} />
        <Route path="/doc-video" element={<DocToVideo />} />
      </Routes>
    </div>
  )
}