import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  validationErrorResponse 
} from '@/lib/api-response';

// GET /api/bookings - 獲取預訂列表
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role'); // 'customer' 或 'guide'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    // 構建查詢條件
    const where: any = {};
    
    if (status) {
      where.status = status;
    }

    // 根據用戶角色和查詢參數決定查詢範圍
    if (user.role === 'CUSTOMER' || role === 'customer') {
      where.travelerId = user.id;
    } else if (user.role === 'GUIDE' || role === 'guide') {
      where.guideId = user.id;
    } else if (user.role === 'ADMIN') {
      // 管理員可以查看所有預訂
    } else {
      where.travelerId = user.id; // 預設查看自己的預訂
    }

    // 獲取預訂列表
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          service: {
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
          traveler: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          payments: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.booking.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse(bookings, '預訂列表獲取成功', {
      page,
      limit,
      total,
      totalPages
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    return errorResponse('獲取預訂列表失敗', 500);
  }
}

// POST /api/bookings - 創建新預訂
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const {
      serviceId,
      bookingDate,
      totalPrice,
      guests,
      specialRequests,
      contactInfo
    } = body;

    // 驗證輸入
    const errors: Record<string, string> = {};
    
    if (!serviceId) errors.serviceId = '服務 ID 為必填項目';
    if (!bookingDate) errors.bookingDate = '預訂日期為必填項目';
    if (!totalPrice || totalPrice <= 0) errors.totalPrice = '總金額必須大於 0';
    if (!guests || guests <= 0) errors.guests = '參與人數必須大於 0';

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    // 檢查服務是否存在
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        guide: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!service) {
      return errorResponse('服務不存在', 404);
    }

    if (service.status !== 'ACTIVE') {
      return errorResponse('服務目前不可預訂', 400);
    }

    // 檢查人數限制
    if (guests > service.maxGuests) {
      return errorResponse(`參與人數不能超過 ${service.maxGuests} 人`, 400);
    }

    if (guests < service.minGuests) {
      return errorResponse(`參與人數不能少於 ${service.minGuests} 人`, 400);
    }

    // 檢查日期是否已被預訂 (同一時間只能有一個預訂)
    const existingBooking = await prisma.booking.findFirst({
      where: {
        serviceId,
        bookingDate: new Date(bookingDate),
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    });

    if (existingBooking) {
      return errorResponse('該日期時段已被預訂', 409);
    }

    // 創建預訂
    const newBooking = await prisma.booking.create({
      data: {
        serviceId,
        travelerId: user.id,
        guideId: service.guideId,
        bookingDate: new Date(bookingDate),
        startTime: new Date(`${bookingDate}T09:00:00`), // 預設上午9點開始
        durationHours: service.durationHours,
        guests: parseInt(guests.toString()),
        basePrice: parseFloat(totalPrice.toString()),
        serviceFee: parseFloat((totalPrice * 0.1).toString()), // 10% 服務費
        totalAmount: parseFloat((totalPrice * 1.1).toString()),
        currency: service.currency || 'TWD',
        specialRequests: specialRequests || null,
        contactInfo: contactInfo || {},
        status: 'PENDING',
        paymentStatus: 'PENDING'
      },
      include: {
        service: {
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
        traveler: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    // TODO: 發送通知給導遊
    // await sendBookingNotification(newBooking);

    return successResponse(newBooking, '預訂創建成功');

  } catch (error) {
    console.error('Create booking error:', error);
    return errorResponse('創建預訂失敗', 500);
  }
}