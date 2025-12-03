'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, Bookmark, MapPin, Clock } from 'lucide-react'

interface Author {
  id: string
  name: string
  avatar?: string
  role: string
}

interface EmbeddedService {
  id: string
  title: string
  price: number
  images: string[]
  location: string
}

interface PostDetailProps {
  id: string
  title: string
  content: string
  coverImage?: string
  author: Author
  category: string
  tags: string[]
  location?: string
  viewCount: number
  likeCount: number
  commentCount: number
  publishedAt: string
  embeddedServices?: any[]
}

export function PostDetail({
  id,
  title,
  content,
  coverImage,
  author,
  category,
  tags,
  location,
  viewCount,
  likeCount,
  commentCount,
  publishedAt,
  embeddedServices = [],
}: PostDetailProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount)
  const [error, setError] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleLike = async () => {
    try {
      setError(null)
      const response = await fetch(`/api/posts/${id}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likeType: 'like' }),
      })

      if (response.status === 401) {
        setError('請先登入以讚好貼文')
        return
      }

      if (response.ok) {
        const { data } = await response.json()
        setIsLiked(data.isLiked)
        setCurrentLikeCount((prev) => (data.isLiked ? prev + 1 : prev - 1))
      } else {
        setError('無法讚好貼文，請稍後重試')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error liking post')
    }
  }

  const handleBookmark = async () => {
    try {
      setError(null)
      const response = await fetch(`/api/posts/${id}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likeType: 'bookmark' }),
      })

      if (response.status === 401) {
        setError('請先登入以收藏貼文')
        return
      }

      if (response.ok) {
        const { data } = await response.json()
        setIsBookmarked(data.isLiked)
      } else {
        setError('無法收藏貼文，請稍後重試')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error bookmarking post')
    }
  }

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {/* 封面圖 */}
      {coverImage && (
        <div className="relative w-full h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          {/* 分類徽章 - 浮在圖片上 */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-[#002C56] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              {category}
            </span>
          </div>
        </div>
      )}

      <div className="p-6 sm:p-8">
        {/* 錯誤提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* 標題和作者區域 */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 leading-tight">
            {title}
          </h1>

          {/* 作者卡片 */}
          <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-gradient-to-r from-[#cfdbe9]/30 to-transparent rounded-xl">
            <div className="flex items-center gap-3">
              {author.avatar ? (
                <div className="relative w-14 h-14 flex-shrink-0">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="rounded-full object-cover border-2 border-[#002C56]"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#cfdbe9] flex items-center justify-center flex-shrink-0 border-2 border-[#002C56]">
                  <span className="font-bold text-[#002C56]">{author.name[0]}</span>
                </div>
              )}
              <div>
                <Link href={`/creators/${author.id}`}>
                  <p className="font-bold text-gray-900 hover:text-[#002C56] transition-colors">
                    {author.name}
                  </p>
                </Link>
                {author.role === 'GUIDE' && (
                  <span className="text-xs font-bold text-[#002C56] uppercase tracking-wide">
                    ✓ 認證地陪
                  </span>
                )}
              </div>
            </div>

            {/* 互動按鈕 */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleLike}
                className={`p-2 rounded-lg transition-all ${
                  isLiked
                    ? 'bg-red-100 text-red-500'
                    : 'hover:bg-[#cfdbe9] text-gray-600'
                }`}
                title="按讚"
              >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-all ${
                  isBookmarked
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'hover:bg-[#cfdbe9] text-gray-600'
                }`}
                title="收藏"
              >
                <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
              <button className="p-2 rounded-lg hover:bg-[#cfdbe9] text-gray-600 transition-all" title="分享">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* 位置和時間 */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
          {location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={16} className="text-[#002C56]" />
              <span>{location}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock size={16} className="text-[#002C56]" />
            <span>{formatDate(publishedAt)}</span>
          </div>
        </div>

        {/* 標籤 */}
        {tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-bold text-[#002C56] bg-[#cfdbe9]/50 px-3 py-1 rounded-full hover:bg-[#cfdbe9] transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 統計資訊 - 簡約風格 */}
        <div className="flex gap-6 text-sm font-medium text-gray-700 mb-6 pb-6 border-b border-gray-100">
          <span>{viewCount} 瀏覽</span>
          <span>{currentLikeCount} 個讚</span>
          <span>{commentCount} 條評論</span>
        </div>

        {/* 主要內容 */}
        <div className="mb-8 text-gray-700 leading-relaxed">
          <div
            className="prose prose-sm max-w-none space-y-4"
            dangerouslySetInnerHTML={{
              __html: content
                .replace(/<h2>/g, '<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-900">')
                .replace(/<h3>/g, '<h3 class="text-lg font-bold mt-6 mb-3 text-gray-900">')
                .replace(/<p>/g, '<p class="mb-4 text-gray-700 leading-relaxed text-base">')
            }}
          />
        </div>

        {/* 嵌入的商品 */}
        {embeddedServices && embeddedServices.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">相關推薦</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {embeddedServices.map((embed) => (
                <Link key={embed.id} href={`/services/${embed.service.id}`}>
                  <div className="group border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all hover:border-[#002C56]/20 cursor-pointer bg-gradient-to-br from-white to-[#cfdbe9]/10">
                    {embed.service.images && embed.service.images[0] && (
                      <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={embed.service.images[0]}
                          alt={embed.service.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-[#002C56] transition-colors line-clamp-2">
                      {embed.service.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
                      <MapPin size={14} className="text-[#002C56]" />
                      {embed.service.location}
                    </p>
                    <p className="text-[#002C56] font-bold text-lg">
                      ${embed.service.price.toLocaleString()}
                    </p>

                    {embed.customText && (
                      <p className="text-gray-600 text-sm mt-4 p-3 bg-[#cfdbe9]/30 rounded-lg italic border-l-2 border-[#002C56]">
                        "{embed.customText}"
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
