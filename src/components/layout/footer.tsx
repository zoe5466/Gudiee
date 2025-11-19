import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    traveler: [
      { name: '探索地陪', href: '/search' },
      { name: '如何使用', href: '/how-it-works' },
      { name: '安全保障', href: '/safety' },
      { name: '用戶評價', href: '/reviews' },
      { name: '旅遊保險', href: '/travel-insurance' }
    ],
    guide: [
      { name: '成為地陪', href: '/become-guide' },
      { name: '地陪資源', href: '/guide-resources' },
      { name: '地陪社群', href: '/guide-community' },
      { name: '地陪支援', href: '/guide-support' },
      { name: '收入計算', href: '/guide-earnings' }
    ],
    support: [
      { name: '幫助中心', href: '/help' },
      { name: '聯絡我們', href: '/contact' },
      { name: '爭議處理', href: '/disputes' },
      { name: '服務條款', href: '/terms' },
      { name: '隱私政策', href: '/privacy' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  const contactInfo = [
    { icon: Mail, label: '客服信箱', value: 'support@guidee.online' },
    { icon: Phone, label: '客服專線', value: '0800-123-456' },
    { icon: MapPin, label: '公司地址', value: '台北市信義區信義路五段7號' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* 背景裝飾 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 主要內容 */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo 和描述 */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="Guidee Logo"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <span className="text-2xl font-bold text-white">Guidee</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                Guidee 是台灣領先的地陪媒合平台，連接旅客與專業地陪，創造難忘的旅遊體驗。
              </p>
              
              {/* 社群媒體 */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-sky-500 hover:scale-110 transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* 旅客服務 */}
            <div className="space-y-6">
              <h3 className="text-white font-semibold text-lg">旅客服務</h3>
              <ul className="space-y-3">
                {footerLinks.traveler.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 transform transition-transform duration-300 inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 地陪服務 */}
            <div className="space-y-6">
              <h3 className="text-white font-semibold text-lg">地陪服務</h3>
              <ul className="space-y-3">
                {footerLinks.guide.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 transform transition-transform duration-300 inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 支援中心 */}
            <div className="space-y-6">
              <h3 className="text-white font-semibold text-lg">支援中心</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 transform transition-transform duration-300 inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 聯絡資訊 */}
        <div className="border-t border-gray-700 pt-8 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((contact, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <contact.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{contact.label}</p>
                  <p className="text-gray-300 text-sm">{contact.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部版權 */}
        <div className="border-t border-gray-700 pt-6 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Guidee. 保留所有權利。
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                服務條款
              </a>
              <a
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                隱私政策
              </a>
              <a
                href="/cookies"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Cookie 政策
              </a>
              <a
                href="/accessibility"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                無障礙聲明
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 波浪裝飾 */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".1"
            className="fill-sky-500"
          />
        </svg>
      </div>
    </footer>
  );
}