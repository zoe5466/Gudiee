'use client'

import { PostFeed } from '@/components/post/post-feed'
import Link from 'next/link'
import { ArrowRight, Plus, Compass, Users, MapPin, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      {/* 簡約 Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#002C56] to-blue-600 bg-clip-text text-transparent">Guidee</h1>
            <p className="text-xs sm:text-sm text-gray-500">發現精彩的旅遊故事</p>
          </div>
          <Link
            href="/posts/create"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#002C56] to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium hover:scale-105"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">新貼文</span>
          </Link>
        </div>
      </div>

      {/* 英雄區域 */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-blue-50/50 pointer-events-none" />
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              <Sparkles size={16} />
              <span>歡迎來到 Guidee 社區</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              探索地陪和旅客的
              <span className="block bg-gradient-to-r from-[#002C56] via-blue-600 to-blue-400 bg-clip-text text-transparent">故事與冒險</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              與來自世界各地的旅遊愛好者連接，發現隱藏的寶石景點，分享你的旅遊經驗和當地見聞。
            </p>
            <Link
              href="/posts/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#002C56] text-white rounded-lg hover:bg-[#001f41] transition-all duration-200 font-medium group shadow-lg hover:shadow-xl"
            >
              開始分享你的故事
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* 功能卡片區域 */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Compass className="text-[#002C56]" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">探索新地點</h3>
            <p className="text-sm text-gray-600">發現世界各地的精彩景點和隱藏寶石，透過真實的旅客故事。</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-[#002C56]" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">連接導遊和旅客</h3>
            <p className="text-sm text-gray-600">與在地導遊聊天，獲得當地專業建議和個人化的旅遊體驗。</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="text-[#002C56]" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">分享你的體驗</h3>
            <p className="text-sm text-gray-600">記錄和分享你的旅遊冒險，幫助其他旅客發現更多可能性。</p>
          </div>
        </div>
      </div>

      {/* 貼文牆部分 */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">最新故事</h3>
            <p className="text-gray-600">探索社區最新分享的旅遊故事和冒險經歷</p>
          </div>
          {/* 貼文牆 */}
          <PostFeed displayMode="grid" />
        </div>
      </div>

      {/* Footer CTA 區域 */}
      <div className="relative mt-16 bg-gradient-to-r from-[#002C56] via-blue-600 to-blue-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')]"></div>
        </div>
        <div className="relative container mx-auto px-4 py-16 sm:py-20 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold mb-4">
            準備開始你的旅遊故事了嗎？
          </h3>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            加入我們充滿活力的旅遊社區，與世界各地的旅客和導遊分享你的見聞和建議。
          </p>
          <Link
            href="/posts/create"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#002C56] rounded-lg hover:bg-blue-50 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl group"
          >
            立即開始寫貼文
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-gray-600">
          <p>加入 Guidee 社區，分享你的旅遊故事，發現無限可能的冒險機會。</p>
        </div>
      </div>
    </div>
  )
}
