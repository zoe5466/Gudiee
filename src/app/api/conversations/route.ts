import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  validationErrorResponse 
} from '@/lib/api-response';

// GET /api/conversations - 獲取用戶的對話列表
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type') as 'DIRECT' | 'GROUP' | 'CUSTOMER_SUPPORT' | null;
    const skip = (page - 1) * limit;

    // 構建查詢條件
    const where: any = {
      participants: {
        has: user.id
      }
    };

    if (type) {
      where.type = type;
    }

    // 獲取對話列表
    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          }
        },
        orderBy: {
          lastActivityAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.conversation.count({ where })
    ]);

    // 為每個對話添加額外信息
    const enrichedConversations = await Promise.all(
      conversations.map(async (conversation) => {
        // 獲取未讀消息數
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conversation.id,
            senderId: { not: user.id },
            isRead: false
          }
        });

        // 獲取參與者信息
        const participantIds = conversation.participants.filter(id => id !== user.id);
        const participants = await prisma.user.findMany({
          where: {
            id: { in: participantIds }
          },
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true
          }
        });

        // 計算對話標題
        let conversationTitle = conversation.title;
        if (!conversationTitle && conversation.type === 'DIRECT') {
          conversationTitle = participants.map(p => p.name).join(', ');
        }

        return {
          ...conversation,
          title: conversationTitle,
          participants: participants,
          unreadCount,
          lastMessage: conversation.messages[0] || null
        };
      })
    );

    return successResponse({
      conversations: enrichedConversations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    return errorResponse('獲取對話列表失敗', 500);
  }
}

// POST /api/conversations - 創建新對話
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { participantIds, title, type = 'DIRECT', message } = body;

    // 驗證參數
    const errors: Record<string, string> = {};
    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      errors.participantIds = '請選擇對話參與者';
    }
    if (type === 'GROUP' && !title) {
      errors.title = '群組對話需要標題';
    }

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    // 檢查參與者是否存在
    const participants = await prisma.user.findMany({
      where: {
        id: { in: participantIds }
      }
    });

    if (participants.length !== participantIds.length) {
      return errorResponse('部分參與者不存在', 400);
    }

    // 對於直接對話，檢查是否已存在
    if (type === 'DIRECT' && participantIds.length === 1) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          type: 'DIRECT',
          participants: {
            hasEvery: [user.id, participantIds[0]]
          }
        }
      });

      if (existingConversation) {
        return successResponse({
          conversation: existingConversation,
          isExisting: true
        }, '對話已存在');
      }
    }

    // 創建對話
    const allParticipants = [user.id, ...participantIds];
    
    const conversation = await prisma.conversation.create({
      data: {
        type,
        participants: allParticipants,
        title: title || null,
        lastActivityAt: new Date()
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    // 如果有初始消息，發送它
    let firstMessage = null;
    if (message && message.trim()) {
      firstMessage = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: user.id,
          content: message.trim(),
          messageType: 'TEXT'
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      });

      // 更新對話的最後活動時間
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastActivityAt: new Date() }
      });
    }

    // 創建通知給其他參與者
    for (const participantId of participantIds) {
      await prisma.notification.create({
        data: {
          userId: participantId,
          type: 'MESSAGE_RECEIVED',
          title: '新對話',
          content: `${user.name} 開始了新對話`,
          data: {
            conversationId: conversation.id,
            senderId: user.id
          },
          actionUrl: `/messages/${conversation.id}`
        }
      });
    }

    return successResponse({
      conversation,
      firstMessage,
      isExisting: false
    }, '對話創建成功');

  } catch (error) {
    console.error('Create conversation error:', error);
    return errorResponse('創建對話失敗', 500);
  }
}