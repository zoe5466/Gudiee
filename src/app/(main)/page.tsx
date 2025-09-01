import { Metadata } from 'next';
import { Hero } from '@/components/features/home/hero';
import { FeaturedServices } from '@/components/features/home/featured-services';
import { Features } from '@/components/features/home/features';
import { HowItWorks } from '@/components/features/home/how-it-works';
import { Statistics } from '@/components/features/home/statistics';
import { Testimonials } from '@/components/features/home/testimonials';
import { CallToAction } from '@/components/features/home/call-to-action';

export const metadata: Metadata = {
  title: 'Guidee - 地陪媒合平台｜旅遊界的 Uber',
  description: '連接在地地陪與旅客的雙邊媒合平台。輕鬆找到可信賴的在地嚮導，享受專業導覽服務。地陪穩定接案，獲得合理收入。立即加入 Guidee！',
  keywords: 'guidee,地陪,導遊,旅遊,媒合平台,tour guide,travel,local guide',
  authors: [{ name: 'Guidee Team' }],
  creator: 'Guidee',
  publisher: 'Guidee',
  robots: 'index, follow',

  category: 'travel',
  alternates: {
    canonical: 'https://guidee.online/',
    languages: {
      'zh-TW': 'https://guidee.online/zh-TW',
      'en': 'https://guidee.online/en',
      'ja': 'https://guidee.online/ja',
      'ko': 'https://guidee.online/ko',
    },
  },
  openGraph: {
    title: 'Guidee - 地陪媒合平台｜旅遊界的 Uber',
    description: '連接在地地陪與旅客的雙邊媒合平台。輕鬆找到可信賴的在地嚮導，享受專業導覽服務。',
    type: 'website',
    locale: 'zh_TW',
    siteName: 'Guidee',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@guidee_tw',
    title: 'Guidee - 地陪媒合平台',
    description: '旅遊界的 Uber - 連接在地地陪與旅客的雙邊媒合平台',
    images: ['http://localhost:3000/images/twitter-image.png'],
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedServices />
      <Features />
      <HowItWorks />
      <Statistics />
      <Testimonials />
      <CallToAction />
    </>
  );
}