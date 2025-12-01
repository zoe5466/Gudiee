/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  // Skip Prisma validation during build if DATABASE_URL is not set
  experimental: {
    isrMemoryCacheSize: 0,
  },

  images: {
    domains: ['guidee.online', 'avatars.githubusercontent.com', 'images.unsplash.com', 'api.dicebear.com'],
    unoptimized: true,
  },

  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Skip static optimization for routes that need dynamic behavior
  staticPageGenerationTimeout: 120,

  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;