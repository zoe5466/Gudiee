// 單一訂單操作 API
// 功能：處理特定訂單的查詢、更新、取消等操作
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { Order, OrderResponse, OrderStatus, PaymentStatus, CancellationReason } from '@/types/order';
import { orderStorage } from '@/lib/mock-orders';
import { errorHandler, OrderErrorCode, withErrorHandler } from '@/lib/error-handler';
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

// 檢查訂單存取權限
function hasOrderAccess(order: Order, user: any): boolean {
  // 管理員可以存取所有訂單
  if (user.role === 'admin') return true;
  
  // 用戶只能存取自己的訂單或作為導遊的訂單
  return order.userId === user.id || order.booking.guideId === user.id;
}

// GET - 查詢特定訂單
export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  console.log('Get single order API called:', params.id);
  
  const user = getCurrentUser();
  if (!user) {
    throw errorHandler.createOrderError(OrderErrorCode.INSUFFICIENT_PERMISSIONS);
  }

  const order = orderStorage.getById(params.id);
  
  if (!order) {
    throw errorHandler.createOrderError(OrderErrorCode.ORDER_NOT_FOUND);
  }

  // 檢查存取權限
  if (!hasOrderAccess(order, user)) {
    throw errorHandler.createOrderError(OrderErrorCode.INSUFFICIENT_PERMISSIONS);
  }

    const response: OrderResponse = {
      success: true,
      data: order
    };

    return Response.json(response);
});

// PUT - 更新訂單狀態
export const PUT = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  console.log('Update order API called:', params.id);
  
  const user = getCurrentUser();
  if (!user) {
    throw errorHandler.createOrderError(OrderErrorCode.INSUFFICIENT_PERMISSIONS);
  }

  const body = await request.json();
  const { status, paymentStatus, notes } = body;

  const order = orderStorage.getById(params.id);
  
  if (!order) {
    throw errorHandler.createOrderError(OrderErrorCode.ORDER_NOT_FOUND);
  }

  // 檢查存取權限
  if (!hasOrderAccess(order, user)) {
    throw errorHandler.createOrderError(OrderErrorCode.INSUFFICIENT_PERMISSIONS);
  }

    // 驗證狀態轉換邏輯
    if (status) {
      try {
        errorHandler.validateStatusTransition(order.status, status);
      } catch (validationError) {
        throw validationError;
      }
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

    const savedOrder = orderStorage.update(params.id, updatedOrder);
    
    if (!savedOrder) {
      throw new Error('Failed to update order in storage');
    }

    console.log('Order updated successfully:', savedOrder.orderNumber);

    // 發送訂單確認通知（當狀態變為 CONFIRMED 時）
    if (status === 'CONFIRMED' && order.status !== 'CONFIRMED') {
      await notificationService.sendOrderConfirmedNotifications(savedOrder);
    }

    const response: OrderResponse = {
      success: true,
      data: savedOrder,
      message: '訂單更新成功'
    };

    return Response.json(response);
});

// DELETE - 取消訂單
export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  console.log('Cancel order API called:', params.id);
  
  const user = getCurrentUser();
  if (!user) {
    throw errorHandler.createOrderError(OrderErrorCode.INSUFFICIENT_PERMISSIONS);
  }

  const body = await request.json();
  const { reason, description }: { 
    reason: CancellationReason; 
    description?: string;
  } = body;

  if (!reason) {
    throw errorHandler.createOrderError(OrderErrorCode.INVALID_REQUEST_DATA, 'Cancellation reason is required');
  }

  const order = orderStorage.getById(params.id);
  
  if (!order) {
    throw errorHandler.createOrderError(OrderErrorCode.ORDER_NOT_FOUND);
  }

  // 檢查存取權限
  if (!hasOrderAccess(order, user)) {
    throw errorHandler.createOrderError(OrderErrorCode.INSUFFICIENT_PERMISSIONS);
  }

  // 檢查是否可以取消
  const cancellableStatuses: OrderStatus[] = ['DRAFT', 'PENDING', 'CONFIRMED', 'PAID'];
  if (!cancellableStatuses.includes(order.status)) {
    throw errorHandler.createOrderError(OrderErrorCode.CANCELLATION_NOT_ALLOWED);
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

    const savedOrder = orderStorage.update(params.id, cancelledOrder);
    
    if (!savedOrder) {
      throw new Error('Failed to cancel order in storage');
    }

    console.log('Order cancelled successfully:', savedOrder.orderNumber);

    // 發送訂單取消通知
    await notificationService.sendOrderCancelledNotifications(savedOrder);

    const response: OrderResponse = {
      success: true,
      data: savedOrder,
      message: '訂單取消成功'
    };

    return Response.json(response);
});