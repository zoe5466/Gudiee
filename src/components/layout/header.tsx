// 網站主要頭部導航組件
// 功能：包含 Logo、搜尋欄、分類導航、語言切換、用戶選單等
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Globe, Menu, User } from 'lucide-react'; // 圖標組件
import { LanguageToggle } from '@/components/i18n/language-switcher'; // 語言切換組件
import { UserMenu } from '@/components/ui/user-menu'; // 用戶選單組件

/**
 * 網站主頭部組件
 * 
 * 功能：
 * 1. 顯示品牌 Logo 和導航
 * 2. 搜尋功能（地點、日期、人數）
 * 3. 服務分類導航
 * 4. 語言切換和用戶選單
 * 5. 響應式設計和滾動效果
 */
export function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false); // 頁面是否已滾動
  const [isMounted, setIsMounted] = useState(false); // 組件是否已掛載（防止 SSR 問題）

  // 監聽頁面滾動事件，用於調整頭部樣式
  useEffect(() => {
    setIsMounted(true); // 標記組件已掛載
    
    const handleScroll = () => {
      // 滾動超過 80px 時改變頭部樣式
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // 清理事件監聽器
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-white transition-all duration-200 ${
      isScrolled ? 'shadow-md border-b border-gray-200' : 'shadow-sm'
    }`}> {/* 固定在頂部，根據滾動狀態調整陰影 */}
      <div className="relative">
        {/* 主要頭部區域 */}
        <div className="px-6 lg:px-10 xl:px-20">
          <div className="flex items-center justify-between h-20">
            {/* 品牌 Logo 區域 */}
            <div className="flex items-center">
              <div className="flex items-center">
                {/* Logo 圖標 */}
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF5A5F] to-[#E1464A] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                {/* 品牌名稱（在小螢幕隱藏） */}
                <span className="ml-2 text-2xl font-bold text-[#FF5A5F] hidden sm:block">guidee</span>
              </div>
            </div>

            {/* 搜尋欄（大螢幕顯示） */}
            <div className="hidden lg:block">
              <div className="flex items-center border border-gray-300 rounded-full shadow-sm hover:shadow-lg transition-all duration-200 bg-white">
                {/* 地點選擇區域 */}
                <div className="search-section border-r border-gray-200 rounded-l-full hover:bg-gray-50">
                  <div className="search-label">地點</div>
                  <div className="search-value">隨處</div>
                </div>
                {/* 日期選擇區域 */}
                <div className="search-section border-r border-gray-200 hover:bg-gray-50">
                  <div className="search-label">入住</div>
                  <div className="search-value">任何一週</div>
                </div>
                {/* 人數選擇區域 */}
                <div className="search-section hover:bg-gray-50 flex items-center">
                  <div className="flex-1">
                    <div className="search-label">旅客</div>
                    <div className="search-value">新增旅客</div>
                  </div>
                  {/* 搜尋按鈕 */}
                  <button className="btn btn-primary btn-sm rounded-full w-8 h-8 !p-0 ml-3">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 右側功能區域 */}
            <div className="flex items-center space-x-4">
              {/* 成為地陪連結（大螢幕顯示） */}
              <Link
                href="/auth/register"
                className="hidden lg:block text-sm font-medium text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-full transition-colors cursor-pointer"
                style={{ textDecoration: 'none' }}
              >
                成為地陪
              </Link>

              {/* 語言切換器 */}
              <LanguageToggle />

              {/* 用戶選單 */}
              <UserMenu />

              {/* 移動設備搜尋按鈕 */}
              <button className="lg:hidden p-2 text-gray-600">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 服務分類導航（大螢幕顯示） */}
        <div className="hidden lg:block border-t border-gray-200">
          <div className="px-6 lg:px-10 xl:px-20">
            <div className="flex items-center space-x-8 py-4 overflow-x-auto">
              {/* 預定義的服務分類列表 */}
              {[
                { name: '文化', icon: '🏛️' },
                { name: '美食', icon: '🍜' },
                { name: '自然', icon: '🏔️' },
                { name: '城市', icon: '🏙️' },
                { name: '夜生活', icon: '🌃' },
                { name: '購物', icon: '🛍️' },
                { name: '歷史', icon: '🏯' },
                { name: '海岸', icon: '🏖️' },
              ].map((category, index) => (
                <button
                  key={index}
                  className={`flex flex-col items-center min-w-max px-4 py-3 text-xs font-medium transition-colors hover:text-gray-900 ${
                    index === 0 
                      ? 'text-gray-900 border-b-2 border-gray-900' // 第一個分類為預設選中
                      : 'text-gray-500 hover:border-b-2 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl mb-2">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 移動設備搜尋欄（滾動時顯示） */}
        {/* 使用 isMounted 防止服務端渲染問題 */}
        {isMounted && isScrolled && (
          <div className="lg:hidden px-6 py-3 border-t border-gray-200">
            <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm p-3">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              {/* 簡化版搜尋資訊顯示 */}
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">隨處</div>
                <div className="text-xs text-gray-500">任何一週 · 新增旅客</div>
              </div>
              {/* 搜尋指示器 */}
              <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} // Header 組件結束