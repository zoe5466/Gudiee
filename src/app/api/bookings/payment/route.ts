import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  validationErrorResponse 
} from '@/lib/api-response';

// POST /api/bookings/payment - 處理支付
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { bookingId, paymentMethod, cardDetails } = body;

    // 驗證必填字段
    const errors: Record<string, string> = {};
    if (!bookingId) errors.bookingId = '預訂 ID 為必填項目';
    if (!paymentMethod) errors.paymentMethod = '支付方式為必填項目';

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    // 查找預訂
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: {
          include: {
            guide: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        traveler: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!booking) {
      return errorResponse('找不到預訂', 404);
    }

    // 驗證預訂所有者
    if (booking.travelerId !== user.id) {
      return errorResponse('無權限訪問此預訂', 403);
    }

    // 檢查預訂狀態
    if (booking.paymentStatus !== 'PENDING') {
      return errorResponse('此預訂已處理過付款', 400);
    }

    // 模擬支付處理（在實際應用中會使用 Stripe, PayPal 等支付服務）
    // 這裡簡化為直接成功
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 創建支付記錄
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        userId: user.id,
        amount: booking.totalAmount,
        currency: booking.currency,
        status: 'COMPLETED',
        paymentMethod: paymentMethod,
        paymentProvider: 'MOCK', // Required field
        metadata: {
          paymentMethod,
          transactionId,
          processedAt: new Date().toISOString()
        },
        processedAt: new Date()
      }
    });

    // 更新預訂狀態
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: 'COMPLETED',
        status: 'CONFIRMED',
        paymentIntentId: transactionId
      },
      include: {
        service: {
          include: {
            guide: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        traveler: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        payments: true
      }
    });

    return successResponse({
      status: 'succeeded',
      transactionId,
      booking: updatedBooking,
      payment
    }, '支付成功！預訂已確認');

  } catch (error) {
    console.error('Process payment error:', error);
    return errorResponse('支付處理失敗', 500);
  }
}