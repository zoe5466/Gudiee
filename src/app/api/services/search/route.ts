// 服務搜尋 API 路由
// 功能：提供強大的服務搜尋和篩選功能，支援多種排序和統計
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma'; // 資料庫連接
import { successResponse, errorResponse } from '@/lib/api-response'; // API 回應格式

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
    // 解析 URL 查詢參數
    const { searchParams } = new URL(request.url);
    
    // 提取搜尋和篩選參數
    const query = searchParams.get('q') || ''; // 關鍵字搜尋
    const location = searchParams.get('location') || ''; // 地點篩選
    const category = searchParams.get('category') || ''; // 分類篩選
    const minPrice = searchParams.get('minPrice'); // 最低價格
    const maxPrice = searchParams.get('maxPrice'); // 最高價格
    const rating = searchParams.get('rating'); // 評分範圍
    const duration = searchParams.get('duration'); // 時長篩選
    const maxGuests = searchParams.get('maxGuests'); // 最大人數
    const dateFrom = searchParams.get('dateFrom'); // 開始日期
    const dateTo = searchParams.get('dateTo'); // 結束日期
    const tags = searchParams.get('tags')?.split(',') || []; // 標籤列表（逗號分隔）
    
    // 排序和分頁參數
    const sortBy = searchParams.get('sortBy') || 'relevance'; // 排序方式
    const sortOrder = searchParams.get('sortOrder') || 'desc'; // 排序順序
    const page = parseInt(searchParams.get('page') || '1'); // 當前頁碼
    const limit = parseInt(searchParams.get('limit') || '20'); // 每頁數量
    const skip = (page - 1) * limit; // 計算跳過的記錄數

    // 構建基本查詢條件：只查詢活躍狀態的服務
    const where: any = {
      status: 'ACTIVE'
    };

    // 關鍵字搜尋：在標題、描述、簡短描述中搜尋（不區分大小寫）
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } }, // 標題搜尋
        { description: { contains: query, mode: 'insensitive' } }, // 詳細描述搜尋
        { shortDescription: { contains: query, mode: 'insensitive' } } // 簡短描述搜尋
      ];
    }

    // 地點篩選：模糊匹配地點名稱（不區分大小寫）
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    // 分類篩選：透過 category slug 進行精確匹配
    if (category) {
      where.category = {
        slug: category
      };
    }

    // 價格範圍篩選：支援最低價、最高價或兩者同時設定
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice); // 大於等於最低價
      if (maxPrice) where.price.lte = parseFloat(maxPrice); // 小於等於最高價
    }

    // 服務時長篩選：精確匹配指定小時數
    if (duration) {
      const durationHours = parseInt(duration);
      where.durationHours = durationHours;
    }

    // 最大人數篩選：查找可容納指定人數以上的服務
    if (maxGuests) {
      where.maxGuests = { gte: parseInt(maxGuests) }; // 大於等於指定人數
    }

    // 可用日期篩選：查找在指定日期範圍內有可用時段的服務
    if (dateFrom && dateTo) {
      where.availability = {
        some: { // 至少有一個可用時段
          date: {
            gte: new Date(dateFrom), // 大於等於開始日期
            lte: new Date(dateTo) // 小於等於結束日期
          },
          isAvailable: true // 且為可用狀態
        }
      };
    }

    // 構建排序條件：支援多種排序方式
    let orderBy: any = {};
    switch (sortBy) {
      case 'price_low':
        orderBy = { price: 'asc' }; // 價格由低到高
        break;
      case 'price_high':
        orderBy = { price: 'desc' }; // 價格由高到低
        break;
      case 'rating':
        // 評分排序需要在獲取數據後再處理，這裡先使用預設排序
        orderBy = { createdAt: 'desc' };
        break;
      case 'duration':
        orderBy = { durationHours: sortOrder }; // 按時長排序
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' }; // 最新在前
        break;
      case 'relevance': // 相關性排序（預設）
      default:
        orderBy = { createdAt: 'desc' }; // 預設按建立時間排序
        break;
    }

    // 並行執行查詢：獲取服務列表和總數
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: {
          guide: { // 包含導遊資訊
            select: {
              id: true,
              name: true,
              avatar: true,
              userProfile: { // 導遊檔案資訊
                select: {
                  languages: true, // 語言能力
                  experienceYears: true // 經驗年數
                }
              }
            }
          },
          category: { // 服務分類資訊
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          reviews: { // 評論資訊（只需評分用於計算）
            select: {
              rating: true
            }
          },
          _count: { // 計數資訊
            select: {
              reviews: true, // 評論總數
              bookings: true // 預訂總數
            }
          }
        },
        orderBy, // 排序條件
        skip, // 跳過記錄數（分頁）
        take: limit // 取得記錄數（分頁）
      }),
      prisma.service.count({ where }) // 符合條件的總記錄數
    ]);

    // 處理服務數據：計算評分統計和人氣指數
    const servicesWithStats = services.map(service => {
      const ratings = service.reviews.map(r => r.rating); // 提取所有評分
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length // 計算平均評分
        : 0; // 沒有評論時為 0 分
      
      const { reviews, _count, ...serviceData } = service; // 移除原始評論數據
      
      return {
        ...serviceData,
        averageRating: Number(averageRating.toFixed(1)), // 平均評分（保留一位小數）
        totalReviews: _count.reviews, // 評論總數
        totalBookings: _count.bookings, // 預訂總數
        popularity: _count.bookings > 0 ? Math.min(_count.bookings / 10, 5) : 0 // 人氣指數（0-5）
      };
    });

    // 評分排序特殊處理：因為評分需要計算，所以在獲取數據後重新排序
    if (sortBy === 'rating') {
      servicesWithStats.sort((a, b) => 
        sortOrder === 'desc' 
          ? b.averageRating - a.averageRating // 高分在前
          : a.averageRating - b.averageRating // 低分在前
      );
    }

    // 並行查詢篩選器統計資料：用於前端顯示篩選器選項
    const filterStats = await Promise.all([
      // 價格範圍統計：獲取最低價和最高價
      prisma.service.aggregate({
        where: { status: 'ACTIVE' },
        _min: { price: true },
        _max: { price: true }
      }),
      // 分類統計：每個分類的服務數量
      prisma.service.groupBy({
        by: ['categoryId'],
        where: { status: 'ACTIVE' },
        _count: { categoryId: true }
      }),
      // 地點統計：每個地點的服務數量
      prisma.service.groupBy({
        by: ['location'],
        where: { status: 'ACTIVE' },
        _count: { location: true }
      })
    ]);

    // 組裝完整的搜尋結果回應
    return successResponse({
      services: servicesWithStats, // 處理後的服務列表
      pagination: { // 分頁資訊
        page,
        limit,
        total,
        pages: Math.ceil(total / limit), // 總頁數
        hasNext: page < Math.ceil(total / limit), // 是否有下一頁
        hasPrev: page > 1 // 是否有上一頁
      },
      filters: { // 篩選器統計資料
        priceRange: { // 價格範圍
          min: filterStats[0]._min.price || 0,
          max: filterStats[0]._max.price || 10000
        },
        categories: filterStats[1], // 分類統計
        locations: filterStats[2] // 地點統計
      },
      searchParams: { // 回傳搜尋參數，用於前端保持搜尋狀態
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
    // 錯誤處理：記錄搜尋錯誤並返回通用錯誤訊息
    console.error('Search services error:', error);
    return errorResponse('搜尋服務失敗', 500);
  }
}