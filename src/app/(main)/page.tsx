import { Metadata } from 'next';
import { PostFeed } from '@/components/post/post-feed';

export const metadata: Metadata = {
  title: 'Guidee - 發現精彩故事',
  description: '探索地陪和旅客分享的精彩故事和旅遊經驗。',
  keywords: 'guidee,地陪,導遊,旅遊,貼文,旅遊故事',
  authors: [{ name: 'Guidee Team' }],
  creator: 'Guidee',
  publisher: 'Guidee',
  robots: 'index, follow',
  category: 'travel',
};

export default function HomePage() {
  return (
    <div className="bg-[#cfdbe9] min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">發現精彩故事</h1>
          <p className="text-gray-600">探索地陪和旅客分享的精彩故事和旅遊經驗</p>
        </div>

        {/* 貼文牆 */}
        <div className="bg-white rounded-lg p-6">
          <PostFeed displayMode="grid" />
        </div>
      </div>
    </div>
  );
}
