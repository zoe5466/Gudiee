'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Compass, 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  TrendingUp, 
  Eye, 
  Heart,
  Filter,
  Search,
  Map,
  Grid,
  List,
  ArrowRight
} from 'lucide-react';

interface ExploreService {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  duration: string;
  maxGuests: number;
  image: string;
  category: string;
  isPopular?: boolean;
  isTrending?: boolean;
  guide: {
    name: string;
    avatar: string;
    rating: number;
  };
}

interface ExploreCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

export default function ExplorePage() {
  const router = useRouter();
  const [services, setServices] = useState<ExploreService[]>([]);
  const [categories, setCategories] = useState<ExploreCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price'>('popular');

  useEffect(() => {
    loadExploreData();
  }, []);

  const loadExploreData = async () => {
    setLoading(true);
    try {
      // 模擬資料載入
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockCategories: ExploreCategory[] = [
        { id: 'all', name: '全部', icon: '🌍', color: '#6b7280', count: 24 },
        { id: 'culture', name: '文化探索', icon: '🏛️', color: '#8b5cf6', count: 8 },
        { id: 'nature', name: '自然生態', icon: '🌲', color: '#10b981', count: 6 },
        { id: 'food', name: '美食體驗', icon: '🍜', color: '#f59e0b', count: 5 },
        { id: 'adventure', name: '冒險活動', icon: '🏔️', color: '#ef4444', count: 3 },
        { id: 'city', name: '城市導覽', icon: '🏙️', color: '#3b82f6', count: 2 }
      ];

      const mockServices: ExploreService[] = [
        {
          id: '1',
          title: '台北101 & 信義區深度文化之旅',
          description: '探索台北最具代表性的地標，了解現代台北的發展歷程與建築藝術',
          location: '台北市信義區',
          price: 800,
          rating: 4.9,
          reviewCount: 127,
          duration: '4小時',
          maxGuests: 6,
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
          category: 'culture',
          isPopular: true,
          isTrending: true,
          guide: {
            name: '小美',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            rating: 4.8
          }
        },
        {
          id: '2',
          title: '陽明山國家公園生態導覽',
          description: '走入台北後花園，認識豐富的火山地形與動植物生態',
          location: '台北市北投區',
          price: 600,
          rating: 4.7,
          reviewCount: 89,
          duration: '6小時',
          maxGuests: 8,
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
          category: 'nature',
          isPopular: true,
          guide: {
            name: '阿明',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
            rating: 4.6
          }
        },
        {
          id: '3',
          title: '九份老街 & 金瓜石礦業文化',
          description: '重溫台灣黃金歲月，體驗山城風情與礦業文化',
          location: '新北市瑞芳區',
          price: 1000,
          rating: 4.8,
          reviewCount: 156,
          duration: '8小時',
          maxGuests: 4,
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
          category: 'culture',
          isTrending: true,
          guide: {
            name: '小華',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
            rating: 4.9
          }
        },
        {
          id: '4',
          title: '西門町美食文化巡禮',
          description: '品嚐台北經典小吃，探索西門町的流行文化與歷史',
          location: '台北市萬華區',
          price: 500,
          rating: 4.6,
          reviewCount: 98,
          duration: '3小時',
          maxGuests: 10,
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
          category: 'food',
          guide: {
            name: '大雄',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            rating: 4.5
          }
        }
      ];

      setCategories(mockCategories);
      setServices(mockServices);
    } catch (error) {
      console.error('載入探索資料失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price':
        return a.price - b.price;
      default:
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    }
  });

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ fontSize: '18px', fontWeight: '500' }}>探索精彩服務中...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)' 
    }}>
      {/* 主標題區域 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 1rem 60px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <Compass style={{ width: '36px', height: '36px' }} />
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              margin: 0
            }}>
              探索台灣
            </h1>
          </div>
          <p style={{
            fontSize: '1.125rem',
            opacity: 0.9,
            margin: 0,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            發現台灣最美的角落，與專業在地導遊一起深度體驗台灣文化
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* 分類標籤 */}
        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          marginBottom: '2rem',
          paddingBottom: '8px'
        }}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '25px',
                border: 'none',
                backgroundColor: selectedCategory === category.id ? category.color : 'white',
                color: selectedCategory === category.id ? 'white' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: selectedCategory === category.id ? 
                  '0 4px 12px rgba(0,0,0,0.15)' : 
                  '0 2px 8px rgba(0,0,0,0.1)'
              }}
              className="hover:shadow-lg"
            >
              <span style={{ fontSize: '16px' }}>{category.icon}</span>
              <span>{category.name}</span>
              <span style={{
                backgroundColor: selectedCategory === category.id ? 
                  'rgba(255,255,255,0.2)' : 
                  'rgba(107,114,128,0.1)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* 搜尋和篩選工具列 */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* 搜尋框 */}
          <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: '#9ca3af'
            }} />
            <input
              type="text"
              placeholder="搜尋服務名稱或地點..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'white'
              }}
              className="focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
          </div>

          {/* 排序選擇 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: '12px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <option value="popular">熱門推薦</option>
            <option value="rating">評分最高</option>
            <option value="price">價格最低</option>
          </select>

          {/* 檢視模式切換 */}
          <div style={{
            display: 'flex',
            backgroundColor: '#f3f4f6',
            borderRadius: '12px',
            padding: '4px'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: viewMode === 'grid' ? 'white' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Grid style={{ width: '20px', height: '20px', color: '#6b7280' }} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: viewMode === 'list' ? 'white' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <List style={{ width: '20px', height: '20px', color: '#6b7280' }} />
            </button>
          </div>
        </div>

        {/* 服務列表 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: viewMode === 'grid' ? 
            'repeat(auto-fill, minmax(350px, 1fr))' : 
            '1fr',
          gap: '1.5rem'
        }}>
          {filteredServices.map((service) => (
            <div
              key={service.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: viewMode === 'list' ? 'flex' : 'block'
              }}
              className="hover:shadow-xl hover:transform hover:scale-105"
              onClick={() => router.push(`/services/${service.id}`)}
            >
              {/* 服務圖片 */}
              <div style={{
                position: 'relative',
                height: viewMode === 'list' ? '200px' : '240px',
                width: viewMode === 'list' ? '300px' : '100%',
                flexShrink: 0
              }}>
                <img
                  src={service.image}
                  alt={service.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* 標籤 */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  display: 'flex',
                  gap: '8px'
                }}>
                  {service.isPopular && (
                    <span style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      熱門
                    </span>
                  )}
                  {service.isTrending && (
                    <span style={{
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <TrendingUp style={{ width: '12px', height: '12px' }} />
                      趨勢
                    </span>
                  )}
                </div>

                {/* 收藏按鈕 */}
                <button
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  className="hover:bg-white hover:shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    // 收藏功能
                  }}
                >
                  <Heart style={{ width: '18px', height: '18px', color: '#6b7280' }} />
                </button>
              </div>

              {/* 服務資訊 */}
              <div style={{ padding: '20px', flex: 1 }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 8px 0',
                  lineHeight: '1.4'
                }}>
                  {service.title}
                </h3>

                <p style={{
                  color: '#6b7280',
                  fontSize: '14px',
                  margin: '0 0 16px 0',
                  lineHeight: '1.5'
                }}>
                  {service.description}
                </p>

                {/* 服務詳情 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>{service.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>{service.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>最多 {service.maxGuests} 人</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Star style={{ width: '16px', height: '16px', color: '#fbbf24' }} />
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                      {service.rating} ({service.reviewCount})
                    </span>
                  </div>
                </div>

                {/* 導遊資訊和價格 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                      src={service.guide.avatar}
                      alt={service.guide.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>
                        {service.guide.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        ⭐ {service.guide.rating}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#111827'
                    }}>
                      NT$ {service.price.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      起/人
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 空狀態 */}
        {filteredServices.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6b7280'
          }}>
            <Compass style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 20px',
              color: '#d1d5db'
            }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              margin: '0 0 8px 0'
            }}>
              沒有找到符合條件的服務
            </h3>
            <p style={{ margin: '0 0 20px 0' }}>
              試試調整搜尋關鍵字或選擇其他分類
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              重置篩選
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}