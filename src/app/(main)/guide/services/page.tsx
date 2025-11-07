'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Trash2, 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  DollarSign,
  MoreVertical,
  Filter,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/store/auth';

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  price: number;
  duration: string;
  maxParticipants: number;
  images: string[];
  status: 'active' | 'inactive' | 'draft';
  rating: number;
  reviewCount: number;
  bookingCount: number;
  createdAt: string;
  lastModified: string;
}

export default function GuideServicesPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (user?.role !== 'guide') {
      router.push('/');
      return;
    }

    // 檢查是否完成KYC驗證
    if (!user?.isKYCVerified) {
      router.push('/kyc');
      return;
    }

    // 檢查是否完成良民證驗證（新增）
    if (!user?.isCriminalRecordVerified) {
      router.push('/kyc');
      return;
    }
    
    fetchServices();
  }, [isAuthenticated, user, router]);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      // Mock services data for demonstration
      const mockServices: Service[] = [
        {
          id: 'service-001',
          title: '台北101觀景台導覽',
          description: '專業導遊帶您登上台北101觀景台，欣賞台北市360度全景，分享台北的歷史文化與現代發展。',
          category: '觀光導覽',
          location: '台北101',
          price: 1500,
          duration: '3小時',
          maxParticipants: 8,
          images: ['/images/services/taipei101-1.jpg', '/images/services/taipei101-2.jpg'],
          status: 'active',
          rating: 4.8,
          reviewCount: 47,
          bookingCount: 128,
          createdAt: '2024-01-01T10:00:00Z',
          lastModified: '2024-01-15T14:30:00Z'
        },
        {
          id: 'service-002',
          title: '九份老街文化之旅',
          description: '探索九份的黃金歲月，品嘗在地小吃，體驗傳統茶館文化，欣賞山城美景。',
          category: '文化體驗',
          location: '九份老街',
          price: 2000,
          duration: '6小時',
          maxParticipants: 6,
          images: ['/images/services/jiufen-1.jpg'],
          status: 'active',
          rating: 4.9,
          reviewCount: 32,
          bookingCount: 85,
          createdAt: '2024-01-05T09:00:00Z',
          lastModified: '2024-01-20T11:15:00Z'
        },
        {
          id: 'service-003',
          title: '淡水夕陽攝影導覽',
          description: '專業攝影師帶您到淡水最佳攝影點，捕捉絕美夕陽景色，學習攝影技巧。',
          category: '攝影教學',
          location: '淡水漁人碼頭',
          price: 1200,
          duration: '4小時',
          maxParticipants: 4,
          images: ['/images/services/tamsui-1.jpg'],
          status: 'inactive',
          rating: 4.7,
          reviewCount: 18,
          bookingCount: 45,
          createdAt: '2024-01-10T16:00:00Z',
          lastModified: '2024-01-22T09:45:00Z'
        },
        {
          id: 'service-004',
          title: '台北夜市美食探索',
          description: '帶您深入台北最道地的夜市，品嘗經典小吃，了解台灣飲食文化。',
          category: '美食體驗',
          location: '士林夜市',
          price: 800,
          duration: '3小時',
          maxParticipants: 10,
          images: [],
          status: 'draft',
          rating: 0,
          reviewCount: 0,
          bookingCount: 0,
          createdAt: '2024-01-25T20:00:00Z',
          lastModified: '2024-01-25T20:00:00Z'
        }
      ];
      
      setServices(mockServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      case 'popular':
        return b.bookingCount - a.bookingCount;
      case 'rating':
        return b.rating - a.rating;
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      default:
        return 0;
    }
  });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { text: '已發布', color: 'bg-green-100 text-green-800' };
      case 'inactive':
        return { text: '已暫停', color: 'bg-red-100 text-red-800' };
      case 'draft':
        return { text: '草稿', color: 'bg-gray-100 text-gray-800' };
      default:
        return { text: '未知', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (confirm('確定要刪除這個服務嗎？此操作無法復原。')) {
      // 這裡應該調用 API 刪除服務
      setServices(services.filter(s => s.id !== serviceId));
    }
  };

  const handleToggleStatus = async (serviceId: string) => {
    // 這裡應該調用 API 切換服務狀態
    setServices(services.map(s => 
      s.id === serviceId 
        ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' as any }
        : s
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入服務列表中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">我的服務</h1>
              <p className="text-gray-600 mt-1">管理您發布的導覽服務</p>
            </div>
            <button
              onClick={() => router.push('/guide/services/create')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              新增服務
            </button>
          </div>
        </div>

        {/* 搜尋和篩選 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 搜尋框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜尋服務名稱、描述或地點..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 狀態篩選 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">所有狀態</option>
              <option value="active">已發布</option>
              <option value="inactive">已暫停</option>
              <option value="draft">草稿</option>
            </select>

            {/* 排序 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">最近更新</option>
              <option value="popular">預訂數量</option>
              <option value="rating">評分高低</option>
              <option value="price-high">價格高到低</option>
              <option value="price-low">價格低到高</option>
            </select>
          </div>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">總服務數</p>
                <p className="text-2xl font-semibold text-gray-900">{services.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">已發布</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {services.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">總預訂數</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {services.reduce((sum, s) => sum + s.bookingCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">平均評分</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {(services.filter(s => s.rating > 0).reduce((sum, s) => sum + s.rating, 0) / 
                    services.filter(s => s.rating > 0).length || 0).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 服務列表 */}
        {sortedServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? '沒有找到符合條件的服務' : '尚未建立任何服務'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? '嘗試調整搜尋條件或篩選器' 
                : '開始建立您的第一個導覽服務吧！'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => router.push('/guide/services/create')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                建立服務
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedServices.map((service) => {
              const statusInfo = getStatusInfo(service.status);
              
              return (
                <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-6">
                    {/* 服務圖片 */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        {service.images.length > 0 ? (
                          <img
                            src={service.images[0]}
                            alt={service.title}
                            className="w-full h-full rounded-lg object-cover"
                          />
                        ) : (
                          <MapPin className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* 服務資訊 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {service.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.text}
                          </span>
                          <div className="relative">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{service.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>NT$ {service.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>最多 {service.maxParticipants} 人</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {service.rating > 0 ? (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span>{service.rating.toFixed(1)} ({service.reviewCount} 評價)</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">尚無評價</span>
                          )}
                          <span>{service.bookingCount} 次預訂</span>
                          <span>更新於 {new Date(service.lastModified).toLocaleDateString('zh-TW')}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/services/${service.id}`)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            預覽
                          </button>
                          <button
                            onClick={() => router.push(`/guide/services/${service.id}/edit`)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            編輯
                          </button>
                          <button
                            onClick={() => handleToggleStatus(service.id)}
                            className={`px-3 py-1.5 text-sm rounded transition-colors ${
                              service.status === 'active'
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                          >
                            {service.status === 'active' ? '暫停' : '啟用'}
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            刪除
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}