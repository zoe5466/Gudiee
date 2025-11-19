'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, CreditCard, AlertCircle } from 'lucide-react';
import { useAuth } from '@/store/auth';

interface Booking {
  id: string;
  service: {
    id: string;
    title: string;
    location: string;
    images: string[];
    guide: {
      name: string;
      avatar: string;
    };
  };
  bookingDate: string;
  guests: number;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  createdAt: string;
}

export default function MyBookingsPage() {
  const { isAuthenticated, user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    fetchBookings();
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.data || []);
      } else {
        setError(data.message || '獲取預訂記錄失敗');
      }
    } catch (err) {
      console.error('Fetch bookings error:', err);
      setError('網路錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'PENDING': '待確認',
      'CONFIRMED': '已確認',
      'CANCELLED': '已取消',
      'COMPLETED': '已完成'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      'PENDING': 'text-yellow-600 bg-yellow-50',
      'CONFIRMED': 'text-green-600 bg-green-50',
      'CANCELLED': 'text-red-600 bg-red-50',
      'COMPLETED': 'text-blue-600 bg-blue-50'
    };
    return colorMap[status as keyof typeof colorMap] || 'text-gray-600 bg-[#cfdbe9]';
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap = {
      'PENDING': '待付款',
      'PAID': '已付款',
      'REFUNDED': '已退款'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">請先登入</h2>
          <p className="text-gray-600 mb-4">您需要登入才能查看預訂記錄</p>
          <button
            onClick={() => window.location.href = '/auth/login'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            前往登入
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#cfdbe9] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的預訂</h1>
          <p className="text-gray-600">管理您的旅遊預訂記錄</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-600">{error}</span>
            </div>
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">暫無預訂記錄</h3>
            <p className="text-gray-600 mb-6">還沒有任何預訂，快去探索精彩的服務吧！</p>
            <button
              onClick={() => window.location.href = '/search'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              立即預訂
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={booking.service.images[0] || '/placeholder-service.jpg'}
                      alt={booking.service.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {booking.service.title}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{booking.service.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <img
                            src={booking.service.guide.avatar}
                            alt={booking.service.guide.name}
                            className="w-4 h-4 rounded-full mr-1"
                          />
                          <span className="text-sm">導遊: {booking.service.guide.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {new Date(booking.bookingDate).toLocaleDateString('zh-TW')}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="text-sm">{booking.guests} 人</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <CreditCard className="w-4 h-4 mr-2" />
                        <span className="text-sm">{getPaymentStatusText(booking.paymentStatus)}</span>
                      </div>
                      <div className="flex items-center text-gray-900 font-semibold">
                        <span className="text-sm">NT$ {booking.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        預訂時間: {new Date(booking.createdAt).toLocaleString('zh-TW')}
                      </span>
                      <div className="space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          查看詳情
                        </button>
                        {booking.status === 'PENDING' && (
                          <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                            取消預訂
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}