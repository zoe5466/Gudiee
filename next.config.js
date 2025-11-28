/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  poweredByHeader: false,

  images: {
    domains: ['guidee.online', 'avatars.githubusercontent.com', 'images.unsplash.com', 'api.dicebear.com'],
    unoptimized: true,
  },

  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  experimental: {},
};

module.exports = nextConfig;