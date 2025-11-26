'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface Author {
  id: string
  name: string
  avatar?: string
}

interface Comment {
  id: string
  content: string
  author: Author
  createdAt: string
  replies?: Comment[]
}

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  // 獲取評論
  const fetchComments = async (pageNum: number = 1) => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/posts/${postId}/comments?page=${pageNum}&limit=20`
      )
      if (!response.ok) throw new Error('Failed to fetch comments')
      const { data } = await response.json()
      setComments(data)
      setPage(pageNum)
    } catch (err) {
      console.error('Fetch comments error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  // 新增評論
  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment.trim(),
          parentCommentId: replyingTo || null,
        }),
      })

      if (!response.ok) throw new Error('Failed to add comment')

      setNewComment('')
      setReplyingTo(null)
      fetchComments(1)
    } catch (err) {
      console.error('Add comment error:', err)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffHours < 1) return '剛剛'
    if (diffHours < 24) return `${diffHours}小時前`
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}天前`

    return date.toLocaleDateString('zh-TW')
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-12 mt-4' : 'mt-6'}`}>
      <div className="flex gap-3">
        {comment.author.avatar ? (
          <Image
            src={comment.author.avatar}
            alt={comment.author.name}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
            {comment.author.name[0]}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-sm">{comment.author.name}</p>
            <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
          </div>
          <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
          <button
            onClick={() => setReplyingTo(comment.id)}
            className="text-xs text-[#002C56] hover:underline"
          >
            回覆
          </button>
        </div>
      </div>

      {/* 回覆 */}
      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <section className="bg-white rounded-lg p-8 mt-12">
      <h2 className="text-2xl font-bold mb-6">評論區 ({comments.length})</h2>

      {/* 新增評論欄 */}
      <div className="mb-8 pb-8 border-b border-gray-200">
        {replyingTo && (
          <div className="mb-3 p-3 bg-blue-50 rounded text-sm flex justify-between items-center">
            <span>回覆評論</span>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        )}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="分享你的想法..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002C56] resize-none"
          rows={3}
        />
        <div className="mt-3 flex justify-end gap-2">
          {replyingTo && (
            <button
              onClick={() => {
                setReplyingTo(null)
                setNewComment('')
              }}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
          )}
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-[#002C56] text-white rounded-lg hover:bg-[#001f41] disabled:bg-gray-300"
          >
            發送
          </button>
        </div>
      </div>

      {/* 評論列表 */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">載入評論中...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">還沒有評論，搶先留言吧！</p>
        </div>
      ) : (
        <div>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  )
}
