'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'

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

  // 提取文本摘要（去掉 HTML 標籤，取前 150 個字）
  const excerpt = content
    .replace(/<[^>]*>/g, '')
    .substring(0, 150)
    .trim() + '...'

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
        className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden h-full"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* 封面圖 */}
        {coverImage && (
          <div className="relative w-full h-48 overflow-hidden bg-gray-100">
            <Image
              src={coverImage}
              alt={title}
              fill
              className={`object-cover transition-transform duration-300 ${hovering ? 'scale-105' : ''}`}
            />
            {/* 分類標籤 */}
            <div className="absolute top-3 left-3">
              <span className="inline-block bg-[#002C56] text-white px-3 py-1 rounded-full text-xs font-medium">
                {category}
              </span>
            </div>
          </div>
        )}

        <div className="p-4">
          {/* 作者信息 */}
          <div className="flex items-center gap-2 mb-3">
            {author.avatar ? (
              <Image
                src={author.avatar}
                alt={author.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs">{author.name[0]}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{author.name}</p>
              <p className="text-xs text-gray-500">{formatDate(publishedAt)}</p>
            </div>
            {author.role === 'GUIDE' && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                地陪
              </span>
            )}
          </div>

          {/* 標題 */}
          <h3 className="font-bold text-base mb-2 line-clamp-2 hover:text-[#002C56]">
            {title}
          </h3>

          {/* 摘要 */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{excerpt}</p>

          {/* 標籤 */}
          {tags.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-gray-500">+{tags.length - 3}</span>
              )}
            </div>
          )}

          {/* 位置 */}
          {location && (
            <p className="text-xs text-gray-500 mb-3">📍 {location}</p>
          )}

          {/* 統計和互動 */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-gray-600">
            <div className="flex gap-3 text-xs">
              <span className="hover:text-[#002C56]">👁️ {viewCount}</span>
              <span className="hover:text-[#002C56]">💬 {commentCount}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  onLike?.(id)
                }}
                className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-600'
                }`}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  onBookmark?.(id)
                }}
                className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${
                  isBookmarked ? 'text-yellow-500' : 'text-gray-600'
                }`}
              >
                <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
