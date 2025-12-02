import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

export const dynamic = 'force-dynamic';

interface NotificationData {
  type: 'booking_confirmed' | 'new_message' | 'payment_success' | 'review_request' | 'guide_new_booking';
  userId: string;
  email: string;
  data: any;
  sendEmail?: boolean;
  sendPush?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: NotificationData = await request.json();
    
    if (!body.type || !body.userId || !body.email) {
      return NextResponse.json(
        { error: '缺少必要的通知資訊' },
        { status: 400 }
      );
    }

    const results = {
      email: false,
      push: false,
      errors: [] as string[]
    };

    // Send email notification
    if (body.sendEmail !== false) {
      try {
        let emailSent = false;
        
        switch (body.type) {
          case 'booking_confirmed':
            emailSent = await emailService.sendBookingConfirmation(body.email, body.data);
            break;
          case 'new_message':
            emailSent = await emailService.sendNewMessageNotification(body.email, body.data);
            break;
          case 'payment_success':
            emailSent = await emailService.sendPaymentSuccessNotification(body.email, body.data);
            break;
          case 'review_request':
            emailSent = await emailService.sendReviewRequest(body.email, body.data);
            break;
          default:
            results.errors.push(`不支援的郵件通知類型: ${body.type}`);
        }
        
        results.email = emailSent;
      } catch (error) {
        console.error('發送郵件通知失敗:', error);
        results.errors.push('郵件發送失敗');
      }
    }

    // Send push notification (would integrate with push service in production)
    if (body.sendPush !== false) {
      try {
        // In production, this would send an actual push notification
        // using Web Push Protocol or Firebase Cloud Messaging
        console.log(`📱 Push notification sent to user ${body.userId}:`, body.type);
        results.push = true;
      } catch (error) {
        console.error('發送推送通知失敗:', error);
        results.errors.push('推送通知發送失敗');
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: '通知發送完成'
    });
    
  } catch (error) {
    console.error('發送通知失敗:', error);
    return NextResponse.json(
      { error: '通知發送失敗，請稍後再試' },
      { status: 500 }
    );
  }
}

// Test endpoint for sending sample notifications
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const email = url.searchParams.get('email');
  
  if (!type || !email) {
    return NextResponse.json(
      { error: '缺少測試參數 (type, email)' },
      { status: 400 }
    );
  }

  // Sample test data
  const testData = {
    booking_confirmed: {
      userName: '測試用戶',
      guideName: '張小明導遊',
      serviceName: '台北一日遊',
      bookingDate: '2024-08-20',
      bookingTime: '09:00',
      totalPrice: 2500,
      bookingId: 'TEST-001'
    },
    new_message: {
      recipientName: '測試用戶',
      senderName: '張小明導遊',
      messagePreview: '您好！明天的行程我已經安排好了...'
    },
    payment_success: {
      userName: '測試用戶',
      amount: 2500,
      serviceName: '台北一日遊',
      transactionId: 'TXN-TEST-001'
    },
    review_request: {
      userName: '測試用戶',
      guideName: '張小明導遊',
      serviceName: '台北一日遊',
      bookingId: 'TEST-001'
    }
  };

  const data = testData[type as keyof typeof testData];
  if (!data) {
    return NextResponse.json(
      { error: '不支援的測試類型' },
      { status: 400 }
    );
  }

  return POST(new NextRequest(request.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type,
      userId: 'test-user',
      email,
      data,
      sendEmail: true,
      sendPush: false
    })
  }));
}