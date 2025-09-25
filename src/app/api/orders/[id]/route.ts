// 單一訂單操作 API
// 功能：處理特定訂單的查詢、更新、取消等操作
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { Order, OrderResponse, OrderStatus, PaymentStatus, CancellationReason } from '@/types/order';

// 模擬訂單資料（實際應該從資料庫讀取）
// 這應該與 /api/orders/route.ts 共用同一個資料源
let mockOrders: Order[] = [
  {
    id: 'order-001',
    orderNumber: 'GD240001',
    userId: 'guide-001',
    status: 'CONFIRMED',
    booking: {
      serviceId: 'service-001',
      serviceName: '台北101 & 信義區深度導覽',
      serviceImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      guideId: 'guide-001',
      guideName: '張小美',
      guideAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      date: '2024-02-15',
      startTime: '09:00',
      endTime: '13:00',
      duration: 4,
      participants: 2,
      location: {
        name: '台北101購物中心正門',
        address: '台北市信義區市府路45號',
        coordinates: { lat: 25.0339, lng: 121.5645 }
      },
      specialRequests: '希望能多介紹建築歷史'
    },
    customer: {
      name: '王小明',
      email: 'wang@example.com',
      phone: '0912345678',
      nationality: '台灣',
      emergencyContact: {
        name: '王太太',
        phone: '0987654321',
        relationship: '配偶'
      }
    },
    pricing: {
      basePrice: 800,
      participants: 2,
      subtotal: 1600,
      serviceFee: 160,
      tax: 88,
      total: 1848,
      currency: 'TWD'
    },
    payment: {
      method: 'CREDIT_CARD',
      status: 'COMPLETED',
      transactionId: 'txn_123456789',
      paidAt: '2024-01-20T10:30:00Z',
      paymentDetails: {
        cardLast4: '1234',
        cardBrand: 'VISA'
      }
    },
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    confirmedAt: '2024-01-20T10:30:00Z'
  }
];

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

// 檢查訂單存取權限
function hasOrderAccess(order: Order, user: any): boolean {
  // 管理員可以存取所有訂單
  if (user.role === 'admin') return true;
  
  // 用戶只能存取自己的訂單或作為導遊的訂單
  return order.userId === user.id || order.booking.guideId === user.id;
}

// GET - 查詢特定訂單
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Get single order API called:', params.id);
    
    const user = getCurrentUser();
    if (!user) {
      return Response.json({
        success: false,
        error: '未認證'
      }, { status: 401 });
    }

    const order = mockOrders.find(o => o.id === params.id);
    
    if (!order) {
      return Response.json({
        success: false,
        error: '訂單不存在'
      }, { status: 404 });
    }

    // 檢查存取權限
    if (!hasOrderAccess(order, user)) {
      return Response.json({
        success: false,
        error: '無權限存取此訂單'
      }, { status: 403 });
    }

    const response: OrderResponse = {
      success: true,
      data: order
    };

    return Response.json(response);

  } catch (error) {
    console.error('Get order error:', error);
    return Response.json({
      success: false,
      error: '查詢訂單失敗'
    }, { status: 500 });
  }
}

