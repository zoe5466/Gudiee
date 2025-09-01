'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users, MapPin, Star, MessageCircle, X, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { useBooking } from '@/store/booking';
import { FullNavigation } from '@/components/layout/page-navigation';
import { Loading } from '@/components/ui/loading';

export default function MyBookingsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { bookings, fetchBookings, cancelBooking, submitReview, isLoading } = useBooking();
  
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // 檢查用戶是否已登入
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/my-bookings');
      return;
    }
    
    // 載入預訂資料
    fetchBookings();
  }, [isAuthenticated, router, fetchBookings]);

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { text: '待確認', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      confirmed: { text: '已確認', color: 'bg-blue-100 text-blue-800', icon: Check },
      completed: { text: '已完成', color: 'bg-green-100 text-green-800', icon: Check },
      cancelled: { text: '已取消', color: 'bg-red-100 text-red-800', icon: X },
      refunded: { text: '已退款', color: 'bg-gray-100 text-gray-800', icon: X }
    };
    
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500' }} className={badge.color}>
        <Icon style={{ width: '0.75rem', height: '0.75rem' }} />
        {badge.text}
      </span>
    );
  };

  const filteredBookings = bookings.filter(booking => {
    if (selectedTab === 'all') return true;
    return booking.status === selectedTab;
  });

  const handleCancelBooking = async () => {
    if (!cancelBookingId) return;
    
    try {
      await cancelBooking(cancelBookingId, cancelReason);
      setShowCancelModal(false);
      setCancelBookingId(null);
      setCancelReason('');
    } catch (error) {
      console.error('取消預訂失敗:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewBookingId) return;
    
    try {
      await submitReview(reviewBookingId, reviewRating, reviewComment);
      setShowReviewModal(false);
      setReviewBookingId(null);
      setReviewRating(5);
      setReviewComment('');
    } catch (error) {
      console.error('提交評價失敗:', error);
    }
  };

  if (!isAuthenticated) {
    return <Loading />;
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)',
        paddingTop: '2rem',
        paddingBottom: '2rem'
      }}
    >
      <FullNavigation />
      
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1rem' }}>
        {/* 頁面標題 */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
            我的預訂
          </h1>
          <p style={{ color: '#6b7280' }}>
            管理您的所有導覽預訂
          </p>
        </div>

        {/* 分類標籤 */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: '全部' },
            { key: 'pending', label: '待確認' },
            { key: 'confirmed', label: '已確認' },
            { key: 'completed', label: '已完成' },
            { key: 'cancelled', label: '已取消' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.2s',
                ...(selectedTab === tab.key ? {
                  backgroundColor: '#2563eb',
                  borderColor: '#2563eb',
                  color: 'white'
                } : {
                  backgroundColor: 'white',
                  borderColor: '#e5e7eb',
                  color: '#374151'
                })
              }}
              className={selectedTab !== tab.key ? 'hover:bg-gray-50' : ''}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 預訂列表 */}
        {isLoading ? (
          <Loading />
        ) : filteredBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
              {selectedTab === 'all' ? '暫無預訂記錄' : `暫無${selectedTab === 'pending' ? '待確認' : selectedTab === 'confirmed' ? '已確認' : selectedTab === 'completed' ? '已完成' : '已取消'}的預訂`}
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              開始探索精彩的導覽服務吧！
            </p>
            <button
              onClick={() => router.push('/search')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="hover:shadow-lg"
            >
              瀏覽服務
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredBookings.map(booking => (
              <div
                key={booking.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f3f4f6'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                        預訂 #{booking.id}
                      </h3>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>
                      NT$ {booking.pricing.total.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {booking.pricing.currency}
                    </div>
                  </div>
                </div>

                {/* 預訂詳情 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      {new Date(booking.details.date).toLocaleDateString('zh-TW')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      {booking.details.time} ({booking.details.duration}小時)
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      {booking.details.guests} 人
                    </span>
                  </div>
                </div>

                {/* 聯絡資訊 */}
                <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                    聯絡資訊
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {booking.details.contactInfo.name} • {booking.details.contactInfo.email} • {booking.details.contactInfo.phone}
                  </div>
                </div>

                {/* 特殊要求 */}
                {booking.details.specialRequests && (
                  <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#92400e', marginBottom: '0.25rem' }}>
                      特殊要求
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#92400e' }}>
                      {booking.details.specialRequests}
                    </div>
                  </div>
                )}

                {/* 評價 */}
                {booking.review && (
                  <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#ecfdf5', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Star style={{ width: '1rem', height: '1rem', color: '#f59e0b', fill: '#f59e0b' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#065f46' }}>
                        您的評價: {booking.review.rating}/5
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#065f46' }}>
                      {booking.review.comment}
                    </div>
                  </div>
                )}

                {/* 操作按鈕 */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => {
                        setCancelBookingId(booking.id);
                        setShowCancelModal(true);
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #dc2626',
                        borderRadius: '0.375rem',
                        color: '#dc2626',
                        backgroundColor: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      className="hover:bg-red-50"
                    >
                      取消預訂
                    </button>
                  )}
                  
                  {booking.status === 'completed' && !booking.review && (
                    <button
                      onClick={() => {
                        setReviewBookingId(booking.id);
                        setShowReviewModal(true);
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      className="hover:shadow-md"
                    >
                      <Star style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.25rem', display: 'inline' }} />
                      撰寫評價
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 取消預訂模態框 */}
      {showCancelModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', maxWidth: '28rem', width: '100%' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
              取消預訂
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              您確定要取消這個預訂嗎？此操作無法撤銷。
            </p>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                取消原因 (選填)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="請簡述取消原因..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '4rem'
                }}
                className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelBookingId(null);
                  setCancelReason('');
                }}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  color: '#374151',
                  backgroundColor: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                className="hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleCancelBooking}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                className="hover:bg-red-700"
              >
                確認取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 評價模態框 */}
      {showReviewModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', maxWidth: '28rem', width: '100%' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
              撰寫評價
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                評分
              </label>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setReviewRating(rating)}
                    style={{
                      padding: '0.5rem',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <Star 
                      style={{ 
                        width: '1.5rem', 
                        height: '1.5rem', 
                        color: rating <= reviewRating ? '#f59e0b' : '#e5e7eb',
                        fill: rating <= reviewRating ? '#f59e0b' : 'none'
                      }} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                評價內容
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="分享您的體驗..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '6rem'
                }}
                className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewBookingId(null);
                  setReviewRating(5);
                  setReviewComment('');
                }}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  color: '#374151',
                  backgroundColor: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                className="hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={!reviewComment.trim()}
                style={{
                  padding: '0.5rem 1rem',
                  background: reviewComment.trim() ? 'linear-gradient(to right, #2563eb, #4f46e5)' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: reviewComment.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
                className={reviewComment.trim() ? 'hover:shadow-md' : ''}
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