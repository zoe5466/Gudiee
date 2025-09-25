// 重定向到統一的導遊儀表板頁面
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GuideDashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // 重定向到統一的導遊儀表板頁面
    router.replace('/guide/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">正在跳轉到導遊儀表板...</p>
      </div>
    </div>
  );
}