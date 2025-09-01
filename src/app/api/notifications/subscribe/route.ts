import { NextRequest, NextResponse } from 'next/server';

interface SubscriptionData {
  subscription: PushSubscription;
  userId: string;
}

// In a real application, this would be stored in a database
const subscriptions = new Map<string, PushSubscription>();

export async function POST(request: NextRequest) {
  try {
    const body: SubscriptionData = await request.json();
    
    if (!body.subscription || !body.userId) {
      return NextResponse.json(
        { error: '缺少必要的訂閱資訊' },
        { status: 400 }
      );
    }

    // Store subscription in database (mock implementation)
    subscriptions.set(body.userId, body.subscription);
    
    console.log(`💬 User ${body.userId} subscribed to push notifications`);
    
    return NextResponse.json({ 
      success: true,
      message: '推送通知訂閱成功' 
    });
    
  } catch (error) {
    console.error('訂閱推送通知失敗:', error);
    return NextResponse.json(
      { error: '訂閱失敗，請稍後再試' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json(
      { error: '缺少用戶 ID' },
      { status: 400 }
    );
  }
  
  const subscription = subscriptions.get(userId);
  
  return NextResponse.json({
    isSubscribed: !!subscription,
    subscription: subscription || null
  });
}