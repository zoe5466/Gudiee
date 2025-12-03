import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse
} from '@/lib/api-response';

export const dynamic = 'force-dynamic';

// POST /api/reviews/[id]/helpful - 標記評論為有用
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

    // 檢查評論是否存在
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return errorResponse('找不到評論', 404);
    }

    // 檢查用戶是否已經標記過
    const existingHelpful = await prisma.reviewHelpful.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId: user.id
        }
      }
    });

    if (existingHelpful) {
      return errorResponse('您已經標記過此評論', 400);
    }

    // 創建有用標記
    await prisma.reviewHelpful.create({
      data: {
        reviewId,
        userId: user.id
      }
    });

    // 更新評論的有用計數
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        helpfulCount: {
          increment: 1
        }
      }
    });

    return successResponse({
      helpfulCount: updatedReview.helpfulCount,
      isHelpful: true
    }, '標記為有用成功');

  } catch (error) {
    console.error('Mark review helpful error:', error);
    return errorResponse('標記失敗', 500);
  }
}

// DELETE /api/reviews/[id]/helpful - 取消標記評論為有用
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

    // 檢查評論是否存在
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return errorResponse('找不到評論', 404);
    }

    // 檢查用戶是否已經標記過
    const existingHelpful = await prisma.reviewHelpful.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId: user.id
        }
      }
    });

    if (!existingHelpful) {
      return errorResponse('您尚未標記過此評論', 400);
    }

    // 刪除有用標記
    await prisma.reviewHelpful.delete({
      where: {
        reviewId_userId: {
          reviewId,
          userId: user.id
        }
      }
    });

    // 更新評論的有用計數
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        helpfulCount: {
          decrement: 1
        }
      }
    });

    return successResponse({
      helpfulCount: updatedReview.helpfulCount,
      isHelpful: false
    }, '取消標記成功');

  } catch (error) {
    console.error('Remove review helpful error:', error);
    return errorResponse('取消標記失敗', 500);
  }
}

// GET /api/reviews/[id]/helpful - 獲取評論的有用標記狀態
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const reviewId = params.id;

    // 檢查評論是否存在
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: {
        id: true,
        helpfulCount: true
      }
    });

    if (!review) {
      return errorResponse('找不到評論', 404);
    }

    let isHelpful = false;

    // 如果用戶已登入，檢查是否已標記
    if (user) {
      const helpful = await prisma.reviewHelpful.findUnique({
        where: {
          reviewId_userId: {
            reviewId,
            userId: user.id
          }
        }
      });
      isHelpful = !!helpful;
    }

    return successResponse({
      helpfulCount: review.helpfulCount,
      isHelpful
    });

  } catch (error) {
    console.error('Get review helpful status error:', error);
    return errorResponse('獲取標記狀態失敗', 500);
  }
}