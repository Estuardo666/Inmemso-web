import { RootPage } from '@payloadcms/next/views'
import config from '@/payload.config'

type PageProps = {
  params: Promise<{
    segments?: string[]
  }>
  searchParams: Promise<Record<string, string | string[]>>
}

export default function Page({ params, searchParams }: PageProps) {
  return RootPage({
    config,
    importMap: {},
    params: params.then((p) => ({ segments: p.segments ?? [] })),
    searchParams,
  })
}
