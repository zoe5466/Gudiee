import { useRouter } from 'next/router'
import { useTranslation as useNextTranslation } from 'next-i18next'

export function useTranslation(namespace?: string) {
  const { t, i18n } = useNextTranslation(namespace)
  const router = useRouter()
  
  const changeLanguage = async (locale: string) => {
    await router.push(router.asPath, router.asPath, { locale })
  }
  
  const getCurrentLanguage = () => {
    return i18n.language || 'zh-TW'
  }
  
  const getLanguages = () => {
    return [
      { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'ko', name: '한국어', flag: '🇰🇷' },
    ]
  }
  
  return {
    t,
    i18n,
    changeLanguage,
    getCurrentLanguage,
    getLanguages,
    currentLocale: getCurrentLanguage(),
  }
}

// Helper function for pages that need translation props
export function getI18nProps(locale: string, namespaces: string[] = ['common']) {
  return {
    ...(namespaces.length > 0 && {
      locale,
    }),
  }
}