import type { Metadata } from 'next'
import './globals.css'
import { getSEO } from '@/src/lib/getPayloadContent'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO()
  return {
    title: seo.title,
    description: seo.description,
    icons: seo.favicon ? { icon: seo.favicon } : undefined,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  )
}

