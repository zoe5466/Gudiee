'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Star, Users, MessageCircle, Eye, TrendingUp, Plus, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/store/auth';

interface GuideDashboardProps {
  className?: string;
}

interface DashboardStats {
  totalEarnings: number;
  monthlyEarnings: number;
  totalBookings: number;
  activeServices: number;
  averageRating: number;
  totalReviews: number;
  profileViews: number;
  responseRate: number;
}

interface Booking {
  id: string;
  service: {
    id: string;
    title: string;
    images: string[];
  };
  traveler: {
    name: string;
    avatar?: string;
  };
  bookingDate: string;
  startTime: string;
  guests: number;
  totalAmount: number;
  status: string;
}

interface Service {
  id: string;
  title: string;
  images: string[];
  location: string;
  price: number;
  averageRating: number;
  totalBookings: number;
  totalViews: number;
  status: string;
}

export default function GuideDashboard({ className = '' }: GuideDashboardProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: 0,
    monthlyEarnings: 0,
    totalBookings: 0,
    activeServices: 0,
    averageRating: 0,
    totalReviews: 0,
    profileViews: 0,
    responseRate: 0
  });
  
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [topServices, setTopServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 這裡應該調用實際的API
      // const response = await fetch('/api/dashboard/guide', { credentials: 'include' });
      
      // 模擬數據
      setStats({
        totalEarnings: 125680,
        monthlyEarnings: 23400,
        totalBookings: 47,
        activeServices: 5,
        averageRating: 4.8,
        totalReviews: 32,
        profileViews: 1250,
        responseRate: 98
      });

      setUpcomingBookings([
        {
          id: '1',
          service: {
            id: '1',
            title: '陽明山國家公園生態導覽',
            images: ['/api/placeholder/400/300']
          },
          traveler: {
            name: '王小美',
            avatar: '/api/placeholder/40/40'
          },
          bookingDate: '2024-12-15',
          startTime: '09:00',
          guests: 2,
          totalAmount: 2400,
          status: 'CONFIRMED'
        },
        {
          id: '2',
          service: {
            id: '2',
            title: '淡水河岸夜景攝影',
            images: ['/api/placeholder/400/300']
          },
          traveler: {
            name: '李先生',
            avatar: '/api/placeholder/40/40'
          },
          bookingDate: '2024-12-16',
          startTime: '18:00',
          guests: 1,
          totalAmount: 1800,
          status: 'PENDING'
        }
      ]);

      setTopServices([
        {
          id: '1',
          title: '陽明山國家公園生態導覽',
          images: ['/api/placeholder/400/300'],
          location: '台北陽明山',
          price: 1200,
          averageRating: 4.9,
          totalBookings: 15,
          totalViews: 340,
          status: 'ACTIVE'
        },
        {
          id: '2',
          title: '淡水河岸夜景攝影',
          images: ['/api/placeholder/400/300'],
          location: '新北淡水',
          price: 1800,
          averageRating: 4.7,
          totalBookings: 12,
          totalViews: 280,
          status: 'ACTIVE'
        },
        {
          id: '3',
          title: '九份老街文化巡禮',
          images: ['/api/placeholder/400/300'],
          location: '新北九份',
          price: 900,
          averageRating: 4.6,
          totalBookings: 20,
          totalViews: 450,
          status: 'ACTIVE'
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
      month: 'short',
      day: 'numeric'
    });
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* 歡迎標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            嚮導控制台
          </h1>
          <p className="text-gray-600">管理您的服務和預訂</p>
        </div>
        <Link 
          href="/services/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          新增服務
        </Link>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</div>
              <div className="text-sm text-gray-600">總收入</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyEarnings)}</div>
              <div className="text-sm text-gray-600">本月收入</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
              <div className="text-sm text-gray-600">總預訂數</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MapPin className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.activeServices}</div>
              <div className="text-sm text-gray-600">活躍服務</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.averageRating}</div>
              <div className="text-sm text-gray-600">平均評分</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageCircle className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalReviews}</div>
              <div className="text-sm text-gray-600">評論數</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Eye className="h-8 w-8 text-cyan-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.profileViews}</div>
              <div className="text-sm text-gray-600">檔案瀏覽</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-pink-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.responseRate}%</div>
              <div className="text-sm text-gray-600">回覆率</div>
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
                href="/guide/bookings" 
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
                <p className="mt-2 text-sm text-gray-600">優化您的服務以吸引更多客戶</p>
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
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {booking.service.title}
                        </h3>
                        <div className="mt-1 flex items-center space-x-2 text-sm text-gray-600">
                          <span>{booking.traveler.name}</span>
                          <span>•</span>
                          <span>{formatDate(booking.bookingDate)} {booking.startTime}</span>
                          <span>•</span>
                          <span>{booking.guests} 人</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBookingStatusColor(booking.status)}`}>
                            {getBookingStatusText(booking.status)}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(booking.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 熱門服務 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">熱門服務</h2>
              <Link 
                href="/guide/services" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                管理服務
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {topServices.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-sm font-medium text-gray-900">尚未創建服務</h3>
                <p className="mt-2 text-sm text-gray-600">創建您的第一個旅遊服務</p>
                <Link 
                  href="/services/new"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新增服務
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {topServices.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={service.images[0] || '/images/placeholder.jpg'}
                          alt={service.title}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/services/${service.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block"
                        >
                          {service.title}
                        </Link>
                        
                        <div className="mt-1 flex items-center space-x-1">
                          {renderStars(service.averageRating)}
                          <span className="text-sm text-gray-600 ml-2">
                            {service.averageRating} ({service.totalBookings} 預訂)
                          </span>
                        </div>
                        
                        <div className="mt-1 flex items-center justify-between text-sm text-gray-600">
                          <span>{service.location}</span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(service.price)}
                          </span>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                          <span>{service.totalViews} 次瀏覽</span>
                          <Link 
                            href={`/guide/services/${service.id}/edit`}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            編輯
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
      </div>

      {/* 快捷操作 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/services/new"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-[#cfdbe9] transition-colors"
          >
            <Plus className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">新增服務</div>
              <div className="text-sm text-gray-600">創建新的旅遊體驗</div>
            </div>
          </Link>

          <Link 
            href="/guide/bookings"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-[#cfdbe9] transition-colors"
          >
            <Calendar className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">管理預訂</div>
              <div className="text-sm text-gray-600">查看和管理預訂</div>
            </div>
          </Link>

          <Link 
            href="/guide/earnings"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-[#cfdbe9] transition-colors"
          >
            <DollarSign className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">收入報告</div>
              <div className="text-sm text-gray-600">查看收入統計</div>
            </div>
          </Link>

          <Link 
            href="/messages"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-[#cfdbe9] transition-colors"
          >
            <MessageCircle className="h-6 w-6 text-orange-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">訊息中心</div>
              <div className="text-sm text-gray-600">與客戶溝通</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}