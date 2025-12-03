// 管理員儀表板數據 API 路由
// 功能：提供管理員儀表板所需的統計數據和關鍵指標
import { NextRequest, NextResponse } from 'next/server'; // Next.js 伺服器端 API 類型
import { getCurrentUser } from '@/lib/auth'; // 用戶認證工具
import { prisma } from '@/lib/prisma'; // 資料庫連接
import { successResponse, errorResponse } from '@/lib/api-response'; // 統一 API 回應格式

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/dashboard - 管理員儀表板數據 API
 * 
 * 功能：
 * - 驗證管理員權限
 * - 統計用戶、服務、預訂數據
 * - 計算收入和評分統計
 * - 分析月度成長趨勢
 * 
 * 權限：僅限 ADMIN 角色訪問
 * 
 * 回應數據：
 * - totalUsers: 總用戶數
 * - totalServices: 總服務數
 * - totalBookings: 總預訂數
 * - totalRevenue: 總收入（已完成預訂）
 * - pendingServices: 待審核服務數
 * - activeBookings: 進行中預訂數
 * - averageRating: 平均評分
 * - monthlyGrowth: 月度用戶成長率
 */
export async function GET(request: NextRequest) {
  try {
    // 驗證用戶身份和管理員權限
    const user = await getCurrentUser(); // 從 JWT token 獲取當前用戶
    if (!user || (user.role !== 'GUIDE')) {
      return errorResponse('無權限訪問', 403); // 403 Forbidden - 僅管理員可訪問
    }

    // 並行查詢所有統計數據，提升性能
    const [
      totalUsers, // 平台總用戶數
      totalServices, // 平台總服務數
      totalBookings, // 平台總預訂數
      pendingServices, // 待審核服務數（草稿狀態）
      activeBookings, // 進行中預訂數（已確認）
      completedBookings, // 已完成預訂數
      totalRevenue, // 平台總收入統計
      averageRating, // 全平台平均評分
      lastMonthUsers, // 上個月新用戶數
      thisMonthUsers // 本月新用戶數
    ] = await Promise.all([
      // 計算平台總用戶數（包括所有角色）
      prisma.user.count(),
      
      // 計算平台總服務數（包括所有狀態）
      prisma.service.count(),
      
      // 計算平台總預訂數（包括所有狀態）
      prisma.booking.count(),
      
      // 計算待審核服務數（DRAFT 狀態需要管理員審核）
      prisma.service.count({
        where: { status: 'DRAFT' }
      }),
      
      // 計算進行中預訂數（CONFIRMED 狀態，已確認但未完成）
      prisma.booking.count({
        where: { status: 'CONFIRMED' }
      }),
      
      // 計算已完成預訂數（COMPLETED 狀態，服務已提供）
      prisma.booking.count({
        where: { status: 'COMPLETED' }
      }),
      
      // 計算平台總收入（僅統計已完成的預訂）
      prisma.booking.aggregate({
        where: { status: 'COMPLETED' }, // 只統計已完成的預訂收入
        _sum: { totalAmount: true } // 加總所有已完成預訂的總金額
      }),
      
      // 計算全平台平均評分（所有服務的評論平均）
      prisma.review.aggregate({
        _avg: { rating: true } // 計算所有評論的平均評分
      }),
      
      // 計算上個月新用戶數（用於成長率比較）
      prisma.user.count({
        where: {
          createdAt: {
            // 上個月1號 00:00:00 開始
            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            // 本月1號 00:00:00 結束（不包含）
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      
      // 計算本月新用戶數（用於成長率計算）
      prisma.user.count({
        where: {
          createdAt: {
            // 本月1號 00:00:00 開始至今
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ]);

    // 計算月度用戶成長率（百分比）
    const monthlyGrowth = lastMonthUsers > 0 
      ? Math.round(((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100) // 計算成長百分比並四捨五入
      : 0; // 如果上個月沒有用戶，成長率為 0

    // 組裝儀表板數據回應
    const dashboardData = {
      totalUsers, // 總用戶數
      totalServices, // 總服務數
      totalBookings, // 總預訂數
      totalRevenue: totalRevenue._sum.totalAmount || 0, // 總收入（防止 null）
      pendingServices, // 待審核服務數（需要管理員關注）
      activeBookings, // 進行中預訂數
      averageRating: Number((averageRating._avg.rating || 0).toFixed(1)), // 平均評分（保留一位小數）
      monthlyGrowth // 月度成長率（百分比）
    };

    return successResponse(dashboardData, '儀表板數據獲取成功');

  } catch (error) {
    // 錯誤處理：記錄詳細錯誤信息
    console.error('管理員儀表板 API 錯誤:', error);
    return errorResponse('獲取儀表板數據失敗', 500); // 500 Internal Server Error
  }
}