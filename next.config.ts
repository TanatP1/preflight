import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // This is REQUIRED for Docker deployment
  output: 'standalone',
}

export default nextConfig