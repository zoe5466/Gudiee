'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, Settings, BookOpen, Heart } from 'lucide-react';
import { useAuth } from '@/store/auth';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      router.push('/');
    } catch (error) {
      console.error('登出失敗:', error);
    }
  };

  const menuItems = [
    {
      icon: <User className="w-4 h-4" />,
      label: '個人資料',
      href: '/profile',
      onClick: () => {
        router.push('/profile');
        setIsOpen(false);
      }
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      label: '我的預訂',
      href: '/orders',
      onClick: () => {
        router.push('/orders');
        setIsOpen(false);
      }
    },
    {
      icon: <Heart className="w-4 h-4" />,
      label: '我的最愛',
      href: '/favorites',
      onClick: () => {
        router.push('/favorites');
        setIsOpen(false);
      }
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: '設定',
      href: '/settings',
      onClick: () => {
        router.push('/settings');
        setIsOpen(false);
      }
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => router.push('/auth/login')}
          className="text-sm font-medium text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-full transition-colors"
        >
          登入
        </button>
        <button
          onClick={() => router.push('/auth/register')}
          className="text-sm font-medium bg-[#FF5A5F] text-white hover:bg-[#E1464A] px-4 py-2 rounded-full transition-colors"
        >
          註冊
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center border border-gray-300 rounded-full p-2 hover:shadow-md transition-shadow duration-200 bg-white"
      >
        <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
          {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <span className="ml-2 text-sm font-medium text-gray-700 max-w-20 truncate hidden sm:block">
          {user?.name || user?.email?.split('@')[0]}
        </span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="text-sm font-medium text-gray-900">{user?.name}</div>
            <div className="text-sm text-gray-500">{user?.email}</div>
          </div>

          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="ml-3">登出</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}