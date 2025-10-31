'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  Star, 
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react';

interface Order {
  id: string;
  serviceTitle: string;
  guideId: string;
  guideName: string;
  guideAvatar?: string;
  date: string;
  time: string;
  location: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  participants: number;
  createdAt: string;
  notes?: string;
}

export default function OrdersPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // Mock data for orders
      const mockOrders: Order[] = [
        {
          id: 'order-001',
          serviceTitle: '台北101觀景台導覽',
          guideId: 'guide-001',
          guideName: '張小美',
          guideAvatar: '/images/guides/guide1.jpg',
          date: '2024-01-15',
          time: '14:00',
          location: '台北101',
          price: 1500,
          status: 'confirmed',
          participants: 2,
          createdAt: '2024-01-10T10:00:00Z',
          notes: '請準備舒適的鞋子'
        },
        {
          id: 'order-002',
          serviceTitle: '九份老街文化之旅',
          guideId: 'guide-002',
          guideName: '李大明',
          guideAvatar: '/images/guides/guide2.jpg',
          date: '2024-01-20',
          time: '09:00',
          location: '九份老街',
          price: 2000,
          status: 'pending',
          participants: 4,
          createdAt: '2024-01-12T15:30:00Z'
        },
        {
          id: 'order-003',
          serviceTitle: '淡水夕陽攝影導覽',
          guideId: 'guide-003',
          guideName: '王小華',
          guideAvatar: '/images/guides/guide3.jpg',
          date: '2024-01-08',
          time: '17:00',
          location: '淡水漁人碼頭',
          price: 1200,
          status: 'completed',
          participants: 1,
          createdAt: '2024-01-05T12:00:00Z'
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '已確認';
      case 'pending':
        return '待確認';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return '未知';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入訂單資料中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">我的訂單</h1>
          </div>
          <p className="text-gray-600">管理您的服務預訂記錄</p>
        </div>

        {/* 狀態篩選器 */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { key: 'all', label: '全部' },
              { key: 'pending', label: '待確認' },
              { key: 'confirmed', label: '已確認' },
              { key: 'completed', label: '已完成' },
              { key: 'cancelled', label: '已取消' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedStatus(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedStatus === filter.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* 訂單列表 */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {selectedStatus === 'all' ? '尚無訂單' : `無${getStatusText(selectedStatus)}訂單`}
            </h3>
            <p className="text-gray-500 mb-6">
              {selectedStatus === 'all' 
                ? '探索我們的服務，開始您的第一次預訂吧！' 
                : '切換篩選條件查看其他狀態的訂單'}
            </p>
            <button
              onClick={() => router.push('/explore')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              探索服務
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* 左側：服務資訊 */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {order.serviceTitle}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>訂單編號：{order.id}</span>
                          <span>•</span>
                          <span>{new Date(order.createdAt).toLocaleDateString('zh-TW')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>

                    {/* 導遊資訊 */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {order.guideAvatar ? (
                          <img 
                            src={order.guideAvatar} 
                            alt={order.guideName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.guideName}</p>
                        <p className="text-sm text-gray-500">專業導遊</p>
                      </div>
                    </div>

                    {/* 詳細資訊 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(order.date).toLocaleDateString('zh-TW')} {order.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{order.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{order.participants} 人</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium text-blue-600">NT$ {order.price.toLocaleString()}</span>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>備註：</strong>{order.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 右側：操作按鈕 */}
                  <div className="flex flex-row sm:flex-col gap-2 sm:w-32">
                    <button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      查看詳情
                    </button>
                    
                    {order.status === 'completed' && (
                      <button
                        onClick={() => router.push(`/bookings/${order.id}/review`)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                      >
                        <Star className="w-4 h-4" />
                        評價
                      </button>
                    )}
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