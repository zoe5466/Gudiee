import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse 
} from '@/lib/api-response';

// GET /api/conversations/[id] - 獲取對話詳情
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

    // 獲取對話
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
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
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!conversation) {
      return errorResponse('找不到對話', 404);
    }

    // 檢查用戶是否為參與者
    if (!conversation.participants.includes(user.id)) {
      return errorResponse('無權限訪問此對話', 403);
    }

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

    // 標記消息為已讀
    await prisma.message.updateMany({
      where: {
        conversationId: conversationId,
        senderId: { not: user.id },
        isRead: false
      },
      data: { isRead: true }
    });

    // 創建已讀狀態記錄
    const unreadMessages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
        senderId: { not: user.id },
        readStatuses: {
          none: {
            userId: user.id
          }
        }
      }
    });

    if (unreadMessages.length > 0) {
      await prisma.messageReadStatus.createMany({
        data: unreadMessages.map(message => ({
          messageId: message.id,
          userId: user.id
        })),
        skipDuplicates: true
      });
    }

    return successResponse({
      ...conversation,
      participants
    });

  } catch (error) {
    console.error('Get conversation error:', error);
    return errorResponse('獲取對話失敗', 500);
  }
}

// PUT /api/conversations/[id] - 更新對話
export async function PUT(
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
    const { title } = body;

    // 檢查對話是否存在且用戶有權限
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) {
      return errorResponse('找不到對話', 404);
    }

    if (!conversation.participants.includes(user.id)) {
      return errorResponse('無權限修改此對話', 403);
    }

    // 更新對話
    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        ...(title && { title }),
        lastActivityAt: new Date()
      }
    });

    return successResponse(updatedConversation, '對話更新成功');

  } catch (error) {
    console.error('Update conversation error:', error);
    return errorResponse('更新對話失敗', 500);
  }
}

// DELETE /api/conversations/[id] - 刪除對話（僅限創建者或管理員）
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const conversationId = params.id;

    // 檢查對話是否存在
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) {
      return errorResponse('找不到對話', 404);
    }

    // 檢查權限（參與者或管理員）
    if (!conversation.participants.includes(user.id) && user.role !== 'GUIDE') {
      return errorResponse('無權限刪除此對話', 403);
    }

    // 刪除對話（級聯刪除消息和讀取狀態）
    await prisma.conversation.delete({
      where: { id: conversationId }
    });

    return successResponse(null, '對話刪除成功');

  } catch (error) {
    console.error('Delete conversation error:', error);
    return errorResponse('刪除對話失敗', 500);
  }
}