import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Inmemso Architecture',
  description: 'Inmemso Architecture',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
