import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * POST /api/posts/[id]/likes
 * 讚或收藏貼文
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
    const likeType = body.likeType || 'like' // 'like' 或 'bookmark'

    if (!['like', 'bookmark'].includes(likeType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid likeType. Must be "like" or "bookmark"' },
        { status: 400 }
      )
    }

    // 驗證貼文是否存在
    const post = await prisma.post.findUnique({
      where: { id },
      select: { id: true, likeCount: true },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // 檢查是否已經讚過
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId_likeType: {
          postId: id,
          userId: user.id,
          likeType,
        },
      },
    })

    let result
    let message
    let isLiked

    if (existingLike) {
      // 取消讚/收藏
      result = await prisma.postLike.delete({
        where: { id: existingLike.id },
      })

      // 減少計數
      await prisma.post.update({
        where: { id },
        data: { likeCount: { decrement: 1 } },
      })

      message = `${likeType} removed successfully`
      isLiked = false
    } else {
      // 新增讚/收藏
      result = await prisma.postLike.create({
        data: {
          postId: id,
          userId: user.id,
          likeType,
        },
      })

      // 增加計數
      await prisma.post.update({
        where: { id },
        data: { likeCount: { increment: 1 } },
      })

      message = `${likeType} added successfully`
      isLiked = true
    }

    return NextResponse.json({
      success: true,
      message,
      data: {
        isLiked,
        likeType,
      },
    })
  } catch (error) {
    console.error('Like/bookmark post error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to like/bookmark post' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/posts/[id]/likes
 * 取消讚或收藏貼文
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const searchParams = req.nextUrl.searchParams
    const likeType = searchParams.get('type') || 'like'

    if (!['like', 'bookmark'].includes(likeType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid likeType. Must be "like" or "bookmark"' },
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

    // 查找並刪除讚/收藏
    const like = await prisma.postLike.findUnique({
      where: {
        postId_userId_likeType: {
          postId: id,
          userId: user.id,
          likeType,
        },
      },
    })

    if (!like) {
      return NextResponse.json(
        { success: false, error: `No ${likeType} found for this post` },
        { status: 404 }
      )
    }

    await prisma.postLike.delete({
      where: { id: like.id },
    })

    // 減少計數
    await prisma.post.update({
      where: { id },
      data: { likeCount: { decrement: 1 } },
    })

    return NextResponse.json({
      success: true,
      message: `${likeType} removed successfully`,
    })
  } catch (error) {
    console.error('Unlike/unbookmark post error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to unlike/unbookmark post' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/posts/[id]/likes
 * 獲取貼文的讚/收藏列表
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const searchParams = req.nextUrl.searchParams
    const likeType = searchParams.get('type') || 'like'

    if (!['like', 'bookmark'].includes(likeType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid likeType. Must be "like" or "bookmark"' },
        { status: 400 }
      )
    }

    const likes = await prisma.postLike.findMany({
      where: {
        postId: id,
        likeType,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: likes,
      count: likes.length,
    })
  } catch (error) {
    console.error('Get likes error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch likes' },
      { status: 500 }
    )
  }
}
