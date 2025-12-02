import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/posts/feed
 * 獲取推薦的貼文列表
 *
 * 推薦算法：
 * 分數 = (讚數 × 0.4) + (評論數 × 0.3) + (分享數 × 0.2) + (瀏覽數 × 0.1)
 * 再加上新鮮度加權（新貼文權重更高）
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    const searchParams = req.nextUrl.searchParams

    // 查詢參數
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const category = searchParams.get('category')
    const authorType = searchParams.get('authorType') // 'guide' or 'consumer'

    const skip = (page - 1) * limit

    // 構建基本查詢條件
    const where: any = {
      status: 'published',
      isPublished: true,
    }

    if (category) where.category = category
    if (authorType) where.authorType = authorType

    // 獲取所有符合條件的貼文
    const posts = await prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        content: true,
        coverImage: true,
        authorId: true,
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
        category: true,
        tags: true,
        location: true,
        viewCount: true,
        likeCount: true,
        commentCount: true,
        shareCount: true,
        publishedAt: true,
        createdAt: true,
      },
    })

    // 計算推薦分數
    const now = new Date()
    const postsWithScore = posts.map((post) => {
      // 基礎分數
      const engagementScore =
        post.likeCount * 0.4 +
        post.commentCount * 0.3 +
        post.shareCount * 0.2 +
        post.viewCount * 0.1

      // 新鮮度加權（過去 7 天內的貼文權重更高）
      const ageInHours = (now.getTime() - new Date(post.publishedAt || post.createdAt).getTime()) / (1000 * 60 * 60)
      const freshnessMultiplier = ageInHours < 24 ? 2 : ageInHours < 168 ? 1.5 : 1

      const finalScore = engagementScore * freshnessMultiplier

      return {
        ...post,
        score: finalScore,
      }
    })

    // 按分數排序
    postsWithScore.sort((a, b) => b.score - a.score)

    // 分頁
    const paginatedPosts = postsWithScore.slice(skip, skip + limit)

    const total = postsWithScore.length
    const totalPages = Math.ceil(total / limit)

    // 如果用戶已登錄，獲取他們的讚和收藏狀態
    const userLikes = new Map<string, Set<string>>()
    if (user) {
      const likes = await prisma.postLike.findMany({
        where: {
          userId: user.id,
          postId: { in: paginatedPosts.map((p) => p.id) },
        },
      })

      likes.forEach((like) => {
        if (!userLikes.has(like.likeType)) {
          userLikes.set(like.likeType, new Set())
        }
        userLikes.get(like.likeType)!.add(like.postId)
      })
    }

    return NextResponse.json({
      success: true,
      data: paginatedPosts.map((post) => ({
        ...post,
        score: undefined, // 不返回分數給前端
        isLiked: userLikes.get('like')?.has(post.id) || false,
        isBookmarked: userLikes.get('bookmark')?.has(post.id) || false,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error('Get feed error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feed' },
      { status: 500 }
    )
  }
}
