// 搜尋結果頁面組件
// 功能：顯示服務搜尋結果、提供篩選和排序、支援格子檢視和地圖檢視、智能推薦等
'use client';

import { useState, useEffect, useCallback } from 'react'; // React Hooks
import { useRouter, useSearchParams } from 'next/navigation'; // Next.js 路由和查詢參數
import { Search, MapPin, Filter, Star, Clock, Users, Heart, Loader2, SlidersHorizontal, Map, Grid3X3, Sparkles, TrendingUp } from 'lucide-react'; // 圖標組件
import { Button } from '@/components/ui/button'; // 按鈕組件
import { Input } from '@/components/ui/input'; // 輸入框組件
import { Card, CardContent } from '@/components/ui/card'; // 卡片組件
import { Footer } from '@/components/layout/footer'; // 頁尾組件
import { useToast } from '@/components/ui/toast'; // 提示訊息組件
import { Loading } from '@/components/ui/loading'; // 載入組件
import { ReviewsSummary } from '@/components/reviews/reviews-summary'; // 評論摘要組件
import { InteractiveMap } from '@/components/map/interactive-map'; // 互動地圖組件
import { AdvancedSearch } from '@/components/search/advanced-search'; // 進階搜尋組件

// 搜尋篩選條件介面定義
interface SearchFilters {
  query: string; // 搜尋關鍵字
  location: string; // 地點篩選
  date: string; // 日期篩選
  guests: number; // 旅客人數
  minPrice: number; // 最低價格
  maxPrice: number; // 最高價格
  minRating: number; // 最低評分
  category: string; // 服務分類
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest'; // 排序方式
}

// 搜尋結果介面定義
interface SearchResult {
  total: number; // 結果總數
  services: ServiceCardProps[]; // 服務列表
  hasMore: boolean; // 是否有更多結果
}

// 服務卡片屬性介面定義
interface ServiceCardProps {
  id: string; // 服務 ID
  title: string; // 服務標題
  location: string; // 服務地點
  price: number; // 服務價格
  rating: number; // 服務評分
  reviewCount: number; // 評論數量
  duration: string; // 服務時長
  maxGuests: number; // 最大旅客數
  image: string; // 服務圖片
  guideName: string; // 導遊姓名
  guideAvatar: string; // 導遊頭像
  isLiked?: boolean; // 是否收藏（可選）
  selectedLocationId?: string | null; // 選中的地點 ID（用於地圖檢視）
}

/**
 * 服務卡片組件
 * 顯示單個服務的詳細資訊，包含圖片、標題、評分、價格、導遊資訊等
 * 支援收藏功能和點擊查看詳情
 */
const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  location,
  price,
  rating,
  reviewCount,
  duration,
  maxGuests,
  image,
  guideName,
  guideAvatar,
  isLiked = false,
  selectedLocationId = null
}) => {
  const router = useRouter();
  const [liked, setLiked] = useState(isLiked); // 本地收藏狀態

  // 處理卡片點擊事件，導航到服務詳情頁
  const handleCardClick = () => {
    router.push(`/services/${id}`);
  };

  // 處理收藏按鈕點擊事件
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止觸發卡片點擊事件
    setLiked(!liked);
    // TODO: 實際的收藏/取消收藏 API 呼叫
  };

  return (
    <Card 
      id={`service-${id}`}
      style={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        borderRadius: '1rem',
        border: selectedLocationId === id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
        boxShadow: selectedLocationId === id ? '0 10px 15px -3px rgba(59, 130, 246, 0.2)' : undefined
      }}
      className="group hover:shadow-lg"
      onClick={handleCardClick}
    >
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img 
          src={image} 
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          className="group-hover:scale-105"
        />
        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
          <button 
            onClick={handleLikeClick}
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              backgroundColor: liked ? '#ef4444' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              color: liked ? 'white' : '#6b7280',
              border: 'none',
              cursor: 'pointer'
            }}
            className="hover:bg-white"
          >
            <Heart style={{ width: '1rem', height: '1rem', fill: liked ? 'currentColor' : 'none' }} />
          </button>
        </div>
        {rating >= 4.8 && (
          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
            <span style={{
              backgroundColor: '#FF5A5F',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: '500',
              padding: '0.25rem 0.5rem',
              borderRadius: '9999px'
            }}>
              熱門推薦
            </span>
          </div>
        )}
      </div>
      
      <CardContent style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem', lineHeight: '1.4' }}>
              {title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280', fontSize: '0.875rem' }}>
              <MapPin style={{ width: '0.75rem', height: '0.75rem' }} />
              <span>{location}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827' }}>
              NT$ {price.toLocaleString()}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>每小時</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '1rem' }}>
          <ReviewsSummary serviceId={id} className="text-sm" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#6b7280' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock style={{ width: '0.75rem', height: '0.75rem' }} />
              <span>{duration}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Users style={{ width: '0.75rem', height: '0.75rem' }} />
              <span>最多 {maxGuests} 人</span>
            </div>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          paddingTop: '0.75rem', 
          borderTop: '1px solid #f3f4f6' 
        }}>
          <img 
            src={guideAvatar} 
            alt={guideName}
            style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{guideName}</span>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * 搜尋結果頁面主組件
 * 
 * 功能：
 * - 顯示搜尋結果列表或地圖檢視
 * - 提供篩選和排序功能
 * - 支援進階搜尋
 * - 智能推薦系統
 * - 分頁載入更多結果
 * - URL 參數管理
 */
