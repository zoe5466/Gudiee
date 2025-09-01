/** @type {import('next').NextConfig} */
const nextConfig = {
  
  // 圖片優化設定
  images: {
    domains: [
      'roamie.online',
      's3.amazonaws.com',
      'storage.googleapis.com',
      'cdn.roamie.online'
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // 環境變數
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  },

  // 編譯設定
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },


  // 重導向設定
  async redirects() {
    return [
      {
        source: '/guide',
        destination: '/providers',
        permanent: true,
      },
    ];
  },

  // Headers 設定
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Webpack 設定
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;