import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  validationErrorResponse 
} from '@/lib/api-response';

// POST /api/reviews/[id]/responses - 回復評論
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const reviewId = params.id;
    const body = await request.json();
    const { content } = body;

    // 驗證內容
    if (!content || content.trim().length < 10) {
      return validationErrorResponse({
        content: '回復內容至少需要 10 個字元'
      });
    }

    // 查找評論
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        service: {
          include: {
            guide: true
          }
        }
      }
    });

    if (!review) {
      return errorResponse('找不到評論', 404);
    }

    // 確定回復者類型
    let authorType: 'GUIDE' | 'ADMIN';
    
    // 檢查是否為嚮導回復自己服務的評論
    if (user.id === review.service.guide.id) {
      authorType = 'GUIDE';
    } else if (user.role === 'GUIDE') {
      authorType = 'ADMIN';
    } else {
      return errorResponse('只有嚮導或管理員可以回復評論', 403);
    }

    // 檢查是否已經回復過（每個類型的用戶只能回復一次）
    const existingResponse = await prisma.reviewResponse.findFirst({
      where: {
        reviewId,
        authorId: user.id,
        authorType
      }
    });

    if (existingResponse) {
      return errorResponse('您已經回復過此評論', 400);
    }

    // 創建回復
    const response = await prisma.reviewResponse.create({
      data: {
        reviewId,
        authorId: user.id,
        authorType,
        content: content.trim()
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true
          }
        }
      }
    });

    // 創建通知給評論者
    await prisma.notification.create({
      data: {
        userId: review.reviewerId,
        type: 'REVIEW_RECEIVED',
        title: '評論收到回復',
        content: `${authorType === 'GUIDE' ? '嚮導' : '管理員'} ${user.name} 回復了您的評論`,
        data: {
          reviewId,
          responseId: response.id,
          authorType
        },
        actionUrl: `/reviews/${reviewId}`
      }
    });

    return successResponse(response, '回復發送成功');

  } catch (error) {
    console.error('Create review response error:', error);
    return errorResponse('回復發送失敗', 500);
  }
}

// GET /api/reviews/[id]/responses - 獲取評論的所有回復
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviewId = params.id;

    // 檢查評論是否存在
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return errorResponse('找不到評論', 404);
    }

    // 獲取所有回復
    const responses = await prisma.reviewResponse.findMany({
      where: { reviewId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return successResponse(responses);

  } catch (error) {
    console.error('Get review responses error:', error);
    return errorResponse('獲取回復失敗', 500);
  }
}