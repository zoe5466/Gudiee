import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/guides - 取得嚮導列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 搜尋和篩選參數
    const query = searchParams.get('q') || '';
    const location = searchParams.get('location') || '';
    const language = searchParams.get('language') || '';
    const specialty = searchParams.get('specialty') || '';
    const minRating = searchParams.get('minRating');
    const minExperience = searchParams.get('minExperience');
    const sortBy = searchParams.get('sortBy') || 'rating';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // 構建查詢條件
    const where: any = {
      role: 'GUIDE',
      isEmailVerified: true,
      guidedServices: {
        some: {
          status: 'ACTIVE'
        }
      }
    };

    // 文字搜尋 - 搜尋姓名或個人檔案
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { userProfile: { bio: { contains: query, mode: 'insensitive' } } }
      ];
    }

    // 地點篩選
    if (location) {
      where.userProfile = {
        ...where.userProfile,
        location: { contains: location, mode: 'insensitive' }
      };
    }

    // 語言篩選
    if (language) {
      where.userProfile = {
        ...where.userProfile,
        languages: { has: language }
      };
    }

    // 專業領域篩選
    if (specialty) {
      where.userProfile = {
        ...where.userProfile,
        specialties: { has: specialty }
      };
    }

    // 最低經驗年數
    if (minExperience) {
      where.userProfile = {
        ...where.userProfile,
        experienceYears: { gte: parseInt(minExperience) }
      };
    }

    // 排序設定
    let orderBy: any = {};
    switch (sortBy) {
      case 'name':
        orderBy = { name: sortOrder };
        break;
      case 'experience':
        orderBy = { userProfile: { experienceYears: sortOrder } };
        break;
      case 'services':
        // 按服務數量排序，需要在後續處理
        orderBy = { createdAt: 'desc' };
        break;
      case 'rating':
      default:
        // 按評分排序，需要在後續處理
        orderBy = { createdAt: 'desc' };
        break;
    }

    // 查詢嚮導列表
    const [guides, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          userProfile: true,
          guidedServices: {
            where: { status: 'ACTIVE' },
            select: {
              id: true,
              title: true,
              price: true,
              location: true,
              images: true,
              _count: {
                select: {
                  bookings: true,
                  reviews: true
                }
              }
            },
            take: 3,
            orderBy: { createdAt: 'desc' }
          },
          reviewsAsGuide: {
            select: {
              rating: true
            }
          },
          _count: {
            select: {
              guidedServices: true,
              reviewsAsGuide: true,
              bookingsAsGuide: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    // 計算每個嚮導的統計資料
    const guidesWithStats = guides.map(guide => {
      const ratings = guide.reviewsAsGuide.map(r => r.rating);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
        : 0;

      // 計算總預訂數
      const totalBookings = guide.guidedServices.reduce((sum, service) => 
        sum + (service._count?.bookings || 0), 0
      );

      // 計算總評論數
      const totalReviews = guide.guidedServices.reduce((sum, service) => 
        sum + (service._count?.reviews || 0), 0
      );

      // 移除 reviewsAsGuide 避免返回過多資料
      const { reviewsAsGuide, ...guideData } = guide;

      return {
        ...guideData,
        stats: {
          averageRating: Number(averageRating.toFixed(1)),
          totalReviews,
          totalBookings,
          activeServices: guide._count.guidedServices,
          responseRate: 95 + Math.floor(Math.random() * 5) // 模擬回覆率
        }
      };
    });

    // 如果按評分或服務數排序，重新排序
    if (sortBy === 'rating') {
      guidesWithStats.sort((a, b) => 
        sortOrder === 'desc' 
          ? b.stats.averageRating - a.stats.averageRating
          : a.stats.averageRating - b.stats.averageRating
      );
    } else if (sortBy === 'services') {
      guidesWithStats.sort((a, b) => 
        sortOrder === 'desc' 
          ? b.stats.activeServices - a.stats.activeServices
          : a.stats.activeServices - b.stats.activeServices
      );
    }

    // 應用最低評分篩選
    let filteredGuides = guidesWithStats;
    if (minRating) {
      filteredGuides = guidesWithStats.filter(guide => 
        guide.stats.averageRating >= parseFloat(minRating)
      );
    }

    // 取得篩選統計
    const [locationStats, languageStats, specialtyStats] = await Promise.all([
      // 地點統計
      prisma.userProfile.groupBy({
        by: ['location'],
        where: {
          user: { role: 'GUIDE', isEmailVerified: true },
          location: { not: null }
        },
        _count: { location: true },
        orderBy: { _count: { location: 'desc' } },
        take: 10
      }),
      
      // 語言統計 (這需要自訂查詢，暫時跳過)
      Promise.resolve([]),
      
      // 專業領域統計 (這需要自訂查詢，暫時跳過)
      Promise.resolve([])
    ]);

    return successResponse({
      guides: filteredGuides,
      pagination: {
        page,
        limit,
        total: filteredGuides.length,
        pages: Math.ceil(filteredGuides.length / limit),
        hasNext: page < Math.ceil(filteredGuides.length / limit),
        hasPrev: page > 1
      },
      filters: {
        locations: locationStats,
        languages: languageStats,
        specialties: specialtyStats
      },
      searchParams: {
        query,
        location,
        language,
        specialty,
        minRating,
        minExperience,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('Get guides error:', error);
    return errorResponse('取得嚮導列表失敗', 500);
  }
}