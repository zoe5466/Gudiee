import { PostFeed } from '@/components/post/post-feed'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'

export const revalidate = 0  // Disable caching

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 頂部導航 - 簡約精致 */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-[#002C56]">Guidee</h1>
          </div>
          <Link
            href="/posts/create"
            className="flex items-center gap-2 px-4 py-2 bg-[#002C56] text-white rounded-lg hover:bg-[#001f3f] transition-all duration-200 font-medium text-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">發佈故事</span>
          </Link>
        </div>
      </div>

      {/* 大 Banner 區域 - 形象圖+短標語 */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-gradient-to-r from-[#002C56] to-[#0a4a8f]">
        {/* 背景圖片（示意） */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#002C56]/90 to-[#0a4a8f]/90">
          {/* 装饰背景图案 */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#cfdbe9]/10 rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#cfdbe9]/10 rounded-full -ml-36 -mb-36"></div>
        </div>

        {/* Banner 文字內容 */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            探索世界的故事
          </h2>
          <p className="text-lg sm:text-xl text-[#cfdbe9] mb-8 max-w-2xl">
            與旅遊愛好者、地陪分享冒險經歷
          </p>
          <Link
            href="/posts/create"
            className="px-8 py-3 bg-white text-[#002C56] rounded-lg font-bold hover:bg-[#cfdbe9] transition-all duration-200"
          >
            開始分享
          </Link>
        </div>
      </div>

      {/* 搜尋區域 - 簡約風格 */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="搜尋故事..."
              className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002C56] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* 貼文牆區域 - 小紅書風格瀑布流 */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 區域標題 */}
          <div className="mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">最新故事</h3>
            <div className="h-1 w-12 bg-[#002C56] rounded-full mt-3"></div>
          </div>

          {/* 瀑布流貼文 */}
          <PostFeed displayMode="grid" />
        </div>
      </div>

      {/* 底部 CTA - 簡約風格 */}
      <div className="bg-[#cfdbe9]/15 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            準備分享你的旅遊故事？
          </h3>
          <Link
            href="/posts/create"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#002C56] text-white rounded-lg hover:bg-[#001f3f] transition-all duration-200 font-medium"
          >
            <Plus size={20} />
            發佈新故事
          </Link>
        </div>
      </div>
    </div>
  )
}
