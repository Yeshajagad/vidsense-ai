import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0e1420',
            color: '#e8edf5',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#0e1420' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#0e1420' } },
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>
)