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

// POST - 審核 KYC 申請
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Review KYC submission API called:', params.id);
    
    const admin = getCurrentAdmin();
    if (!admin) {
      return Response.json({
        success: false,
        error: '需要管理員權限'
      }, { status: 401 });
    }

    const body = await request.json();
    const { action, rejectionReason } = body;

    // 驗證輸入
    if (!action || !['approve', 'reject'].includes(action)) {
      return Response.json({
        success: false,
        error: '無效的審核動作'
      }, { status: 400 });
    }

    if (action === 'reject' && !rejectionReason) {
      return Response.json({
        success: false,
        error: '拒絕申請時必須提供原因'
      }, { status: 400 });
    }

    // 檢查 KYC 申請是否存在
    const submission = await prisma.kycSubmission.findUnique({
      where: { id: params.id },
      include: {
        user: true
      }
    });

    if (!submission) {
      return Response.json({
        success: false,
        error: '找不到該申請'
      }, { status: 404 });
    }

    if (submission.status !== 'pending') {
      return Response.json({
        success: false,
        error: '該申請已經被審核過了'
      }, { status: 400 });
    }

    // 開始資料庫交易
    const result = await prisma.$transaction(async (prisma) => {
      // 更新 KYC 申請狀態
      const updatedSubmission = await prisma.kycSubmission.update({
        where: { id: params.id },
        data: {
          status: action === 'approve' ? 'approved' : 'rejected',
          reviewedBy: admin.id,
          reviewedAt: new Date(),
          ...(action === 'reject' && { rejectionReason })
        }
      });

      // 如果通過審核，更新用戶的驗證狀態
      if (action === 'approve') {
        const updateData: any = {
          isKycVerified: true,
          updatedAt: new Date()
        };

        // 如果有良民證，也更新良民證驗證狀態
        if (submission.criminalRecordUrl) {
          updateData.isCriminalRecordVerified = true;
        }

        await prisma.user.update({
          where: { id: submission.userId },
          data: updateData
        });

        console.log(`KYC approved for user ${submission.userId}, KYC: true, Criminal Record: ${!!submission.criminalRecordUrl}`);
      } else {
        // 如果拒絕，確保驗證狀態為 false
        await prisma.user.update({
          where: { id: submission.userId },
          data: {
            isKycVerified: false,
            isCriminalRecordVerified: false,
            updatedAt: new Date()
          }
        });

        console.log(`KYC rejected for user ${submission.userId}, reason: ${rejectionReason}`);
      }

      return updatedSubmission;
    });

    return Response.json({
      success: true,
      data: result,
      message: action === 'approve' ? '申請已通過審核' : '申請已拒絕'
    });

  } catch (error) {
    console.error('Review KYC submission error:', error);
    return Response.json({
      success: false,
      error: '審核失敗，請稍後再試'
    }, { status: 500 });
  }
}