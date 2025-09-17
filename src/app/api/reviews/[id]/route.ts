import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  validationErrorResponse 
} from '@/lib/api-response';

// GET /api/reviews/[id] - 取得單個評論詳情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviewId = params.id;

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        service: {
          select: {
            id: true,
            title: true,
            location: true,
            images: true,
            guide: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        },
        guide: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        booking: {
          select: {
            id: true,
            bookingDate: true,
            guests: true
          }
        },
        responses: {
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
        },
        helpful: {
          select: {
            userId: true
          }
        }
      }
    });

    if (!review) {
      return errorResponse('找不到評論', 404);
    }

    return successResponse(review);

  } catch (error) {
    console.error('Get review error:', error);
    return errorResponse('獲取評論失敗', 500);
  }
}

// PUT /api/reviews/[id] - 更新評論（僅限作者）
export async function PUT(
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
    const { rating, comment, photos, pros, cons, tags } = body;

    // 查找評論
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return errorResponse('找不到評論', 404);
    }

    // 檢查權限（只有作者可以編輯）
    if (review.reviewerId !== user.id) {
      return errorResponse('無權限編輯此評論', 403);
    }

    // 檢查評論狀態（已審核的評論不能編輯）
    if (review.status === 'APPROVED') {
      return errorResponse('已審核的評論無法編輯', 400);
    }

    // 驗證字段
    const errors: Record<string, string> = {};
    if (rating && (rating < 1 || rating > 5)) errors.rating = '評分必須為 1-5 分';
    if (comment && comment.trim().length < 10) errors.comment = '評論內容至少需要 10 個字元';

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    // 更新評論
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(rating && { rating }),
        ...(comment && { comment: comment.trim() }),
        ...(photos && { photos }),
        ...(pros && { pros }),
        ...(cons && { cons }),
        ...(tags && { tags }),
        status: 'PENDING' // 重新審核
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        service: {
          select: {
            id: true,
            title: true,
            location: true
          }
        }
      }
    });

    return successResponse(updatedReview, '評論更新成功');

  } catch (error) {
    console.error('Update review error:', error);
    return errorResponse('更新評論失敗', 500);
  }
}

// DELETE /api/reviews/[id] - 刪除評論
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const reviewId = params.id;

    // 查找評論
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return errorResponse('找不到評論', 404);
    }

    // 檢查權限（作者或管理員可以刪除）
    if (review.reviewerId !== user.id && user.role !== 'GUIDE') {
      return errorResponse('無權限刪除此評論', 403);
    }

    // 刪除評論（級聯刪除相關數據）
    await prisma.review.delete({
      where: { id: reviewId }
    });

    return successResponse(null, '評論刪除成功');

  } catch (error) {
    console.error('Delete review error:', error);
    return errorResponse('刪除評論失敗', 500);
  }
}