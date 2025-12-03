import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    id: string
    serviceId: string
  }
}

/**
 * DELETE /api/posts/[id]/embed-service/[serviceId]
 * 移除貼文中的嵌入商品
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

    const { id, serviceId } = params

    // 驗證貼文是否存在且由該用戶擁有
    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // 檢查權限
    if (post.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Only post author can remove embeds' },
        { status: 403 }
      )
    }

    // 查找並刪除嵌入
    const embed = await prisma.postServiceEmbed.findUnique({
      where: {
        postId_serviceId: {
          postId: id,
          serviceId,
        },
      },
    })

    if (!embed) {
      return NextResponse.json(
        { success: false, error: 'Embedded service not found' },
        { status: 404 }
      )
    }

    await prisma.postServiceEmbed.delete({
      where: {
        postId_serviceId: {
          postId: id,
          serviceId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Service embed removed successfully',
    })
  } catch (error) {
    console.error('Remove embed error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove service embed' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/posts/[id]/embed-service/[serviceId]
 * 編輯嵌入的商品（更新自定義文本和樣式）
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id, serviceId } = params
    const body = await req.json()

    // 驗證貼文是否存在且由該用戶擁有
    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // 檢查權限
    if (post.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Only post author can edit embeds' },
        { status: 403 }
      )
    }

    // 查找嵌入
    const embed = await prisma.postServiceEmbed.findUnique({
      where: {
        postId_serviceId: {
          postId: id,
          serviceId,
        },
      },
    })

    if (!embed) {
      return NextResponse.json(
        { success: false, error: 'Embedded service not found' },
        { status: 404 }
      )
    }

    // 驗證 embedType
    if (body.embedType && !['card', 'inline'].includes(body.embedType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid embedType. Must be "card" or "inline"' },
        { status: 400 }
      )
    }

    const updatedEmbed = await prisma.postServiceEmbed.update({
      where: {
        postId_serviceId: {
          postId: id,
          serviceId,
        },
      },
      data: {
        embedType: body.embedType,
        customText: body.customText,
        position: body.position,
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Service embed updated successfully',
      data: updatedEmbed,
    })
  } catch (error) {
    console.error('Update embed error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update service embed' },
      { status: 500 }
    )
  }
}
