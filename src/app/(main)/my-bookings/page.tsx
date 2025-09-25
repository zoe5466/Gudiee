'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users, MapPin, Star, MessageCircle, X, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/store/auth';
import { useOrder } from '@/store/order';
import { FullNavigation } from '@/components/layout/page-navigation';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@/components/ui/toast';
import { OrderStatusBadge } from '@/components/ui/order-status-badge';
import { OrderStatus } from '@/types/order';

export default function MyBookingsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { orders, fetchOrders, cancelOrder, rateOrder, isLoading, error } = useOrder();
  const { success, error: showError } = useToast();
  
  const [selectedTab, setSelectedTab] = useState<'all' | OrderStatus>('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('USER_REQUEST');
  const [cancelDescription, setCancelDescription] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  // Wait for authentication initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 檢查用戶是否已登入
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push('/auth/login?redirect=/my-bookings');
      return;
    }
    
    // 載入訂單資料
    if (!isInitializing && isAuthenticated) {
      fetchOrders();
    }
  }, [isInitializing, isAuthenticated, router, fetchOrders]);


  const filteredOrders = orders.filter(order => {
    if (selectedTab === 'all') return true;
    return order.status === selectedTab;
  });

  const handleCancelOrder = async () => {
    if (!cancelOrderId) return;
    
    try {
      await cancelOrder(cancelOrderId, cancelReason as any, cancelDescription);
      success('取消成功', '訂單已成功取消');
      setShowCancelModal(false);
      setCancelOrderId(null);
      setCancelReason('USER_REQUEST');
      setCancelDescription('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '取消訂單失敗';
      showError('取消失敗', errorMessage);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewOrderId) return;
    
    try {
      await rateOrder(reviewOrderId, reviewRating, reviewComment);
      success('評價成功', '感謝您的評價！');
      setShowReviewModal(false);
      setReviewOrderId(null);
      setReviewRating(5);
      setReviewComment('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '提交評價失敗';
      showError('評價失敗', errorMessage);
    }
  };

  if (isInitializing || !isAuthenticated) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-8 pb-8">
      <FullNavigation />
      
      <div className="max-w-5xl mx-auto px-4">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            我的訂單
          </h1>
          <p className="text-gray-600">
            管理您的所有導覽服務訂單
          </p>
        </div>

        {/* 分類標籤 */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { key: 'all', label: '全部' },
            { key: 'DRAFT', label: '草稿' },
            { key: 'PENDING', label: '待確認' },
            { key: 'CONFIRMED', label: '已確認' },
            { key: 'PAID', label: '已付款' },
            { key: 'IN_PROGRESS', label: '進行中' },
            { key: 'COMPLETED', label: '已完成' },
            { key: 'CANCELLED', label: '已取消' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
                selectedTab === tab.key
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 訂單列表 */}
        {isLoading ? (
          <Loading />
        ) : filteredOrders.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-sm">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {selectedTab === 'all' ? '暫無訂單記錄' : '暫無相關訂單'}
            </h3>
            <p className="text-gray-600 mb-6">
              開始探索精彩的導覽服務吧！
            </p>
            <button
              onClick={() => router.push('/search')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
            >
              瀏覽服務
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.booking.serviceName}
                      </h3>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      訂單編號：{order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      導遊：{order.booking.guideName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold text-gray-900 mb-1">
                      NT$ {order.pricing.total.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600">
                      {order.pricing.participants} 位旅客
                    </p>
                  </div>
                </div>

                {/* 訂單詳情 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {new Date(order.booking.date).toLocaleDateString('zh-TW')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {order.booking.startTime} ({order.booking.duration}小時)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {order.booking.location.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {order.booking.participants} 位旅客
                    </span>
                  </div>
                </div>

                {/* 操作按鈕 */}
                <div className="flex flex-wrap gap-3 justify-end">
                  <button
                    onClick={() => router.push(`/orders/${order.id}`)}
                    className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    查看詳情
                  </button>

                  {order.status === 'COMPLETED' && !order.rating && (
                    <button
                      onClick={() => {
                        setReviewOrderId(order.id);
                        setShowReviewModal(true);
                      }}
                      className="flex items-center gap-1 px-4 py-2 bg-yellow-400 text-white rounded-md text-sm font-medium hover:bg-yellow-500 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5" />
                      評價
                    </button>
                  )}

                  {['DRAFT', 'PENDING', 'CONFIRMED', 'PAID'].includes(order.status) && (
                    <button
                      onClick={() => {
                        setCancelOrderId(order.id);
                        setShowCancelModal(true);
                      }}
                      className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      取消
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 取消訂單 Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              取消訂單
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                取消原因 *
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USER_REQUEST">個人因素</option>
                <option value="SCHEDULE_CONFLICT">時間衝突</option>
                <option value="WEATHER">天氣因素</option>
                <option value="OTHER">其他原因</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                詳細說明
              </label>
              <textarea
                value={cancelDescription}
                onChange={(e) => setCancelDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm min-h-20 resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="請說明取消原因..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-6 py-3 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                確認取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 評價 Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              服務評價
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                評分 *
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-1 border-none bg-transparent cursor-pointer hover:scale-110 transition-transform"
                  >
                    <Star 
                      className={cn(
                        "w-6 h-6 transition-colors",
                        star <= reviewRating 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                評論
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm min-h-24 resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="分享您的服務體驗..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                提交評價
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}