'use client'

import { useState } from 'react'
import { useI18n } from '@/components/providers/i18n-provider'
import { SupportedLocale, localeInfo } from '@/hooks/useI18n'
import { ChevronDown, Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const languages = Object.entries(localeInfo).map(([code, data]) => ({
    code: code as SupportedLocale,
    name: data.name,
    flag: data.flag
  }))
  const currentLangData = languages.find(lang => lang.code === locale)

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale as SupportedLocale)
    setIsOpen(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          backgroundColor: 'white',
          cursor: 'pointer',
          transition: 'all 0.2s',
          fontSize: '0.875rem'
        }}
        className="hover:bg-[#cfdbe9] hover:border-gray-300"
      >
        <Globe style={{ width: '16px', height: '16px' }} />
        <span>{currentLangData?.flag}</span>
        <span>{currentLangData?.name}</span>
        <ChevronDown 
          style={{ 
            width: '14px', 
            height: '14px',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} 
        />
      </button>
      
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.25rem)',
            right: '0',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: 50,
            minWidth: '150px'
          }}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                textAlign: 'left',
                fontSize: '0.875rem',
                border: 'none',
                backgroundColor: locale === language.code ? '#f3f4f6' : 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              className="hover:bg-[#cfdbe9] first:rounded-t-[0.4rem] last:rounded-b-[0.4rem]"
            >
              <span style={{ fontSize: '1.125rem' }}>{language.flag}</span>
              <span>{language.name}</span>
              {locale === language.code && (
                <span style={{ marginLeft: 'auto', color: '#3b82f6', fontSize: '0.75rem' }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// 簡化版本用於手機版
export function LanguageSwitcherMobile() {
  const { locale } = useI18n()

  const languages = Object.entries(localeInfo).map(([code, data]) => ({
    code: code as SupportedLocale,
    name: data.name,
    flag: data.flag
  }))
  const currentLangData = languages.find(lang => lang.code === locale)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem',
        fontSize: '0.875rem'
      }}
    >
      <Globe style={{ width: '16px', height: '16px' }} />
      <span>{currentLangData?.flag}</span>
      <span>{currentLangData?.name}</span>
    </div>
  )
}