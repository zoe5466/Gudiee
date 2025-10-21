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

// POST /api/services - 創建新服務（暫時停用，使用 mock 數據）
export async function POST(request: NextRequest) {
  try {
    return Response.json({
      success: false,
      error: 'Not implemented',
      message: '創建服務功能暫時停用，請使用現有的模擬服務'
    }, { status: 501 });

  } catch (error) {
    console.error('Create service error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error',
      message: '創建服務失敗'
    }, { status: 500 });
  }
}