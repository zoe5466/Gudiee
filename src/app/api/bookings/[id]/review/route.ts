import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// 模擬預訂數據庫 - 這裡應該和其他 API 文件共用同一個數據源
let bookings: any[] = [
  {
    id: '1',
    serviceId: '1',
    guideId: 'guide-1',
    travelerId: '1',
    status: 'CONFIRMED',
    details: {
      serviceId: '1',
      guideId: 'guide-1',
      date: new Date('2024-02-01'),
      time: '10:00',
      guests: 2,
      duration: 4,
      specialRequests: '希望能介紹更多歷史背景',
      contactInfo: {
        name: '測試用戶',
        email: 'user@guidee.com',
        phone: '0912345678'
      }
    },
    pricing: {
      basePrice: 3200,
      serviceFee: 320,
      total: 3520,
      currency: 'TWD'
    },
    payment: {
      method: 'credit_card',
      status: 'completed',
      transactionId: 'tx_123456789'
    },
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z'
  }
];

function getAuthenticatedUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback-secret'
    ) as any;

    return decoded;
  } catch {
    return null;
  }
}

// POST /api/bookings/[id]/review - 提交評價
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: '未授權訪問' },
        { status: 401 }
      );
    }

    const bookingId = params.id;
    const body = await request.json();
    const { rating, comment } = body;
    
    // 驗證輸入
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: '評分必須在 1-5 之間' },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length === 0) {
      return NextResponse.json(
        { error: '請提供評價內容' },
        { status: 400 }
      );
    }
    
    // 查找預訂
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      return NextResponse.json(
        { error: '找不到預訂' },
        { status: 404 }
      );
    }

    // 驗證權限（只有預訂者可以評價）
    if (booking.travelerId !== user.userId) {
      return NextResponse.json(
        { error: '只有預訂者可以提交評價' },
        { status: 403 }
      );
    }

    // 檢查預訂狀態
    if (booking.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: '只能評價已完成的預訂' },
        { status: 400 }
      );
    }

    // 檢查是否已經評價過
    if (booking.review) {
      return NextResponse.json(
        { error: '您已經對此預訂進行過評價' },
        { status: 400 }
      );
    }

    // 添加評價
    booking.review = {
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };
    booking.updatedAt = new Date().toISOString();

    return NextResponse.json({
      message: '評價提交成功',
      review: booking.review
    });

  } catch (error) {
    console.error('Submit review error:', error);
    return NextResponse.json(
      { error: '服務器錯誤' },
      { status: 500 }
    );
  }
}