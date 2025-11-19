'use client';

import { useEffect, useState } from 'react';
import { Bell, X, Check, Settings } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@/store/auth';

interface NotificationManagerProps {
  className?: string;
}

export function NotificationManager({ className = '' }: NotificationManagerProps) {
  const { user } = useAuth();
  const {
    permission,
    isSupported,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
    sendLocalNotification
  } = usePushNotifications();

  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 自動初始化通知
  useEffect(() => {
    if (user && isSupported && permission === 'default') {
      // 延遲一點再請求權限，避免太突兀
      const timer = setTimeout(() => {
        setShowSettings(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [user, isSupported, permission]);

  const handleEnableNotifications = async () => {
    if (!isSupported) return;

    setIsLoading(true);
    try {
      const result = await requestPermission();
      if (result === 'granted') {
        await subscribe();
        setShowSettings(false);
        
        // 發送歡迎通知
        setTimeout(() => {
          sendLocalNotification({
            title: '通知已啟用！',
            body: '您將收到預訂確認、新訊息等重要通知',
            icon: '/icons/notification-success.png',
            tag: 'welcome-notification'
          });
        }, 1000);
      }
    } catch (error) {
      console.error('啟用通知失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setIsLoading(true);
    try {
      await unsubscribe();
      setShowSettings(false);
    } catch (error) {
      console.error('關閉通知失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestNotification = () => {
    if (permission === 'granted') {
      sendLocalNotification({
        title: '測試通知',
        body: '這是一個測試通知，確認通知功能正常運作',
        icon: '/icons/test-notification.png',
        tag: 'test-notification'
      });
    }
  };

  if (!user || !isSupported) {
    return null;
  }

  return (
    <>
      {/* 通知設定提示 */}
      {showSettings && permission !== 'granted' && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          left: '1rem',
          maxWidth: '400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          padding: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          zIndex: 1000,
          animation: 'slideInDown 0.3s ease-out'
        }} className={className}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Bell style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                啟用通知功能
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                接收預訂確認、新訊息和重要更新通知，讓您不錯過任何重要資訊。
              </p>
              
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={handleEnableNotifications}
                  disabled={isLoading}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  className="hover:bg-blue-600"
                >
                  {isLoading ? (
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  ) : (
                    <Check style={{ width: '1rem', height: '1rem' }} />
                  )}
                  {isLoading ? '啟用中...' : '啟用通知'}
                </button>
                
                <button
                  onClick={() => setShowSettings(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                  className="hover:bg-[#cfdbe9]"
                >
                  稍後再說
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowSettings(false)}
              style={{
                padding: '0.25rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                flexShrink: 0
              }}
              className="hover:bg-gray-100"
            >
              <X style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
            </button>
          </div>
        </div>
      )}

      {/* 通知狀態指示器 */}
      <div style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 999
      }}>
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{
            width: '2.5rem',
            height: '2.5rem',
            backgroundColor: permission === 'granted' ? '#10b981' : '#6b7280',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s'
          }}
          className="hover:scale-105"
          title={permission === 'granted' ? '通知已啟用' : '點擊啟用通知'}
        >
          <Bell style={{
            width: '1.25rem',
            height: '1.25rem',
            color: 'white'
          }} />
          
          {permission === 'granted' && isSubscribed && (
            <div style={{
              position: 'absolute',
              top: '-0.125rem',
              right: '-0.125rem',
              width: '0.75rem',
              height: '0.75rem',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              border: '2px solid white'
            }} />
          )}
        </button>

        {/* 通知設定面板 */}
        {showSettings && permission === 'granted' && (
          <div style={{
            position: 'absolute',
            top: '3rem',
            left: 0,
            width: '280px',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Settings style={{ width: '1rem', height: '1rem' }} />
              通知設定
            </div>
            
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#f0f9ff',
              borderRadius: '0.375rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#0369a1',
                marginBottom: '0.25rem'
              }}>
                通知狀態：已啟用
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#0284c7'
              }}>
                訂閱狀態：{isSubscribed ? '已訂閱' : '未訂閱'}
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <button
                onClick={handleTestNotification}
                style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                className="hover:bg-gray-100"
              >
                發送測試通知
              </button>
              
              <button
                onClick={handleDisableNotifications}
                disabled={isLoading}
                style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  color: '#dc2626',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  opacity: isLoading ? 0.6 : 1
                }}
                className="hover:bg-red-100"
              >
                {isLoading ? '處理中...' : '關閉通知'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}