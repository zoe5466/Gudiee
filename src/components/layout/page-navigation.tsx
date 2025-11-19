'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Search, Compass, Home, MapPin, Heart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface PageNavigationProps {
  showBackButton?: boolean;
  backButtonText?: string;
  showHomeButton?: boolean;
  homeButtonText?: string;
  customBackAction?: () => void;
}

export function PageNavigation({
  showBackButton = false,
  backButtonText = '返回',
  showHomeButton = true,
  homeButtonText = '回到首頁',
  customBackAction
}: PageNavigationProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (customBackAction) {
      customBackAction();
    } else {
      router.back();
    }
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <>
      {/* Home Button - Fixed position with responsive design */}
      {showHomeButton && (
        <div 
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            zIndex: 50
          }}
          className="sm:top-8 sm:left-8"
        >
          <button
            onClick={handleHomeClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '0.5rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '0.75rem',
              fontWeight: '500',
              color: '#374151',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
            className="hover:bg-white hover:shadow-md sm:text-sm sm:px-4 sm:py-3"
          >
            <span className="hidden sm:inline">← {homeButtonText}</span>
            <span className="sm:hidden">← 首頁</span>
          </button>
        </div>
      )}

      {/* Back Button - In content flow */}
      {showBackButton && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem', paddingTop: showHomeButton ? '4rem' : '1rem' }}>
          <button 
            onClick={handleBackClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#6b7280',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'color 0.2s',
              padding: '0.5rem 0'
            }}
            className="hover:text-gray-900"
          >
            <ChevronLeft style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>{backButtonText}</span>
          </button>
        </div>
      )}
    </>
  );
}

// 簡化版本，只有回到首頁按鈕
export function HomeButton({ text = '回到首頁' }: { text?: string }) {
  return (
    <PageNavigation 
      showHomeButton={true} 
      homeButtonText={text} 
      showBackButton={false} 
    />
  );
}

// 側邊選單組件
export function SideMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: '首頁', path: '/', color: '#3b82f6' },
    { icon: Search, label: '搜尋服務', path: '/search', color: '#8b5cf6' },
    { icon: Compass, label: '探索', path: '/explore', color: '#06b6d4' },
    { icon: MapPin, label: '附近景點', path: '/nearby', color: '#10b981' },
    { icon: Heart, label: '我的收藏', path: '/my-favorites', color: '#f59e0b' },
    { icon: User, label: '個人資料', path: '/profile', color: '#6b7280' }
  ];

  return (
    <>
      {/* 選單觸發按鈕 */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 60,
          width: '48px',
          height: '48px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        className="hover:bg-white hover:shadow-lg"
      >
        <Menu style={{ width: '24px', height: '24px', color: '#374151' }} />
      </button>

      {/* 側邊選單覆蓋層 */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 70,
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 側邊選單 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: isOpen ? 0 : '-320px',
          width: '320px',
          height: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.3)',
          zIndex: 80,
          transition: 'left 0.3s ease',
          overflowY: 'auto',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* 選單標題 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>G</span>
            </div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#111827',
              margin: 0
            }}>
              Guidee
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            className="hover:bg-gray-100"
          >
            <X style={{ width: '20px', height: '20px', color: '#6b7280' }} />
          </button>
        </div>

        {/* 選單項目 */}
        <div style={{ padding: '1rem' }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1rem',
            paddingLeft: '1rem'
          }}>
            主要功能
          </div>
          
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  router.push(item.path);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  marginBottom: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                className="hover:bg-[#cfdbe9]"
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: `${item.color}15`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon style={{ 
                    width: '20px', 
                    height: '20px', 
                    color: item.color 
                  }} />
                </div>
                <span style={{
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* 底部區域 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1.5rem',
          borderTop: '1px solid rgba(229, 231, 235, 0.5)',
          backgroundColor: 'rgba(249, 250, 251, 0.8)'
        }}>
          <div style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            <p style={{ margin: '0 0 8px 0' }}>探索台灣之美</p>
            <p style={{ margin: 0, fontSize: '0.75rem' }}>與在地導遊一起旅行</p>
          </div>
        </div>
      </div>

      {/* CSS 動畫 */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}

// 快速搜尋按鈕
export function QuickSearchButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/search')}
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 60,
        width: '48px',
        height: '48px',
        backgroundColor: 'rgba(139, 92, 246, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      className="hover:bg-purple-600 hover:shadow-lg"
    >
      <Search style={{ width: '24px', height: '24px', color: 'white' }} />
    </button>
  );
}

// 完整導航，包含返回和首頁按鈕
export function FullNavigation({ 
  backButtonText = '返回',
  homeButtonText = '回到首頁',
  customBackAction,
  showSideMenu = true,
  showQuickSearch = true
}: {
  backButtonText?: string;
  homeButtonText?: string;
  customBackAction?: () => void;
  showSideMenu?: boolean;
  showQuickSearch?: boolean;
}) {
  return (
    <>
      {showSideMenu && <SideMenu />}
      {showQuickSearch && <QuickSearchButton />}
      <PageNavigation 
        showHomeButton={false}
        showBackButton={true}
        backButtonText={backButtonText}
        homeButtonText={homeButtonText}
        customBackAction={customBackAction}
      />
    </>
  );
}

// 簡化版導航，只有側邊選單
export function SimpleNavigation() {
  return (
    <>
      <SideMenu />
      <QuickSearchButton />
    </>
  );
}