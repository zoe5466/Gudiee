import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  notFoundResponse,
  validationErrorResponse 
} from '@/lib/api-response';

interface RouteParams {
  params: { id: string };
}


// GET /api/services/[id] - 獲取單個服務詳情
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const service = await prisma.service.findUnique({
      where: { 
        id: params.id
      },
      include: {
        guide: {
          include: {
            userProfile: true
          }
        },
        category: true,
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 20
        },
        bookings: {
          where: {
            status: { in: ['CONFIRMED', 'COMPLETED'] }
          },
          select: {
            id: true,
            bookingDate: true,
            status: true
          },
          orderBy: { bookingDate: 'desc' },
          take: 10
        },
        _count: {
          select: {
            reviews: true,
            bookings: true
          }
        }
      }
    });

    if (!service) {
      return notFoundResponse('服務');
    }

    // 計算服務評分
    const serviceRatings = service.reviews.map(r => r.rating);
    const serviceAverageRating = serviceRatings.length > 0 
      ? serviceRatings.reduce((sum, rating) => sum + rating, 0) / serviceRatings.length 
      : 0;

    // 計算評分分布
    const ratingDistribution = [1, 2, 3, 4, 5].reduce((acc, rating) => {
      acc[rating] = serviceRatings.filter(r => r === rating).length;
      return acc;
    }, {} as Record<number, number>);

    // 取得未來可預訂的日期（排除已預訂的日期）
    const bookedDates = service.bookings.map(booking => 
      booking.bookingDate.toISOString().split('T')[0]
    );

    // 生成未來30天的可用日期（簡化版本）
    const availableDates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      if (!bookedDates.includes(dateString)) {
        availableDates.push(dateString);
      }
    }

    // 處理服務資料
    const serviceData = {
      id: service.id,
      title: service.title,
      description: service.description,
      shortDescription: service.shortDescription,
      price: Number(service.price),
      location: service.location,
      duration: service.durationHours,
      maxGuests: service.maxGuests,
      minGuests: service.minGuests,
      images: service.images,
      highlights: service.highlights || [],
      included: service.included || [],
      excluded: service.notIncluded || [],
      cancellationPolicy: service.cancellationPolicy,
      category: service.category,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
      stats: {
        averageRating: Number(serviceAverageRating.toFixed(1)),
        totalReviews: service._count.reviews,
        totalBookings: service._count.bookings,
        ratingDistribution
      },
      availability: {
        availableDates,
        bookedDates
      },
      guide: {
        id: service.guide.id,
        name: service.guide.name,
        avatar: service.guide.avatar,
        bio: service.guide.userProfile?.bio,
        location: service.guide.userProfile?.location,
        languages: service.guide.userProfile?.languages || [],
        specialties: service.guide.userProfile?.specialties || [],
        experienceYears: service.guide.userProfile?.experienceYears
      },
      reviews: service.reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        isAnonymous: review.isAnonymous,
        reviewer: review.isAnonymous ? null : review.reviewer
      }))
    };

    return successResponse(serviceData, '服務詳情獲取成功');

  } catch (error) {
    console.error('Get service error:', error);
    return errorResponse('獲取服務詳情失敗', 500);
  }
}

// PUT /api/services/[id] - 更新服務（僅服務擁有者或管理員）
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // 檢查服務是否存在
    const existingService = await prisma.service.findUnique({
      where: { id: params.id },
      include: { guide: true }
    });

    if (!existingService) {
      return notFoundResponse('服務');
    }

    // 檢查權限：只有服務擁有者或管理員可以更新
    if (existingService.guideId !== user.id && user.role !== 'ADMIN') {
      return errorResponse('權限不足', 403);
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      location,
      duration,
      price,
      maxParticipants,
      inclusions,
      exclusions,
      requirements,
      cancellationPolicy,
      highlights,
      itinerary,
      images,
      isActive
    } = body;

    // 更新服務
    const updatedService = await prisma.service.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(location !== undefined && { location }),
        ...(duration !== undefined && { duration }),
        ...(price !== undefined && { price }),
        ...(maxParticipants !== undefined && { maxParticipants }),
        ...(inclusions !== undefined && { inclusions }),
        ...(exclusions !== undefined && { exclusions }),
        ...(requirements !== undefined && { requirements }),
        ...(cancellationPolicy !== undefined && { cancellationPolicy }),
        ...(highlights !== undefined && { highlights }),
        ...(itinerary !== undefined && { itinerary }),
        ...(images !== undefined && { images }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date()
      },
      include: {
        guide: {
          include: {
            userProfile: true
          }
        }
      }
    });

    return successResponse(updatedService, '服務更新成功');

  } catch (error) {
    console.error('Update service error:', error);
    return errorResponse('更新服務失敗', 500);
  }
}

// DELETE /api/services/[id] - 刪除服務（僅服務擁有者或管理員）
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // 檢查服務是否存在
    const existingService = await prisma.service.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            bookings: {
              where: {
                status: {
                  in: ['confirmed', 'pending']
                }
              }
            }
          }
        }
      }
    });

    if (!existingService) {
      return notFoundResponse('服務');
    }

    // 檢查權限
    if (existingService.guideId !== user.id && user.role !== 'ADMIN') {
      return errorResponse('權限不足', 403);
    }

    // 檢查是否有未完成的預訂
    if (existingService._count.bookings > 0) {
      return errorResponse('無法刪除有未完成預訂的服務', 400);
    }

    // 刪除服務
    await prisma.service.delete({
      where: { id: params.id }
    });

    return successResponse(null, '服務刪除成功');

  } catch (error) {
    console.error('Delete service error:', error);
    return errorResponse('刪除服務失敗', 500);
  }
}