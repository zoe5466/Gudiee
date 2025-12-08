import { PostCard } from '@/components/post/post-card'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'

// Mock posts data for fallback display
const MOCK_POSTS = [
  {
    id: 'mock-1',
    title: '台北101不只是地標，更是美食寶庫！',
    content: '<h2>台北101美食之旅</h2><p>當我們提到台北，誰不想到台北101？但你知道嗎，在這座地標的周圍，隱藏著許多令人垂涎的美食？</p>',
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
    viewCount: 3420,
    likeCount: 156,
    commentCount: 32,
    publishedAt: '2024-11-20T00:00:00.000Z',
  },
  {
    id: 'mock-2',
    title: '九份老街尋找千與千尋的場景',
    content: '<h2>九份懷舊之旅</h2><p>還記得動畫電影《千與千尋》嗎？九份老街就是宮崎駿的靈感來源。</p>',
    coverImage: 'https://images.unsplash.com/photo-1512453045332-e901b6a8c358?w=800&h=600&fit=crop',
    author: {
      id: 'author-2',
      name: '文化導遊',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=culture-guide',
      role: 'GUIDE',
    },
    category: 'culture',
    tags: ['文化', '九份', '老街'],
    location: '新北市瑞芳區',
    viewCount: 5890,
    likeCount: 412,
    commentCount: 89,
    publishedAt: '2024-11-18T00:00:00.000Z',
  },
  {
    id: 'mock-3',
    title: '陽明山花季：台灣北部最壯觀的花海',
    content: '<h2>陽明山絢爛花季</h2><p>每年春天，陽明山都會被各色花朵染得五彩繽紛。杜鵑花、櫻花和竹子花競相綻放，美不勝收。</p>',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
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
  },
  {
    id: 'mock-4',
    title: '野柳地質公園：天然的地球教室',
    content: '<p>野柳地質公園展示了台灣的地質演化過程，千奇百怪的岩石造型令人嘆為觀止。</p>',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    author: {
      id: 'author-4',
      name: '地質愛好者',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=geology',
      role: 'GUIDE',
    },
    category: 'nature',
    tags: ['地質', '野柳', '科普'],
    location: '新北市萬里區',
    viewCount: 2450,
    likeCount: 187,
    commentCount: 45,
    publishedAt: '2024-11-12T00:00:00.000Z',
  },
]

async function getPosts() {
  try {
    // Only fetch from API in production with a valid base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    if (!baseUrl) {
      return MOCK_POSTS
    }

    const response = await fetch(`${baseUrl}/api/posts?limit=20&sortBy=latest`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })

    if (!response.ok) {
      console.warn('Failed to fetch posts from API, using mock data')
      return MOCK_POSTS
    }

    const result = await response.json()
    if (result.success && result.data && result.data.length > 0) {
      console.log(`Fetched ${result.data.length} posts from API`)
      return result.data
    }
    return MOCK_POSTS
  } catch (error) {
    console.warn('Error fetching posts from API, using mock data:', error instanceof Error ? error.message : error)
    return MOCK_POSTS
  }
}

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-white">
      {/* 頂部導航 - 簡約精致 */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-[#002C56]">Guidee</h1>
          </div>
          <Link
            href="/posts/create"
            className="flex items-center gap-2 px-4 py-2 bg-[#002C56] text-white rounded-lg hover:bg-[#001f3f] transition-all duration-200 font-medium text-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">發佈故事</span>
          </Link>
        </div>
      </div>

      {/* 大 Banner 區域 - 形象圖+短標語 */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-gradient-to-r from-[#002C56] to-[#0a4a8f]">
        {/* 背景圖片（示意） */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#002C56]/90 to-[#0a4a8f]/90">
          {/* 装饰背景图案 */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#cfdbe9]/10 rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#cfdbe9]/10 rounded-full -ml-36 -mb-36"></div>
        </div>

        {/* Banner 文字內容 */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
            探索世界的故事
          </h2>
          <p className="text-lg sm:text-xl text-white mb-8 max-w-2xl drop-shadow-md">
            與旅遊愛好者、地陪分享冒險經歷
          </p>
          <Link
            href="/posts/create"
            className="px-8 py-3 bg-white text-[#002C56] rounded-lg font-bold hover:bg-[#cfdbe9] transition-all duration-200"
          >
            開始分享
          </Link>
        </div>
      </div>

      {/* 搜尋區域 - 簡約風格 */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="搜尋故事..."
              className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002C56] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* 貼文網格區域 - 使用 Grid 佈局 */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 區域標題 */}
          <div className="mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">最新故事</h3>
            <div className="h-1 w-12 bg-[#002C56] rounded-full mt-3"></div>
          </div>

          {/* 貼文網格 - 使用 Grid 而不是 Columns 以獲得更好的相容性 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts && posts.length > 0 ? (
              posts.map((post: any) => (
                <PostCard
                  key={post.id}
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
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">暫無故事，成為第一個分享的人吧！</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部 CTA - 簡約風格 */}
      <div className="bg-[#cfdbe9]/15 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            準備分享你的旅遊故事？
          </h3>
          <Link
            href="/posts/create"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#002C56] text-white rounded-lg hover:bg-[#001f3f] transition-all duration-200 font-medium"
          >
            <Plus size={20} />
            發佈新故事
          </Link>
        </div>
      </div>
    </div>
  )
}
