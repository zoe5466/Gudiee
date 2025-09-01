'use client';

import { useState, useEffect } from 'react';
import { Search, Globe, Menu, User } from 'lucide-react';
import { LanguageToggle } from '@/components/i18n/language-switcher';
import { UserMenu } from '@/components/ui/user-menu';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-white transition-all duration-200 ${
      isScrolled ? 'shadow-md border-b border-gray-200' : 'shadow-sm'
    }`}>
      <div className="relative">
        {/* Main Header */}
        <div className="px-6 lg:px-10 xl:px-20">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF5A5F] to-[#E1464A] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="ml-2 text-2xl font-bold text-[#FF5A5F] hidden sm:block">guidee</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:block">
              <div className="flex items-center border border-gray-300 rounded-full shadow-sm hover:shadow-lg transition-all duration-200 bg-white">
                <div className="search-section border-r border-gray-200 rounded-l-full hover:bg-gray-50">
                  <div className="search-label">地點</div>
                  <div className="search-value">隨處</div>
                </div>
                <div className="search-section border-r border-gray-200 hover:bg-gray-50">
                  <div className="search-label">入住</div>
                  <div className="search-value">任何一週</div>
                </div>
                <div className="search-section hover:bg-gray-50 flex items-center">
                  <div className="flex-1">
                    <div className="search-label">旅客</div>
                    <div className="search-value">新增旅客</div>
                  </div>
                  <button className="btn btn-primary btn-sm rounded-full w-8 h-8 !p-0 ml-3">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Become a Host */}
              <button className="hidden lg:block text-sm font-medium text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-full transition-colors">
                成為地陪
              </button>

              {/* Language */}
              <LanguageToggle />

              {/* User Menu */}
              <UserMenu />

              {/* Mobile Search */}
              <button className="lg:hidden p-2 text-gray-600">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Navigation */}
        <div className="hidden lg:block border-t border-gray-200">
          <div className="px-6 lg:px-10 xl:px-20">
            <div className="flex items-center space-x-8 py-4 overflow-x-auto">
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
                      ? 'text-gray-900 border-b-2 border-gray-900' 
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

        {/* Mobile Search Bar (when scrolled) */}
        {isMounted && isScrolled && (
          <div className="lg:hidden px-6 py-3 border-t border-gray-200">
            <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm p-3">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">隨處</div>
                <div className="text-xs text-gray-500">任何一週 · 新增旅客</div>
              </div>
              <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}