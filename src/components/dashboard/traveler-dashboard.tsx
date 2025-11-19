'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Star, Heart, MessageCircle, MapPin, CreditCard, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/store/auth';

interface TravelerDashboardProps {
  className?: string;
}

interface DashboardStats {
  upcomingBookings: number;
  completedBookings: number;
  favoriteServices: number;
  totalSpent: number;
  reviewsGiven: number;
}

interface Booking {
  id: string;
  service: {
    id: string;
    title: string;
    images: string[];
    location: string;
    guide: {
      name: string;
      avatar?: string;
    };
  };
  bookingDate: string;
  startTime: string;
  guests: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
}

interface RecentActivity {
  id: string;
  type: 'booking' | 'review' | 'message';
  title: string;
  description: string;
  createdAt: string;
  url?: string;
}

export default function TravelerDashboard({ className = '' }: TravelerDashboardProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    upcomingBookings: 0,
    completedBookings: 0,
    favoriteServices: 0,
    totalSpent: 0,
    reviewsGiven: 0
  });
  
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 這裡應該調用實際的API
      // const response = await fetch('/api/dashboard/traveler', { credentials: 'include' });
      
      // 模擬數據
      setStats({
        upcomingBookings: 2,
        completedBookings: 8,
        favoriteServices: 15,
        totalSpent: 45200,
        reviewsGiven: 6
      });

      setUpcomingBookings([
        {
          id: '1',
          service: {
            id: '1',
            title: '陽明山國家公園生態導覽',
            images: ['/api/placeholder/400/300'],
            location: '台北陽明山',
            guide: {
              name: '張小明',
              avatar: '/api/placeholder/40/40'
            }
          },
          bookingDate: '2024-12-15',
          startTime: '09:00',
          guests: 2,
          totalAmount: 2400,
          status: 'CONFIRMED',
          paymentStatus: 'COMPLETED'
        },
        {
          id: '2',
          service: {
            id: '2',
            title: '九份老街文化巡禮',
            images: ['/api/placeholder/400/300'],
            location: '新北九份',
            guide: {
              name: '李小華',
              avatar: '/api/placeholder/40/40'
            }
          },
          bookingDate: '2024-12-20',
          startTime: '14:00',
          guests: 4,
          totalAmount: 3600,
          status: 'PENDING',
          paymentStatus: 'PENDING'
        }
      ]);

      setRecentActivity([
        {
          id: '1',
          type: 'booking',
          title: '預訂確認',
          description: '陽明山國家公園生態導覽 - 12月15日',
          createdAt: '2024-12-01T10:30:00Z',
          url: '/bookings/1'
        },
        {
          id: '2',
          type: 'review',
          title: '評論發表',
          description: '給「淡水河岸夜景攝影」留下了5星好評',
          createdAt: '2024-11-28T16:45:00Z',
          url: '/reviews/1'
        },
        {
          id: '3',
          type: 'message',
          title: '收到訊息',
          description: '嚮導張小明發送了行程提醒',
          createdAt: '2024-11-27T09:15:00Z',
          url: '/messages/1'
        }
      ]);

    } catch (error) {
      console.error('Fetch dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `NT$ ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'review':
        return <Star className="w-4 h-4 text-yellow-600" />;
      case 'message':
        return <MessageCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBookingStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return '已確認';
      case 'PENDING':
        return '待確認';
      case 'CANCELLED':
        return '已取消';
      case 'COMPLETED':
        return '已完成';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-200 h-64 rounded-lg"></div>
            <div className="bg-gray-200 h-64 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* 歡迎標題 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          歡迎回來，{user?.name}！
        </h1>
        <p className="text-gray-600">管理您的旅行預訂和探索新的體驗</p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.upcomingBookings}</div>
              <div className="text-sm text-gray-600">即將到來</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.completedBookings}</div>
              <div className="text-sm text-gray-600">已完成</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.favoriteServices}</div>
              <div className="text-sm text-gray-600">收藏服務</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</div>
              <div className="text-sm text-gray-600">總消費</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.reviewsGiven}</div>
              <div className="text-sm text-gray-600">評論數</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 即將到來的預訂 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">即將到來的預訂</h2>
              <Link 
                href="/bookings" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                查看全部
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-sm font-medium text-gray-900">沒有即將到來的預訂</h3>
                <p className="mt-2 text-sm text-gray-600">探索並預訂新的旅行體驗</p>
                <Link 
                  href="/search" 
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  開始探索
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={booking.service.images[0] || '/images/placeholder.jpg'}
                          alt={booking.service.title}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/services/${booking.service.id}`}
                          className="text-lg font-medium text-gray-900 hover:text-blue-600"
                        >
                          {booking.service.title}
                        </Link>
                        
                        <div className="mt-1 flex items-center text-sm text-gray-600 space-x-4">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {booking.service.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(booking.bookingDate)} {booking.startTime}
                          </div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {booking.guests} 人
                          </div>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBookingStatusColor(booking.status)}`}>
                              {getBookingStatusText(booking.status)}
                            </span>
                            <span className="text-lg font-semibold text-gray-900">
                              {formatCurrency(booking.totalAmount)}
                            </span>
                          </div>
                          
                          <Link 
                            href={`/bookings/${booking.id}`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            查看詳情
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 最近活動 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">最近活動</h2>
          </div>
          
          <div className="p-6">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-sm font-medium text-gray-900">暫無活動記錄</h3>
                <p className="mt-2 text-sm text-gray-600">開始您的旅行體驗</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.createdAt).toLocaleDateString('zh-TW')}
                      </p>
                    </div>
                    {activity.url && (
                      <Link 
                        href={activity.url}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        查看
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/search"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-[#cfdbe9] transition-colors"
          >
            <MapPin className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">探索服務</div>
              <div className="text-sm text-gray-600">尋找新的體驗</div>
            </div>
          </Link>

          <Link 
            href="/bookings"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-[#cfdbe9] transition-colors"
          >
            <Calendar className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">我的預訂</div>
              <div className="text-sm text-gray-600">管理預訂記錄</div>
            </div>
          </Link>

          <Link 
            href="/favorites"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-[#cfdbe9] transition-colors"
          >
            <Heart className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">我的收藏</div>
              <div className="text-sm text-gray-600">查看收藏的服務</div>
            </div>
          </Link>

          <Link 
            href="/messages"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-[#cfdbe9] transition-colors"
          >
            <MessageCircle className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">訊息中心</div>
              <div className="text-sm text-gray-600">與嚮導聯繫</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}