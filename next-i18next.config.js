module.exports = {
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['zh-TW', 'en', 'ja', 'ko'],
    localeDetection: true,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  
  // 命名空間設定
  ns: [
    'common',
    'auth',
    'home',
    'search',
    'service',
    'booking',
    'profile',
    'dashboard',
    'admin',
    'error'
  ],
  
  // 預設命名空間
  defaultNS: 'common',
  
  // 載入路徑
  localePath: './public/locales',
  
  // 插值設定
  interpolation: {
    escapeValue: false,
  },
  
  // 開發模式設定
  debug: process.env.NODE_ENV === 'development',
  
  // 回退語言
  fallbackLng: {
    'zh-CN': ['zh-TW'],
    'zh-HK': ['zh-TW'],
    default: ['zh-TW']
  },
  
  // 語言檢測設定
  detection: {
    order: ['cookie', 'header', 'querystring', 'path', 'subdomain'],
    caches: ['cookie'],
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'strict'
    }
  }
};