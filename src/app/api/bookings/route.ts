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
          payment: true
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
      startTime,
      endTime,
      guests,
      durationHours,
      specialRequests,
      contactInfo
    } = body;

    // 驗證必填字段
    const errors: Record<string, string> = {};
    
    if (!serviceId) errors.serviceId = '服務 ID 為必填項目';
    if (!bookingDate) errors.bookingDate = '預訂日期為必填項目';
    if (!startTime) errors.startTime = '開始時間為必填項目';
    if (!guests || guests <= 0) errors.guests = '請提供有效的參與人數';

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    // 檢查服務是否存在且可用
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return errorResponse('服務不存在', 404);
    }

    if (service.status !== 'ACTIVE') {
      return errorResponse('服務暫時不可用', 400);
    }

    if (guests > service.maxGuests) {
      return errorResponse(`參與人數不能超過 ${service.maxGuests} 人`, 400);
    }

    // 檢查同一天是否已有預訂衝突
    const bookingDateTime = new Date(bookingDate);
    const startTimeDate = new Date(`${bookingDate}T${startTime}`);
    const endTimeDate = endTime ? new Date(`${bookingDate}T${endTime}`) : new Date(startTimeDate.getTime() + (durationHours || service.durationHours) * 60 * 60 * 1000);

    const conflictingBookings = await prisma.booking.findMany({
      where: {
        serviceId,
        status: {
          in: ['CONFIRMED', 'PENDING']
        },
        bookingDate: bookingDateTime
      }
    });

    if (conflictingBookings.length > 0) {
      return errorResponse('選擇的日期已被預訂', 400);
    }

    // 計算總價
    const basePrice = service.price * guests;
    const serviceFee = basePrice * 0.1; // 10% 服務費
    const totalAmount = basePrice + serviceFee;

    // 創建預訂
    const booking = await prisma.booking.create({
      data: {
        serviceId,
        guideId: service.guideId,
        travelerId: user.id,
        bookingDate: bookingDateTime,
        startTime: startTimeDate,
        endTime: endTimeDate,
        guests,
        durationHours: durationHours || service.durationHours,
        basePrice,
        serviceFee,
        totalAmount,
        specialRequests: specialRequests || '',
        contactInfo: contactInfo || {},
        status: 'PENDING'
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

    return successResponse(booking, '預訂創建成功');

  } catch (error) {
    console.error('Create booking error:', error);
    return errorResponse('創建預訂失敗', 500);
  }
}