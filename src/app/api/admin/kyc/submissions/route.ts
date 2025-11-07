import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

// 獲取當前管理員用戶函數
function getCurrentAdmin() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) return null;
    
    const userData = JSON.parse(atob(token));
    if (userData.exp && userData.exp < Date.now()) return null;
    
    // 確保是管理員
    if (userData.role !== 'ADMIN' && userData.role !== 'admin') return null;
    
    return userData;
  } catch (error) {
    console.error('Parse admin token error:', error);
    return null;
  }
}

// GET - 獲取所有 KYC 提交申請
export async function GET(request: NextRequest) {
  try {
    console.log('Get KYC submissions API called');
    
    const admin = getCurrentAdmin();
    if (!admin) {
      return Response.json({
        success: false,
        error: '需要管理員權限'
      }, { status: 401 });
    }

    // 從資料庫獲取所有 KYC 提交申請，包含用戶資訊
    const submissions = await prisma.kycSubmission.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Found ${submissions.length} KYC submissions`);

    return Response.json({
      success: true,
      data: submissions,
      message: '成功獲取 KYC 申請清單'
    });

  } catch (error) {
    console.error('Get KYC submissions error:', error);
    return Response.json({
      success: false,
      error: '獲取申請清單失敗，請稍後再試'
    }, { status: 500 });
  }
}