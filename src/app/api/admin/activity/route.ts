import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 驗證用戶是否為管理員
    const user = await getCurrentUser();
    // For now, allow GUIDE users to access admin endpoints until proper admin roles are set up
    if (!user || (user.role !== 'GUIDE')) {
      return errorResponse('無權限訪問', 403);
    }

    // 獲取最近的活動數據
    const [recentUsers, recentServices, recentBookings] = await Promise.all([
      // 最近註冊的用戶
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          role: true
        }
      }),
      
      // 最近的服務
      prisma.service.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          guide: {
            select: {
              name: true
            }
          }
        }
      }),
      
      // 最近的預訂
      prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          service: {
            select: {
              title: true
            }
          },
          traveler: {
            select: {
              name: true
            }
          }
        }
      })
    ]);

    // 格式化活動數據
    const activities = [
      ...recentUsers.map(user => ({
        id: `user-${user.id}`,
        type: 'user_registered',
        title: '新用戶註冊',
        description: `${user.name} 剛剛完成註冊`,
        time: user.createdAt,
        icon: 'user',
        color: 'blue'
      })),
      ...recentServices.map(service => ({
        id: `service-${service.id}`,
        type: 'service_created',
        title: '新服務提交',
        description: `${service.title} 由 ${service.guide?.name || '未知用戶'} 提交`,
        time: service.createdAt,
        icon: 'service',
        color: 'green'
      })),
      ...recentBookings.map(booking => ({
        id: `booking-${booking.id}`,
        type: 'booking_created',
        title: '新預訂確認',
        description: `${booking.service?.title || '未知服務'} 被 ${booking.traveler?.name || '未知用戶'} 預訂`,
        time: booking.createdAt,
        icon: 'booking',
        color: 'purple'
      }))
    ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10);

    return successResponse(activities);

  } catch (error) {
    console.error('Activity API error:', error);
    return errorResponse('獲取活動數據失敗', 500);
  }
}