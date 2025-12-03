import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  validationErrorResponse
} from '@/lib/api-response';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: { id: string };
}

// POST /api/bookings/[id]/cancel - 取消預訂
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { reason } = body;

    // 查找預訂
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        service: {
          include: {
            guide: true
          }
        },
        traveler: true
        // customer and payment relations don't exist
      }
    });

    if (!booking) {
      return notFoundResponse('預訂');
    }

    // 驗證權限（只有預訂者或導遊可以取消）
    if (booking.travelerId !== user.id && booking.service.guideId !== user.id && user.role !== 'GUIDE') {
      return errorResponse('無權限操作此預訂', 403);
    }

    // 檢查預訂狀態
    if (booking.status === 'CANCELLED') {
      return errorResponse('預訂已經取消', 400);
    }

    if (booking.status === 'COMPLETED') {
      return errorResponse('已完成的預訂無法取消', 400);
    }

    // 檢查取消政策（服務開始前24小時內不允許取消）
    const now = new Date();
    const startDate = new Date(booking.bookingDate);
    const hoursUntilStart = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilStart < 24 && user.role !== 'GUIDE') {
      return errorResponse('服務開始前24小時內無法取消預訂', 400);
    }

    // 計算退款金額
    let refundAmount = 0;
    // Payment relation doesn't exist, use totalAmount directly
    if (hoursUntilStart >= 48) {
      refundAmount = Number(booking.totalAmount); // 全額退款
    } else if (hoursUntilStart >= 24) {
      refundAmount = Number(booking.totalAmount) * 0.5; // 50% 退款
    }

    // 更新預訂狀態
    const cancelledBooking = await prisma.$transaction(async (tx) => {
      // 更新預訂
      const updatedBooking = await tx.booking.update({
        where: { id: params.id },
        data: {
          status: 'CANCELLED',
          // cancelledAt field doesn't exist in Booking schema
          // cancellationReason field doesn't exist in Booking schema
          updatedAt: new Date()
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
          // payment relation doesn't exist
        }
      });

      // 處理退款 - Payment relation doesn't exist, skip refund processing
      // if (refundAmount > 0) {
      //   Handle refund through payment service
      // }

      return updatedBooking;
    });

    return successResponse({
      booking: cancelledBooking,
      refundAmount
    }, '預訂已取消');

  } catch (error) {
    console.error('Cancel booking error:', error);
    return errorResponse('取消預訂失敗', 500);
  }
}