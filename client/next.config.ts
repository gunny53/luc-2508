import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const withNextIntl = createNextIntlPlugin()
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/:path*`
      }
    ]
  },
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'named'
      }
    }

    return config
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      },
      {
        protocol: 'http',
        hostname: '**'
      }
    ]
  }
}

export default withNextIntl(nextConfig)
