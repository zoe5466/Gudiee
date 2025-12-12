import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

interface RouteParams {
  params: { id: string };
}

export const dynamic = 'force-dynamic';

// GET /api/services/[id] - 獲取單個服務詳情
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    console.log('Service API called with ID:', params.id);

    // 從數據庫獲取服務詳情
    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: {
        guide: {
          select: {
            id: true,
            name: true,
            avatar: true,
            userProfile: {
              select: {
                bio: true,
                languages: true,
                specialties: true,
                experienceYears: true,
                location: true
              }
            }
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        reviews: {
          where: { status: 'APPROVED' },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            reviewer: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            reviews: { where: { status: 'APPROVED' } },
            bookings: true
          }
        }
      }
    });

    if (!service) {
      return errorResponse('找不到指定的服務', 404);
    }

    // 計算平均評分
    const reviews = await prisma.review.findMany({
      where: {
        serviceId: service.id,
        status: 'APPROVED'
      },
      select: { rating: true }
    });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    // 格式化數據以符合前端需求
    const formattedService = {
      ...service,
      price: Number(service.price),
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviewCount: service._count.reviews,
      bookingsCount: service._count.bookings,
      guide: {
        ...service.guide,
        rating: 4.8, // TODO: 計算導遊的總體評分
        reviewCount: service._count.reviews,
        languages: service.guide.userProfile?.languages || [],
        experience: service.guide.userProfile?.experienceYears
          ? `${service.guide.userProfile.experienceYears}年經驗`
          : '新手導遊',
        specialties: service.guide.userProfile?.specialties || [],
        bio: service.guide.userProfile?.bio || ''
      }
    };

    return successResponse(formattedService, '服務詳情獲取成功');
  } catch (error) {
    console.error('Service API error:', error);
    return errorResponse('服務載入失敗', 500);
  }
}