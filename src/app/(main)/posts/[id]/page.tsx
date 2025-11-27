'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { PostDetail } from '@/components/post/post-detail'
import { CommentSection } from '@/components/post/comment-section'
import { notFound } from 'next/navigation'

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
  embeddedServices: any[]
}

export default function PostPage() {
  const router = useRouter()
  const params = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`)

        if (!response.ok) {
          throw new Error('Post not found')
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to load post')
        }

        setPost(data.data)
      } catch (err) {
        console.error('Error fetching post:', err)
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPost()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">貼文不存在</h1>
          <p className="text-gray-600 mb-6">{error || '我們找不到您要找的貼文'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-[#002C56] text-white rounded-lg hover:bg-[#001f41] transition-colors"
          >
            返回首頁
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* 貼文詳情 */}
        <PostDetail
          id={post.id}
          title={post.title}
          content={post.content}
          coverImage={post.coverImage}
          author={post.author}
          category={post.category}
          tags={post.tags}
          location={post.location}
          viewCount={post.viewCount}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          publishedAt={post.publishedAt}
          embeddedServices={post.embeddedServices || []}
        />

        {/* 評論區 */}
        <CommentSection postId={post.id} />

        {/* 相關推薦貼文 */}
        {/* TODO: 實裝相關推薦 */}
      </div>
    </div>
  )
}
