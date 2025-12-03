import { PostFeed } from '@/components/post/post-feed'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const revalidate = 0  // Disable caching

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 導航 Header - 簡約設計 */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#002C56]">Guidee</h1>
            <p className="text-xs text-gray-500">發現精彩的旅遊故事</p>
          </div>
          <Link
            href="/posts/create"
            className="flex items-center gap-2 px-4 py-2 bg-[#002C56] text-white rounded-lg hover:bg-[#001f3f] transition-all duration-200 font-medium"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">新貼文</span>
          </Link>
        </div>
      </div>

      {/* 簡約 Banner 區域 */}
      <div className="bg-gradient-to-b from-[#cfdbe9]/20 to-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              探索地陪和旅客的故事
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-6">
              發現世界各地的精彩故事，與旅遊愛好者連接、分享冒險經歷
            </p>
          </div>
        </div>
      </div>

      {/* 搜尋和篩選區域 - 可選 */}
      <div className="container mx-auto px-4 py-4 border-b border-gray-100">
        <div className="flex gap-2 flex-wrap items-center justify-center">
          <input
            type="text"
            placeholder="搜尋故事..."
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002C56] focus:border-transparent"
          />
        </div>
      </div>

      {/* 主要內容區域 - 貼文牆 */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900">最新故事</h3>
          <p className="text-sm text-gray-600 mt-1">瀏覽社區最新分享的旅遊冒險</p>
        </div>
        {/* 貼文牆 - 瀑布流佈局 */}
        <PostFeed displayMode="grid" />
      </div>

      {/* 底部 CTA - 簡約版本 */}
      <div className="bg-[#cfdbe9]/30 py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            開始分享你的旅遊故事
          </h3>
          <p className="text-gray-600 mb-6">
            加入我們的社區，與世界各地的旅客和導遊分享你的見聞
          </p>
          <Link
            href="/posts/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#002C56] text-white rounded-lg hover:bg-[#001f3f] transition-all duration-200 font-medium"
          >
            <Plus size={18} />
            撰寫新貼文
          </Link>
        </div>
      </div>
    </div>
  )
}
