import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return errorResponse('未認證', 401);
    }

    // 返回用戶資訊（不包含密碼）
    const { passwordHash, ...userWithoutPassword } = user;
    
    return successResponse({
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Get current user error:', error);
    return errorResponse('獲取用戶資訊失敗', 500);
  }
}

// 登出
export async function POST(request: NextRequest) {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = cookies();
    
    // 清除 auth token cookie
    cookieStore.delete('auth-token');

    return successResponse(null, '登出成功');

  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse('登出失敗', 500);
  }
}