import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    domains: ['localhost'],
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

  webpack: (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@payload-config': path.resolve(__dirname, 'payload.config.ts'),
    }

    // Payload ships a dynamic require in its job runner. Webpack warns about it,
    // but it is expected and safe to ignore for Next builds.
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        message:
          /Critical dependency: the request of a dependency is an expression/i,
        module:
          /payload[\\/]dist[\\/]queues[\\/]operations[\\/]runJobs[\\/]runJob[\\/]importHandlerPath\.js/i,
      },
    ]

    return config
  },
}

export default withPayload(nextConfig)

