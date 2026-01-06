/* app/(payload)/admin/[[...segments]]/page.tsx */
import type { Metadata } from 'next'
import config from '@/payload.config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = async ({ params, searchParams }: Args) => {
  const parsedParams = await params
  const parsedSearchParams = await searchParams

  return (
    <RootPage
      config={config}
      params={parsedParams}
      searchParams={parsedSearchParams}
      importMap={importMap}
    />
  )
}

export default Page
