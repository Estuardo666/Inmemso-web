import React from 'react'
import '@payloadcms/next/css'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import config from '@/payload.config'

import { importMap as generatedImportMap } from './admin/importMap.js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function serverFunction(args: { name: string; args: Record<string, unknown> }) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap: generatedImportMap,
  })
}

export default function PayloadLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <RootLayout
      config={config}
      importMap={generatedImportMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  )
}
