import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/services/search - 搜尋和篩選服務
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 搜尋參數
    const query = searchParams.get('q') || '';
    const location = searchParams.get('location') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rating = searchParams.get('rating');
    const duration = searchParams.get('duration');
    const maxGuests = searchParams.get('maxGuests');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const tags = searchParams.get('tags')?.split(',') || [];
    
    // 排序和分頁
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // 構建查詢條件
    const where: any = {
      status: 'ACTIVE'
    };

    // 文字搜尋
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { shortDescription: { contains: query, mode: 'insensitive' } }
      ];
    }

    // 地點篩選
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    // 分類篩選
    if (category) {
      where.category = {
        slug: category
      };
    }

    // 價格篩選
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // 時長篩選
    if (duration) {
      const durationHours = parseInt(duration);
      where.durationHours = durationHours;
    }

    // 最大人數篩選
    if (maxGuests) {
      where.maxGuests = { gte: parseInt(maxGuests) };
    }

    // 可用日期篩選
    if (dateFrom && dateTo) {
      where.availability = {
        some: {
          date: {
            gte: new Date(dateFrom),
            lte: new Date(dateTo)
          },
          isAvailable: true
        }
      };
    }

    // 構建排序
    let orderBy: any = {};
    switch (sortBy) {
      case 'price_low':
        orderBy = { price: 'asc' };
        break;
      case 'price_high':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        // 需要計算平均評分，暫時使用創建時間
        orderBy = { createdAt: 'desc' };
        break;
      case 'duration':
        orderBy = { durationHours: sortOrder };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'relevance':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // 執行查詢
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: {
          guide: {
            select: {
              id: true,
              name: true,
              avatar: true,
              userProfile: {
                select: {
                  languages: true,
                  experienceYears: true
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
            select: {
              rating: true
            }
          },
          _count: {
            select: {
              reviews: true,
              bookings: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.service.count({ where })
    ]);

    // 計算每個服務的評分統計
    const servicesWithStats = services.map(service => {
      const ratings = service.reviews.map(r => r.rating);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
        : 0;
      
      const { reviews, _count, ...serviceData } = service;
      
      return {
        ...serviceData,
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews: _count.reviews,
        totalBookings: _count.bookings,
        popularity: _count.bookings > 0 ? Math.min(_count.bookings / 10, 5) : 0
      };
    });

    // 如果是按評分排序，重新排序
    if (sortBy === 'rating') {
      servicesWithStats.sort((a, b) => 
        sortOrder === 'desc' 
          ? b.averageRating - a.averageRating
          : a.averageRating - b.averageRating
      );
    }

    // 計算篩選器統計
    const filterStats = await Promise.all([
      // 價格範圍
      prisma.service.aggregate({
        where: { status: 'ACTIVE' },
        _min: { price: true },
        _max: { price: true }
      }),
      // 分類統計
      prisma.service.groupBy({
        by: ['categoryId'],
        where: { status: 'ACTIVE' },
        _count: { categoryId: true }
      }),
      // 地點統計
      prisma.service.groupBy({
        by: ['location'],
        where: { status: 'ACTIVE' },
        _count: { location: true }
      })
    ]);

    return successResponse({
      services: servicesWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      filters: {
        priceRange: {
          min: filterStats[0]._min.price || 0,
          max: filterStats[0]._max.price || 10000
        },
        categories: filterStats[1],
        locations: filterStats[2]
      },
      searchParams: {
        query,
        location,
        category,
        minPrice,
        maxPrice,
        rating,
        duration,
        maxGuests,
        dateFrom,
        dateTo,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('Search services error:', error);
    return errorResponse('搜尋服務失敗', 500);
  }
}