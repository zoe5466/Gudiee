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
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const rating = searchParams.get('rating');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const skip = (page - 1) * limit;

    // 構建查詢條件
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      };
    }
    
    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price.gte = parseFloat(priceMin);
      if (priceMax) where.price.lte = parseFloat(priceMax);
    }
    
    if (rating) {
      where.rating = {
        gte: parseFloat(rating)
      };
    }

    // 獲取服務列表
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: {
          guide: {
            include: {
              userProfile: true
            }
          },
          _count: {
            select: {
              reviews: true,
              bookings: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.service.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse(services, '服務列表獲取成功', {
      page,
      limit,
      total,
      totalPages
    });

  } catch (error) {
    console.error('Get services error:', error);
    return errorResponse('獲取服務列表失敗', 500);
  }
}

// POST /api/services - 創建新服務（僅 Guide 可用）
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    if (user.role !== 'GUIDE') {
      return errorResponse('只有導遊可以創建服務', 403);
    }

    const body = await request.json();
    const {
      title,
      description,
      shortDescription,
      categoryId,
      location,
      coordinates,
      durationHours,
      price,
      currency = 'TWD',
      maxGuests,
      included,
      notIncluded,
      cancellationPolicy,
      images
    } = body;

    // 驗證必填字段
    const errors: Record<string, string> = {};
    
    if (!title) errors.title = '服務標題為必填項目';
    if (!description) errors.description = '服務描述為必填項目';
    if (!location) errors.location = '服務地點為必填項目';
    if (!durationHours) errors.durationHours = '服務時長為必填項目';
    if (!price || price <= 0) errors.price = '請提供有效的價格';
    if (!maxGuests || maxGuests <= 0) errors.maxGuests = '請提供有效的最大參與人數';

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    // 創建服務
    const service = await prisma.service.create({
      data: {
        title,
        description,
        shortDescription,
        categoryId,
        location,
        coordinates,
        durationHours,
        price,
        currency,
        maxGuests,
        included: included || [],
        notIncluded: notIncluded || [],
        cancellationPolicy: cancellationPolicy || '',
        images: images || [],
        guideId: user.id,
        status: 'DRAFT' // 新服務預設為草稿狀態
      },
      include: {
        guide: {
          include: {
            userProfile: true
          }
        }
      }
    });

    return successResponse(service, '服務創建成功');

  } catch (error) {
    console.error('Create service error:', error);
    return errorResponse('創建服務失敗', 500);
  }
}