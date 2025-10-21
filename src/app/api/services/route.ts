import { NextRequest } from 'next/server';
import { serviceStorage } from '@/lib/mock-services';

// GET /api/services - 獲取服務列表
export async function GET(request: NextRequest) {
  try {
    console.log('Services API called');
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query') || undefined;
    const category = searchParams.get('category') || undefined;
    const location = searchParams.get('location') || undefined;
    const priceMin = searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined;
    const priceMax = searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined;
    const minRating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined;
    const sortBy = (searchParams.get('sortBy') as any) || 'relevance';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // 使用 mock 服務進行搜尋
    const allServices = serviceStorage.search({
      query,
      location,
      category,
      priceMin,
      priceMax,
      minRating,
      sortBy
    });

    // 分頁處理
    const total = allServices.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const services = allServices.slice(startIndex, endIndex);

    return Response.json({
      success: true,
      data: services,
      message: '服務列表獲取成功',
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('Get services error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error',
      message: '獲取服務列表失敗'
    }, { status: 500 });
  }
}

// POST /api/services - 創建新服務
export async function POST(request: NextRequest) {
  try {
    console.log('Create service API called');
    
    const data = await request.json();
    console.log('Received service data:', data);

    // 驗證必填欄位
    if (!data.title || !data.description || !data.location || !data.price) {
      return Response.json({
        success: false,
        error: 'Missing required fields',
        message: '請填寫所有必填欄位'
      }, { status: 400 });
    }

    // 創建新服務數據
    const newService = {
      id: `service-${Date.now()}`,
      title: data.title,
      description: data.description,
      shortDescription: data.shortDescription || data.title,
      price: parseFloat(data.price),
      location: data.location,
      duration: parseInt(data.duration) || 4,
      maxGuests: parseInt(data.maxGuests) || 6,
      minGuests: parseInt(data.minGuests) || 1,
      category: data.category ? { id: data.category, name: data.category } : null,
      status: 'ACTIVE' as const,
      highlights: Array.isArray(data.highlights) ? data.highlights.filter(h => h.trim()) : [],
      included: Array.isArray(data.included) ? data.included.filter(i => i.trim()) : [],
      excluded: Array.isArray(data.excluded) ? data.excluded.filter(e => e.trim()) : [],
      images: data.images || [
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      cancellationPolicy: data.cancellationPolicy || '24小時前免費取消',
      guide: {
        id: 'guide-current',
        name: '專業導遊',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        bio: '專業認證導遊，擁有豐富的在地經驗',
        location: data.location,
        languages: ['中文', '英文'],
        specialties: [data.category || '觀光導覽'],
        experienceYears: 5
      },
      stats: {
        averageRating: 0,
        totalReviews: 0,
        totalBookings: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      },
      availability: {
        availableDates: [],
        bookedDates: []
      },
      reviews: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 使用 serviceStorage 添加服務
    const { serviceStorage } = await import('@/lib/mock-services');
    const createdService = serviceStorage.add(newService);

    console.log('Service created successfully:', createdService.id);

    return Response.json({
      success: true,
      data: createdService,
      message: '服務創建成功'
    });

  } catch (error) {
    console.error('Create service error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error',
      message: '創建服務失敗'
    }, { status: 500 });
  }
}