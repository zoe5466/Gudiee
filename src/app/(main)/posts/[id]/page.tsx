import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import PostPageClient from './page-client'

export const revalidate = 0  // Disable caching for post detail pages
export const dynamic = 'force-dynamic'  // Force dynamic rendering

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

// Mock posts for development/testing
const MOCK_POSTS: Record<string, Post> = {
  'mock-1': {
    id: 'mock-1',
    title: '台北101不只是地標，更是美食寶庫！',
    content: '<h2>台北101美食之旅</h2><p>當我們提到台北，誰不想到台北101？但你知道嗎，在這座地標的周圍，隱藏著許多令人垂涎的美食？</p><p>從微風廣場的米其林餐廳到101大樓內的各式美食，這裡是美食愛好者的天堂。特別推薦樓下的鼎泰豐，排隊時間雖然長，但咬下去的那一刻，你會明白為什麼全世界的人都想嚐一口。</p><p>101樓的瞭望台不僅提供360度的台北城市美景，還有精選的飲品和輕食。在夜晚登上101，看著城市的燈火點綴，享受一杯咖啡或雞尾酒，是體驗台北夜生活最浪漫的方式。</p>',
    coverImage: 'https://images.unsplash.com/photo-1604072143121-27e0fb5c5667?w=800&h=600&fit=crop',
    author: {
      id: 'author-1',
      name: '台北美食家',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=food-guide',
      role: 'GUIDE',
    },
    category: 'food',
    tags: ['美食', '台北', '101'],
    location: '台北市信義區',
    viewCount: 3421,
    likeCount: 156,
    commentCount: 32,
    publishedAt: '2024-11-20T00:00:00.000Z',
    embeddedServices: [],
  },
  'mock-2': {
    id: 'mock-2',
    title: '九份老街尋找千與千尋的場景',
    content: '<h2>九份懷舊之旅</h2><p>還記得動畫電影《千與千尋》嗎？九份老街就是宮崎駿的靈感來源。</p><p>漫步在狹窄的石階街道上，兩側是傳統的木造房屋和紅燈籠，彷彿穿越了時空。一定要嘗試這裡的芋圓和茶葉蛋，它們是九份最經典的小吃。</p><p>傍晚時分，當日落將天空染成金黃色，整條老街都籠罩在柔和的光線中。這時候來到九份，你會真正理解為什麼宮崎駿選擇這裡作為靈感。不要錯過山城的懷舊氛圍和在地人的熱情招待。</p>',
    coverImage: 'https://images.unsplash.com/photo-1604072143121-27e0fb5c5667?w=800&h=600&fit=crop',
    author: {
      id: 'author-2',
      name: '文化導遊',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=culture-guide',
      role: 'GUIDE',
    },
    category: 'culture',
    tags: ['文化', '九份', '老街'],
    location: '新北市瑞芳區',
    viewCount: 5891,
    likeCount: 412,
    commentCount: 89,
    publishedAt: '2024-11-18T00:00:00.000Z',
    embeddedServices: [],
  },
  'mock-3': {
    id: 'mock-3',
    title: '陽明山花季：台灣北部最壯觀的花海',
    content: '<h2>陽明山絢爛花季</h2><p>每年春天，陽明山都會被各色花朵染得五彩繽紛。杜鵑花、櫻花和竹子花競相綻放，美不勝收。</p><p>建議清晨前往，避開遊客高峰，享受寧靜的自然風景。記得帶上相機，因為每一個角度都是絕佳的拍照點。</p><p>如果你是自駕遊客，陽明山的山路蜿蜒曲折，沿途的停靠點提供絕佳的觀景視角。小油坑的硫磺地質奇觀與盛開的花朵形成獨特的對比，讓人印象深刻。在山頂咖啡廳享受一杯咖啡，俯瞰台北市景，這是體驗陽明山的完美方式。</p>',
    coverImage: 'https://images.unsplash.com/photo-1604072143121-27e0fb5c5667?w=800&h=600&fit=crop',
    author: {
      id: 'author-3',
      name: '自然探險家',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nature-guide',
      role: 'GUIDE',
    },
    category: 'nature',
    tags: ['自然', '花季', '陽明山'],
    location: '台北市',
    viewCount: 7235,
    likeCount: 523,
    commentCount: 124,
    publishedAt: '2024-11-15T00:00:00.000Z',
    embeddedServices: [],
  },
}

async function getPost(id: string): Promise<Post | null> {
  try {
    // First check if it's a mock post
    if (MOCK_POSTS[id]) {
      return MOCK_POSTS[id]
    }

    // Then try to fetch from the API
    let baseUrl: string
    if (process.env.NEXT_PUBLIC_APP_URL) {
      baseUrl = process.env.NEXT_PUBLIC_APP_URL
    } else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`
    } else {
      baseUrl = 'http://localhost:3000'
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
    console.error('[Post] Error:', error)
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
