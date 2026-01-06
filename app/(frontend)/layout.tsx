import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Inmemso Architecture',
  description: 'Inmemso Architecture - Ingeniería sismorresistente y paneles prefabricados',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
}

