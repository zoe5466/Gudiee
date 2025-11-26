'use client'

import React, { useState } from 'react'
import { PostFeed } from '@/components/post/post-feed'

const CATEGORIES = [
  { id: 'all', label: '全部' },
  { id: 'food', label: '美食', icon: '🍜' },
  { id: 'culture', label: '文化', icon: '🏛️' },
  { id: 'nature', label: '自然', icon: '🏔️' },
  { id: 'city', label: '城市', icon: '🏙️' },
  { id: 'nightlife', label: '夜生活', icon: '🌃' },
  { id: 'shopping', label: '購物', icon: '🛍️' },
  { id: 'history', label: '歷史', icon: '🏯' },
  { id: 'beach', label: '海岸', icon: '🏖️' },
]

const SORT_OPTIONS = [
  { id: 'latest', label: '最新' },
  { id: 'popular', label: '最熱' },
  { id: 'trending', label: '趨勢' },
]

export default function FeedPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest')

  return (
    <div className="bg-[#cfdbe9] min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">探索貼文</h1>
          <p className="text-gray-600">發現地陪和旅客分享的精彩故事</p>
        </div>

        {/* 分類篩選 */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">分類</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#002C56] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.icon && <span className="mr-1">{category.icon}</span>}
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* 排序選項 */}
        <div className="mb-8 flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700">排序:</span>
          <div className="flex gap-2">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortBy === option.id
                    ? 'bg-[#002C56] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 貼文列表 */}
        <div className="bg-white rounded-lg p-6">
          <PostFeed
            category={selectedCategory !== 'all' ? selectedCategory : undefined}
            sortBy={sortBy}
            displayMode="grid"
          />
        </div>
      </div>
    </div>
  )
}
