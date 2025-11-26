import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

/**
 * GET /api/posts
 * 獲取貼文列表（支持分頁、篩選、排序）
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams

    // 查詢參數
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const category = searchParams.get('category')
    const authorId = searchParams.get('authorId')
    const location = searchParams.get('location')
    const status = searchParams.get('status') || 'published'
    const sortBy = searchParams.get('sortBy') || 'latest' // latest, popular, trending
    const searchQuery = searchParams.get('search')

    const skip = (page - 1) * limit

    // 構建查詢條件
    const where: any = {
      status: status,
      isPublished: true,
    }

    if (category) where.category = category
    if (authorId) where.authorId = authorId
    if (location) where.location = location

    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { content: { contains: searchQuery, mode: 'insensitive' } },
      ]
    }

    // 構建排序
    let orderBy: any = { createdAt: 'desc' }
    if (sortBy === 'popular') {
      orderBy = [
        { likeCount: 'desc' },
        { commentCount: 'desc' },
        { viewCount: 'desc' },
      ]
    } else if (sortBy === 'trending') {
      orderBy = { viewCount: 'desc' }
    }

    // 查詢貼文
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
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
          publishedAt: true,
          createdAt: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/posts
 * 新增貼文
 */
export async function POST(req: NextRequest) {
  try {
    // 驗證用戶
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()

    // 驗證必填欄位
    const { title, content, category, authorType } = body

    if (!title || !content || !category || !authorType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, content, category, authorType',
        },
        { status: 400 }
      )
    }

    // 驗證 authorType
    if (!['guide', 'consumer'].includes(authorType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid authorType. Must be "guide" or "consumer"' },
        { status: 400 }
      )
    }

    // 驗證用戶角色和 authorType 的匹配
    if (authorType === 'guide' && user.role !== 'GUIDE' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Only guides can create guide posts' },
        { status: 403 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content,
        coverImage: body.coverImage || null,
        authorId: user.id,
        authorType,
        category: category.toLowerCase(),
        tags: body.tags || [],
        location: body.location || null,
        status: body.status || 'published',
        isPublished: body.status === 'published' || body.isPublished !== false,
        publishedAt:
          body.status === 'published' ? new Date() : body.publishedAt || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Post created successfully',
        data: post,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
