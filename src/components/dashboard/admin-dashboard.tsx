'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  MessageCircle,
  Activity,
  BarChart3,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/store/auth';

interface AdminDashboardProps {
  className?: string;
}

interface DashboardStats {
  totalUsers: number;
  totalGuides: number;
  totalTravelers: number;
  totalServices: number;
  activeServices: number;
  pendingServices: number;
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  totalReviews: number;
  pendingReviews: number;
  supportTickets: number;
  activeTickets: number;
}

interface RecentActivity {
  id: string;
  type: 'user' | 'booking' | 'service' | 'review' | 'support';
  title: string;
  description: string;
  createdAt: string;
  status?: string;
  url?: string;
}

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  url?: string;
}

export default function AdminDashboard({ className = '' }: AdminDashboardProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalGuides: 0,
    totalTravelers: 0,
    totalServices: 0,
    activeServices: 0,
    pendingServices: 0,
    totalBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    pendingReviews: 0,
    supportTickets: 0,
    activeTickets: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 這裡應該調用實際的API
      // const response = await fetch('/api/admin/dashboard', { credentials: 'include' });
      
      // 模擬數據
      setStats({
        totalUsers: 1247,
        totalGuides: 186,
        totalTravelers: 1061,
        totalServices: 342,
        activeServices: 298,
        pendingServices: 15,
        totalBookings: 2891,
        completedBookings: 2456,
        totalRevenue: 5672340,
        monthlyRevenue: 456780,
        averageRating: 4.6,
        totalReviews: 1834,
        pendingReviews: 23,
        supportTickets: 89,
        activeTickets: 12
      });

      setRecentActivity([
        {
          id: '1',
          type: 'user',
          title: '新用戶註冊',
          description: '王小明註冊為嚮導',
          createdAt: '2024-12-01T10:30:00Z',
          url: '/admin/users/1'
        },
        {
          id: '2',
          type: 'service',
          title: '服務待審核',
          description: '「台北101觀景導覽」等待審核',
          createdAt: '2024-12-01T09:15:00Z',
          status: 'pending',
          url: '/admin/services/pending'
        },
        {
          id: '3',
          type: 'booking',
          title: '新預訂',
          description: '李小華預訂了陽明山生態導覽',
          createdAt: '2024-12-01T08:45:00Z',
          url: '/admin/bookings/1'
        },
        {
          id: '4',
          type: 'review',
          title: '評論舉報',
          description: '有用戶舉報不當評論內容',
          createdAt: '2024-11-30T16:20:00Z',
          status: 'warning',
          url: '/admin/reviews/reported'
        },
        {
          id: '5',
          type: 'support',
          title: '客服工單',
          description: '用戶反映付款問題',
          createdAt: '2024-11-30T14:10:00Z',
          status: 'active',
          url: '/admin/support/1'
        }
      ]);

      setAlerts([
        {
          id: '1',
          type: 'warning',
          title: '待審核服務過多',
          description: '目前有 15 個服務等待審核，建議盡快處理',
          url: '/admin/services/pending'
        },
        {
          id: '2',
          type: 'info',
          title: '系統維護提醒',
          description: '系統將於明日 02:00-04:00 進行例行維護',
          url: '/admin/system/maintenance'
        },
        {
          id: '3',
          type: 'error',
          title: '支付異常',
          description: '檢測到 3 筆支付異常交易，需要人工確認',
          url: '/admin/payments/issues'
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'service':
        return <MapPin className="w-4 h-4 text-green-600" />;
      case 'booking':
        return <Clock className="w-4 h-4 text-purple-600" />;
      case 'review':
        return <Star className="w-4 h-4 text-yellow-600" />;
      case 'support':
        return <MessageCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityStatusColor = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'warning':
        return 'text-orange-600';
      case 'error':
        return 'text-red-600';
      case 'active':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-[#cfdbe9] border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }, (_, i) => (
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          管理員控制台
        </h1>
        <p className="text-gray-600">系統總覽和管理面板</p>
      </div>

      {/* 系統警告 */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`border rounded-lg p-4 ${getAlertBgColor(alert.type)}`}>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900">{alert.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                  {alert.url && (
                    <Link 
                      href={alert.url}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 mt-2 inline-block"
                    >
                      查看詳情 →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 統計卡片 - 用戶統計 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">用戶統計</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-gray-600">總用戶數</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.totalGuides.toLocaleString()}</div>
                <div className="text-sm text-gray-600">嚮導數量</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.totalTravelers.toLocaleString()}</div>
                <div className="text-sm text-gray-600">旅行者</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">+8.2%</div>
                <div className="text-sm text-gray-600">月成長率</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 服務統計 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">服務統計</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.totalServices}</div>
                <div className="text-sm text-gray-600">總服務數</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
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
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.pendingServices}</div>
                <div className="text-sm text-gray-600">待審核</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.averageRating}</div>
                <div className="text-sm text-gray-600">平均評分</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 營收統計 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">營收統計</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</div>
                <div className="text-sm text-gray-600">總營收</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</div>
                <div className="text-sm text-gray-600">本月營收</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-purple-600" />
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
                <CheckCircle className="h-8 w-8 text-cyan-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.completedBookings}</div>
                <div className="text-sm text-gray-600">完成預訂</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近活動 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">最近活動</h2>
          </div>
          
          <div className="p-6">
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
                    <p className={`text-sm ${getActivityStatusColor(activity.status)}`}>
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
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">快捷操作</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              <Link 
                href="/admin/users"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-[#cfdbe9] transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">用戶管理</div>
                    <div className="text-sm text-gray-600">管理所有用戶帳戶</div>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </Link>

              <Link 
                href="/admin/services"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-[#cfdbe9] transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">服務審核</div>
                    <div className="text-sm text-gray-600">審核待處理的服務</div>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {stats.pendingServices}
                </span>
              </Link>

              <Link 
                href="/admin/reviews"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-[#cfdbe9] transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Star className="h-6 w-6 text-yellow-600" />
                  <div>
                    <div className="font-medium text-gray-900">評論管理</div>
                    <div className="text-sm text-gray-600">管理用戶評論</div>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {stats.pendingReviews}
                </span>
              </Link>

              <Link 
                href="/admin/support"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-[#cfdbe9] transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <div className="font-medium text-gray-900">客服工單</div>
                    <div className="text-sm text-gray-600">處理用戶支援請求</div>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {stats.activeTickets}
                </span>
              </Link>

              <Link 
                href="/admin/analytics"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-[#cfdbe9] transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">數據分析</div>
                    <div className="text-sm text-gray-600">查看詳細統計報告</div>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}