/** @type {import('next').NextConfig} */
const nextConfig = {
  // 最極簡配置防止 micromatch 在所有階段出錯
  reactStrictMode: false, // 禁用嚴格模式減少複雜度
  swcMinify: false, // 禁用 SWC 壓縮
  poweredByHeader: false,
  
  // 基本圖片配置
  images: {
    domains: ['guidee.online', 'avatars.githubusercontent.com', 'images.unsplash.com'],
    unoptimized: true, // 禁用圖片優化以減少構建複雜度
  },
  
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  
  // 完全禁用實驗性功能
  experimental: {},
  
  // 禁用構建軌跡收集 - 這是導致 micromatch 錯誤的主要原因
  generateBuildId: () => 'build',
  
  webpack: (config) => {
    // 最小化 webpack 配置
    config.optimization = {
      minimize: false, // 禁用壓縮
      splitChunks: false, // 禁用代碼分割
      sideEffects: false,
    };
    
    // 限制解析模塊
    config.resolve = {
      ...config.resolve,
      modules: ['node_modules'],
      symlinks: false, // 禁用符號連結解析
    };
    
    // 移除所有可能觸發 micromatch 的插件
    config.plugins = config.plugins.filter(plugin => {
      const name = plugin.constructor.name;
      return !name.includes('OptimizeCss') && 
             !name.includes('CompressionPlugin') &&
             !name.includes('BundleAnalyzer');
    });
    
    // 禁用構建統計
    config.stats = false;
    
    return config;
  },
  
  // 禁用所有可能觸發文件掃描的功能
  output: 'standalone',
  
  // 禁用 TypeScript 增量編譯
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
};

module.exports = nextConfig;