import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  // Configure Turbopack (replaces deprecated experimental.turbo)
  turbopack: {
    resolveAlias: {
      // Use project-relative POSIX path to avoid Windows absolute path issues
      '@payload-config': './payload.config.ts',
    },
  },

  // Payload Admin pulls in some dependencies that import CSS from node_modules.
  // If those are externalized, Node will try to import `.css` directly and crash.
  // Transpile/bundle them instead. Payload packages are handled by withPayload plugin.
  transpilePackages: [
    '@payloadcms/next',
    '@payloadcms/richtext-lexical',
    '@payloadcms/ui',
    'react-image-crop',
  ],

  experimental: {
    // Server Actions configuration lives under experimental in Next 15
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
}

export default withPayload(nextConfig)

