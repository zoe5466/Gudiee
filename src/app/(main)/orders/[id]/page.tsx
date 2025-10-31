'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Calendar, Clock, Users, MapPin, Star, Phone, Mail, 
  CreditCard, Receipt, MessageCircle, CheckCircle, AlertCircle,
  Download, Eye, User
} from 'lucide-react';
import { useAuth } from '@/store/auth';

interface Order {
  id: string;
  orderNumber: string;
  serviceName: string;
  serviceImage: string;
  guideName: string;
  guideAvatar: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  rating?: {
    score: number;
    comment: string;
    ratedAt: string;
  };
}

interface OrderDetailsPageProps {
  params: { id: string };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchOrder();
  }, [isAuthenticated, params.id, router]);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      // Mock order data for demonstration
      const mockOrders: Record<string, Order> = {
        'order-001': {
          id: 'order-001',
          orderNumber: 'GD2024010001',
          serviceName: '台北101觀景台導覽',
          serviceImage: '/images/services/taipei101.jpg',
          guideName: '張小美',
          guideAvatar: '/images/guides/guide1.jpg',
          date: '2024-01-15',
          startTime: '14:00',
          endTime: '17:00',
          location: '台北101',
          participants: 2,
          price: 1500,
          status: 'confirmed',
          createdAt: '2024-01-10T10:00:00Z',
          customerName: user?.name || '顧客姓名',
          customerEmail: user?.email || 'customer@example.com',
          customerPhone: user?.profile?.phone || '0912345678',
          specialRequests: '請準備舒適的鞋子，希望能拍照留念',
        },
        'order-002': {
          id: 'order-002',
          orderNumber: 'GD2024010002',
          serviceName: '九份老街文化之旅',
          serviceImage: '/images/services/jiufen.jpg',
          guideName: '李大明',
          guideAvatar: '/images/guides/guide2.jpg',
          date: '2024-01-20',
          startTime: '09:00',
          endTime: '15:00',
          location: '九份老街',
          participants: 4,
          price: 2000,
          status: 'pending',
          createdAt: '2024-01-12T15:30:00Z',
          customerName: user?.name || '顧客姓名',
          customerEmail: user?.email || 'customer@example.com',
          customerPhone: user?.profile?.phone || '0912345678',
        },
        'order-003': {
          id: 'order-003',
          orderNumber: 'GD2024010003',
          serviceName: '淡水夕陽攝影導覽',
          serviceImage: '/images/services/tamsui.jpg',
          guideName: '王小華',
          guideAvatar: '/images/guides/guide3.jpg',
          date: '2024-01-08',
          startTime: '17:00',
          endTime: '19:00',
          location: '淡水漁人碼頭',
          participants: 1,
          price: 1200,
          status: 'completed',
          createdAt: '2024-01-05T12:00:00Z',
          customerName: user?.name || '顧客姓名',
          customerEmail: user?.email || 'customer@example.com',
          customerPhone: user?.profile?.phone || '0912345678',
          rating: {
            score: 5,
            comment: '非常棒的體驗！導遊專業又親切，拍到了很棒的夕陽照片。',
            ratedAt: '2024-01-09T20:00:00Z'
          }
        }
      };

      const foundOrder = mockOrders[params.id];
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError('訂單不存在');
      }
    } catch (err) {
      setError('載入訂單失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { text: '已確認', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'pending':
        return { text: '待確認', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle };
      case 'completed':
        return { text: '已完成', color: 'bg-blue-100 text-blue-800', icon: CheckCircle };
      case 'cancelled':
        return { text: '已取消', color: 'bg-red-100 text-red-800', icon: AlertCircle };
      default:
        return { text: '未知', color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入訂單詳情中...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || '訂單不存在'}
          </h2>
          <p className="text-gray-600 mb-6">
            無法載入訂單詳情，請稍後再試
          </p>
          <button
            onClick={() => router.push('/orders')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回訂單列表
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  訂單詳情
                </h1>
                <p className="text-sm text-gray-600">
                  {order.orderNumber}
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
              <StatusIcon className="w-4 h-4" />
              {statusInfo.text}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要內容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 服務資訊 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">服務資訊</h2>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  {order.serviceImage ? (
                    <img
                      src={order.serviceImage}
                      alt={order.serviceName}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    <MapPin className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {order.serviceName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                      {order.guideAvatar ? (
                        <img
                          src={order.guideAvatar}
                          alt={order.guideName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                    導遊：{order.guideName}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(order.date).toLocaleDateString('zh-TW')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{order.startTime} - {order.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{order.participants} 位旅客</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{order.location}</span>
                </div>
              </div>

              {order.specialRequests && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-1">特殊需求</h4>
                  <p className="text-sm text-blue-800">{order.specialRequests}</p>
                </div>
              )}
            </div>

            {/* 客戶資訊 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">客戶資訊</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <div className="text-sm text-gray-900">{order.customerName}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {order.customerEmail}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">電話號碼</label>
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {order.customerPhone}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">訂單建立時間</label>
                  <div className="text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleString('zh-TW')}
                  </div>
                </div>
              </div>
            </div>

            {/* 評價資訊 */}
            {order.rating && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-yellow-900 mb-4">服務評價</h2>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= order.rating!.score 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-yellow-800">
                    {order.rating.score} 分
                  </span>
                  <span className="text-xs text-yellow-600 ml-2">
                    {new Date(order.rating.ratedAt).toLocaleDateString('zh-TW')}
                  </span>
                </div>
                {order.rating.comment && (
                  <p className="text-sm text-yellow-800">{order.rating.comment}</p>
                )}
              </div>
            )}
          </div>

          {/* 側邊欄 */}
          <div className="space-y-6">
            {/* 價格資訊 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                價格資訊
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">服務費用</span>
                  <span className="text-gray-900">NT$ {order.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">人數</span>
                  <span className="text-gray-900">{order.participants} 人</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-base font-semibold">
                    <span className="text-gray-900">總計</span>
                    <span className="text-gray-900">NT$ {order.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">操作</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/messages`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  聯繫導遊
                </button>
                
                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  下載收據
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  列印訂單
                </button>

                {order.status === 'completed' && !order.rating && (
                  <button
                    onClick={() => router.push(`/bookings/${order.id}/review`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    評價服務
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}