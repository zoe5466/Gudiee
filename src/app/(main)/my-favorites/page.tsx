// 我的收藏頁面組件
// 功能：顯示用戶收藏的地陪服務，支援篩選和管理收藏項目
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Search, Filter, Star, MapPin, Clock, Users, Grid, List } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { useToast } from '@/components/ui/toast';
import { Loading } from '@/components/ui/loading';
import { SimpleNavigation } from '@/components/layout/page-navigation';

// 收藏項目介面定義
interface FavoriteItem {
  id: string;
  serviceId: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  duration: string;
  maxGuests: number;
  image: string;
  guideName: string;
  guideAvatar: string;
  tags: string[];
  addedAt: string;
}

/**
 * 我的收藏頁面主組件
 */
export default function MyFavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { success, error } = useToast();

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isInitializing, setIsInitializing] = useState(true);

  // Wait for authentication initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 檢查用戶是否已登入
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push('/auth/login?redirect=/my-favorites');
      return;
    }
    
    // 載入收藏資料
    if (!isInitializing && isAuthenticated) {
      loadFavorites();
    }
  }, [isInitializing, isAuthenticated, router]);

  // 載入收藏資料
  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      // TODO: 實際的 API 調用
      // const response = await fetch('/api/user/favorites');
      // const data = await response.json();
      
      // 模擬資料
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockFavorites: FavoriteItem[] = [
        {
          id: 'fav-1',
          serviceId: 'service-1',
          title: '台北101 & 信義區深度導覽',
          location: '台北市信義區',
          price: 800,
          rating: 4.9,
          reviewCount: 127,
          duration: '4小時',
          maxGuests: 6,
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          guideName: '張小美',
          guideAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          tags: ['歷史文化', '建築'],
          addedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 'fav-2',
          serviceId: 'service-2',
          title: '九份老街 & 金瓜石礦業遺址',
          location: '新北市瑞芳區',
          price: 1000,
          rating: 4.8,
          reviewCount: 89,
          duration: '6小時',
          maxGuests: 4,
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          guideName: '李大明',
          guideAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          tags: ['歷史文化', '美食'],
          addedAt: '2024-01-20T14:15:00Z'
        }
      ];
      
      setFavorites(mockFavorites);
      setFilteredFavorites(mockFavorites);
    } catch (err) {
      error('載入失敗', '無法載入收藏清單，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  // 移除收藏
  const removeFavorite = async (favoriteId: string) => {
    try {
      // TODO: API 調用
      // await fetch(`/api/user/favorites/${favoriteId}`, { method: 'DELETE' });
      
      setFavorites(prev => prev.filter(item => item.id !== favoriteId));
      setFilteredFavorites(prev => prev.filter(item => item.id !== favoriteId));
      success('移除成功', '已從收藏清單中移除');
    } catch (err) {
      error('移除失敗', '無法移除收藏，請稍後再試');
    }
  };

  // 搜尋和篩選
  useEffect(() => {
    let filtered = favorites;

    // 搜尋篩選
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.guideName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 分類篩選
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.tags.includes(selectedCategory)
      );
    }

    setFilteredFavorites(filtered);
  }, [searchQuery, selectedCategory, favorites]);

  // 檢查認證狀態
  if (isInitializing || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)' 
    }}>
      <SimpleNavigation />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的收藏</h1>
          <p className="text-gray-600">管理您收藏的地陪服務</p>
        </div>

        {/* 搜尋和篩選 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* 搜尋欄 */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜尋收藏的服務..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
              />
            </div>

            {/* 分類篩選 */}
            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
              >
                <option value="all">所有分類</option>
                <option value="歷史文化">歷史文化</option>
                <option value="美食">美食</option>
                <option value="自然">自然</option>
                <option value="建築">建築</option>
              </select>

              {/* 檢視模式切換 */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 收藏清單 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loading size="lg" />
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || selectedCategory !== 'all' ? '找不到符合條件的收藏' : '還沒有收藏任何服務'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== 'all' 
                ? '試試調整搜尋條件或篩選器' 
                : '開始探索並收藏您喜歡的地陪服務吧！'
              }
            </p>
            <button
              onClick={() => router.push('/search')}
              className="btn btn-primary"
            >
              探索服務
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredFavorites.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* 服務圖片 */}
                <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => router.push(`/services/${item.serviceId}`)}
                  />
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* 服務資訊 */}
                <div className="p-4 flex-1">
                  <h3 
                    className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-[#FF5A5F] transition-colors"
                    onClick={() => router.push(`/services/${item.serviceId}`)}
                  >
                    {item.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {item.location}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                        {item.rating} ({item.reviewCount})
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {item.duration}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        最多 {item.maxGuests} 人
                      </div>
                    </div>
                  </div>

                  {/* 標籤 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 價格和導遊 */}
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-900">
                      NT$ {item.price.toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <img
                        src={item.guideAvatar}
                        alt={item.guideName}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      {item.guideName}
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => router.push(`/services/${item.serviceId}`)}
                      className="w-full btn btn-primary btn-sm"
                    >
                      查看詳情
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 統計資訊 */}
        {!isLoading && filteredFavorites.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            共 {filteredFavorites.length} 個收藏
          </div>
        )}
      </div>
    </div>
  );
}