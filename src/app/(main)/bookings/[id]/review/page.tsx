'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Star } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { useOrder } from '@/store/order';
import { useToast } from '@/components/ui/toast';
import { Loading } from '@/components/ui/loading';
import { cn } from '@/lib/utils';

export default function OrderReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const { orders, rateOrder, fetchOrder, isLoading } = useOrder();
  const { success, error: showError } = useToast();
  
  const orderId = params.id as string;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // 等待認證初始化
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 檢查用戶是否已登入並載入訂單
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push('/auth/login?redirect=/bookings/' + orderId + '/review');
      return;
    }
    
    if (!isInitializing && isAuthenticated && orderId) {
      fetchOrder(orderId);
    }
  }, [isInitializing, isAuthenticated, orderId, router, fetchOrder]);

  const order = orders.find(o => o.id === orderId);

  const handleSubmitReview = async () => {
    if (!order) return;
    
    setIsSubmitting(true);
    try {
      await rateOrder(order.id, rating, comment);
      success('評價成功', '感謝您的評價！');
      router.push('/my-bookings');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '提交評價失敗';
      showError('評價失敗', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">請先登入</h1>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            前往登入
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">訂單不存在</h1>
          <button
            onClick={() => router.push('/my-bookings')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回我的訂單
          </button>
        </div>
      </div>
    );
  }

  // 只有已完成且未評價的訂單才能評價
  if (order.status !== 'COMPLETED' || order.rating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {order.rating ? '您已評價過此訂單' : '此訂單無法評價'}
          </h1>
          <button
            onClick={() => router.push('/my-bookings')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回我的訂單
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 頁面標題 */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">撰寫評價</h1>
            <p className="text-gray-600">分享您的體驗，幫助其他旅客</p>
          </div>
        </div>

        {/* 訂單資訊卡片 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">服務</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {order.booking.serviceName}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>訂單編號：{order.orderNumber}</p>
                <p>服務日期：{new Date(order.booking.date).toLocaleDateString('zh-TW')}</p>
                <p>服務時間：{order.booking.startTime}</p>
                <p>參與人數：{order.booking.participants} 人</p>
                <p>導遊：{order.booking.guideName}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                NT$ {order.pricing.total.toLocaleString()}
              </div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                已完成
              </div>
            </div>
          </div>
        </div>

        {/* 評價表單 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">您的評價</h2>
          
          {/* 評分 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              服務評分 *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star 
                    className={cn(
                      "w-8 h-8 transition-colors",
                      star <= rating 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"
                    )}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {rating === 1 && '非常不滿意'}
              {rating === 2 && '不滿意'}
              {rating === 3 && '普通'}
              {rating === 4 && '滿意'}
              {rating === 5 && '非常滿意'}
            </p>
          </div>

          {/* 評論 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              詳細評論
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="請分享您的服務體驗..."
            />
          </div>

          {/* 提交按鈕 */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmitReview}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '提交中...' : '提交評價'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}