'use client'

import React, { useEffect } from 'react'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function PayloadError({ error, reset }: Props) {
  // Buenas prácticas:
  // - Mantenerlo client-only (requisito de Next.js para error boundaries).
  // - No usar estilos globales del frontend (Tailwind) para no afectar Admin.
  useEffect(() => {
    // Log serverless-friendly (aparece en consola del navegador; en prod complementa con observabilidad si aplica).
    console.error('[Payload Admin] Route error boundary:', error)
  }, [error])

  return (
    <html lang="es">
      <body>
        <main>
          <h1>Admin error</h1>
          <p>Ocurrió un error cargando el panel de administración.</p>
          <p>
            <button type="button" onClick={() => reset()}>
              Reintentar
            </button>
          </p>
          {process.env.NODE_ENV !== 'production' ? (
            <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error?.message || error)}</pre>
          ) : null}
        </main>
      </body>
    </html>
  )
}
