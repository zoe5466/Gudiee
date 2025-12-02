import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// GET - 獲取所有客服對話
export async function GET(request: NextRequest) {
  try {
    // 獲取查詢參數
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const userId = searchParams.get('userId')
    
    // 構建查詢條件
    const where: any = {}
    
    if (status && status !== 'ALL') {
      if (status === 'UNREAD') {
        where.status = 'SENT'
      } else if (status === 'PENDING') {
        where.status = 'READ'
      } else if (status === 'RESOLVED') {
        where.status = 'REPLIED'
      }
    }
    
    if (category && category !== 'ALL') {
      where.category = category
    }
    
    if (userId) {
      where.userId = userId
    }

    // 獲取對話列表，包含相關用戶資料和回覆
    const chats = await prisma.supportTicket.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 格式化響應數據
    const formattedChats = chats.map(chat => ({
      id: chat.id,
      userId: chat.userId,
      userType: chat.user.role === 'GUIDE' ? 'GUIDE' : 'USER',
      userName: chat.user.name || chat.user.email,
      userAvatar: null, // UserProfile has no avatar field
      message: chat.message,
      timestamp: chat.createdAt.toISOString(),
      status: chat.status,
      priority: chat.priority,
      category: chat.category,
      replies: chat.replies.map(reply => ({
        id: reply.id,
        adminId: reply.adminId,
        adminName: reply.admin.name || reply.admin.email,
        message: reply.message,
        timestamp: reply.createdAt.toISOString()
      }))
    }))

    // 統計數據
    const totalChats = await prisma.supportTicket.count()
    const unreadChats = await prisma.supportTicket.count({ where: { status: 'SENT' } })
    const pendingChats = await prisma.supportTicket.count({ where: { status: 'READ' } })
    const resolvedChats = await prisma.supportTicket.count({ where: { status: 'REPLIED' } })
    
    // 計算平均回覆時間（簡化計算）
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayMessages = await prisma.supportTicket.count({
      where: {
        createdAt: {
          gte: todayStart
        }
      }
    })

    const stats = {
      totalChats,
      unreadChats,
      pendingChats,
      resolvedChats,
      averageResponseTime: '12 分鐘', // 這可以根據實際回覆時間計算
      todayMessages
    }

    return NextResponse.json({
      success: true,
      chats: formattedChats,
      stats
    })

  } catch (error) {
    console.error('Error fetching chats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chats' },
      { status: 500 }
    )
  }
}

// POST - 創建新的客服對話
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, message, category = 'GENERAL', priority = 'NORMAL' } = body

    if (!userId || !message) {
      return NextResponse.json(
        { success: false, error: 'User ID and message are required' },
        { status: 400 }
      )
    }

    const newChat = await prisma.supportTicket.create({
      data: {
        userId,
        message,
        category,
        priority,
        status: 'SENT'
      },
      include: {
        user: {
          include: {
            userProfile: true
          }
        }
      }
    })

    const formattedChat = {
      id: newChat.id,
      userId: newChat.userId,
      userType: newChat.user.role === 'GUIDE' ? 'GUIDE' : 'USER',
      userName: newChat.user.name || newChat.user.email,
      userAvatar: null,
      message: newChat.message,
      timestamp: newChat.createdAt.toISOString(),
      status: newChat.status,
      priority: newChat.priority,
      category: newChat.category,
      replies: []
    }

    return NextResponse.json({
      success: true,
      chat: formattedChat
    })

  } catch (error) {
    console.error('Error creating chat:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create chat' },
      { status: 500 }
    )
  }
}