import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  validationErrorResponse 
} from '@/lib/api-response';

// GET /api/conversations/[id]/messages - 獲取對話中的消息
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const conversationId = params.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const before = searchParams.get('before'); // 獲取某個時間點之前的消息
    const skip = (page - 1) * limit;

    // 檢查對話是否存在且用戶有權限
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) {
      return errorResponse('找不到對話', 404);
    }

    if (!conversation.participants.includes(user.id)) {
      return errorResponse('無權限訪問此對話', 403);
    }

    // 構建查詢條件
    const where: any = {
      conversationId,
      isDeleted: false
    };

    if (before) {
      where.createdAt = { lt: new Date(before) };
    }

    // 獲取消息列表
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
              role: true
            }
          },
          readStatuses: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          },
          replyTo: {
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.message.count({ where })
    ]);

    // 反轉順序，使最新消息在後面
    const reversedMessages = messages.reverse();

    return successResponse({
      messages: reversedMessages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: total > page * limit
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    return errorResponse('獲取消息失敗', 500);
  }
}

// POST /api/conversations/[id]/messages - 發送新消息
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const conversationId = params.id;
    const body = await request.json();
    const { content, messageType = 'TEXT', attachments = [], replyToId, metadata = {} } = body;

    // 驗證參數
    const errors: Record<string, string> = {};
    
    if (messageType === 'TEXT' && (!content || content.trim().length === 0)) {
      errors.content = '消息內容不能為空';
    }
    
    if (messageType === 'TEXT' && content && content.trim().length > 2000) {
      errors.content = '消息內容不能超過 2000 字元';
    }

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    // 檢查對話是否存在且用戶有權限
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) {
      return errorResponse('找不到對話', 404);
    }

    if (!conversation.participants.includes(user.id)) {
      return errorResponse('無權限在此對話中發送消息', 403);
    }

    // 如果是回復消息，檢查原消息是否存在
    if (replyToId) {
      const originalMessage = await prisma.message.findUnique({
        where: { id: replyToId }
      });

      if (!originalMessage || originalMessage.conversationId !== conversationId) {
        return errorResponse('回復的原消息不存在', 400);
      }
    }

    // 創建消息
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        content: content?.trim() || null,
        messageType,
        attachments,
        replyToId: replyToId || null,
        metadata
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true
          }
        },
        replyTo: {
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

    // 更新對話的最後活動時間
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { 
        lastActivityAt: new Date(),
        lastMessageId: message.id
      }
    });

    // 創建通知給其他參與者
    const otherParticipants = conversation.participants.filter(id => id !== user.id);
    
    for (const participantId of otherParticipants) {
      await prisma.notification.create({
        data: {
          userId: participantId,
          type: 'MESSAGE_RECEIVED',
          title: '新消息',
          content: `${user.name}: ${messageType === 'TEXT' ? content.substring(0, 100) : '[附件]'}`,
          data: {
            conversationId,
            messageId: message.id,
            senderId: user.id
          },
          actionUrl: `/messages/${conversationId}`
        }
      });
    }

    return successResponse(message, '消息發送成功');

  } catch (error) {
    console.error('Send message error:', error);
    return errorResponse('發送消息失敗', 500);
  }
}