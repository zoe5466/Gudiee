import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * GET /api/posts/[id]/comments
 * 獲取貼文的所有評論
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const skip = (page - 1) * limit

    // 驗證貼文是否存在
    const post = await prisma.post.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    const [comments, total] = await Promise.all([
      prisma.postComment.findMany({
        where: {
          postId: id,
          parentCommentId: null, // 只獲取主評論
        },
        select: {
          id: true,
          content: true,
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          createdAt: true,
          replies: {
            select: {
              id: true,
              content: true,
              author: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.postComment.count({
        where: { postId: id, parentCommentId: null },
      }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: comments,
      pagination: { page, limit, total, totalPages },
    })
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/posts/[id]/comments
 * 新增評論
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await req.json()

    if (!body.content || !body.content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Comment content is required' },
        { status: 400 }
      )
    }

    // 驗證貼文是否存在
    const post = await prisma.post.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    const comment = await prisma.postComment.create({
      data: {
        postId: id,
        authorId: user.id,
        content: body.content.trim(),
        parentCommentId: body.parentCommentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    // 更新貼文評論計數
    await prisma.post.update({
      where: { id },
      data: { commentCount: { increment: 1 } },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Comment added successfully',
        data: comment,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
