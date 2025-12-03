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
  const [showOverlay, setShowOverlay] = useState(false)

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffHours < 1) return '剛剛'
    if (diffHours < 24) return `${diffHours}小時前`
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}天前`

    return date.toLocaleDateString('zh-TW')
  }

  return (
    <Link href={`/posts/${id}`}>
      <div
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 break-inside-avoid"
        onMouseEnter={() => {
          setHovering(true)
          setShowOverlay(true)
        }}
        onMouseLeave={() => {
          setHovering(false)
          setShowOverlay(false)
        }}
      >
        {/* 封面圖片區 - 占主要空間 */}
        {coverImage && (
          <div className="relative w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden" style={{ aspectRatio: '3/4' }}>
            <Image
              src={coverImage}
              alt={title}
              fill
              className={`object-cover transition-transform duration-500 ${hovering ? 'scale-110' : 'scale-100'}`}
              priority
            />

            {/* 分類徽章 */}
            <div className="absolute top-3 left-3">
              <span className="inline-block bg-[#002C56] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                {category}
              </span>
            </div>

            {/* 懸停時的疊加層 - 更新的互動設計 */}
            {showOverlay && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-between p-4 opacity-100 transition-opacity">
                {/* 頂部：互動按鈕 */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      onBookmark?.(id)
                    }}
                    className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                      isBookmarked
                        ? 'bg-yellow-400/90 text-white'
                        : 'bg-white/20 text-white hover:bg-white/40'
                    }`}
                  >
                    <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      onLike?.(id)
                    }}
                    className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                      isLiked
                        ? 'bg-red-500/90 text-white'
                        : 'bg-white/20 text-white hover:bg-white/40'
                    }`}
                  >
                    <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* 底部：貼文摘要 */}
                <div className="text-white">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 drop-shadow-lg">{title}</h3>
                  {location && (
                    <p className="text-xs text-gray-100 flex items-center gap-1">
                      📍 {location}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 卡片底部資訊區 - 簡潔設計 */}
        <div className="p-3 space-y-2">
          {/* 作者信息 - 簡化版本 */}
          <div className="flex items-center gap-2">
            {author.avatar ? (
              <Image
                src={author.avatar}
                alt={author.name}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#cfdbe9] flex items-center justify-center">
                <span className="text-xs font-bold text-[#002C56]">{author.name[0]}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{author.name}</p>
              {author.role === 'GUIDE' && (
                <p className="text-xs text-[#002C56] font-bold">✓ 認證地陪</p>
              )}
            </div>
          </div>

          {/* 標籤 - 簡化顯示 */}
          {tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-[#002C56] bg-[#cfdbe9]/40 px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 互動統計 - 最小化 */}
          <div className="flex gap-3 pt-1 text-gray-600 text-xs">
            <span>💬 {commentCount}</span>
            <span>❤️ {likeCount}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
