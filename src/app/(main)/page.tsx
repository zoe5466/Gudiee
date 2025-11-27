'use client'

import { PostFeed } from '@/components/post/post-feed'
import Link from 'next/link'
import { ArrowRight, MapPin, Users, Sparkles } from 'lucide-react'
import { Metadata } from 'next'

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - 簡約設計 */}
      <section className="relative overflow-hidden">
        {/* 背景漸變 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#cfdbe9]/20 via-white to-[#cfdbe9]/10" />

        <div className="relative container mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto text-center">
            {/* 標籤 */}
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-[#cfdbe9]/30 rounded-full border border-[#cfdbe9]">
              <Sparkles size={16} className="text-[#002C56]" />
              <span className="text-sm font-medium text-[#002C56]">探索精彩故事</span>
            </div>

            {/* 主標題 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              發現台灣的故事
            </h1>

            {/* 副標題 */}
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              聆聽地陪和旅客分享的精彩冒險。探索隱藏的寶石，找到屬於你的旅遊靈感。
            </p>

            {/* CTA 按鈕 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="#posts"
                className="px-8 py-3 bg-[#002C56] text-white rounded-lg font-medium hover:bg-[#001f41] transition-colors flex items-center justify-center gap-2 group"
              >
                瀏覽故事
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/posts/create"
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-[#002C56] hover:text-[#002C56] transition-colors"
              >
                分享你的故事
              </Link>
            </div>

            {/* 統計卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-100">
                <div className="text-3xl font-bold text-[#002C56] mb-1">1000+</div>
                <p className="text-sm text-gray-600">精彩故事</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-100">
                <div className="text-3xl font-bold text-purple-600 mb-1">500+</div>
                <p className="text-sm text-gray-600">在地導遊</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-xl border border-pink-100">
                <div className="text-3xl font-bold text-pink-600 mb-1">50+</div>
                <p className="text-sm text-gray-600">台灣景點</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 分隔線 */}
      <div className="border-t border-gray-100" />

      {/* 特色介紹 - 簡約卡片 */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">為什麼選擇 Guidee？</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 卡片 1 */}
            <div className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 hover:border-[#cfdbe9] hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-[#cfdbe9] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="text-[#002C56]" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">在地知識</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                從認證地陪那裡獲得第一手的在地知識和隱藏景點推薦
              </p>
            </div>

            {/* 卡片 2 */}
            <div className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 hover:border-[#cfdbe9] hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="text-purple-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">真實故事</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                看真實旅客和導遊分享的親身經歷和建議
              </p>
            </div>

            {/* 卡片 3 */}
            <div className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 hover:border-[#cfdbe9] hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="text-pink-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">靈感探索</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                發現新的旅遊目的地和體驗，啟發你的下一段冒險
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 分隔線 */}
      <div className="border-t border-gray-100" />

      {/* 貼文牆區域 */}
      <section id="posts" className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">精選故事</h2>
          <p className="text-gray-600">來自 Guidee 社區最新和最熱門的內容</p>
        </div>

        <div className="rounded-xl overflow-hidden">
          <PostFeed displayMode="grid" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-gray-100 bg-gradient-to-br from-[#cfdbe9]/20 to-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">準備好分享你的故事了嗎？</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            加入數百位導遊和旅客，分享你的旅遊經驗和建議
          </p>
          <Link
            href="/posts/create"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#002C56] text-white rounded-lg font-medium hover:bg-[#001f41] transition-colors group"
          >
            立即開始寫貼文
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}
