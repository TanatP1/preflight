import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // This is REQUIRED for Docker deployment
  output: 'standalone',
  
  // Add these for Next.js 15 compatibility
  experimental: {
    // Ensure standalone output works properly
    outputFileTracingRoot: undefined,
  },
  
  // Explicitly disable static export to ensure standalone works
  trailingSlash: false,
}

export default nextConfig
