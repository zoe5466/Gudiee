// 健康檢查 API 路由
// 功能：提供應用程式健康狀態檢查，用於部署平台監控
import { NextResponse } from 'next/server';

/**
 * GET /api/health - 應用程式健康檢查
 * 
 * 功能：
 * - 檢查應用程式基本運行狀態
 * - 提供給部署平台 (Vercel, Railway, Render 等) 進行健康監控
 * - 返回應用程式版本和狀態資訊
 * 
 * 用途：
 * - Load balancer 健康檢查
 * - 部署後驗證服務可用性
 * - 監控系統狀態檢查
 */
export async function GET() {
  try {
    // 檢查基本應用程式狀態
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      message: 'Guidee 地陪媒合平台運行正常'
    };

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    // 健康檢查失敗時返回錯誤狀態
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        message: '應用程式健康檢查失敗'
      },
      { 
        status: 503 // Service Unavailable
      }
    );
  }
}