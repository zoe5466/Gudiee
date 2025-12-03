import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import PostPageClient from './page-client'

export const revalidate = 0  // Disable caching for post detail pages

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
    // For server-side rendering, always use absolute URLs
    // Prefer NEXT_PUBLIC_APP_URL if set, then use VERCEL_URL, then localhost
    let baseUrl: string

    if (process.env.NEXT_PUBLIC_APP_URL) {
      baseUrl = process.env.NEXT_PUBLIC_APP_URL
    } else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`
    } else {
      baseUrl = 'http://localhost:3000'
    }

    const url = `${baseUrl}/api/posts/${id}`
    console.log(`[Post Fetch] Fetching from: ${url}`)

    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      console.error(`[Post Fetch] Response status: ${response.status}`)
      return null
    }

    const data = await response.json()

    if (!data.success || !data.data) {
      console.error(`[Post Fetch] Invalid response structure`)
      return null
    }

    return data.data
  } catch (error) {
    console.error('[Post Fetch] Error:', error instanceof Error ? error.message : String(error))
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
