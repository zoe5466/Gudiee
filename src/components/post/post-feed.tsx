'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { PostCard } from './post-card'
import { Loader, AlertCircle } from 'lucide-react'

interface Post {
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
}

interface PostFeedProps {
  initialPosts?: Post[]
  category?: string
  authorId?: string
  location?: string
  sortBy?: 'latest' | 'popular' | 'trending'
  displayMode?: 'grid' | 'list'
}

export function PostFeed({
  initialPosts = [],
  category,
  authorId,
  location,
  sortBy = 'latest',
  displayMode = 'grid',
}: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set())

  // 獲取貼文
  const fetchPosts = useCallback(
    async (pageNum: number = 1, reset: boolean = false) => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: '20',
          sortBy,
        })

        if (category) params.append('category', category)
        if (authorId) params.append('authorId', authorId)
        if (location) params.append('location', location)
        if (searchQuery) params.append('search', searchQuery)

        const response = await fetch(`/api/posts?${params}`)
        if (!response.ok) throw new Error('Failed to fetch posts')

        const { data, pagination } = await response.json()

        if (reset) {
          setPosts(data)
        } else {
          setPosts((prev) => [...prev, ...data])
        }

        setHasMore(pagination.page < pagination.totalPages)
        setPage(pageNum)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    },
    [category, authorId, location, searchQuery, sortBy]
  )

  // 初始加載
  useEffect(() => {
    fetchPosts(1, true)
  }, [fetchPosts])

  // 搜尋查詢改變時重新查詢
  useEffect(() => {
    if (searchQuery.trim()) {
      fetchPosts(1, true)
    }
  }, [searchQuery])

  // 加載更多
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1, false)
    }
  }

  // 處理讚
  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likeType: 'like' }),
      })

      if (response.status === 401) {
        setError('請先登入以讚好貼文')
        return
      }

      if (!response.ok) throw new Error('Failed to like post')

      const { data } = await response.json()

      if (data.isLiked) {
        setLikedPosts((prev) => new Set([...prev, postId]))
      } else {
        setLikedPosts((prev) => {
          const newSet = new Set(prev)
          newSet.delete(postId)
          return newSet
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error liking post')
    }
  }

  // 處理收藏
  const handleBookmark = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likeType: 'bookmark' }),
      })

      if (response.status === 401) {
        setError('請先登入以收藏貼文')
        return
      }

      if (!response.ok) throw new Error('Failed to bookmark post')

      const { data } = await response.json()

      if (data.isLiked) {
        setBookmarkedPosts((prev) => new Set([...prev, postId]))
      } else {
        setBookmarkedPosts((prev) => {
          const newSet = new Set(prev)
          newSet.delete(postId)
          return newSet
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error bookmarking post')
      console.error('Bookmark error:', err)
    }
  }

  return (
    <div className="w-full">
      {/* 搜尋欄 */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="搜尋貼文..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setPage(1)
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002C56]"
        />
      </div>

      {/* 錯誤提示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* 貼文列表 */}
      <div
        className={
          displayMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
        }
      >
        {posts.map((post) => (
          <PostCard
            key={post.id}
            {...post}
            onLike={handleLike}
            onBookmark={handleBookmark}
            isLiked={likedPosts.has(post.id)}
            isBookmarked={bookmarkedPosts.has(post.id)}
          />
        ))}
      </div>

      {/* 加載中提示 */}
      {loading && (
        <div className="mt-12 flex justify-center">
          <Loader className="animate-spin text-[#002C56]" size={32} />
        </div>
      )}

      {/* 空狀態 */}
      {!loading && posts.length === 0 && !error && (
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-lg">還沒有貼文</p>
        </div>
      )}

      {/* 加載更多按鈕 */}
      {hasMore && !loading && posts.length > 0 && (
        <div className="mt-12 text-center">
          <button
            onClick={loadMore}
            className="px-8 py-3 bg-[#002C56] text-white rounded-lg hover:bg-[#001f41] transition-colors"
          >
            載入更多
          </button>
        </div>
      )}

      {/* 沒有更多提示 */}
      {!hasMore && posts.length > 0 && (
        <div className="mt-12 text-center">
          <p className="text-gray-500">已到底部</p>
        </div>
      )}
    </div>
  )
}
