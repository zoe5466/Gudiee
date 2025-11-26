'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'

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
      const response = await fetch(`/api/posts/${id}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likeType: 'like' }),
      })

      if (response.ok) {
        const { data } = await response.json()
        setIsLiked(data.isLiked)
        setCurrentLikeCount((prev) => (data.isLiked ? prev + 1 : prev - 1))
      }
    } catch (err) {
      console.error('Like error:', err)
    }
  }

  const handleBookmark = async () => {
    try {
      const response = await fetch(`/api/posts/${id}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likeType: 'bookmark' }),
      })

      if (response.ok) {
        const { data } = await response.json()
        setIsBookmarked(data.isLiked)
      }
    } catch (err) {
      console.error('Bookmark error:', err)
    }
  }

  return (
    <article className="bg-white rounded-lg shadow-lg">
      {/* 封面圖 */}
      {coverImage && (
        <div className="relative w-full h-96 overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-8">
        {/* 標題 */}
        <h1 className="text-4xl font-bold mb-4">{title}</h1>

        {/* 作者和分享資訊 */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {author.avatar ? (
              <Image
                src={author.avatar}
                alt={author.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="font-semibold">{author.name[0]}</span>
              </div>
            )}
            <div>
              <Link href={`/creators/${author.id}`}>
                <p className="font-semibold hover:text-[#002C56]">{author.name}</p>
              </Link>
              <p className="text-sm text-gray-500">{formatDate(publishedAt)}</p>
            </div>
            {author.role === 'GUIDE' && (
              <span className="ml-4 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                認證地陪
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-600'
              }`}
            >
              <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                isBookmarked ? 'text-yellow-500' : 'text-gray-600'
              }`}
            >
              <Bookmark size={24} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
              <Share2 size={24} />
            </button>
          </div>
        </div>

        {/* 分類和標籤 */}
        <div className="mb-6">
          <div className="inline-block bg-[#002C56] text-white px-4 py-2 rounded-full text-sm font-medium mb-3">
            {category}
          </div>
          {location && (
            <p className="text-sm text-gray-600 mb-3">📍 {location}</p>
          )}
          {tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 統計資訊 */}
        <div className="flex gap-6 text-sm text-gray-600 mb-8">
          <span>👁️ {viewCount} 瀏覽</span>
          <span>❤️ {currentLikeCount} 個讚</span>
          <span>💬 {commentCount} 條評論</span>
        </div>

        {/* 主要內容 */}
        <div
          className="prose prose-sm md:prose-base max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* 嵌入的商品 */}
        {embeddedServices.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">推薦商品</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {embeddedServices.map((embed) => (
                <div key={embed.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <Link href={`/services/${embed.service.id}`}>
                    <div>
                      {embed.service.images && embed.service.images[0] && (
                        <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                          <Image
                            src={embed.service.images[0]}
                            alt={embed.service.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <h3 className="font-bold text-lg mb-2 hover:text-[#002C56]">
                        {embed.service.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">📍 {embed.service.location}</p>
                      <p className="text-[#002C56] font-bold text-xl">
                        ${embed.service.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>

                  {embed.customText && (
                    <p className="text-gray-700 text-sm mt-4 p-3 bg-gray-50 rounded italic">
                      &quot;{embed.customText}&quot;
                    </p>
                  )}

                  <button className="mt-4 w-full bg-[#002C56] text-white py-2 rounded-lg hover:bg-[#001f41] transition-colors">
                    查看詳情
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