// PUT - 更新訂單狀態
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Update order API called:', params.id);
    
    const user = getCurrentUser();
    if (!user) {
      return Response.json({
        success: false,
        error: '未認證'
      }, { status: 401 });
    }

    const body = await request.json();
    const { status, paymentStatus, notes } = body;

    const orderIndex = mockOrders.findIndex(o => o.id === params.id);
    
    if (orderIndex === -1) {
      return Response.json({
        success: false,
        error: '訂單不存在'
      }, { status: 404 });
    }

    const order = mockOrders[orderIndex];

    // 檢查存取權限
    if (!hasOrderAccess(order, user)) {
      return Response.json({
        success: false,
        error: '無權限修改此訂單'
      }, { status: 403 });
    }

    // 驗證狀態轉換邏輯
    const allowedTransitions: { [key in OrderStatus]?: OrderStatus[] } = {
      'DRAFT': ['PENDING', 'CANCELLED'],
      'PENDING': ['CONFIRMED', 'CANCELLED'],
      'CONFIRMED': ['PAID', 'CANCELLED'],
      'PAID': ['IN_PROGRESS', 'CANCELLED'],
      'IN_PROGRESS': ['COMPLETED'],
      'COMPLETED': [], // 完成後不能修改
      'CANCELLED': ['REFUNDED'],
      'REFUNDED': [] // 退款後不能修改
    };

    if (status && allowedTransitions[order.status] && 
        !allowedTransitions[order.status]!.includes(status)) {
      return Response.json({
        success: false,
        error: `無法從 ${order.status} 狀態轉換到 ${status}`
      }, { status: 400 });
    }

    // 更新訂單
    const updatedOrder: Order = {
      ...order,
      ...(status && { status }),
      ...(paymentStatus && { 
        payment: { 
          ...order.payment, 
          status: paymentStatus,
          ...(paymentStatus === 'COMPLETED' && !order.payment.paidAt && {
            paidAt: new Date().toISOString()
          })
        }
      }),
      ...(notes && { notes }),
      updatedAt: new Date().toISOString(),
      ...(status === 'CONFIRMED' && !order.confirmedAt && {
        confirmedAt: new Date().toISOString()
      }),
      ...(status === 'COMPLETED' && !order.completedAt && {
        completedAt: new Date().toISOString()
      })
    };

    mockOrders[orderIndex] = updatedOrder;

    console.log('Order updated successfully:', updatedOrder.orderNumber);

    const response: OrderResponse = {
      success: true,
      data: updatedOrder,
      message: '訂單更新成功'
    };

    return Response.json(response);

  } catch (error) {
    console.error('Update order error:', error);
    return Response.json({
      success: false,
      error: '更新訂單失敗'
    }, { status: 500 });
  }
}

// DELETE - 取消訂單
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Cancel order API called:', params.id);
    
    const user = getCurrentUser();
    if (!user) {
      return Response.json({
        success: false,
        error: '未認證'
      }, { status: 401 });
    }

    const body = await request.json();
    const { reason, description }: { 
      reason: CancellationReason; 
      description?: string;
    } = body;

    if (!reason) {
      return Response.json({
        success: false,
        error: '必須提供取消原因'
      }, { status: 400 });
    }

    const orderIndex = mockOrders.findIndex(o => o.id === params.id);
    
    if (orderIndex === -1) {
      return Response.json({
        success: false,
        error: '訂單不存在'
      }, { status: 404 });
    }

    const order = mockOrders[orderIndex];

    // 檢查存取權限
    if (!hasOrderAccess(order, user)) {
      return Response.json({
        success: false,
        error: '無權限取消此訂單'
      }, { status: 403 });
    }

    // 檢查是否可以取消
    const cancellableStatuses: OrderStatus[] = ['DRAFT', 'PENDING', 'CONFIRMED', 'PAID'];
    if (!cancellableStatuses.includes(order.status)) {
      return Response.json({
        success: false,
        error: '此狀態的訂單無法取消'
      }, { status: 400 });
    }

    // 計算退款政策
    const now = new Date();
    const bookingDate = new Date(order.booking.date);
    const hoursUntilBooking = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    let refundPercentage = 0;
    if (hoursUntilBooking > 48) {
      refundPercentage = 100; // 48小時前取消全額退款
    } else if (hoursUntilBooking > 24) {
      refundPercentage = 50;  // 24-48小時前取消50%退款
    } else {
      refundPercentage = 0;   // 24小時內取消不退款
    }

    const refundAmount = Math.round(order.pricing.total * (refundPercentage / 100));
    const processingFee = refundPercentage > 0 ? Math.min(100, refundAmount * 0.03) : 0;

    // 更新訂單為已取消
    const cancelledOrder: Order = {
      ...order,
      status: 'CANCELLED',
      cancellation: {
        reason,
        description,
        cancelledBy: order.userId === user.id ? 'USER' : 
                    order.booking.guideId === user.id ? 'GUIDE' : 'ADMIN',
        cancelledAt: new Date().toISOString(),
        refundPolicy: {
          isRefundable: refundPercentage > 0,
          refundPercentage,
          refundAmount,
          processingFee
        }
      },
      updatedAt: new Date().toISOString()
    };

    mockOrders[orderIndex] = cancelledOrder;

    console.log('Order cancelled successfully:', cancelledOrder.orderNumber);

    const response: OrderResponse = {
      success: true,
      data: cancelledOrder,
      message: '訂單取消成功'
    };

    return Response.json(response);

  } catch (error) {
    console.error('Cancel order error:', error);
    return Response.json({
      success: false,
      error: '取消訂單失敗'
    }, { status: 500 });
  }
}