import type { Metadata } from 'next'
import { Inter, Noto_Sans_TC } from 'next/font/google'
import { appWithTranslation } from 'next-i18next'
import '@/styles/globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import { DualLayout } from '@/components/layout/dual-layout'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  variable: '--font-noto-sans-tc',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Guidee - 地陪媒合平台',
    template: '%s | Guidee'
  },
  description: '旅遊界的 Uber - 連接在地地陪與旅客的雙邊媒合平台。輕鬆找到可信賴的在地嚮導，讓地陪穩定接案並獲得合理收入。',
  keywords: [
    'guidee', '地陪', '導遊', '旅遊', '媒合平台', 'tour guide', 'travel', 'local guide'
  ],
  authors: [{ name: 'Guidee Team' }],
  creator: 'Guidee',
  publisher: 'Guidee',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://guidee.online'),
  alternates: {
    canonical: '/',
    languages: {
      'zh-TW': '/zh-TW',
      'en': '/en',
      'ja': '/ja',
      'ko': '/ko',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://guidee.online',
    title: 'Guidee - 地陪媒合平台',
    description: '旅遊界的 Uber - 連接在地地陪與旅客的雙邊媒合平台',
    siteName: 'Guidee',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Guidee - 地陪媒合平台',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guidee - 地陪媒合平台',
    description: '旅遊界的 Uber - 連接在地地陪與旅客的雙邊媒合平台',
    images: ['/images/twitter-image.png'],
    creator: '@guidee_tw',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  category: 'travel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ed7411" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body 
        className={`${inter.variable} ${notoSansTC.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}