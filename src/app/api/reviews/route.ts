import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

import {
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  validationErrorResponse 
} from '@/lib/api-response';

// GET /api/reviews - 獲取評價列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');
    const guideId = searchParams.get('guideId');
    const userId = searchParams.get('userId');
    const rating = searchParams.get('rating');
    const verified = searchParams.get('verified');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    // 構建查詢條件
    const where: any = {
      status: 'APPROVED'
    };

    if (serviceId) {
      where.serviceId = serviceId;
    }

    if (guideId) {
      where.service = {
        guideId: guideId
      };
    }

    if (userId) {
      where.reviewerId = userId;
    }

    if (rating) {
      where.rating = parseInt(rating);
    }

    if (verified !== null && verified !== undefined) {
      where.isVerified = verified === 'true';
    }

    // 獲取評價列表
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
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
              guide: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          },
          booking: {
            select: {
              id: true,
              bookingDate: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.review.count({ where })
    ]);

    // 計算統計資料
    const stats = await prisma.review.aggregate({
      where,
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    const ratingDistribution = await Promise.all([
      prisma.review.count({ where: { ...where, rating: 5 } }),
      prisma.review.count({ where: { ...where, rating: 4 } }),
      prisma.review.count({ where: { ...where, rating: 3 } }),
      prisma.review.count({ where: { ...where, rating: 2 } }),
      prisma.review.count({ where: { ...where, rating: 1 } })
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse({
      reviews,
      statistics: {
        averageRating: Number((stats._avg.rating || 0).toFixed(1)),
        totalReviews: stats._count.rating,
        ratingDistribution: {
          5: ratingDistribution[0],
          4: ratingDistribution[1],
          3: ratingDistribution[2],
          2: ratingDistribution[3],
          1: ratingDistribution[4]
        }
      }
    }, '評價列表獲取成功', {
      page,
      limit,
      total,
      totalPages
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    return errorResponse('獲取評價列表失敗', 500);
  }
}

// POST /api/reviews - 創建新評價
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const {
      bookingId,
      serviceId,
      rating,
      comment,
      photos,
      pros,
      cons,
      tags,
      isAnonymous
    } = body;

    // 驗證必填字段
    const errors: Record<string, string> = {};
    
    if (!bookingId) errors.bookingId = '預訂 ID 為必填項目';
    if (!serviceId) errors.serviceId = '服務 ID 為必填項目';
    if (!rating || rating < 1 || rating > 5) errors.rating = '請提供1-5星的評分';
    if (!comment || comment.trim().length < 10) errors.comment = '評論內容至少需要10個字符';

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    // 檢查預訂是否存在且屬於用戶
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: true
      }
    });

    if (!booking) {
      return errorResponse('預訂不存在', 404);
    }

    if (booking.travelerId !== user.id) {
      return errorResponse('只能評價自己的預訂', 403);
    }

    if (booking.status !== 'COMPLETED') {
      return errorResponse('只能評價已完成的服務', 400);
    }

    // 檢查是否已經評價過
    const existingReview = await prisma.review.findFirst({
      where: {
        bookingId,
        reviewerId: user.id
      }
    });

    if (existingReview) {
      return errorResponse('該預訂已經評價過', 400);
    }

    // 創建評價
    const review = await prisma.review.create({
      data: {
        bookingId,
        serviceId,
        guideId: booking.guideId,
        reviewerId: user.id,
        rating,
        comment: comment.trim(),
        photos: photos || [],
        pros: pros || [],
        cons: cons || [],
        tags: tags || [],
        isAnonymous: isAnonymous || false,
        isVerified: true, // 通過預訂創建的評價自動驗證
        status: 'APPROVED'
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
            guide: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        },
        booking: {
          select: {
            id: true,
            bookingDate: true
          }
        }
      }
    });

    // TODO: 可以在此處添加計算服務平均評分的邏輯

    return successResponse(review, '評價提交成功');

  } catch (error) {
    console.error('Create review error:', error);
    return errorResponse('評價提交失敗', 500);
  }
}