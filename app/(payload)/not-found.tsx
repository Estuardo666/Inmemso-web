import React from 'react'
import Link from 'next/link'

export default function PayloadNotFound() {
  return (
    <div style={{ padding: '4rem', textAlign: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 - Panel no encontrado</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Parece que Payload no encuentra esta ruta o la base de datos está reiniciándose.
      </p>
      <Link 
        href="/admin" 
        style={{ 
          display: 'inline-block',
          padding: '0.5rem 1rem',
          textDecoration: 'none', 
          color: '#0070f3',
          border: '1px solid #0070f3',
          borderRadius: '4px',
          backgroundColor: 'white'
        }}
      >
        Volver al Inicio del Admin
      </Link>
    </div>
  )
}


