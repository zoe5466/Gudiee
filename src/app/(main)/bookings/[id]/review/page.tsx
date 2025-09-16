'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Star } from 'lucide-react';
import ReviewForm from '@/components/reviews/review-form';
import { ReviewsList } from '@/components/reviews/reviews-list';
import { useAuth } from '@/store/auth';
import { useBooking } from '@/store/booking';

export default function BookingReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { bookings } = useBooking();
  
  const bookingId = params.id as string;
  const [showReviewForm, setShowReviewForm] = useState(true);
  
  // 在實際應用中，這應該從 booking store 或 API 獲取
  const booking = bookings.find(b => b.id === bookingId) || {
    id: bookingId,
    serviceId: 'service-1',
    guideId: 'guide-1',
    status: 'completed' as const,
    details: {
      serviceId: 'service-1',
      guideId: 'guide-1',
      date: new Date('2024-01-15'),
      time: '09:00',
      guests: 2,
      duration: 4,
      contactInfo: {
        name: '張小明',
        email: 'ming@example.com',
        phone: '0912345678'
      }
    },
    pricing: {
      basePrice: 2000,
      serviceFee: 200,
      total: 2200,
      currency: 'TWD'
    },
    payment: {
      method: 'credit_card',
      status: 'completed' as const
    },
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z',
    travelerId: user?.id || 'user-1'
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    // 可以添加成功提示或導航
  };

  if (!user) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 頁面標題 */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">撰寫評論</h1>
            <p className="text-gray-600">分享您的體驗，幫助其他旅客</p>
          </div>
        </div>

        {/* 預訂資訊卡片 */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">服務圖片</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                台北市區導覽服務
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>預訂編號：{booking.id}</p>
                <p>服務日期：{booking.details.date.toLocaleDateString('zh-TW')}</p>
                <p>服務時間：{booking.details.time}</p>
                <p>參與人數：{booking.details.guests} 人</p>
                <p>服務時長：{booking.details.duration} 小時</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                NT$ {booking.pricing.total.toLocaleString()}
              </div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                已完成
              </div>
            </div>
          </div>
        </div>

        {/* 評論表單 */}
        {showReviewForm && (
          <div className="mb-8">
            <ReviewForm
              serviceId={booking.serviceId}
              guideId={booking.guideId}
              bookingId={booking.id}
              serviceName="服務"
              guideName="導遊"
              onSubmit={async (reviewData) => {
                // TODO: 實作評論提交邏輯
                console.log('提交評論:', reviewData);
                handleReviewSubmitted();
              }}
              onCancel={handleReviewSubmitted}
              onClose={handleReviewSubmitted}
            />
          </div>
        )}

        {/* 相關評論 */}
        {!showReviewForm && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">其他用戶的評價</h2>
            <ReviewsList
              targetId={booking.serviceId}
              targetType="service"
              showTitle={false}
              showStatistics={false}
              maxItems={5}
            />
            
            <div className="mt-6 pt-6 border-t text-center">
              <button
                onClick={() => router.push(`/services/${booking.serviceId}#reviews`)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                查看所有評論
              </button>
            </div>
          </div>
        )}

        {/* 操作按鈕 */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => router.push('/bookings')}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            返回預訂列表
          </button>
          {!showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              重新撰寫評論
            </button>
          )}
        </div>
      </div>
    </div>
  );
}