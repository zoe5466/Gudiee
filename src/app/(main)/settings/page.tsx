'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Key,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit
} from 'lucide-react';
import { useAuth } from '@/store/auth';
import { Loading } from '@/components/ui/loading';
import { HomeButton } from '@/components/layout/page-navigation';

interface SettingItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  badge?: string;
  color: string;
}

const settingsSections = [
  {
    title: '個人設定',
    items: [
      {
        icon: User,
        title: '個人資料',
        description: '編輯您的基本資料和個人介紹',
        href: '/settings/profile',
        color: 'text-blue-500'
      },
      {
        icon: Key,
        title: '帳戶安全',
        description: '密碼、登入方式和安全設定',
        href: '/settings/account',
        color: 'text-green-500'
      }
    ]
  },
  {
    title: '偏好設定',
    items: [
      {
        icon: Bell,
        title: '通知設定',
        description: '選擇您希望接收的通知類型',
        href: '/settings/notifications',
        color: 'text-orange-500'
      },
      {
        icon: Shield,
        title: '隱私設定',
        description: '控制您的個人資料可見性',
        href: '/settings/privacy',
        color: 'text-purple-500'
      },
      {
        icon: Globe,
        title: '語言與地區',
        description: '語言、時區和貨幣設定',
        href: '/settings/language',
        color: 'text-blue-500'
      }
    ]
  },
  {
    title: '付款與帳單',
    items: [
      {
        icon: CreditCard,
        title: '付款方式',
        description: '管理您的付款方式和帳單',
        href: '/settings/payment',
        color: 'text-indigo-500'
      }
    ]
  },
  {
    title: '支援',
    items: [
      {
        icon: HelpCircle,
        title: '說明中心',
        description: '常見問題和使用說明',
        href: '/help',
        color: 'text-gray-500'
      }
    ]
  }
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/settings');
      return;
    }
    
    // 模擬載入
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)' 
      }}>
        <HomeButton />
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
          <div className="text-center py-12">
            <Loading size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)' 
    }}>
      <HomeButton />
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">設定</h1>
          <p className="text-lg text-gray-600">管理您的帳戶和偏好設定</p>
        </div>

        {/* 用戶資訊卡片 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User avatar'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {user?.name?.charAt(0) || '?'}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{user?.name || '用戶'}</h3>
                <p className="text-gray-600">{user?.email}</p>
                <div className="flex items-center mt-1">
                  {user?.isEmailVerified ? (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      已驗證
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      待驗證
                    </span>
                  )}
                  <span className="ml-2 text-xs text-gray-500">
                    {user?.role === 'guide' ? '導遊' : user?.role === 'admin' ? '管理員' : '用戶'}
                  </span>
                </div>
              </div>
            </div>
            <Link
              href="/settings/profile"
              className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <Edit className="w-4 h-4 mr-1" />
              編輯
            </Link>
          </div>
        </div>

        {/* 設定選項 */}
        <div className="space-y-8">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h2>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
                {section.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 group-hover:text-gray-700">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 登出按鈕 */}
        <div className="mt-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-red-50 transition-colors group rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <LogOut className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-medium text-red-600">登出</h3>
                  <p className="text-sm text-gray-500">安全地登出您的帳戶</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}