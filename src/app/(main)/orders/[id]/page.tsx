// 訂單詳情頁面組件
// 功能：顯示單一訂單的完整詳情資訊，包含預訂資訊、客戶資訊、價格明細、狀態追蹤等
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Calendar, Clock, Users, MapPin, Star, Phone, Mail, 
  CreditCard, Receipt, MessageCircle, CheckCircle,
  Download, Eye
} from 'lucide-react';
import { useAuth } from '@/store/auth';
import { useOrder } from '@/store/order';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@/components/ui/toast';
import { OrderStatusBadge } from '@/components/ui/order-status-badge';
import { OrderStatus, Order } from '@/types/order';

interface OrderDetailsPageProps {
  params: { id: string };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { currentOrder, fetchOrder, isLoading, error } = useOrder();
  const { success, error: showError } = useToast();
  
  const [isInitializing, setIsInitializing] = useState(true);

  // 等待認證初始化
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 檢查用戶是否已登入
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push('/auth/login?redirect=/orders/' + params.id);
      return;
    }
    
    // 載入訂單詳情
    if (!isInitializing && isAuthenticated && params.id) {
      fetchOrder(params.id);
    }
  }, [isInitializing, isAuthenticated, params.id, router, fetchOrder]);


  const getStatusTimeline = (order: Order) => {
    const steps = [
      { key: 'DRAFT', label: '訂單建立', time: order.createdAt },
      { key: 'PENDING', label: '等待確認', time: order.createdAt },
      { key: 'CONFIRMED', label: '已確認', time: order.confirmedAt },
      { key: 'PAID', label: '已付款', time: order.payment.paidAt },
      { key: 'COMPLETED', label: '已完成', time: order.completedAt }
    ];

    return steps.filter(step => {
      // 如果訂單已取消，只顯示到取消前的狀態
      if (order.status === 'CANCELLED') {
        return step.key === 'DRAFT' || step.key === 'PENDING';
      }
      
      // 根據當前狀態決定顯示哪些步驟
      const statusOrder = ['DRAFT', 'PENDING', 'CONFIRMED', 'PAID', 'IN_PROGRESS', 'COMPLETED'];
      const currentIndex = statusOrder.indexOf(order.status);
      const stepIndex = statusOrder.indexOf(step.key);
      
      return stepIndex <= currentIndex;
    });
  };

  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || '訂單不存在'}
          </h2>
          <p className="text-gray-600 mb-6">
            無法載入訂單詳情，請稍後再試
          </p>
          <button
            onClick={() => router.push('/my-bookings')}
            className="btn btn-primary"
          >
            返回我的訂單
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  訂單詳情
                </h1>
                <p className="text-sm text-gray-600">
                  {currentOrder.orderNumber}
                </p>
              </div>
            </div>
            <OrderStatusBadge status={currentOrder.status} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要內容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 服務資訊 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">服務資訊</h2>
              
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={currentOrder.booking.serviceImage}
                  alt={currentOrder.booking.serviceName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {currentOrder.booking.serviceName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <img
                      src={currentOrder.booking.guideAvatar}
                      alt={currentOrder.booking.guideName}
                      className="w-5 h-5 rounded-full"
                    />
                    導遊：{currentOrder.booking.guideName}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(currentOrder.booking.date).toLocaleDateString('zh-TW')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{currentOrder.booking.startTime} - {currentOrder.booking.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{currentOrder.booking.participants} 位旅客</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{currentOrder.booking.location.name}</span>
                </div>
              </div>

              {currentOrder.booking.specialRequests && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-1">特殊需求</h4>
                  <p className="text-sm text-blue-800">{currentOrder.booking.specialRequests}</p>
                </div>
              )}
            </div>

            {/* 客戶資訊 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">客戶資訊</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <div className="text-sm text-gray-900">{currentOrder.customer.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">國籍</label>
                  <div className="text-sm text-gray-900">{currentOrder.customer.nationality || '未提供'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {currentOrder.customer.email}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">電話號碼</label>
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {currentOrder.customer.phone}
                  </div>
                </div>
              </div>

              {currentOrder.customer.emergencyContact && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">緊急聯絡人</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">姓名：</span>
                      <span className="text-gray-900">{currentOrder.customer.emergencyContact.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">電話：</span>
                      <span className="text-gray-900">{currentOrder.customer.emergencyContact.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">關係：</span>
                      <span className="text-gray-900">{currentOrder.customer.emergencyContact.relationship}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 取消資訊 */}
            {currentOrder.cancellation && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-red-900 mb-4">取消資訊</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-red-700">取消時間：</span>
                    <span className="text-sm text-red-900 ml-2">
                      {new Date(currentOrder.cancellation.cancelledAt).toLocaleString('zh-TW')}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-red-700">取消者：</span>
                    <span className="text-sm text-red-900 ml-2">
                      {currentOrder.cancellation.cancelledBy === 'USER' ? '客戶' : 
                       currentOrder.cancellation.cancelledBy === 'GUIDE' ? '導遊' : '系統管理員'}
                    </span>
                  </div>
                  {currentOrder.cancellation.description && (
                    <div>
                      <span className="text-sm font-medium text-red-700">取消原因：</span>
                      <p className="text-sm text-red-900 mt-1">{currentOrder.cancellation.description}</p>
                    </div>
                  )}
                  
                  {/* 退款資訊 */}
                  <div className="mt-4 p-3 bg-red-100 rounded-lg">
                    <h4 className="text-sm font-medium text-red-900 mb-2">退款政策</h4>
                    <div className="text-sm text-red-800">
                      {currentOrder.cancellation.refundPolicy.isRefundable ? (
                        <>
                          <p>可退款金額：NT$ {currentOrder.cancellation.refundPolicy.refundAmount.toLocaleString()}</p>
                          <p>退款比例：{currentOrder.cancellation.refundPolicy.refundPercentage}%</p>
                          {currentOrder.cancellation.refundPolicy.processingFee > 0 && (
                            <p>手續費：NT$ {currentOrder.cancellation.refundPolicy.processingFee.toLocaleString()}</p>
                          )}
                        </>
                      ) : (
                        <p>根據退款政策，此訂單不符合退款條件</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 評價資訊 */}
            {currentOrder.rating && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-yellow-900 mb-4">服務評價</h2>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= currentOrder.rating!.score 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-yellow-800">
                    {currentOrder.rating.score} 分
                  </span>
                  <span className="text-xs text-yellow-600 ml-2">
                    {new Date(currentOrder.rating.ratedAt).toLocaleDateString('zh-TW')}
                  </span>
                </div>
                {currentOrder.rating.comment && (
                  <p className="text-sm text-yellow-800">{currentOrder.rating.comment}</p>
                )}
              </div>
            )}
          </div>

          {/* 側邊欄 */}
          <div className="space-y-6">
            {/* 訂單狀態追蹤 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">訂單狀態</h3>
              
              <div className="space-y-4">
                {getStatusTimeline(currentOrder).map((step, index, array) => (
                  <div key={step.key} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.time 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.time ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <div className="w-2 h-2 bg-current rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        step.time ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </p>
                      {step.time && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(step.time).toLocaleString('zh-TW')}
                        </p>
                      )}
                    </div>
                    {index < array.length - 1 && (
                      <div className="absolute left-4 mt-8 w-px h-4 bg-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 價格明細 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                價格明細
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">服務費用</span>
                  <span className="text-gray-900">NT$ {currentOrder.pricing.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">平台服務費</span>
                  <span className="text-gray-900">NT$ {currentOrder.pricing.serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">稅費</span>
                  <span className="text-gray-900">NT$ {currentOrder.pricing.tax.toLocaleString()}</span>
                </div>
                
                {currentOrder.pricing.discount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">折扣 ({currentOrder.pricing.discount.description})</span>
                    <span className="text-green-600">
                      -NT$ {(
                        currentOrder.pricing.discount.type === 'FIXED' 
                          ? currentOrder.pricing.discount.value
                          : Math.round(currentOrder.pricing.subtotal * currentOrder.pricing.discount.value / 100)
                      ).toLocaleString()}
                    </span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-base font-semibold">
                    <span className="text-gray-900">總計</span>
                    <span className="text-gray-900">NT$ {currentOrder.pricing.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 支付資訊 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                支付資訊
              </h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">支付方式：</span>
                  <span className="text-sm text-gray-900 ml-2">
                    {currentOrder.payment.method === 'CREDIT_CARD' ? '信用卡' : 
                     currentOrder.payment.method === 'BANK_TRANSFER' ? '銀行轉帳' : 
                     currentOrder.payment.method}
                  </span>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600">支付狀態：</span>
                  <span className={`text-sm ml-2 ${
                    currentOrder.payment.status === 'COMPLETED' ? 'text-green-600' :
                    currentOrder.payment.status === 'PENDING' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {currentOrder.payment.status === 'COMPLETED' ? '已完成' :
                     currentOrder.payment.status === 'PENDING' ? '待付款' :
                     currentOrder.payment.status === 'FAILED' ? '失敗' : '已取消'}
                  </span>
                </div>
                
                {currentOrder.payment.paidAt && (
                  <div>
                    <span className="text-sm text-gray-600">付款時間：</span>
                    <span className="text-sm text-gray-900 ml-2">
                      {new Date(currentOrder.payment.paidAt).toLocaleString('zh-TW')}
                    </span>
                  </div>
                )}
                
                {currentOrder.payment.transactionId && (
                  <div>
                    <span className="text-sm text-gray-600">交易編號：</span>
                    <span className="text-sm text-gray-900 ml-2 font-mono">
                      {currentOrder.payment.transactionId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">操作</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/chat?order=${currentOrder.id}`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  聯繫導遊
                </button>
                
                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  下載收據
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  列印訂單
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}