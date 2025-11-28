'use client'

import { useRouter } from 'next/navigation'
import { PostDetail } from '@/components/post/post-detail'
import { CommentSection } from '@/components/post/comment-section'

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

interface PostPageClientProps {
  post: Post
}

export default function PostPageClient({ post }: PostPageClientProps) {
  const router = useRouter()

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
