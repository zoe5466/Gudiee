// 預訂管理 API 路由
// 功能：處理預訂的創建、查詢、更新等操作，支援多角色權限控制
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma'; // 資料庫連接
import { getCurrentUser } from '@/lib/auth'; // 用戶認證
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  validationErrorResponse 
} from '@/lib/api-response'; // 統一 API 回應格式

/**
 * GET /api/bookings - 獲取預訂列表
 * 
 * 查詢參數：
 * - status: 預訂狀態篩選
 * - role: 角色視角 (customer/guide)
 * - page: 頁碼
 * - limit: 每頁數量
 * 
 * 權限控制：
 * - CUSTOMER: 只能查看自己的預訂
 * - GUIDE: 只能查看作為導遊的預訂
 * - ADMIN: 可查看所有預訂
 */
export async function GET(request: NextRequest) {
  try {
    // 驗證用戶身份
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // 解析查詢參數
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 預訂狀態篩選
    const role = searchParams.get('role'); // 角色視角: 'customer' 或 'guide'
    const page = parseInt(searchParams.get('page') || '1'); // 頁碼，預設第1頁
    const limit = parseInt(searchParams.get('limit') || '10'); // 每頁數量，預設10筆

    const skip = (page - 1) * limit; // 計算跳過的記錄數

    // 構建資料庫查詢條件
    const where: any = {};
    
    // 狀態篩選
    if (status) {
      where.status = status;
    }

    // 根據用戶角色和查詢參數決定查詢範圍
    if (user.role === 'CUSTOMER' || role === 'customer') {
      where.travelerId = user.id; // 客戶只能查看自己的預訂
    } else if (user.role === 'GUIDE' || role === 'guide') {
      where.guideId = user.id; // 導遊只能查看自己接受的預訂
    } else if (user.role === 'ADMIN') {
      // 管理員可以查看所有預訂（不添加額外限制）
    } else {
      where.travelerId = user.id; // 預設查看自己作為客戶的預訂
    }

    // 並行查詢：獲取預訂列表和總數
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          service: { // 包含服務資訊
            include: {
              guide: { // 包含導遊基本資訊
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true
                }
              }
            }
          },
          traveler: { // 包含旅行者基本資訊
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          payments: true // 包含付款記錄
        },
        orderBy: {
          createdAt: 'desc' // 按建立時間倒序排列
        },
        skip, // 分頁：跳過的記錄數
        take: limit // 分頁：取得的記錄數
      }),
      prisma.booking.count({ where }) // 計算符合條件的總記錄數
    ]);

    // 計算總頁數
    const totalPages = Math.ceil(total / limit);

    // 返回成功回應，包含分頁資訊
    return successResponse(bookings, '預訂列表獲取成功', {
      page,
      limit,
      total,
      totalPages
    });

  } catch (error) {
    // 錯誤處理：記錄錯誤並返回通用錯誤訊息
    console.error('Get bookings error:', error);
    return errorResponse('獲取預訂列表失敗', 500);
  }
}

/**
 * POST /api/bookings - 創建新預訂
 * 
 * 請求格式：
 * {
 *   "serviceId": "服務ID",
 *   "bookingDate": "預訂日期",
 *   "totalPrice": 總金額,
 *   "guests": 參與人數,
 *   "specialRequests": "特殊需求",
 *   "contactInfo": { 聯絡資訊 }
 * }
 * 
 * 功能：
 * 1. 驗證服務可用性
 * 2. 檢查日期衝突
 * 3. 驗證人數限制
 * 4. 計算費用（含服務費）
 * 5. 創建預訂記錄
 */
export async function POST(request: NextRequest) {
  try {
    // 驗證用戶身份
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

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

    // 輸入驗證：檢查必填欄位和格式
    const errors: Record<string, string> = {};
    
    if (!serviceId) errors.serviceId = '服務 ID 為必填項目';
    if (!bookingDate) errors.bookingDate = '預訂日期為必填項目';
    if (!totalPrice || totalPrice <= 0) errors.totalPrice = '總金額必須大於 0';
    if (!guests || guests <= 0) errors.guests = '參與人數必須大於 0';

    // 如果有驗證錯誤，立即返回
    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    // 查詢服務資訊並驗證可用性
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        guide: { // 包含導遊資訊，用於後續通知
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // 服務存在性檢查
    if (!service) {
      return errorResponse('服務不存在', 404);
    }

    // 服務狀態檢查
    if (service.status !== 'ACTIVE') {
      return errorResponse('服務目前不可預訂', 400);
    }

    // 人數限制驗證
    if (guests > service.maxGuests) {
      return errorResponse(`參與人數不能超過 ${service.maxGuests} 人`, 400);
    }

    if (guests < service.minGuests) {
      return errorResponse(`參與人數不能少於 ${service.minGuests} 人`, 400);
    }

    // 日期衝突檢查：確保同一時間只有一個有效預訂
    const existingBooking = await prisma.booking.findFirst({
      where: {
        serviceId,
        bookingDate: new Date(bookingDate),
        status: {
          in: ['PENDING', 'CONFIRMED'] // 只檢查進行中的預訂
        }
      }
    });

    if (existingBooking) {
      return errorResponse('該日期時段已被預訂', 409);
    }

    // 創建預訂記錄
    const newBooking = await prisma.booking.create({
      data: {
        serviceId,
        travelerId: user.id, // 預訂者ID
        guideId: service.guideId, // 導遊ID
        bookingDate: new Date(bookingDate),
        startTime: new Date(`${bookingDate}T09:00:00`), // 預設上午9點開始
        durationHours: service.durationHours, // 服務時長
        guests: parseInt(guests.toString()), // 參與人數
        basePrice: parseFloat(totalPrice.toString()), // 基礎價格
        serviceFee: parseFloat((totalPrice * 0.1).toString()), // 10% 平台服務費
        totalAmount: parseFloat((totalPrice * 1.1).toString()), // 總金額（含服務費）
        currency: service.currency || 'TWD', // 貨幣，預設台幣
        specialRequests: specialRequests || null, // 特殊需求
        contactInfo: contactInfo || {}, // 聯絡資訊
        status: 'PENDING', // 預訂狀態：待確認
        paymentStatus: 'PENDING' // 付款狀態：待付款
      },
      include: {
        service: { // 包含完整服務資訊
          include: {
            guide: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        traveler: { // 包含預訂者資訊
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    // TODO: 發送通知給導遊和客戶
    // await sendBookingNotification(newBooking);

    return successResponse(newBooking, '預訂創建成功');

  } catch (error) {
    // 錯誤處理：記錄錯誤並返回通用錯誤訊息
    console.error('Create booking error:', error);
    return errorResponse('創建預訂失敗', 500);
  }
}