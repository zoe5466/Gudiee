'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { ChatInterface } from './chat-interface';
import { useAuth } from '@/store/auth';

interface CustomerSupportChatProps {
  className?: string;
}

export function CustomerSupportChat({ className = '' }: CustomerSupportChatProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // 模擬新訊息通知
  useEffect(() => {
    if (!isOpen && user) {
      const interval = setInterval(() => {
        if (Math.random() > 0.9) { // 10% 機率
          setUnreadCount(prev => prev + 1);
        }
      }, 30000); // 每30秒檢查一次

      return () => clearInterval(interval);
    }
    return undefined;
  }, [isOpen, user]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!user) {
    return null; // 只有登入用戶才顯示客服聊天
  }

  return (
    <>
      {/* 客服聊天按鈕 */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '3.5rem',
            height: '3.5rem',
            backgroundColor: '#3b82f6',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s',
            zIndex: 1000
          }}
          className={`hover:scale-105 hover:shadow-lg ${className}`}
        >
          <MessageCircle style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
          
          {/* 未讀訊息數量 */}
          {unreadCount > 0 && (
            <div style={{
              position: 'absolute',
              top: '-0.25rem',
              right: '-0.25rem',
              width: '1.25rem',
              height: '1.25rem',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'white',
              border: '2px solid white'
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </button>
      )}

      {/* 客服聊天視窗 */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '24rem',
          height: isMinimized ? 'auto' : '32rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          zIndex: 1000,
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out'
        }}>
          {/* 標題列 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            backgroundColor: '#3b82f6',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageCircle style={{ width: '1rem', height: '1rem' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                  客服中心
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                  我們在線為您服務
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleMinimize}
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
                className="hover:bg-white hover:bg-opacity-20"
              >
                {isMinimized ? (
                  <Maximize2 style={{ width: '0.875rem', height: '0.875rem' }} />
                ) : (
                  <Minimize2 style={{ width: '0.875rem', height: '0.875rem' }} />
                )}
              </button>
              
              <button
                onClick={handleClose}
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
                className="hover:bg-white hover:bg-opacity-20"
              >
                <X style={{ width: '0.875rem', height: '0.875rem' }} />
              </button>
            </div>
          </div>

          {/* 聊天內容 */}
          {!isMinimized && (
            <div style={{ height: 'calc(32rem - 4rem)' }}>
              <ChatInterface
                recipientId="support"
                recipientName="客服中心"
                chatType="customer_support"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}