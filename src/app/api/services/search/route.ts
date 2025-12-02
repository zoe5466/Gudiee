// 服務搜尋 API 路由
// 功能：提供強大的服務搜尋和篩選功能，支援多種排序和統計
import { NextRequest } from 'next/server';
import { serviceStorage } from '@/lib/mock-services';

export const dynamic = 'force-dynamic';

/**
 * GET /api/services/search - 服務搜尋和篩選 API
 * 
 * 支援的查詢參數：
 * - q: 關鍵字搜尋
 * - location: 地點篩選
 * - category: 分類篩選
 * - minPrice/maxPrice: 價格範圍
 * - rating: 評分範圍
 * - duration: 時長篩選
 * - maxGuests: 最大人數
 * - dateFrom/dateTo: 日期範圍
 * - tags: 標籤篩選
 * - sortBy: 排序方式 (relevance, price_low, price_high, rating, duration, newest)
 * - sortOrder: 排序順序 (asc, desc)
 * - page: 頁碼
 * - limit: 每頁數量
 * 
 * 回應包含：
 * - services: 服務列表（含評分統計）
 * - pagination: 分頁資訊
 * - filters: 篩選器統計資料
 * - searchParams: 搜尋參數回傳
 */
export async function GET(request: NextRequest) {
  try {
    console.log('Search services API called');
    
    // 解析 URL 查詢參數
    const { searchParams } = new URL(request.url);
    
    // 提取搜尋和篩選參數
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const location = searchParams.get('location') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const minRating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined;
    const sortBy = (searchParams.get('sortBy') as any) || 'relevance';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // 使用 mock 服務進行搜尋
    const allServices = serviceStorage.search({
      query,
      location,
      category,
      priceMin: minPrice,
      priceMax: maxPrice,
      minRating,
      sortBy
    });

    // 分頁處理
    const total = allServices.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const services = allServices.slice(startIndex, endIndex);

    // 計算篩選器統計資料
    const allActiveServices = serviceStorage.getAll();
    const prices = allActiveServices.map(s => s.price);
    const locations = Array.from(new Set(allActiveServices.map(s => s.location)));
    const categories = Array.from(new Set(allActiveServices.map(s => s.category?.name).filter(Boolean)));

    return Response.json({
      success: true,
      data: {
        services,
        pagination: {
          page,
          limit,
          total,
          pages: totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters: {
          priceRange: {
            min: Math.min(...prices),
            max: Math.max(...prices)
          },
          locations: locations.map(loc => ({ location: loc, _count: { location: allActiveServices.filter(s => s.location === loc).length } })),
          categories: categories.map(cat => ({ category: cat, _count: { category: allActiveServices.filter(s => s.category?.name === cat).length } }))
        },
        searchParams: {
          query,
          location,
          category,
          minPrice,
          maxPrice,
          rating: minRating,
          sortBy
        }
      },
      message: '搜尋成功'
    });

  } catch (error) {
    console.error('Search services error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error',
      message: '搜尋服務失敗'
    }, { status: 500 });
  }
}