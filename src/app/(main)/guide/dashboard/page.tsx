'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Users, 
  Star, 
  Calendar, 
  MapPin, 
  MessageCircle,
  DollarSign,
  Clock,
  Eye,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  ArrowUpRight,
  BarChart3,
  Filter,
  Bell,
  Settings
} from 'lucide-react';
import { useAuth } from '@/store/auth';
import { useToast } from '@/components/ui/toast';
import { Loading } from '@/components/ui/loading';

interface DashboardStats {
  todayEarnings: number;
  monthlyOrders: number;
  customerRating: number;
  unreadMessages: number;
  totalEarnings: number;
  completionRate: number;
  responseTime: string;
  totalServices: number;
}

interface TodaySchedule {
  id: string;
  title: string;
  customer: string;
  time: string;
  duration: number;
  price: number;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  location: string;
}

interface RecentReview {
  id: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  serviceTitle: string;
  createdAt: string;
}

interface PendingAction {
  id: string;
  type: 'booking_request' | 'message' | 'review_response' | 'schedule_conflict';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export default function GuideDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { error } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todaySchedule, setTodaySchedule] = useState<TodaySchedule[]>([]);
  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'today' | 'week' | 'month'>('today');

  // 檢查認證狀態
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    loadDashboardData();
  }, [isAuthenticated, router]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // TODO: 實際 API 調用
      const mockStats: DashboardStats = {
        todayEarnings: 2400,
        monthlyOrders: 28,
        customerRating: 4.9,
        unreadMessages: 3,
        totalEarnings: 28500,
        completionRate: 98,
        responseTime: '30分鐘',
        totalServices: 156
      };

      const mockSchedule: TodaySchedule[] = [
        {
          id: 'schedule-1',
          title: '台北101 & 信義區導覽',
          customer: '王小華',
          time: '14:00 - 17:00',
          duration: 3,
          price: 1500,
          status: 'in_progress',
          location: '台北101'
        },
        {
          id: 'schedule-2',
          title: '夜市美食體驗',
          customer: '李美玲',
          time: '19:00 - 21:00',
          duration: 2,
          price: 800,
          status: 'upcoming',
          location: '士林夜市'
        }
      ];

      const mockReviews: RecentReview[] = [
        {
          id: 'review-1',
          customerName: '王小華',
          customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          rating: 5,
          comment: '張導遊非常專業，帶我們走訪了很多私房景點，講解也很詳細有趣！',
          serviceTitle: '台北文化深度游',
          createdAt: '2024-01-16T10:30:00Z'
        },
        {
          id: 'review-2',
          customerName: '李美玲',
          customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          rating: 5,
          comment: '行程安排很棒，時間控制得很好，推薦的餐廳也很道地！',
          serviceTitle: '夜市美食探索',
          createdAt: '2024-01-15T16:20:00Z'
        }
      ];

      const mockPendingActions: PendingAction[] = [
        {
          id: 'action-1',
          type: 'booking_request',
          title: '新的預訂請求',
          description: '陳先生想要預訂九份一日遊，2024年1月25日',
          priority: 'high',
          createdAt: '2024-01-16T09:30:00Z'
        },
        {
          id: 'action-2',
          type: 'message',
          title: '客戶詢問',
          description: '張小姐詢問淡水行程的詳細內容',
          priority: 'medium',
          createdAt: '2024-01-16T08:15:00Z'
        }
      ];

      setStats(mockStats);
      setTodaySchedule(mockSchedule);
      setRecentReviews(mockReviews);
      setPendingActions(mockPendingActions);
    } catch (err) {
      error('載入失敗', '無法載入儀表板數據');
    } finally {
      setIsLoading(false);
    }
  };

  const getScheduleStatusColor = (status: TodaySchedule['status']) => {
    const colorMap = {
      upcoming: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colorMap[status];
  };

  const getScheduleStatusText = (status: TodaySchedule['status']) => {
    const textMap = {
      upcoming: '即將開始',
      in_progress: '進行中',
      completed: '已完成',
      cancelled: '已取消'
    };
    return textMap[status];
  };

  const getPriorityColor = (priority: PendingAction['priority']) => {
    const colorMap = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return colorMap[priority];
  };

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
        {/* 頁面標題和快捷操作 */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              歡迎回來，{user?.name || '地陪朋友'} 👋
            </h1>
            <p className="text-gray-600">今天準備迎接新的旅客了嗎？</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
            >
              <option value="today">今日</option>
              <option value="week">本週</option>
              <option value="month">本月</option>
            </select>
            
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => router.push('/guide/services/create')}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF5A5F] text-white rounded-lg hover:bg-[#E1464A] transition-colors"
            >
              <Plus className="w-4 h-4" />
              新增服務
            </button>
          </div>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">今日收入</p>
                <p className="text-2xl font-bold text-gray-900">NT$ {stats?.todayEarnings.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12% 比昨日
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">本月訂單</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.monthlyOrders}</p>
                <p className="text-sm text-blue-600 mt-2 flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  +8% 比上月
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">客戶評分</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.customerRating}</p>
                <p className="text-sm text-yellow-600 mt-2 flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  {stats?.completionRate}% 完成率
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600 fill-current" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">未讀訊息</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.unreadMessages}</p>
                <p className="text-sm text-purple-600 mt-2">
                  平均回覆：{stats?.responseTime}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 待處理事項 */}
        {pendingActions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                待處理事項 ({pendingActions.length})
              </h3>
              <button className="text-sm text-[#FF5A5F] hover:text-[#E1464A] transition-colors">
                查看全部
              </button>
            </div>
            <div className="space-y-3">
              {pendingActions.slice(0, 3).map((action) => (
                <div key={action.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{action.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}>
                        {action.priority === 'high' ? '高' : action.priority === 'medium' ? '中' : '低'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{action.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(action.createdAt).toLocaleString('zh-TW')}
                    </p>
                  </div>
                  <button className="ml-4 px-3 py-1 text-sm bg-[#FF5A5F] text-white rounded hover:bg-[#E1464A] transition-colors">
                    處理
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 主要內容區域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 今日行程 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 text-[#FF5A5F] mr-2" />
                  今日行程
                </h3>
                <button
                  onClick={() => router.push('/guide/orders')}
                  className="text-sm text-[#FF5A5F] hover:text-[#E1464A] transition-colors flex items-center gap-1"
                >
                  查看全部
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                {todaySchedule.length > 0 ? (
                  <div className="space-y-4">
                    {todaySchedule.map((schedule) => (
                      <div key={schedule.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                          <MapPin className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900">{schedule.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScheduleStatusColor(schedule.status)}`}>
                              {getScheduleStatusText(schedule.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{schedule.time} • {schedule.customer}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {schedule.location}
                            </span>
                            <span className="text-sm font-medium text-[#FF5A5F]">
                              NT$ {schedule.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <button className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">今日暫無行程</h4>
                    <p className="text-gray-600 mb-4">享受一個輕鬆的日子，或者查看明日安排</p>
                    <button className="text-[#FF5A5F] hover:text-[#E1464A] transition-colors">
                      查看明日行程
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 側邊欄 */}
          <div className="space-y-6">
            {/* 最新評價 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2 fill-current" />
                  最新評價
                </h3>
                <button className="text-sm text-[#FF5A5F] hover:text-[#E1464A] transition-colors">
                  查看全部
                </button>
              </div>
              <div className="p-6">
                {recentReviews.length > 0 ? (
                  <div className="space-y-4">
                    {recentReviews.slice(0, 2).map((review) => (
                      <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center mb-3">
                          <img
                            src={review.customerAvatar}
                            alt={review.customerName}
                            className="w-8 h-8 rounded-full object-cover mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{review.customerName}</div>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          &ldquo;{review.comment}&rdquo;
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {review.serviceTitle} • {new Date(review.createdAt).toLocaleDateString('zh-TW')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">暫無新評價</p>
                  </div>
                )}
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/guide/messages')}
                  className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:border-[#FF5A5F] hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <MessageCircle className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-900">查看訊息</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </button>
                
                <button
                  onClick={() => router.push('/guide/orders')}
                  className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:border-[#FF5A5F] hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-900">管理訂單</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </button>
                
                <button
                  onClick={() => router.push('/guide/account')}
                  className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:border-[#FF5A5F] hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-900">帳戶設定</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </button>
                
                <button
                  onClick={() => router.push('/guide/analytics')}
                  className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:border-[#FF5A5F] hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-900">數據分析</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}