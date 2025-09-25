// 訂單狀態徽章組件
// 功能：提供統一的訂單狀態顯示，消除重複代碼
'use client';

import { AlertCircle, CheckCircle, Clock, CreditCard, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@/types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const STATUS_CONFIG = {
  DRAFT: { 
    text: '草稿', 
    color: 'bg-gray-100 text-gray-800', 
    icon: AlertCircle 
  },
  PENDING: { 
    text: '待確認', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: AlertCircle 
  },
  CONFIRMED: { 
    text: '已確認', 
    color: 'bg-blue-100 text-blue-800', 
    icon: CheckCircle 
  },
  PAID: { 
    text: '已付款', 
    color: 'bg-green-100 text-green-800', 
    icon: CreditCard 
  },
  IN_PROGRESS: { 
    text: '進行中', 
    color: 'bg-purple-100 text-purple-800', 
    icon: Clock 
  },
  COMPLETED: { 
    text: '已完成', 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle 
  },
  CANCELLED: { 
    text: '已取消', 
    color: 'bg-red-100 text-red-800', 
    icon: X 
  },
  REFUNDED: { 
    text: '已退款', 
    color: 'bg-gray-100 text-gray-800', 
    icon: RefreshCw 
  }
} as const;

/**
 * 訂單狀態徽章組件
 * 
 * @param status - 訂單狀態
 * @param className - 額外的 CSS 類名
 */
export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const Icon = config.icon;

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
        config.color,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {config.text}
    </span>
  );
}