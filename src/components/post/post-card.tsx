'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Bookmark } from 'lucide-react'

interface PostCardProps {
  id: string
  title: string
  content: string
  coverImage?: string
  author: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  category: string
  tags: string[]
  location?: string
  viewCount: number
  likeCount: number
  commentCount: number
  publishedAt: string
  onLike?: (postId: string) => void
  onBookmark?: (postId: string) => void
  isLiked?: boolean
  isBookmarked?: boolean
}

export function PostCard({
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
  onLike,
  onBookmark,
  isLiked = false,
  isBookmarked = false,
}: PostCardProps) {
  const [hovering, setHovering] = useState(false)

  return (
    <Link href={`/posts/${id}`}>
      <div
        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 break-inside-avoid"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* 封面圖片區 - 占 75% 的空間 */}
        {coverImage && (
          <div
            className="relative w-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300"
            style={{ aspectRatio: '3/4' }}
          >
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-transform duration-500 ${
                hovering ? 'scale-105' : 'scale-100'
              }`}
              priority={false}
              loading="lazy"
            />

            {/* 分類徽章 - 左上角 */}
            <div className="absolute top-2 left-2 z-10">
              <span className="inline-block bg-[#002C56]/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold">
                {category}
              </span>
            </div>

            {/* Hover 疊加層 - 底部漸層 + 交互按鈕 */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent transition-opacity duration-300 ${
                hovering ? 'opacity-100' : 'opacity-0'
              } flex flex-col justify-between p-3`}
            >
              {/* 頂部：互動按鈕 */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onBookmark?.(id)
                  }}
                  className={`p-2 rounded-full backdrop-blur-md transition-all ${
                    isBookmarked ? 'bg-yellow-400' : 'bg-white/30 hover:bg-white/50'
                  }`}
                  title="收藏"
                >
                  <Bookmark
                    size={18}
                    fill={isBookmarked ? 'currentColor' : 'none'}
                    className="text-white"
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onLike?.(id)
                  }}
                  className={`p-2 rounded-full backdrop-blur-md transition-all ${
                    isLiked ? 'bg-red-500' : 'bg-white/30 hover:bg-white/50'
                  }`}
                  title="按讚"
                >
                  <Heart
                    size={18}
                    fill={isLiked ? 'currentColor' : 'none'}
                    className="text-white"
                  />
                </button>
              </div>

              {/* 底部：簡短信息 */}
              <div className="text-white">
                <h3 className="font-bold text-sm line-clamp-2 drop-shadow-md">{title}</h3>
                {location && (
                  <p className="text-xs text-gray-100 mt-1 flex items-center gap-1">
                    📍 {location}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 卡片底部資訊區 - 非常簡潔 */}
        <div className="p-2.5 space-y-1.5">
          {/* 標題 */}
          <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-snug">
            {title}
          </h4>

          {/* 作者信息 - 超簡潔 */}
          <div className="flex items-center gap-1.5 text-xs">
            {author.avatar ? (
              <Image
                src={author.avatar}
                alt={author.name}
                width={20}
                height={20}
                className="w-5 h-5 rounded-full"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-[#cfdbe9] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[#002C56]">{author.name[0]}</span>
              </div>
            )}
            <span className="text-gray-700 font-medium truncate">{author.name}</span>
            {author.role === 'GUIDE' && (
              <span className="text-[#002C56] font-bold">✓</span>
            )}
          </div>

          {/* 互動數據 - 最小化 */}
          <div className="flex gap-2 text-gray-600 text-xs">
            <span>💬 {commentCount}</span>
            <span>❤️ {likeCount}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
