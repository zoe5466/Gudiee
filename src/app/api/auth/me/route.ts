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
    return errorResponse('獲取用戶信息失敗', 500);
  }
}