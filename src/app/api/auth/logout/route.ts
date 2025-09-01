import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { successResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    // 清除認證 cookie
    const cookieStore = cookies();
    cookieStore.delete('auth-token');

    return successResponse(null, '登出成功');
  } catch (error) {
    console.error('Logout error:', error);
    return successResponse(null, '登出成功'); // 即使出錯也返回成功，確保前端狀態正確
  }
}