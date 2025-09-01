import { NextRequest, NextResponse } from 'next/server';

interface UnsubscribeData {
  userId: string;
}

// In a real application, this would be stored in a database
const subscriptions = new Map<string, PushSubscription>();

export async function POST(request: NextRequest) {
  try {
    const body: UnsubscribeData = await request.json();
    
    if (!body.userId) {
      return NextResponse.json(
        { error: '缺少用戶 ID' },
        { status: 400 }
      );
    }

    // Remove subscription from database (mock implementation)
    const wasSubscribed = subscriptions.has(body.userId);
    subscriptions.delete(body.userId);
    
    console.log(`🔕 User ${body.userId} unsubscribed from push notifications`);
    
    return NextResponse.json({ 
      success: true,
      message: wasSubscribed ? '已取消推送通知訂閱' : '用戶未訂閱推送通知'
    });
    
  } catch (error) {
    console.error('取消訂閱推送通知失敗:', error);
    return NextResponse.json(
      { error: '取消訂閱失敗，請稍後再試' },
      { status: 500 }
    );
  }
}