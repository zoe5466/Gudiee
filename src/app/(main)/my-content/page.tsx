'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trash2, Edit, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Post {
  id: string
  title: string
  status: string
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: string
}

export default function MyContentPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>(
    'all'
  )
  const [error, setError] = useState<string | null>(null)

  // 獲取我的貼文
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({ authorId: 'current' })
        if (filter !== 'all') {
          params.append('status', filter)
        }

        const response = await fetch(`/api/posts?${params}`)
        if (!response.ok) throw new Error('Failed to fetch posts')

        const { data } = await response.json()
        setPosts(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchMyPosts()
  }, [filter])

  // 刪除貼文
  const handleDelete = async (postId: string) => {
    if (!confirm('確定要刪除這篇貼文嗎？')) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete post')

      setPosts(posts.filter((p) => p.id !== postId))
    } catch (err) {
      console.error('Delete error:', err)
      alert('刪除失敗')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW')
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      published: { bg: 'bg-green-100', text: 'text-green-700', label: '已發布' },
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '草稿' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-700', label: '已封存' },
    }

    const badge = badges[status] || badges['draft']
    return (
      <span className={`${badge!.bg} ${badge!.text} px-3 py-1 rounded-full text-sm font-medium`}>
        {badge!.label}
      </span>
    )
  }

  return (
    <div className="bg-[#cfdbe9] min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* 頁面標題 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">我的內容</h1>
              <p className="text-gray-600 mt-2">管理您發布的所有貼文</p>
            </div>
            <Link
              href="/posts/create"
              className="bg-[#002C56] text-white px-6 py-3 rounded-lg hover:bg-[#001f41] font-medium"
            >
              + 新建貼文
            </Link>
          </div>
        </div>

        {/* 篩選按鈕 */}
        <div className="mb-6 flex gap-2">
          {['all', 'published', 'draft', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-[#002C56] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status === 'all' && '全部'}
              {status === 'published' && '已發布'}
              {status === 'draft' && '草稿'}
              {status === 'archived' && '已封存'}
            </button>
          ))}
        </div>

        {/* 錯誤提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {/* 內容表 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">載入中...</div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">還沒有貼文</p>
              <Link
                href="/posts/create"
                className="inline-block bg-[#002C56] text-white px-6 py-2 rounded-lg hover:bg-[#001f41]"
              >
                立即創建第一篇貼文
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      標題
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      狀態
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      發布日期
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      瀏覽
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      讚
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      評論
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link
                          href={`/posts/${post.id}`}
                          className="font-medium text-[#002C56] hover:underline"
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(post.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(post.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm">👁️ {post.viewCount}</td>
                      <td className="px-6 py-4 text-sm">❤️ {post.likeCount}</td>
                      <td className="px-6 py-4 text-sm">💬 {post.commentCount}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/posts/${post.id}`}
                            className="p-2 text-gray-600 hover:text-[#002C56] hover:bg-gray-100 rounded"
                            title="查看"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            href={`/posts/${post.id}/edit`}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded"
                            title="編輯"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
                            title="刪除"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 統計資訊 */}
        {posts.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm mb-2">總貼文數</p>
              <p className="text-3xl font-bold text-[#002C56]">{posts.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm mb-2">總瀏覽</p>
              <p className="text-3xl font-bold text-purple-600">
                {posts.reduce((sum, p) => sum + p.viewCount, 0)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm mb-2">總讚數</p>
              <p className="text-3xl font-bold text-pink-600">
                {posts.reduce((sum, p) => sum + p.likeCount, 0)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm mb-2">總評論</p>
              <p className="text-3xl font-bold text-blue-600">
                {posts.reduce((sum, p) => sum + p.commentCount, 0)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
