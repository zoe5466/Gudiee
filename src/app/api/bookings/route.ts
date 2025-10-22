// 預訂管理 API 路由
// 功能：處理預訂的創建、查詢、更新等操作，支援多角色權限控制
import { NextRequest } from 'next/server';
import { bookingStorage } from '@/lib/mock-bookings';
import { serviceStorage } from '@/lib/mock-services';
// import { getCurrentUser } from '@/lib/auth'; // 用戶認證
// import { 
//   successResponse, 
//   errorResponse, 
//   unauthorizedResponse,
//   validationErrorResponse 
// } from '@/lib/api-response'; // 統一 API 回應格式

/**
 * GET /api/bookings - 獲取預訂列表
 */
export async function GET(request: NextRequest) {
  try {
    // 模擬用戶認證 - 實際項目中應該使用真實的用戶認證
    const mockUserId = 'user-123'; // 模擬當前用戶ID

    // 解析查詢參數
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // 獲取用戶的預訂記錄
    let bookings = bookingStorage.search({
      travelerId: mockUserId, // 暫時只返回當前用戶的預訂
      status: status || undefined,
      sortBy: 'newest'
    });

    // 分頁處理
    const total = bookings.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBookings = bookings.slice(startIndex, endIndex);

    return Response.json({
      success: true,
      data: paginatedBookings,
      message: '預訂列表獲取成功',
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error',
      message: '獲取預訂列表失敗'
    }, { status: 500 });
  }
}

/**
 * POST /api/bookings - 創建新預訂
 */
export async function POST(request: NextRequest) {
  try {
    // 模擬用戶認證
    const mockUserId = 'user-123';

    // 解析請求資料
    const body = await request.json();
    const {
      serviceId,
      bookingDate,
      totalPrice,
      guests,
      specialRequests,
      contactInfo
    } = body;

    // 輸入驗證
    const errors: Record<string, string> = {};
    
    if (!serviceId) errors.serviceId = '服務 ID 為必填項目';
    if (!bookingDate) errors.bookingDate = '預訂日期為必填項目';
    if (!totalPrice || totalPrice <= 0) errors.totalPrice = '總金額必須大於 0';
    if (!guests || guests <= 0) errors.guests = '參與人數必須大於 0';

    if (Object.keys(errors).length > 0) {
      return Response.json({
        success: false,
        errors,
        message: '輸入驗證失敗'
      }, { status: 400 });
    }

    // 查詢服務資訊
    const service = serviceStorage.getById(serviceId);
    if (!service) {
      return Response.json({
        success: false,
        error: '服務不存在',
        message: '找不到指定的服務'
      }, { status: 404 });
    }

    // 服務狀態檢查
    if (service.status !== 'ACTIVE') {
      return Response.json({
        success: false,
        error: '服務不可預訂',
        message: '服務目前不可預訂'
      }, { status: 400 });
    }

    // 人數限制驗證
    if (guests > service.maxGuests) {
      return Response.json({
        success: false,
        error: '人數超限',
        message: `參與人數不能超過 ${service.maxGuests} 人`
      }, { status: 400 });
    }

    if (guests < (service.minGuests || 1)) {
      return Response.json({
        success: false,
        error: '人數不足',
        message: `參與人數不能少於 ${service.minGuests || 1} 人`
      }, { status: 400 });
    }

    // 創建預訂記錄
    const newBooking = bookingStorage.add({
      serviceId,
      travelerId: mockUserId,
      guideId: service.guide.id,
      bookingDate,
      startTime: `${bookingDate}T09:00:00`,
      durationHours: service.duration,
      guests: parseInt(guests.toString()),
      basePrice: parseFloat(totalPrice.toString()),
      serviceFee: parseFloat((totalPrice * 0.1).toString()),
      totalAmount: parseFloat((totalPrice * 1.1).toString()),
      currency: 'TWD',
      specialRequests: specialRequests || '',
      contactInfo: contactInfo || {},
      status: 'PENDING',
      paymentStatus: 'PENDING',
      service: {
        id: service.id,
        title: service.title,
        location: service.location,
        images: service.images,
        guide: {
          id: service.guide.id,
          name: service.guide.name,
          avatar: service.guide.avatar || ''
        }
      },
      traveler: {
        id: mockUserId,
        name: '測試用戶',
        email: 'test@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      }
    });

    return Response.json({
      success: true,
      data: newBooking,
      message: '預訂創建成功'
    });

  } catch (error) {
    console.error('Create booking error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error',
      message: '創建預訂失敗'
    }, { status: 500 });
  }
}