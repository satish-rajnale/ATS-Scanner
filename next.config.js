/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Enable image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;

