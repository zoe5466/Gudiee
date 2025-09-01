'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

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

// 完整導航，包含返回和首頁按鈕
export function FullNavigation({ 
  backButtonText = '返回',
  homeButtonText = '回到首頁',
  customBackAction
}: {
  backButtonText?: string;
  homeButtonText?: string;
  customBackAction?: () => void;
}) {
  return (
    <PageNavigation 
      showHomeButton={true}
      showBackButton={true}
      backButtonText={backButtonText}
      homeButtonText={homeButtonText}
      customBackAction={customBackAction}
    />
  );
}