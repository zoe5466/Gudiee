// 預訂管理 API 路由
// 功能：處理預訂的創建、查詢、更新等操作，支援多角色權限控制
import { NextRequest } from 'next/server';
import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse
} from '@/lib/api-response';

/**
 * GET /api/bookings - 獲取預訂列表
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // 解析查詢參數
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as any;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // 構建查詢條件
    const where: any = {};

    if (user.role === 'GUIDE') {
      // 導遊只能看自己收到的預訂
      where.guideId = user.id;
    } else if (user.role === 'CUSTOMER') {
      // 旅客只能看自己的預訂
      where.travelerId = user.id;
    }
    // ADMIN 可以看所有

    if (status) {
      where.status = status;
    }

    // 獲取預訂數據
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          service: {
            select: {
              id: true,
              title: true,
              location: true,
              price: true,
              guide: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          },
          guide: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          traveler: {
            select: {
              id: true,
              name: true,
              avatar: true,
              email: true
            }
          },
          payments: {
            select: {
              id: true,
              amount: true,
              status: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.booking.count({ where })
    ]);

    return successResponse({
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, '預訂列表獲取成功');

  } catch (error) {
    console.error('Get bookings error:', error);
    return errorResponse('獲取預訂列表失敗', 500);
  }
}

/**
 * POST /api/bookings - 創建新預訂
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    if (user.role !== 'CUSTOMER') {
      return errorResponse('只有旅客可以建立預訂', 403);
    }

    // 解析請求資料
    const body = await request.json();
    const {
      serviceId,
      bookingDate,
      numberOfGuests,
      specialRequests
    } = body;

    // 輸入驗證
    const errors: Record<string, string> = {};

    if (!serviceId) errors.serviceId = '服務 ID 為必填項目';
    if (!bookingDate) errors.bookingDate = '預訂日期為必填項目';
    if (!numberOfGuests || numberOfGuests <= 0) errors.numberOfGuests = '參與人數必須大於 0';

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    // 查詢服務資訊
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        guide: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    if (!service) {
      return errorResponse('找不到指定的服務', 404);
    }

    // 服務狀態檢查
    if (service.status !== 'ACTIVE') {
      return errorResponse('服務目前不可預訂', 400);
    }

    // 人數限制驗證
    if (numberOfGuests > service.maxGuests) {
      return errorResponse(
        `參與人數不能超過 ${service.maxGuests} 人`,
        400
      );
    }

    if (numberOfGuests < (service.minGuests || 1)) {
      return errorResponse(
        `參與人數不能少於 ${service.minGuests || 1} 人`,
        400
      );
    }

    // 計算價格
    const pricePerGuest = typeof service.price === 'number'
      ? service.price
      : parseFloat(String(service.price));
    const basePrice = pricePerGuest * numberOfGuests;
    const serviceFee = basePrice * 0.05; // 5% 服務費
    const totalAmount = basePrice + serviceFee;

    // 創建預訂記錄
    const newBooking = await prisma.booking.create({
      data: {
        serviceId,
        guideId: service.guideId,
        travelerId: user.id,
        bookingDate: new Date(bookingDate),
        startTime: new Date(bookingDate + ' 09:00:00'), // 默認上午 9 點開始
        guests: numberOfGuests,
        durationHours: service.durationHours,
        basePrice: new Decimal(basePrice),
        serviceFee: new Decimal(serviceFee),
        totalAmount: new Decimal(totalAmount),
        currency: 'TWD',
        specialRequests: specialRequests || '',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        contactInfo: {
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            location: true,
            price: true,
            guide: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        },
        guide: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        traveler: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true
          }
        }
      }
    });

    // TODO: 建立支付記錄和發送通知

    return successResponse({
      data: newBooking
    }, '預訂創建成功');

  } catch (error) {
    console.error('Create booking error:', error);
    return errorResponse('創建預訂失敗', 500);
  }
}