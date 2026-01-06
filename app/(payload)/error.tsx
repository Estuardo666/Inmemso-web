'use client'

import React, { useEffect } from 'react'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function PayloadError({ error, reset }: Props) {
  useEffect(() => {
    console.error('[Payload Admin] Route error boundary:', error)
  }, [error])

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1>⚠️ Error en Admin</h1>
      <p>Ocurrió un error cargando el panel de administración.</p>
      <button
        type="button"
        onClick={() => reset()}
        style={{
          padding: '0.5rem 1rem',
          marginBottom: '1rem',
          cursor: 'pointer',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Reintentar
      </button>
      {process.env.NODE_ENV !== 'production' ? (
        <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: '1rem' }}>
          {String(error?.message || error)}
        </pre>
      ) : null}
    </div>
  )
}


