/** @type {import('next').NextConfig} */
const nextConfig = {
  
  // 圖片優化設定 - 支援多個 CDN 和存儲服務
  images: {
    domains: [
      'guidee.online',      // 主域名
      'roamie.online',      // 舊域名 (向後兼容)
      's3.amazonaws.com',   // AWS S3
      'storage.googleapis.com', // Google Cloud Storage
      'cdn.guidee.online',  // CDN 域名
      'avatars.githubusercontent.com', // GitHub 頭像
      'lh3.googleusercontent.com', // Google 用戶頭像
      'platform-lookaside.fbsbx.com', // Facebook 頭像
      'images.unsplash.com' // Unsplash 圖片
    ],
    formats: ['image/webp', 'image/avif'], // 現代圖片格式
    dangerouslyAllowSVG: true, // 允許 SVG (用於 icon)
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // SVG 安全策略
  },

  // 前端環境變數 - 僅在客戶端可訪問的變數
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '0.1.0',
  },

  // 編譯優化設定
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // 生產環境移除 console.log
    styledComponents: true, // 支援 styled-components (如果使用)
  },

  // 實驗性功能 (修正配置)
  experimental: {
    // optimizeCss: true,   // 暫時禁用 CSS 優化以避免 critters 問題
    typedRoutes: true,   // 類型安全的路由
    // serverActions: true 已移除，Next.js 14 預設啟用
  },


  // 重導向設定 - SEO 優化和向後兼容
  async redirects() {
    return [
      {
        source: '/guide',
        destination: '/providers',
        permanent: true, // 301 重導向
      },
      {
        source: '/guides',
        destination: '/providers',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      // 舊版本 API 路由重導向
      {
        source: '/api/v1/:path*',
        destination: '/api/:path*',
        permanent: false, // 302 重導向
      },
    ];
  },

  // 安全 Headers 設定 - 增強應用程式安全性
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // 防止點擊劫持
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // 防止 MIME 嗅探
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // 限制 Referer 資訊
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block', // XSS 保護
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()', // 權限策略
          },
        ],
      },
      // API 路由的 CORS 設定
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://guidee.online' 
              : '*', // 開發環境允許所有來源
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          },
        ],
      },
    ];
  },

  // Webpack 自定義配置
  webpack: (config, { isServer, dev }) => {
    // 客戶端配置
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,        // 禁用 fs 模組 (客戶端不需要)
        net: false,       // 禁用 net 模組
        dns: false,       // 禁用 dns 模組
        child_process: false, // 禁用 child_process 模組
        tls: false,       // 禁用 tls 模組
      };
    }

    // 開發環境優化
    if (dev) {
      config.watchOptions = {
        poll: 1000,      // 每秒檢查文件變化
        aggregateTimeout: 300, // 延遲重新構建
      };
    }

    // 生產環境優化
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  },

  // 部署輸出配置 - 可根據不同平台調整
  output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : undefined,

  // 壓縮配置
  compress: true,

  // PoweredBy Header (移除 X-Powered-By: Next.js)
  poweredByHeader: false,

  // 嚴格模式
  reactStrictMode: true,

  // SWC 最小化器 (更快的構建)
  swcMinify: true,

  // 跨域配置
  crossOrigin: 'anonymous',
};

module.exports = nextConfig;