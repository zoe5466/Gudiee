'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Clock, Users, Star, MessageCircle, MoreHorizontal, Filter, ChevronDown } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { useBooking, type Booking } from '@/store/booking';
import { useToast } from '@/components/ui/toast';
import { Loading } from '@/components/ui/loading';

type BookingStatus = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
type SortOption = 'newest' | 'oldest' | 'status' | 'date';

export default function BookingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { bookings, isLoading, error, fetchBookings, cancelBooking } = useBooking();
  const { success, error: showError } = useToast();
  
  const [statusFilter, setStatusFilter] = useState<BookingStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // 檢查認證狀態
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // 載入預訂列表
    fetchBookings();
  }, [isAuthenticated, fetchBookings, router]);

  // 處理錯誤
  useEffect(() => {
    if (error) {
      showError('載入失敗', error);
    }
  }, [error, showError]);

  // 過濾和排序預訂
  const filteredAndSortedBookings = bookings
    .filter(booking => statusFilter === 'all' || booking.status === statusFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
          return new Date(a.details.date).getTime() - new Date(b.details.date).getTime();
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm('確定要取消這個預訂嗎？')) {
      try {
        await cancelBooking(bookingId, '用戶主動取消');
        success('取消成功', '預訂已成功取消');
      } catch (err) {
        showError('取消失敗', '無法取消預訂，請聯繫客服');
      }
    }
  };

  const getStatusText = (status: Booking['status']) => {
    const statusMap = {
      PENDING: '待確認',
      CONFIRMED: '已確認',
      COMPLETED: '已完成',
      CANCELLED: '已取消',
      REFUNDED: '已退款'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: Booking['status']) => {
    const colorMap = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  // 載入狀態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <div className="flex justify-center items-center py-20">
            <Loading size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的預訂</h1>
          <p className="text-gray-600">管理您的所有旅遊預訂</p>
        </div>

        {/* 過濾器和排序 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-[#FF5A5F] transition-colors"
              >
                <Filter className="w-4 h-4" />
                篩選
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <div className="text-sm text-gray-600">
                共 {filteredAndSortedBookings.length} 個預訂
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
              >
                <option value="newest">最新的在前</option>
                <option value="oldest">最舊的在前</option>
                <option value="date">按服務日期</option>
                <option value="status">按狀態</option>
              </select>
            </div>
          </div>

          {/* 展開的篩選器 */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <h3 className="text-sm font-medium text-gray-700 w-full mb-2">狀態篩選：</h3>
                {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      statusFilter === status
                        ? 'bg-[#FF5A5F] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? '全部' : getStatusText(status)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 預訂列表 */}
        {filteredAndSortedBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredAndSortedBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* 左側：預訂資訊 */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {/* TODO: 從 serviceId 獲取服務名稱 */}
                          台北文化導覽服務
                        </h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          NT$ {booking.pricing.total.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          預訂編號：{booking.id.slice(-6)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.details.date).toLocaleDateString('zh-TW')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{booking.details.duration} 小時</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{booking.details.guests} 位旅客</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>台北市</span>
                      </div>
                    </div>

                    {booking.details.specialRequests && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>特殊需求：</strong> {booking.details.specialRequests}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 右側：操作按鈕 */}
                  <div className="flex flex-col gap-2 lg:min-w-[200px]">
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="btn btn-secondary btn-sm w-full"
                      >
                        取消預訂
                      </button>
                    )}
                    
                    {booking.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => router.push(`/messages?guide=${booking.guideId}`)}
                          className="btn btn-primary btn-sm w-full flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          聯繫地陪
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="btn btn-secondary btn-sm w-full"
                        >
                          取消預訂
                        </button>
                      </>
                    )}
                    
                    {booking.status === 'completed' && !booking.review && (
                      <button
                        onClick={() => router.push(`/bookings/${booking.id}/review`)}
                        className="btn btn-primary btn-sm w-full flex items-center justify-center gap-2"
                      >
                        <Star className="w-4 h-4" />
                        撰寫評價
                      </button>
                    )}
                    
                    {booking.review && (
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{booking.review.rating}</span>
                        </div>
                        <p className="text-xs text-gray-600">已評價</p>
                      </div>
                    )}

                    <button
                      onClick={() => router.push(`/bookings/${booking.id}`)}
                      className="btn btn-ghost btn-sm w-full"
                    >
                      查看詳情
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 空狀態 */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {statusFilter === 'all' ? '還沒有任何預訂' : `沒有${getStatusText(statusFilter)}的預訂`}
            </h3>
            <p className="text-gray-600 mb-6">
              {statusFilter === 'all' 
                ? '開始探索精彩的旅遊體驗吧！' 
                : '試試調整篩選條件或建立新的預訂'
              }
            </p>
            {statusFilter === 'all' ? (
              <button
                onClick={() => router.push('/search')}
                className="btn btn-primary"
              >
                探索服務
              </button>
            ) : (
              <button
                onClick={() => setStatusFilter('all')}
                className="btn btn-secondary"
              >
                查看所有預訂
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}