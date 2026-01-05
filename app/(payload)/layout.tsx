import React from 'react'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import config from '@/payload.config'

const importMap = {}

async function serverFunction(args: { name: string; args: Record<string, unknown> }) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

export default function PayloadLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  )
}
