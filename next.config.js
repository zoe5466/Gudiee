/** @type {import('next').NextConfig} */
const nextConfig = {
  // 核心 micromatch 修復配置
  reactStrictMode: false,
  swcMinify: false,
  poweredByHeader: false,
  
  images: {
    domains: ['guidee.online', 'avatars.githubusercontent.com', 'images.unsplash.com'],
    unoptimized: true,
  },
  
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  
  experimental: {},
  
  // 關鍵：禁用輸出文件跟蹤 - 這是 micromatch 錯誤的根源
  outputFileTracing: false,
  
  // 固定構建 ID
  generateBuildId: () => 'static-build',
  
  webpack: (config) => {
    // 最小化優化設置
    config.optimization = {
      ...config.optimization,
      minimize: false,
      splitChunks: false,
      sideEffects: false,
    };
    
    // 限制解析
    config.resolve = {
      ...config.resolve,
      modules: ['node_modules'],
      symlinks: false,
    };
    
    // 禁用統計收集
    config.stats = false;
    
    return config;
  },
};

module.exports = nextConfig;