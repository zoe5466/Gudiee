'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, User, MessageCircle, CheckSquare, Heart } from 'lucide-react';
import { useAuth } from '@/store/auth';

export function HomeSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  
  // 檢查是否為首頁
  const isHomePage = pathname === '/';

  const menuItems = [
    {
      icon: <User className="w-5 h-5" />,
      label: '個人資料',
      path: '/profile',
      description: '查看和編輯個人資料'
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: '聊天',
      path: '/messages',
      description: '與導遊和客戶聊天'
    },
    {
      icon: <CheckSquare className="w-5 h-5" />,
      label: '任務',
      path: '/tasks',
      description: '查看和管理任務'
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: '我的最愛',
      path: '/favorites',
      description: '收藏的服務和導遊'
    }
  ];

  const handleItemClick = (path: string) => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    router.push(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* 觸發按鈕 */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed z-40 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:bg-gray-50 ${
          isHomePage ? 'top-1/2 left-4 transform -translate-y-1/2' : 'top-24 left-4'
        }`}
        aria-label="打開選單"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* 遮罩層 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 側邊選單 */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 頭部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">功能選單</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="關閉選單"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* 選單內容 */}
        <div className="p-4">
          {!isAuthenticated && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">請先登入以使用完整功能</p>
              <button
                onClick={() => handleItemClick('/auth/login')}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                立即登入 →
              </button>
            </div>
          )}

          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item.path)}
                className="w-full flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors duration-150 text-left group"
              >
                <div className="flex-shrink-0 mt-0.5 text-gray-600 group-hover:text-blue-600 transition-colors">
                  {item.icon}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </nav>

          {/* 額外資訊 */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">需要幫助？</h3>
            <p className="text-xs text-gray-600 mb-3">
              如果您有任何問題，請聯繫我們的客服團隊。
            </p>
            <button
              onClick={() => handleItemClick('/support')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              聯繫客服 →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}