import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import PostPageClient from './page-client'

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

async function getPost(id: string): Promise<Post | null> {
  try {
    // Build absolute URL for server-side fetch
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // In Vercel deployment, use the deployment URL
    if (process.env.VERCEL_URL && !process.env.NEXT_PUBLIC_APP_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`
    }

    const response = await fetch(`${baseUrl}/api/posts/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    if (!data.success || !data.data) {
      return null
    }

    return data.data
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

interface Params {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Params) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    return {
      title: '貼文不存在',
    }
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160),
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function PostPage({ params }: Params) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    notFound()
  }

  return <PostPageClient post={post} />
}
