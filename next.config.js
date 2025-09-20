/** @type {import('next').NextConfig} */
const nextConfig = {
  // 基本配置以避免 micromatch 錯誤
  
  // 圖片優化設定
  images: {
    domains: [
      'guidee.online',
      'avatars.githubusercontent.com',
      'images.unsplash.com'
    ],
    formats: ['image/webp'],
  },

  // 環境變數
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // 編譯優化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 實驗性功能 (最小化)
  experimental: {
    typedRoutes: true,
  },

  // 簡化的 webpack 配置以避免 micromatch 錯誤
  webpack: (config) => {
    // 最小化配置
    return config;
  },

  // 基本設定
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
};

module.exports = nextConfig;