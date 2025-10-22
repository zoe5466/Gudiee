'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/store/auth';

interface ProfileSetupGuardProps {
  children: React.ReactNode;
}

export function ProfileSetupGuard({ children }: ProfileSetupGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // 如果用戶未登入，不需要檢查
    if (!isAuthenticated || !user) {
      return;
    }

    // 允許訪問的頁面（不需要完成資料設置）
    const allowedPaths = [
      '/profile/setup',
      '/auth/login',
      '/auth/register',
      '/api',
      '/_next'
    ];

    // 檢查當前路徑是否在允許列表中
    const isAllowedPath = allowedPaths.some(path => pathname.startsWith(path));

    // 如果用戶已登入但未完成 KYC 驗證，且不在允許頁面中
    if (!user.isKYCVerified && !isAllowedPath) {
      router.push('/profile/setup');
    }
  }, [isAuthenticated, user, pathname, router]);

  return <>{children}</>;
}