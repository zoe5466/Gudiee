/** @type {import('next').NextConfig} */
const nextConfig = {
  // 極簡配置防止 micromatch 堆疊溢出
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  
  images: {
    domains: ['guidee.online', 'avatars.githubusercontent.com', 'images.unsplash.com'],
  },
  
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  
  // 完全禁用實驗性功能
  experimental: {},
  
  webpack: (config) => {
    // 禁用可能觸發大量文件掃描的優化
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      splitChunks: false, // 禁用分包以減少文件掃描
    };
    
    // 限制文件解析範圍，避免掃描過多文件
    config.resolve.modules = ['node_modules'];
    
    // 禁用可能觸發 micromatch 的插件
    config.plugins = config.plugins.filter(plugin => {
      return !plugin.constructor.name.includes('OptimizeCss');
    });
    
    return config;
  },
};

module.exports = nextConfig;