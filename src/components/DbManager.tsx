'use client'

import React, { useState, useRef } from 'react'

export default function DbManager() {
  const [status, setStatus] = useState<'idle' | 'confirming' | 'uploading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDownload = () => {
    window.open('/api/db-ops', '_blank')
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setStatus('confirming')
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setStatus('idle')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleConfirmUpload = async () => {
    if (!selectedFile) return

    setStatus('uploading')
    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const res = await fetch('/api/db-ops', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setStatus('success')
        setMessage('Database restored successfully.')
      } else {
        setStatus('error')
        setMessage('Failed to restore database. Server returned ' + res.status)
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
      setMessage('Error uploading file: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  return (
    <div className="gutter--left gutter--right" style={{ marginTop: '2rem', marginBottom: '2rem', padding: '1rem', border: '1px solid var(--theme-elevation-200)', borderRadius: '8px', background: 'var(--theme-elevation-50)' }}>
      <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>Database Management</h4>
      
      {status === 'idle' && (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={handleDownload}
            type="button"
            className="btn btn--style-secondary"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                background: 'var(--theme-elevation-150)',
                border: '1px solid var(--theme-elevation-200)',
                color: 'var(--theme-elevation-800)'
            }}
          >
            Export DB
          </button>

          <div style={{ position: 'relative' }}>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".db,.sqlite,.sqlite3"
              style={{
                display: 'none'
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn--style-primary"
              style={{
                 display: 'inline-flex',
                 alignItems: 'center',
                 padding: '8px 16px',
                 borderRadius: '4px',
                 cursor: 'pointer',
                 fontSize: '14px',
                 fontWeight: 500,
                 background: 'var(--theme-error-500)',
                 color: 'white',
                 border: 'none'
              }}
            >
              Import DB
            </button>
          </div>
        </div>
      )}

      {status === 'confirming' && (
        <div style={{ background: 'var(--theme-elevation-100)', padding: '1rem', borderRadius: '4px' }}>
            <p style={{ marginBottom: '1rem', fontWeight: 500 }}>
                Are you sure you want to overwrite the database with <strong>{selectedFile?.name}</strong>?
                <br />
                <span style={{ color: 'var(--theme-error-500)', fontSize: '0.9em' }}>This action cannot be undone.</span>
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                    onClick={handleConfirmUpload}
                    type="button"
                    style={{
                        padding: '6px 12px', background: 'var(--theme-error-500)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                    }}
                >
                    Yes, Overwrite
                </button>
                <button 
                    onClick={handleCancel}
                    type="button"
                    style={{
                        padding: '6px 12px', background: 'transparent', border: '1px solid var(--theme-elevation-300)', borderRadius: '4px', cursor: 'pointer', color: 'var(--theme-elevation-800)'
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
      )}

      {status === 'uploading' && (
        <div style={{ padding: '1rem', color: 'var(--theme-elevation-800)' }}>
            Uploading and restoring database...
        </div>
      )}

      {status === 'success' && (
        <div style={{ padding: '1rem', background: 'var(--theme-success-100)', color: 'var(--theme-success-700)', borderRadius: '4px' }}>
            <p style={{ marginBottom: '0.5rem' }}>✅ {message}</p>
            <button 
                onClick={() => window.location.reload()}
                type="button"
                style={{
                    padding: '6px 12px', background: 'var(--theme-success-600)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                }}
            >
                Reload Page
            </button>
        </div>
      )}

      {status === 'error' && (
        <div style={{ padding: '1rem', background: 'var(--theme-error-100)', color: 'var(--theme-error-700)', borderRadius: '4px' }}>
            <p style={{ marginBottom: '0.5rem' }}>❌ {message}</p>
             <button 
                onClick={handleCancel}
                type="button"
                style={{
                    padding: '6px 12px', background: 'white', border: '1px solid var(--theme-error-500)', color: 'var(--theme-error-700)', borderRadius: '4px', cursor: 'pointer'
                }}
            >
                Try Again
            </button>
        </div>
      )}
    </div>
  )
}