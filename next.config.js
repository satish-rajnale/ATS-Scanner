/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Optimize for Vercel deployment
  output: 'standalone',
  // Enable image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;

