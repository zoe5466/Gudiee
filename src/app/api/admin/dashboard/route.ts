import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    // 驗證用戶是否為管理員
    const user = await getCurrentUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'admin')) {
      return errorResponse('無權限訪問', 403)
    }

    // 獲取統計數據
    const [
      totalUsers,
      totalServices,
      totalBookings,
      pendingServices,
      activeBookings,
      completedBookings,
      totalRevenue,
      averageRating,
      lastMonthUsers,
      thisMonthUsers
    ] = await Promise.all([
      // 總用戶數
      prisma.user.count(),
      
      // 總服務數
      prisma.service.count(),
      
      // 總預訂數
      prisma.booking.count(),
      
      // 待審核服務數
      prisma.service.count({
        where: { status: 'DRAFT' }
      }),
      
      // 進行中預訂數
      prisma.booking.count({
        where: { status: 'CONFIRMED' }
      }),
      
      // 已完成預訂數
      prisma.booking.count({
        where: { status: 'COMPLETED' }
      }),
      
      // 總收入（已完成的預訂）
      prisma.booking.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalAmount: true }
      }),
      
      // 平均評分
      prisma.review.aggregate({
        _avg: { rating: true }
      }),
      
      // 上個月新用戶數
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      
      // 本月新用戶數
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ])

    // 計算月度成長率
    const monthlyGrowth = lastMonthUsers > 0 
      ? Math.round(((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100)
      : 0

    const dashboardData = {
      totalUsers,
      totalServices,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingServices,
      activeBookings,
      averageRating: averageRating._avg.rating || 0,
      monthlyGrowth
    }

    return successResponse(dashboardData)

  } catch (error) {
    console.error('Dashboard API error:', error)
    return errorResponse('獲取數據失敗', 500)
  }
}