'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Clock, Calendar, MessageSquare, DollarSign, Star, User, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { useAuth } from '@/store/auth';

interface Notification {
  id: string;
  type: 'booking' | 'message' | 'payment' | 'review' | 'system' | 'promotion';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: {
    bookingId?: string;
    messageId?: string;
    paymentId?: string;
    reviewId?: string;
    userId?: string;
  };
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export default function NotificationCenter({ isOpen, onClose, className = '' }: NotificationCenterProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'booking' | 'message' | 'payment'>('all');

  // 模擬通知數據
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'booking',
      title: '新預訂確認',
      message: '您有一筆來自張小明的新預訂需要確認',
      isRead: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      priority: 'high',
      actionUrl: '/guide-dashboard?tab=bookings',
      metadata: { bookingId: 'booking-123', userId: 'user-456' }
    },
    {
      id: '2',
      type: 'message',
      title: '新訊息',
      message: '李小華向您發送了一則新訊息',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      actionUrl: '/messages/conversation-456',
      metadata: { messageId: 'msg-789', userId: 'user-789' }
    },
    {
      id: '3',
      type: 'payment',
      title: '付款已收到',
      message: '您已收到來自預訂 #12345 的付款 NT$ 2,400',
      isRead: true,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      actionUrl: '/guide-dashboard?tab=earnings',
      metadata: { paymentId: 'pay-101', bookingId: 'booking-12345' }
    },
    {
      id: '4',
      type: 'review',
      title: '新評價',
      message: '王大明給了您 5 星評價：「非常專業的導遊服務！」',
      isRead: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'low',
      actionUrl: '/guide-dashboard?tab=reviews',
      metadata: { reviewId: 'review-202', userId: 'user-303' }
    },
    {
      id: '5',
      type: 'system',
      title: '帳戶驗證完成',
      message: '您的 KYC 身分驗證已通過，現在可以開始接受預訂了！',
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      actionUrl: '/profile',
      metadata: {}
    },
    {
      id: '6',
      type: 'promotion',
      title: '促銷活動',
      message: '春季促銷活動開始了！提升您的服務曝光度，獲得更多預訂。',
      isRead: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'low',
      actionUrl: '/guide-dashboard?tab=services',
      metadata: {}
    }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      // 實際應該調用 API
      // await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      // 實際應該調用 API
      // await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
      
      // 實際應該調用 API
      // await fetch(`/api/notifications/${notificationId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type'], priority: Notification['priority']) => {
    const baseProps = { 
      className: `w-5 h-5 ${priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`
    };

    switch (type) {
      case 'booking':
        return <Calendar {...baseProps} />;
      case 'message':
        return <MessageSquare {...baseProps} />;
      case 'payment':
        return <DollarSign {...baseProps} />;
      case 'review':
        return <Star {...baseProps} />;
      case 'system':
        return <Info {...baseProps} />;
      case 'promotion':
        return <AlertCircle {...baseProps} />;
      default:
        return <Bell {...baseProps} />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black bg-opacity-25"
        onClick={onClose}
      />

      {/* Notification Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md z-50 bg-white shadow-xl transform transition-transform duration-300 ${className}`}
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">通知中心</h2>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 mt-4 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: '全部' },
              { key: 'unread', label: '未讀' },
              { key: 'booking', label: '預訂' },
              { key: 'message', label: '訊息' },
              { key: 'payment', label: '付款' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  filter === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <button
              onClick={markAllAsRead}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              <span>全部標為已讀</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Bell className="w-12 h-12 mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">沒有通知</h3>
              <p className="text-sm text-center">
                {filter === 'unread' ? '所有通知都已讀取' : '目前沒有任何通知'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`relative p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${
                    !notification.isRead ? 'bg-blue-50' : 'bg-white'
                  } ${getPriorityColor(notification.priority)}`}
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsRead(notification.id);
                    }
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl;
                    }
                  }}
                >
                  <div className="flex space-x-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 pt-1">
                      {getNotificationIcon(notification.type, notification.priority)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-gray-400 hover:text-red-500 p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.createdAt), { 
                            addSuffix: true, 
                            locale: zhTW 
                          })}
                        </span>
                        
                        {notification.priority === 'high' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            緊急
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {filteredNotifications.length} 則通知
            </span>
            <button
              onClick={() => {
                // 可以導向完整的通知歷史頁面
                window.location.href = '/notifications';
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              查看全部
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// 通知鈴鐺組件
export function NotificationBell({ onClick, unreadCount }: { onClick: () => void; unreadCount: number }) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
    >
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}