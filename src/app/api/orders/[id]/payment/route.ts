// 訂單支付處理 API
// 功能：處理訂單支付確認和狀態更新
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { OrderResponse } from '@/types/order';
import { orderStorage } from '@/lib/mock-orders';
import { notificationService } from '@/lib/notification-service';

// 獲取當前用戶函數
function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) return null;
    
    const userData = JSON.parse(atob(token));
    if (userData.exp && userData.exp < Date.now()) return null;
    
    return userData;
  } catch (error) {
    console.error('Parse token error:', error);
    return null;
  }
}

// 使用共享的訂單數據存儲

// POST - 確認支付
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Payment confirmation API called:', params.id);
    
    const user = getCurrentUser();
    if (!user) {
      return Response.json({
        success: false,
        error: '未認證'
      }, { status: 401 });
    }

    const body = await request.json();
    const { paymentMethod, paymentToken } = body;

    const order = orderStorage.getById(params.id);
    
    if (!order) {
      return Response.json({
        success: false,
        error: '訂單不存在'
      }, { status: 404 });
    }

    // 檢查權限
    if (order.userId !== user.id) {
      return Response.json({
        success: false,
        error: '無權限處理此訂單支付'
      }, { status: 403 });
    }

    // 檢查訂單狀態
    if (order.status !== 'DRAFT') {
      return Response.json({
        success: false,
        error: '訂單狀態不允許付款'
      }, { status: 400 });
    }

    // 模擬支付處理
    const paymentSuccess = await processPayment(paymentMethod, paymentToken, order.pricing.total);
    
    if (paymentSuccess.success) {
      // 更新訂單狀態為已付款
      const updatedOrder = {
        ...order,
        status: 'PAID' as const,
        payment: {
          ...order.payment,
          status: 'COMPLETED' as const,
          transactionId: paymentSuccess.transactionId,
          paidAt: new Date().toISOString(),
          paymentDetails: paymentSuccess.paymentDetails
        },
        updatedAt: new Date().toISOString()
      };

      const savedOrder = orderStorage.update(params.id, updatedOrder);
      
      if (!savedOrder) {
        return Response.json({
          success: false,
          error: '更新訂單失敗'
        }, { status: 500 });
      }

      // 發送支付確認通知
      await notificationService.sendPaymentCompletedNotifications(savedOrder);

      return Response.json({
        success: true,
        data: savedOrder,
        message: '支付成功'
      } as OrderResponse);

    } else {
      // 支付失敗
      const updatedOrder = {
        ...order,
        payment: {
          ...order.payment,
          status: 'FAILED' as const
        },
        updatedAt: new Date().toISOString()
      };

      orderStorage.update(params.id, updatedOrder);

      return Response.json({
        success: false,
        error: paymentSuccess.error || '支付失敗'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Payment processing error:', error);
    return Response.json({
      success: false,
      error: '支付處理失敗'
    }, { status: 500 });
  }
}

// 模擬支付處理函數
async function processPayment(paymentMethod: string, paymentToken: string, amount: number) {
  // 模擬支付處理邏輯
  // 在實際應用中，這裡應該整合 Stripe, PayPal 等支付服務
  
  console.log(`Processing payment: ${paymentMethod}, Amount: ${amount}`);
  
  // 模擬異步支付處理
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 90% 成功率的模擬
  const success = Math.random() > 0.1;
  
  if (success) {
    return {
      success: true,
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      paymentDetails: {
        cardLast4: paymentMethod === 'CREDIT_CARD' ? '1234' : undefined,
        cardBrand: paymentMethod === 'CREDIT_CARD' ? 'VISA' : undefined
      }
    };
  } else {
    return {
      success: false,
      error: '支付被拒絕，請檢查您的支付方式'
    };
  }
}

// GET - 查詢支付狀態
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUser();
    if (!user) {
      return Response.json({
        success: false,
        error: '未認證'
      }, { status: 401 });
    }

    const order = orderStorage.getById(params.id);
    
    if (!order) {
      return Response.json({
        success: false,
        error: '訂單不存在'
      }, { status: 404 });
    }

    // 檢查權限
    if (order.userId !== user.id) {
      return Response.json({
        success: false,
        error: '無權限查詢此訂單支付狀態'
      }, { status: 403 });
    }

    return Response.json({
      success: true,
      data: {
        paymentStatus: order.payment.status,
        paymentMethod: order.payment.method,
        paidAt: order.payment.paidAt,
        transactionId: order.payment.transactionId
      }
    });

  } catch (error) {
    console.error('Get payment status error:', error);
    return Response.json({
      success: false,
      error: '查詢支付狀態失敗'
    }, { status: 500 });
  }
}