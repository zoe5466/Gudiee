'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Heart, 
  MessageCircle, 
  ClipboardList, 
  User 
} from 'lucide-react';

const navItems = [
  {
    title: '探索',
    href: '/',
    icon: Search,
  },
  {
    title: '收藏',
    href: '/favorites',
    icon: Heart,
  },
  {
    title: '行程',
    href: '/tasks',
    icon: ClipboardList,
  },
  {
    title: '訊息',
    href: '/chat',
    icon: MessageCircle,
  },
  {
    title: '個人',
    href: '/profile',
    icon: User,
  },
];

export function TravelerBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="px-2 py-1">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1"
              >
                <Icon className={cn(
                  "w-5 h-5 mb-1",
                  isActive 
                    ? "text-[#002C56]" 
                    : "text-gray-400"
                )} />
                <span className={cn(
                  "text-xs font-medium",
                  isActive 
                    ? "text-[#002C56]" 
                    : "text-gray-500"
                )}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}