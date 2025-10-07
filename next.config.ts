// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Experimental features
  experimental: {
    // Enable if you're using app directory features
  },

  // Image optimization settings for Docker
  images: {
    unoptimized: true, // Disable image optimization for Docker
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: 'https://api.bigairlab.com',
  },
};

export default nextConfig;