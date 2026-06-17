import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // English content normalized from the original source text.
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // English content normalized from the original source text.
      },
      {
        protocol: 'http',
        hostname: '**', // English content normalized from the original source text.
      },
    ],
  },
};

export default withNextIntl(nextConfig);