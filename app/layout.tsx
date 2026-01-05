import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inmemso Architecture',
  description: 'Inmemso Architecture',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
