'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { SupportedLocale, localeInfo } from '@/hooks/useI18n';
import { useI18n } from '@/components/providers/i18n-provider';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'inline';
  showFlag?: boolean;
  showNativeName?: boolean;
  className?: string;
}

export function LanguageSwitcher({ 
  variant = 'dropdown',
  showFlag = false,
  showNativeName = true,
  className = ''
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 修復 hydration 問題
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickOnButton = buttonRef.current?.contains(target);
      const isClickOnDropdown = document.querySelector('[data-language-dropdown]')?.contains(target);
      
      if (!isClickOnButton && !isClickOnDropdown) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {}; // Return empty cleanup function when isOpen is false
  }, [isOpen]);

  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.right - 192, // 12rem = 192px
        width: 192
      });
    }
  };

  const handleToggleOpen = () => {
    if (!isOpen) {
      updateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  const handleLocaleChange = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  const currentLocaleInfo = localeInfo[locale];

  // 服務器端渲染時顯示通用版本，避免 hydration 錯誤
  if (!isClient) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {Object.entries(localeInfo).map(([localeKey, info]) => (
          <button
            key={localeKey}
            onClick={() => handleLocaleChange(localeKey as SupportedLocale)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid',
              borderColor: locale === localeKey ? '#2563eb' : '#e5e7eb',
              backgroundColor: locale === localeKey ? '#eff6ff' : 'white',
              color: locale === localeKey ? '#2563eb' : '#6b7280',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            className="hover:border-blue-300"
          >
            {showNativeName && (
              <span>
                {localeKey === 'zh-TW' ? '中文（繁體）' : 
                 localeKey === 'en' ? 'English' : 
                 info.nativeName}
              </span>
            )}
            {locale === localeKey && <Check style={{ width: '0.875rem', height: '0.875rem' }} />}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }} className={className}>
      <button
        ref={buttonRef}
        onClick={handleToggleOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          cursor: 'pointer',
          transition: 'all 0.2s',
          minWidth: '8rem'
        }}
        className="hover:bg-gray-50 hover:border-gray-300"
      >
        <Globe style={{ width: '1rem', height: '1rem' }} />
        {showNativeName && (
          <span>
            {locale === 'zh-TW' ? '中文（繁體）' : 
             locale === 'en' ? 'English' : 
             currentLocaleInfo.nativeName}
          </span>
        )}
        <ChevronDown 
          style={{ 
            width: '0.875rem', 
            height: '0.875rem',
            marginLeft: 'auto',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} 
        />
      </button>

      {isOpen && isClient && createPortal(
        <div 
          data-language-dropdown
          style={{
            position: 'fixed',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: 10000,
            overflow: 'hidden'
          }}>
          {Object.entries(localeInfo).map(([localeKey, info]) => (
            <button
              key={localeKey}
              onClick={() => handleLocaleChange(localeKey as SupportedLocale)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                fontSize: '0.875rem',
                color: locale === localeKey ? '#2563eb' : '#374151',
                backgroundColor: locale === localeKey ? '#f8fafc' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              className="hover:bg-gray-50"
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500' }}>
                  {localeKey === 'zh-TW' ? '中文（繁體）' : 
                   localeKey === 'en' ? 'English' : 
                   info.nativeName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {localeKey === 'zh-TW' ? 'Traditional Chinese' : 
                   localeKey === 'en' ? 'English' : 
                   info.name}
                </div>
              </div>
              {locale === localeKey && (
                <Check style={{ width: '1rem', height: '1rem', color: '#2563eb' }} />
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

// 簡化版語言切換按鈕
export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const toggleLanguage = () => {
    const locales: SupportedLocale[] = ['zh-TW', 'en'];
    const currentIndex = locales.indexOf(locale);
    const nextIndex = (currentIndex + 1) % locales.length;
    const nextLocale = locales[nextIndex];
    if (nextLocale) {
      setLocale(nextLocale);
    }
  };

  // 獲取當前語言文字
  const getLanguageText = (currentLocale: SupportedLocale) => {
    return currentLocale === 'zh-TW' ? '中文（繁體）' : 'English';
  };

  // 獲取下一個語言文字
  const getNextLanguageText = (currentLocale: SupportedLocale) => {
    return currentLocale === 'zh-TW' ? 'English' : '中文（繁體）';
  };

  // 服務器端渲染時顯示通用版本
  if (!isClient) {
    return (
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.5rem 0.75rem',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151'
        }}
        className={`hover:bg-gray-50 ${className}`}
      >
        <Globe className="w-4 h-4 text-gray-500 mr-2" />
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem 0.75rem',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151'
      }}
      className={`hover:bg-gray-50 ${className}`}
      title={`切換到 ${getNextLanguageText(locale)}`}
    >
      <Globe className="w-4 h-4 text-gray-500 mr-2" />
      {getLanguageText(locale)}
    </button>
  );
}