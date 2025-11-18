import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse
} from '@/lib/api-response';

// GET /api/services - 獲取服務列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query');
    const location = searchParams.get('location');
    const priceMin = searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined;
    const priceMax = searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined;
    const minRating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined;
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // 構建查詢條件
    const where: any = {
      status: 'ACTIVE'
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) where.price.gte = priceMin;
      if (priceMax !== undefined) where.price.lte = priceMax;
    }

    // 構建排序條件
    const orderBy: any = {};
    switch (sortBy) {
      case 'price_asc':
        orderBy.price = 'asc';
        break;
      case 'price_desc':
        orderBy.price = 'desc';
        break;
      case 'rating':
        orderBy.averageRating = 'desc';
        break;
      case 'popular':
        orderBy.bookingsCount = 'desc';
        break;
      case 'newest':
      default:
        orderBy.createdAt = 'desc';
    }

    // 獲取服務列表
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
                  bio: true,
                  languages: true,
                  specialties: true,
                  yearsOfExperience: true
                }
              }
            }
          },
          _count: {
            select: { reviews: true, bookings: true }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.service.count({ where })
    ]);

    // 計算平均評分和審查統計
    const servicesWithStats = await Promise.all(
      services.map(async (service) => {
        const reviews = await prisma.review.findMany({
          where: { serviceId: service.id },
          select: { rating: true }
        });

        const averageRating = reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

        return {
          ...service,
          averageRating: parseFloat(averageRating.toFixed(1)),
          reviewCount: reviews.length
        };
      })
    );

    // 根據最低評分過濾
    const filteredServices = minRating
      ? servicesWithStats.filter(s => s.averageRating >= minRating)
      : servicesWithStats;

    return successResponse({
      data: filteredServices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, '服務列表獲取成功');

  } catch (error) {
    console.error('Get services error:', error);
    return errorResponse('獲取服務列表失敗', 500);
  }
}

// POST /api/services - 創建新服務
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    if (user.role !== 'GUIDE') {
      return errorResponse('只有導遊可以建立服務', 403);
    }

    const data = await request.json();

    // 驗證必填欄位
    const errors: Record<string, string> = {};
    if (!data.title) errors.title = '服務標題為必填項目';
    if (!data.description) errors.description = '服務描述為必填項目';
    if (!data.location) errors.location = '服務地點為必填項目';
    if (!data.price || data.price <= 0) errors.price = '服務價格必須大於 0';
    if (!data.duration || data.duration <= 0) errors.duration = '服務時長必須大於 0';

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    // 創建新服務
    const newService = await prisma.service.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        price: parseFloat(data.price),
        duration: parseInt(data.duration),
        maxGuests: parseInt(data.maxGuests) || 6,
        minGuests: parseInt(data.minGuests) || 1,
        category: data.category,
        status: 'ACTIVE',
        guideId: user.id,
        images: data.images || [],
        highlights: data.highlights || [],
        included: data.included || [],
        excluded: data.excluded || [],
        cancellationPolicy: data.cancellationPolicy || '24小時前免費取消'
      },
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
                yearsOfExperience: true
              }
            }
          }
        }
      }
    });

    return successResponse({
      data: newService
    }, '服務創建成功');

  } catch (error) {
    console.error('Create service error:', error);
    return errorResponse('創建服務失敗', 500);
  }
}