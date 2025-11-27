'use client'

import { PostFeed } from '@/components/post/post-feed'
import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 簡約 Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Guidee</h1>
            <p className="text-sm text-gray-500">發現精彩的旅遊故事</p>
          </div>
          <Link
            href="/posts/create"
            className="flex items-center gap-2 px-4 py-2 bg-[#002C56] text-white rounded-lg hover:bg-[#001f41] transition-colors font-medium"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">新貼文</span>
          </Link>
        </div>
      </div>

      {/* 主要內容 */}
      <div className="container mx-auto px-4 py-8">
        {/* 標題區域 */}
        <div className="mb-8 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            探索地陪和旅客的故事
          </h2>
          <p className="text-gray-600 text-lg">
            看看在地導遊和旅客分享的精彩冒險，找到你的下一個旅遊靈感
          </p>
        </div>

        {/* 貼文牆 */}
        <PostFeed displayMode="grid" />
      </div>

      {/* Footer CTA */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto px-4 py-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            分享你的旅遊故事
          </h3>
          <p className="text-gray-600 mb-6">
            成為 Guidee 社區的一員，分享你的經驗和建議
          </p>
          <Link
            href="/posts/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#002C56] text-white rounded-lg hover:bg-[#001f41] transition-colors font-medium group"
          >
            立即開始寫貼文
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
