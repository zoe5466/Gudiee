import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  notFoundResponse 
} from '@/lib/api-response';

interface RouteParams {
  params: { id: string };
}

// POST /api/bookings/[id]/confirm - 確認預訂
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

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
      }
    });

    if (!booking) {
      return notFoundResponse('預訂');
    }

    // 驗證權限（只有導遊可以確認預訂）
    if (booking.service.guideId !== user.id && user.role !== 'ADMIN') {
      return errorResponse('只有導遊可以確認預訂', 403);
    }

    // 檢查預訂狀態
    if (booking.status === 'CONFIRMED') {
      return errorResponse('預訂已經確認', 400);
    }

    if (booking.status !== 'PENDING') {
      return errorResponse('只能確認待處理的預訂', 400);
    }

    // 更新預訂狀態
    const confirmedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date(),
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
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        payment: true
      }
    });

    return successResponse(confirmedBooking, '預訂已確認');

  } catch (error) {
    console.error('Confirm booking error:', error);
    return errorResponse('確認預訂失敗', 500);
  }
}