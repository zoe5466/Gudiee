import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic';

// GET - 獲取特定對話詳情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chatId = params.id

    const chat = await prisma.supportTicket.findUnique({
      where: { id: chatId },
      include: {
        user: {
          include: {
            userProfile: true
          }
        },
        replies: {
          include: {
            admin: {
              include: {
                userProfile: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!chat) {
      return NextResponse.json(
        { success: false, error: 'Chat not found' },
        { status: 404 }
      )
    }

    // 標記為已讀（如果還沒讀過）
    if (chat.status === 'SENT') {
      await prisma.supportTicket.update({
        where: { id: chatId },
        data: { status: 'READ' }
      })
    }

    const formattedChat = {
      id: chat.id,
      userId: chat.userId,
      userType: chat.user.role === 'GUIDE' ? 'GUIDE' : 'USER',
      userName: chat.user.name || chat.user.email,
      userAvatar: null, // UserProfile doesn't have avatar field
      message: chat.message,
      timestamp: chat.createdAt.toISOString(),
      status: chat.status === 'SENT' ? 'read' : chat.status,
      priority: chat.priority,
      category: chat.category,
      replies: chat.replies.map(reply => ({
        id: reply.id,
        adminId: reply.adminId,
        adminName: reply.admin.name || reply.admin.email,
        message: reply.message,
        timestamp: reply.createdAt.toISOString()
      }))
    }

    return NextResponse.json({
      success: true,
      chat: formattedChat
    })

  } catch (error) {
    console.error('Error fetching chat:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat' },
      { status: 500 }
    )
  }
}

// POST - 回覆對話
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const chatId = params.id
    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // 確認對話存在
    const chat = await prisma.supportTicket.findUnique({
      where: { id: chatId }
    })

    if (!chat) {
      return NextResponse.json(
        { success: false, error: 'Chat not found' },
        { status: 404 }
      )
    }

    // 創建回覆
    const reply = await prisma.supportReply.create({
      data: {
        ticketId: chatId,
        adminId: user.id,
        message
      },
      include: {
        admin: {
          include: {
            userProfile: true
          }
        }
      }
    })

    // 更新對話狀態為已回覆
    await prisma.supportTicket.update({
      where: { id: chatId },
      data: { status: 'REPLIED' }
    })

    const formattedReply = {
      id: reply.id,
      adminId: reply.adminId,
      adminName: reply.admin.name || reply.admin.email,
      message: reply.message,
      timestamp: reply.createdAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      reply: formattedReply
    })

  } catch (error) {
    console.error('Error creating reply:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create reply' },
      { status: 500 }
    )
  }
}

// PATCH - 更新對話狀態
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const chatId = params.id
    const body = await request.json()
    const { action, status, priority } = body

    const updateData: any = {}

    if (action) {
      switch (action) {
        case 'mark_read':
          updateData.status = 'read'
          break
        case 'resolve':
          updateData.status = 'REPLIED'
          break
        case 'archive':
          updateData.archived = true
          break
        case 'unarchive':
          updateData.archived = false
          break
      }
    }

    if (status) {
      updateData.status = status
    }

    if (priority) {
      updateData.priority = priority
    }

    const updatedChat = await prisma.supportTicket.update({
      where: { id: chatId },
      data: updateData,
      include: {
        user: {
          include: {
            userProfile: true
          }
        },
        replies: {
          include: {
            admin: {
              include: {
                userProfile: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      chat: updatedChat
    })

  } catch (error) {
    console.error('Error updating chat:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update chat' },
      { status: 500 }
    )
  }
}