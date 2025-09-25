// 重定向到統一的註冊頁面
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // 重定向到統一的註冊頁面
    router.replace('/auth/register');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">正在跳轉到註冊頁面...</p>
      </div>
    </div>
  );
}