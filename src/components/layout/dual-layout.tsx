'use client';

import { usePathname } from 'next/navigation';
import { useUserMode } from '@/store/user-mode';
import { GuideSidebar } from './guide-sidebar';
import { TravelerBottomNav } from './traveler-bottom-nav';
import { Header } from './header';
import { CustomerSupportChat } from '@/components/chat/customer-support-chat';
import { NotificationManager } from '@/components/notifications/notification-manager';
import { cn } from '@/lib/utils';

interface DualLayoutProps {
  children: React.ReactNode;
}

export function DualLayout({ children }: DualLayoutProps) {
  const { mode } = useUserMode();
  const pathname = usePathname();
  
  // 檢查是否為首頁
  const isHomePage = pathname === '/';

  if (mode === 'guide') {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <GuideSidebar />
        <main className="flex-1 lg:ml-80">
          <div className="min-h-screen">
            {children}
          </div>
        </main>
        <CustomerSupportChat />
        <NotificationManager />
      </div>
    );
  }

  // 首頁完全繞過系統佈局
  if (isHomePage) {
    return <>{children}</>;
  }

  // 其他頁面使用標準布局
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className={cn(
        "min-h-screen pt-16",
        "pb-20" // 為底部導航留空間
      )}>
        {children}
      </main>
      <TravelerBottomNav />
      <CustomerSupportChat />
      <NotificationManager />
    </div>
  );
}