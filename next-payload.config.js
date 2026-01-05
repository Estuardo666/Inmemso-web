/**
 * Configuración de Next.js con Payload CMS
 * Para ejecutar: npx next dev -p 3000
 */

const { withPayload } = require('@payloadcms/next/withPayload');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'],
  },
};

module.exports = withPayload(nextConfig);
