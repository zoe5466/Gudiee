'use client';

import { usePathname } from 'next/navigation';
import { useUserMode } from '@/store/user-mode';
import { useEffect, useState } from 'react';
import { GuideSidebar } from './guide-sidebar';
import { Header } from './header';
import { HomeSidebar } from './home-sidebar';
import { NotificationManager } from '@/components/notifications/notification-manager';
import { cn } from '@/lib/utils';

interface DualLayoutProps {
  children: React.ReactNode;
}

export function DualLayout({ children }: DualLayoutProps) {
  const { mode } = useUserMode();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  // 檢查是否為首頁
  const isHomePage = pathname === '/';

  // 確保只在客戶端渲染，避免hydration不匹配
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 在hydration完成前，使用最小化的渲染避免不匹配
  if (!isHydrated) {
    return <>{children}</>;
  }

  if (mode === 'guide') {
    return (
      <div className="bg-white">
        <GuideSidebar />
        <main className="flex-1 lg:ml-80">
          <div className="min-h-screen">
            {children}
          </div>
        </main>
        <HomeSidebar />
        <NotificationManager />
      </div>
    );
  }

  // 首頁完全繞過系統佈局
  if (isHomePage) {
    return (
      <>
        {children}
        <HomeSidebar />
      </>
    );
  }

  // 其他頁面使用標準布局
  return (
    <div className="bg-white">
      <Header />
      <main className="min-h-screen pt-16">
        {children}
      </main>
      <HomeSidebar />
      <NotificationManager />
    </div>
  );
}