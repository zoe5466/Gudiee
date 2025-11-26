import { notFound } from 'next/navigation'
import { PostDetail } from '@/components/post/post-detail'
import { CommentSection } from '@/components/post/comment-section'
import { prisma } from '@/lib/prisma'

interface PostPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    select: { title: true, content: true },
  })

  if (!post) return { title: 'Post not found' }

  // 提取摘要
  const excerpt = post.content
    .replace(/<[^>]*>/g, '')
    .substring(0, 160)
    .trim()

  return {
    title: post.title,
    description: excerpt,
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
          role: true,
        },
      },
      embeddedServices: {
        include: {
          service: {
            select: {
              id: true,
              title: true,
              price: true,
              images: true,
              location: true,
            },
          },
        },
      },
    },
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* 貼文詳情 */}
        <PostDetail
          id={post.id}
          title={post.title}
          content={post.content}
          coverImage={post.coverImage || undefined}
          author={{
            ...post.author,
            avatar: post.author.avatar || undefined,
          }}
          category={post.category}
          tags={post.tags}
          location={post.location || undefined}
          viewCount={post.viewCount}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          publishedAt={post.publishedAt?.toISOString() || new Date().toISOString()}
          embeddedServices={post.embeddedServices}
        />

        {/* 評論區 */}
        <CommentSection postId={post.id} />

        {/* 相關推薦貼文 */}
        {/* TODO: 實裝相關推薦 */}
      </div>
    </div>
  )
}
