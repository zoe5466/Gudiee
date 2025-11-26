import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * POST /api/posts/[id]/embed-service
 * 在貼文中嵌入商品
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

    const { serviceId, position, embedType, customText } = body

    if (!serviceId || !embedType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: serviceId, embedType' },
        { status: 400 }
      )
    }

    if (!['card', 'inline'].includes(embedType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid embedType. Must be "card" or "inline"' },
        { status: 400 }
      )
    }

    // 驗證貼文是否存在且由該用戶擁有
    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true, id: true },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // 檢查權限：只有地陪可以嵌入自己的商品，消費者可以嵌入任何商品
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { guideId: true, id: true },
    })

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    // 驗證權限
    if (post.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Only post author can embed services' },
        { status: 403 }
      )
    }

    // 對於地陪，只能嵌入自己的商品
    if (post.authorId === user.id && user.role !== 'ADMIN' && service.guideId !== user.id) {
      if (user.role === 'GUIDE') {
        return NextResponse.json(
          { success: false, error: 'Guides can only embed their own services' },
          { status: 403 }
        )
      }
    }

    // 檢查是否已經嵌入過
    const existingEmbed = await prisma.postServiceEmbed.findUnique({
      where: {
        postId_serviceId: {
          postId: id,
          serviceId,
        },
      },
    })

    if (existingEmbed) {
      return NextResponse.json(
        { success: false, error: 'Service already embedded in this post' },
        { status: 400 }
      )
    }

    const embed = await prisma.postServiceEmbed.create({
      data: {
        postId: id,
        serviceId,
        position: position || 0,
        embedType,
        customText: customText || null,
      },
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
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Service embedded successfully',
        data: embed,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Embed service error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to embed service' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/posts/[id]/embed-service
 * 獲取貼文中嵌入的所有商品
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    const embeds = await prisma.postServiceEmbed.findMany({
      where: { postId: id },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            location: true,
            guide: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { position: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: embeds,
    })
  } catch (error) {
    console.error('Get embedded services error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch embedded services' },
      { status: 500 }
    )
  }
}
