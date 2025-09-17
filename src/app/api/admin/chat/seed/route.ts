import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - 創建示例客服對話資料
export async function POST(request: NextRequest) {
  try {
    // 獲取現有用戶
    const users = await prisma.user.findMany({
      take: 5
    })

    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        error: '沒有找到用戶，請先創建用戶'
      })
    }

    // 創建示例支援票據
    const tickets = await Promise.all([
      prisma.supportTicket.create({
        data: {
          userId: users[0]?.id || '',
          message: '您好，我想詢問關於台北一日遊的服務，請問有什麼推薦的行程嗎？',
          category: 'GENERAL',
          priority: 'NORMAL',
          status: 'SENT'
        }
      }),
      prisma.supportTicket.create({
        data: {
          userId: users[1]?.id || users[0]?.id || '',
          message: '我昨天預訂的服務還沒有收到確認，能幫我查看一下嗎？訂單編號是 #GD2025001',
          category: 'BOOKING',
          priority: 'HIGH',
          status: 'READ'
        }
      }),
      prisma.supportTicket.create({
        data: {
          userId: users[2]?.id || users[0]?.id || '',
          message: '我對昨天的服務不太滿意，地陪遲到了30分鐘，希望能得到合理的處理。',
          category: 'COMPLAINT',
          priority: 'URGENT',
          status: 'SENT'
        }
      }),
      prisma.supportTicket.create({
        data: {
          userId: users[3]?.id || users[0]?.id || '',
          message: '付款後一直沒有收到收據，請幫我處理一下，謝謝！',
          category: 'PAYMENT',
          priority: 'HIGH',
          status: 'READ'
        }
      }),
      prisma.supportTicket.create({
        data: {
          userId: users[4]?.id || users[0]?.id || '',
          message: '管理員您好，我想申請提高服務費用，因為最近油價上漲，希望能調整價格。',
          category: 'FEEDBACK',
          priority: 'NORMAL',
          status: 'REPLIED'
        }
      })
    ])

    // 為其中一些票據創建回覆
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (admin) {
      await prisma.supportReply.create({
        data: {
          ticketId: tickets[1].id,
          adminId: admin.id,
          message: '您好，我已經查到您的訂單，正在為您處理中，預計今天下午會有確認通知。'
        }
      })

      await prisma.supportReply.create({
        data: {
          ticketId: tickets[4].id,
          adminId: admin.id,
          message: '您好，感謝您的建議。我們會評估當前的市場狀況和成本結構，會在一周內給您回覆。'
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: '測試客服對話資料創建成功',
      ticketsCreated: tickets.length
    })

  } catch (error) {
    console.error('Error seeding chat data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed chat data' },
      { status: 500 }
    )
  }
}