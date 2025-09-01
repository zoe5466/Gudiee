'use client'

import * as React from 'react'
import { Toaster } from '@/components/ui/toaster'
import { I18nProvider } from '@/components/providers/i18n-provider'
import { detectBrowserLocale } from '@/hooks/useI18n'

export function Providers({ children }: { children: React.ReactNode }) {
  const defaultLocale = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      return detectBrowserLocale();
    }
    return 'zh-TW';
  }, []);

  return (
    <I18nProvider defaultLocale={defaultLocale}>
      {children}
      <Toaster />
    </I18nProvider>
  )
}