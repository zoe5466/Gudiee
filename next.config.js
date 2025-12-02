/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    domains: ['guidee.online', 'avatars.githubusercontent.com', 'images.unsplash.com', 'api.dicebear.com'],
    unoptimized: true,
  },

  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Increase timeout for static page generation
  staticPageGenerationTimeout: 240,

  // Configure redirects for dynamic routes
  redirects: async () => {
    return [];
  },

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