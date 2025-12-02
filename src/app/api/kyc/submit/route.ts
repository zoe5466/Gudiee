import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

interface KYCSubmissionData {
  idNumber: string;
  birthDate: string;
  address: string;
  emergencyContact: string;
  idFrontImage: string;
  idBackImage: string;
  selfieImage: string;
  criminalRecordCheck?: string; // 良民證（導遊專用）
}

export async function POST(request: NextRequest) {
  try {
    const data: KYCSubmissionData = await request.json();
    
    // 從 cookie 獲取用戶信息
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth-token');
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: '未登入或登入已過期' },
        { status: 401 }
      );
    }

    // 解析 token 獲取用戶 ID
    const tokenData = JSON.parse(atob(authToken.value));
    const userId = tokenData.id;
    
    // 基本驗證
    if (!data.idNumber || !data.birthDate || !data.address || 
        !data.idFrontImage || !data.idBackImage || !data.selfieImage) {
      return NextResponse.json(
        { success: false, error: '必填欄位不完整' },
        { status: 400 }
      );
    }

    // 身分證字號格式驗證
    const idRegex = /^[A-Z][1-2]\d{8}$/;
    if (!idRegex.test(data.idNumber.toUpperCase())) {
      return NextResponse.json(
        { success: false, error: '身分證字號格式錯誤' },
        { status: 400 }
      );
    }

    // 年齡驗證
    const birthYear = new Date(data.birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    if (currentYear - birthYear < 18) {
      return NextResponse.json(
        { success: false, error: '申請者必須年滿18歲' },
        { status: 400 }
      );
    }

    // 儲存KYC資料到資料庫
    const kycSubmission = await prisma.kycSubmission.create({
      data: {
        userId: userId,
        idNumber: data.idNumber,
        birthDate: new Date(data.birthDate),
        address: data.address,
        emergencyContact: data.emergencyContact,
        idFrontImageUrl: data.idFrontImage,
        idBackImageUrl: data.idBackImage,
        selfieImageUrl: data.selfieImage,
        criminalRecordUrl: data.criminalRecordCheck,
        status: 'pending'
      }
    });

    // 更新用戶的 KYC 狀態
    const updateData: any = {
      isKycVerified: false, // 等待審核
      updatedAt: new Date()
    };

    // 如果有良民證，更新良民證驗證狀態
    if (data.criminalRecordCheck) {
      updateData.isCriminalRecordVerified = false; // 等待審核
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    console.log('KYC submission saved to database:', {
      userId,
      submissionId: kycSubmission.id,
      hasCriminalRecordCheck: !!data.criminalRecordCheck,
      submittedAt: kycSubmission.createdAt
    });

    return NextResponse.json({
      success: true,
      message: 'KYC申請已成功提交',
      data: {
        applicationId: kycSubmission.id,
        status: 'pending_review',
        estimatedReviewTime: '24-48小時',
        submittedAt: kycSubmission.createdAt
      }
    });

  } catch (error) {
    console.error('KYC submission error:', error);
    return NextResponse.json(
      { success: false, error: '系統錯誤，請稍後再試' },
      { status: 500 }
    );
  }
}

// 獲取KYC狀態
export async function GET(request: NextRequest) {
  try {
    // TODO: 從JWT token獲取用戶ID
    // const token = request.headers.get('authorization')?.replace('Bearer ', '');
    // const userId = verifyToken(token);

    // TODO: 從資料庫獲取用戶的KYC狀態
    // const kycStatus = await getUserKYCStatus(userId);

    // 模擬回應
    return NextResponse.json({
      success: true,
      data: {
        status: 'pending_review', // pending_review, approved, rejected
        kycVerified: false,
        criminalRecordVerified: false,
        submittedAt: '2024-01-15T10:00:00Z',
        reviewedAt: null,
        rejectionReason: null
      }
    });

  } catch (error) {
    console.error('Get KYC status error:', error);
    return NextResponse.json(
      { success: false, error: '無法獲取驗證狀態' },
      { status: 500 }
    );
  }
}