export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // 從 URL 獲取查詢參數
  const { error } = useToast(); // 錯誤提示功能
  
  // 篩選條件狀態，從 URL 參數初始化
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    date: searchParams.get('date') || '',
    guests: parseInt(searchParams.get('guests') || '2'),
    minPrice: parseInt(searchParams.get('minPrice') || '0'),
    maxPrice: parseInt(searchParams.get('maxPrice') || '5000'),
    minRating: parseFloat(searchParams.get('minRating') || '0'),
    category: searchParams.get('category') || '',
    sortBy: (searchParams.get('sortBy') as SearchFilters['sortBy']) || 'relevance'
  });
  
  // 搜尋結果狀態
  const [searchResult, setSearchResult] = useState<SearchResult>({
    total: 0,
    services: [],
    hasMore: false
  });
  
  // UI 狀態
  const [isLoading, setIsLoading] = useState(false); // 主要載入狀態
  const [showFilters, setShowFilters] = useState(false); // 是否顯示篩選面板
  const [page, setPage] = useState(1); // 目前頁碼
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 載入更多狀態
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid'); // 檢視模式
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null); // 地圖檢視中選中的地點
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false); // 是否顯示進階搜尋
  const [recommendations, setRecommendations] = useState<ServiceCardProps[]>([]); // 智能推薦結果

  /**
   * 將搜尋結果轉換為地圖位置資料
   * 用於在互動地圖上顯示服務位置
   */
  const getMapLocations = useCallback(() => {
    return searchResult.services.map((service, index) => ({
      id: service.id,
      name: service.title,
      latitude: 25.0330 + (Math.random() - 0.5) * 0.1, // 模擬台北附近的座標
      longitude: 121.5654 + (Math.random() - 0.5) * 0.1,
      type: 'service' as const,
      description: `${service.guideName} • ${service.duration} • ${service.maxGuests} 人`,
      image: service.image,
      price: service.price,
      rating: service.rating,
      category: service.location
    }));
  }, [searchResult.services]);

  /**
   * 處理地圖上位置選擇事件
   * 在格子檢視模式下會滾動到對應的服務卡片
   */
  const handleLocationSelect = useCallback((location: any) => {
    setSelectedLocationId(location.id);
    // 在格子檢視模式下滾動到對應的服務卡片
    if (viewMode === 'grid') {
      const element = document.getElementById(`service-${location.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [viewMode]);

  // 模擬搜尋結果
  const mockSearchResults: ServiceCardProps[] = [
    {
      id: 'c1234567-1234-4567-8901-123456789001',
      title: '台北101 & 信義區深度導覽',
      location: '台北市信義區',
      price: 800,
      rating: 4.9,
      reviewCount: 127,
      duration: '4小時',
      maxGuests: 6,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      guideName: '小美',
      guideAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'c1234567-1234-4567-8901-123456789002',
      title: '九份老街 & 金瓜石礦業遺址',
      location: '新北市瑞芳區',
      price: 1000,
      rating: 4.8,
      reviewCount: 89,
      duration: '6小時',
      maxGuests: 4,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      guideName: '阿明',
      guideAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'c1234567-1234-4567-8901-123456789003',
      title: '日月潭環湖 & 邵族文化體驗',
      location: '南投縣魚池鄉',
      price: 1200,
      rating: 4.9,
      reviewCount: 156,
      duration: '8小時',
      maxGuests: 8,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      guideName: '小華',
      guideAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'c1234567-1234-4567-8901-123456789004',
      title: '高雄駁二藝術特區 & 愛河',
      location: '高雄市鹽埕區',
      price: 700,
      rating: 4.7,
      reviewCount: 94,
      duration: '3小時',
      maxGuests: 5,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      guideName: '阿強',
      guideAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'c1234567-1234-4567-8901-123456789005',
      title: '花蓮太魯閣峽谷探險',
      location: '花蓮縣秀林鄉',
      price: 1500,
      rating: 4.9,
      reviewCount: 203,
      duration: '10小時',
      maxGuests: 6,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      guideName: '小玲',
      guideAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'c1234567-1234-4567-8901-123456789006',
      title: '台南古蹟巡禮 & 美食探索',
      location: '台南市中西區',
      price: 900,
      rating: 4.8,
      reviewCount: 167,
      duration: '5小時',
      maxGuests: 4,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      guideName: '阿德',
      guideAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    }
  ];

  /**
   * 智能推薦算法
   * 基於用戶搜尋條件和偏好生成個人化推薦
   */
  const generateRecommendations = useCallback((currentFilters: SearchFilters): ServiceCardProps[] => {
    // 基於用戶搜索歷史和偏好的推薦邏輯
    const recommendations = mockSearchResults.filter(service => {
      // 推薦高評分服務（4.8星以上）
      if (service.rating >= 4.8) return true;
      
      // 推薦相似地點的服務
      if (currentFilters.location && service.location.includes(currentFilters.location)) return true;
      
      // 推薦適合人數的服務
      if (service.maxGuests >= currentFilters.guests) return true;
      
      return false;
    });
    
    // 按評分和受歡迎程度排序，取前3個
    return recommendations
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, []);

  /**
   * 更新 URL 查詢參數
   * 保持搜尋狀態與 URL 同步，支援書籤和分享
   */
  const updateURLParams = useCallback((newFilters: SearchFilters) => {
    const params = new URLSearchParams();
    
    // 將非空值加入查詢參數
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 0) {
        params.set(key, value.toString());
      }
    });
    
    const newURL = `/search${params.toString() ? '?' + params.toString() : ''}`;
    router.replace(newURL, { scroll: false }); // 不滾動頁面
  }, [router]);

  /**
   * 執行搜尋操作
   * 支援新搜尋和分頁載入更多
   */
  const performSearch = useCallback(async (newFilters: SearchFilters, pageNum: number = 1, append: boolean = false) => {
    // 設置載入狀態
    if (pageNum === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    
    try {
      // TODO: 實際 API 調用，目前使用模擬資料
      const mockResult = {
        total: mockSearchResults.length,
        services: filterMockResults(newFilters),
        hasMore: false
      };
      
      if (append && pageNum > 1) {
        // 追加結果到現有列表（分頁載入）
        setSearchResult(prev => ({
          ...mockResult,
          services: [...prev.services, ...mockResult.services]
        }));
      } else {
        // 新的搜尋結果
        setSearchResult(mockResult);
        // 生成智能推薦
        setRecommendations(generateRecommendations(newFilters));
      }
      
    } catch (err) {
      error('搜尋失敗', '無法載入搜尋結果，請稍後再試');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [error, generateRecommendations]);

  // 篩選模擬資料
  const filterMockResults = (filters: SearchFilters): ServiceCardProps[] => {
    return mockSearchResults.filter(service => {
      // 關鍵字搜尋
      if (filters.query) {
        const query = filters.query.toLowerCase();
        if (!service.title.toLowerCase().includes(query) && 
            !service.location.toLowerCase().includes(query) &&
            !service.guideName.toLowerCase().includes(query)) {
          return false;
        }
      }
      
      // 地點篩選
      if (filters.location && !service.location.includes(filters.location)) {
        return false;
      }
      
      // 價格範圍
      if (service.price < filters.minPrice || service.price > filters.maxPrice) {
        return false;
      }
      
      // 評分篩選
      if (service.rating < filters.minRating) {
        return false;
      }
      
      // 人數篩選
      if (service.maxGuests < filters.guests) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return 0; // 暫時不排序
        default:
          return 0;
      }
    });
  };

  // 更新篩選條件
  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setPage(1);
    updateURLParams(updatedFilters);
    performSearch(updatedFilters, 1);
  };

  // 處理進階搜尋
  const handleAdvancedSearch = (advancedFilters: any) => {
    const updatedFilters: SearchFilters = {
      ...filters,
      query: advancedFilters.query || '',
      location: advancedFilters.location || '',
      guests: advancedFilters.guests || 2,
      minPrice: advancedFilters.priceRange?.min || 0,
      maxPrice: advancedFilters.priceRange?.max || 5000,
      minRating: advancedFilters.rating || 0,
      category: advancedFilters.categories?.join(',') || '',
      sortBy: advancedFilters.sortBy || 'relevance'
    };
    
    setFilters(updatedFilters);
    setPage(1);
    setShowAdvancedSearch(false);
    updateURLParams(updatedFilters);
    performSearch(updatedFilters, 1);
  };

  // 初始載入
  useEffect(() => {
    performSearch(filters, 1);
    setRecommendations(generateRecommendations(filters));
  }, [performSearch, generateRecommendations]);

  // 載入更多結果
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    performSearch(filters, nextPage, true);
  };

  // 快速篩選按鈕
  const quickFilters = [
    { label: '高評分', key: 'rating', value: 4.5 },
    { label: '經濟實惠', key: 'price', value: { minPrice: 0, maxPrice: 800 } },
    { label: '一日遊', key: 'duration', value: '8小時' },
    { label: '小團體', key: 'guests', value: 4 }
  ];

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)'
      }}
    >
      <main style={{ minHeight: '100vh', paddingTop: '3rem' }}>
        {/* Search Header */}
        <div 
          style={{
            backgroundColor: 'white',
            borderBottom: '1px solid #e5e7eb',
            position: 'sticky',
            top: '0',
            zIndex: 40,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="sm:flex-row sm:items-center">
              {/* Search Bar */}
              <div style={{ flex: 1, maxWidth: '100%' }} className="sm:max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="搜尋地陪、景點或服務..."
                    value={filters.query}
                    onChange={(e) => updateFilters({ query: e.target.value })}
                    className="pl-12 pr-4 py-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F] w-full"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        performSearch(filters, 1);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Filter Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 border-gray-300 hover:border-[#FF5A5F] w-full sm:w-auto justify-center"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="sm:inline">基本篩選</span>
                  {Object.values(filters).some(v => v && v !== '' && v !== 0 && v !== 'relevance') && <span className="text-[#FF5A5F]">●</span>}
                </Button>
                
                <Button
                  variant={showAdvancedSearch ? 'default' : 'outline'}
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                  className="flex items-center gap-2 border-gray-300 hover:border-[#FF5A5F] w-full sm:w-auto justify-center"
                >
                  <Filter className="w-4 h-4" />
                  <span className="sm:inline">進階搜尋</span>
                </Button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              {quickFilters.map((filter) => (
                <button
                  key={filter.label}
                  onClick={() => {
                    if (filter.key === 'rating') {
                      updateFilters({ minRating: filter.value as number });
                    } else if (filter.key === 'price') {
                      const priceFilter = filter.value as { minPrice: number; maxPrice: number };
                      updateFilters(priceFilter);
                    } else if (filter.key === 'guests') {
                      updateFilters({ guests: filter.value as number });
                    }
                  }}
                  className="px-3 py-1 rounded-full border border-gray-300 text-sm text-gray-600 hover:border-[#FF5A5F] hover:text-[#FF5A5F] transition-colors"
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">地點</label>
                    <select
                      value={filters.location}
                      onChange={(e) => updateFilters({ location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
                    >
                      <option value="">所有地點</option>
                      <option value="台北市">台北市</option>
                      <option value="新北市">新北市</option>
                      <option value="台中市">台中市</option>
                      <option value="台南市">台南市</option>
                      <option value="高雄市">高雄市</option>
                      <option value="花蓮縣">花蓮縣</option>
                      <option value="南投縣">南投縣</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">日期</label>
                    <Input
                      type="date"
                      value={filters.date}
                      onChange={(e) => updateFilters({ date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full"
                    />
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">人數</label>
                    <select
                      value={filters.guests}
                      onChange={(e) => updateFilters({ guests: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num} 位</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">排序方式</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => updateFilters({ sortBy: e.target.value as SearchFilters['sortBy'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
                    >
                      <option value="relevance">相關性</option>
                      <option value="price_low">價格由低到高</option>
                      <option value="price_high">價格由高到低</option>
                      <option value="rating">評分由高到低</option>
                      <option value="newest">最新發布</option>
                    </select>
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">價格範圍 (NT$ {filters.minPrice} - NT$ {filters.maxPrice})</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">最低價格</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.minPrice || ''}
                        onChange={(e) => updateFilters({ minPrice: parseInt(e.target.value) || 0 })}
                        min="0"
                        step="100"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">最高價格</label>
                      <Input
                        type="number"
                        placeholder="5000"
                        value={filters.maxPrice || ''}
                        onChange={(e) => updateFilters({ maxPrice: parseInt(e.target.value) || 5000 })}
                        min="0"
                        step="100"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">最低評分</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[0, 4.0, 4.5, 4.8, 4.9].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => updateFilters({ minRating: filters.minRating === rating ? 0 : rating })}
                        className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                          filters.minRating === rating
                            ? 'bg-[#FF5A5F] text-white border-[#FF5A5F]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#FF5A5F] hover:text-[#FF5A5F]'
                        }`}
                      >
                        {rating === 0 ? '全部' : `${rating}+`} 
                        {rating > 0 && <Star className="w-3 h-3 inline ml-1" />}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Clear Filters */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const defaultFilters: SearchFilters = {
                        query: '',
                        location: '',
                        date: '',
                        guests: 2,
                        minPrice: 0,
                        maxPrice: 5000,
                        minRating: 0,
                        category: '',
                        sortBy: 'relevance'
                      };
                      setFilters(defaultFilters);
                      updateURLParams(defaultFilters);
                      performSearch(defaultFilters, 1);
                    }}
                    className="text-sm"
                  >
                    清除所有篩選
                  </Button>
                </div>
              </div>
            )}

            {/* Advanced Search Panel */}
            {showAdvancedSearch && (
              <div className="mt-6">
                <AdvancedSearch
                  onSearch={handleAdvancedSearch}
                  onClose={() => setShowAdvancedSearch(false)}
                  initialFilters={{
                    query: filters.query,
                    location: filters.location,
                    guests: filters.guests,
                    priceRange: { min: filters.minPrice, max: filters.maxPrice },
                    rating: filters.minRating
                  }}
                />
              </div>
            )}

            {/* Smart Recommendations */}
            {!showAdvancedSearch && !showFilters && recommendations.length > 0 && searchResult.services.length > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">為您推薦</h3>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendations.map(service => (
                    <div
                      key={service.id}
                      className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/services/${service.id}`)}
                    >
                      <div className="flex gap-3">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {service.title}
                          </h4>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 truncate">
                              {service.location}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs font-medium">{service.rating}</span>
                            </div>
                            <span className="text-sm font-semibold text-blue-600">
                              NT$ {service.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
          {/* Results Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>
                搜尋結果
                {!isLoading && (
                  <span style={{ color: '#6b7280', fontWeight: '400', marginLeft: '0.5rem' }}>
                    ({searchResult.total} 個結果)
                  </span>
                )}
              </h1>
              {filters.query && (
                <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                  搜尋「<span style={{ fontWeight: '500' }}>{filters.query}</span>」
                </p>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {filters.sortBy === 'relevance' && '按相關性排序'}
                {filters.sortBy === 'price_low' && '價格由低到高'}
                {filters.sortBy === 'price_high' && '價格由高到低'}
                {filters.sortBy === 'rating' && '評分由高到低'}
                {filters.sortBy === 'newest' && '最新發布'}
              </div>
              
              {/* View Mode Toggle */}
              <div style={{ 
                display: 'flex', 
                backgroundColor: '#f3f4f6', 
                borderRadius: '0.5rem', 
                padding: '0.25rem' 
              }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    backgroundColor: viewMode === 'grid' ? 'white' : 'transparent',
                    color: viewMode === 'grid' ? '#111827' : '#6b7280',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Grid3X3 style={{ width: '1rem', height: '1rem' }} />
                  格子檢視
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    backgroundColor: viewMode === 'map' ? 'white' : 'transparent',
                    color: viewMode === 'map' ? '#111827' : '#6b7280',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Map style={{ width: '1rem', height: '1rem' }} />
                  地圖檢視
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5rem 0' }}>
              <Loading size="lg" />
            </div>
          ) : (
            <>
              {/* Results Content */}
              {searchResult.services.length > 0 ? (
                viewMode === 'grid' ? (
                  /* Grid View */
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '1.5rem' 
                  }}>
                    {searchResult.services.map((service) => (
                      <ServiceCard 
                        key={service.id} 
                        {...service} 
                        selectedLocationId={selectedLocationId}
                      />
                    ))}
                  </div>
                ) : (
                  /* Map View */
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 400px',
                    gap: '1rem',
                    height: '600px'
                  }}>
                    {/* Map */}
                    <div style={{ borderRadius: '0.5rem', overflow: 'hidden' }}>
                      <InteractiveMap
                        center={{ lat: 25.0330, lng: 121.5654 }}
                        zoom={12}
                        locations={getMapLocations()}
                        selectedLocation={selectedLocationId || undefined}
                        onLocationSelect={handleLocationSelect}
                        showUserLocation={true}
                        showControls={true}
                        style={{ height: '100%' }}
                      />
                    </div>
                    
                    {/* Service List */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      overflowY: 'auto',
                      padding: '0.5rem'
                    }}>
                      {searchResult.services.map((service) => (
                        <div
                          key={service.id}
                          style={{
                            padding: '1rem',
                            backgroundColor: selectedLocationId === service.id ? '#f0f9ff' : 'white',
                            borderRadius: '0.5rem',
                            border: selectedLocationId === service.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          className="hover:shadow-md"
                          onClick={() => handleLocationSelect({ id: service.id })}
                        >
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <img
                              src={service.image}
                              alt={service.title}
                              style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '0.5rem',
                                objectFit: 'cover'
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h3 style={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#111827',
                                marginBottom: '0.25rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {service.title}
                              </h3>
                              <p style={{
                                fontSize: '0.75rem',
                                color: '#6b7280',
                                marginBottom: '0.5rem'
                              }}>
                                {service.guideName} • {service.location}
                              </p>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem'
                              }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}>
                                  <Star style={{
                                    width: '0.875rem',
                                    height: '0.875rem',
                                    color: '#f59e0b',
                                    fill: 'currentColor'
                                  }} />
                                  <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    color: '#111827'
                                  }}>
                                    {service.rating}
                                  </span>
                                </div>
                                <div style={{
                                  fontSize: '0.875rem',
                                  fontWeight: '600',
                                  color: '#111827'
                                }}>
                                  NT$ {service.price.toLocaleString()}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/services/${service.id}`);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  backgroundColor: '#FF5A5F',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.75rem',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.2s'
                                }}
                                className="hover:bg-red-600"
                              >
                                查看詳情
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                /* No Results */
                <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                  <div style={{ 
                    width: '6rem', 
                    height: '6rem', 
                    backgroundColor: '#f3f4f6', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 1rem' 
                  }}>
                    <Search style={{ width: '2.5rem', height: '2.5rem', color: '#9ca3af' }} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                    找不到符合條件的結果
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>試試調整搜尋條件或篩選器</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowFilters(true);
                    }}
                  >
                    調整篩選條件
                  </Button>
                </div>
              )}

              {/* Load More */}
              {searchResult.hasMore && (
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <Button 
                    variant="outline" 
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    style={{ padding: '0.75rem 2rem' }}
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} className="animate-spin" />
                        載入中...
                      </>
                    ) : (
                      '載入更多結果'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
} 