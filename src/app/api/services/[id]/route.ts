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

// 模擬服務數據
const getMockService = (id: string) => {
  const mockServices = {
    'c1234567-1234-4567-8901-123456789001': {
      id: 'c1234567-1234-4567-8901-123456789001',
      title: '台北101 & 信義區深度導覽',
      description: '專業地陪帶您探索台北最精華的商業區，包含101觀景台、信義商圈購物與在地美食體驗。我們將從象山開始，欣賞台北101的壯觀景色，然後前往信義商圈，體驗台北的繁華都市生活。',
      shortDescription: '專業地陪帶您探索台北最精華的商業區',
      price: 800,
      currency: 'TWD',
      durationHours: 4,
      maxGuests: 6,
      minGuests: 1,
      location: '台北市信義區',
      coordinates: [25.0330, 121.5654],
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800&h=600&fit=crop'
      ],
      highlights: ['專業攝影指導', '101觀景台門票', '在地美食推薦', '購物指南'],
      included: ['專業導覽解說', '101觀景台門票', '美食試吃', '攝影指導'],
      notIncluded: ['交通費用', '個人消費', '午餐費用'],
      cancellationPolicy: '24小時前免費取消',
      status: 'ACTIVE',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      guide: {
        id: 'guide-001',
        name: '小美',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        userProfile: {
          bio: '台北資深地陪，擁有5年導覽經驗，熟悉台北各大景點與美食。',
          location: '台北市',
          languages: ['中文', '英文', '日文'],
          specialties: ['城市導覽', '美食體驗', '攝影指導'],
          experienceYears: 5
        }
      },
      category: {
        name: '城市導覽'
      },
      averageRating: 4.9,
      totalReviews: 127,
      totalBookings: 156,
      reviews: [
        {
          id: 'review-001',
          rating: 5,
          comment: '小美導覽非常專業，帶我們去了很多隱藏版的美食！',
          createdAt: new Date('2024-03-15'),
          reviewer: {
            id: 'reviewer-001',
            name: '王小明',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
          },
          isAnonymous: false,
          isVerified: true
        },
        {
          id: 'review-002',
          rating: 5,
          comment: '非常棒的體驗！推薦給所有第一次來台北的朋友。',
          createdAt: new Date('2024-03-10'),
          reviewer: {
            id: 'reviewer-002',
            name: '李小華',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
          },
          isAnonymous: false,
          isVerified: true
        }
      ]
    },
    // 可以添加更多模擬服務...
  };
  
  return mockServices[id as keyof typeof mockServices];
};

// GET /api/services/[id] - 獲取單個服務詳情
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    let service;
    
    try {
      service = await prisma.service.findUnique({
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
    } catch (error) {
      // 如果數據庫查詢失敗，使用模擬數據
      console.log('Database query failed, using mock data:', error);
      service = null;
    }

    // 如果數據庫中沒有找到服務，嘗試使用模擬數據
    if (!service) {
      const mockService = getMockService(params.id);
      if (mockService) {
        return successResponse(mockService);
      } else {
        return notFoundResponse('服務');
      }
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