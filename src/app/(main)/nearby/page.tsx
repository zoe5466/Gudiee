'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Navigation, 
  Star, 
  Clock, 
  Users, 
  Phone,
  Globe,
  Camera,
  Heart,
  Navigation2,
  Info,
  Filter,
  Search,
  Map,
  List,
  Locate
} from 'lucide-react';

interface NearbyPlace {
  id: string;
  name: string;
  description: string;
  category: string;
  distance: number; // in meters
  duration: string; // walking time
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  openHours: string;
  phone?: string;
  website?: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  tags: string[];
  services?: {
    id: string;
    title: string;
    price: number;
    guide: string;
  }[];
}

export default function NearbyPage() {
  const router = useRouter();
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadNearbyPlaces();
    }
  }, [userLocation]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationPermission('denied');
      loadMockData();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationPermission('granted');
      },
      (error) => {
        console.error('獲取位置失敗:', error);
        setLocationPermission('denied');
        // 使用台北101作為預設位置
        setUserLocation({ lat: 25.0330, lng: 121.5654 });
      }
    );
  };

  const loadNearbyPlaces = async () => {
    setLoading(true);
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1500));
      loadMockData();
    } catch (error) {
      console.error('載入附近景點失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    const mockPlaces: NearbyPlace[] = [
      {
        id: '1',
        name: '台北101',
        description: '台北最具代表性的地標建築，擁有絕佳的城市全景',
        category: 'landmark',
        distance: 500,
        duration: '6分鐘',
        rating: 4.5,
        reviewCount: 8932,
        isOpen: true,
        openHours: '09:00 - 22:00',
        phone: '+886-2-8101-8800',
        website: 'https://www.taipei-101.com.tw',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        coordinates: { lat: 25.0330, lng: 121.5654 },
        address: '台北市信義區信義路五段7號',
        tags: ['觀景台', '購物', '餐廳', '地標'],
        services: [
          {
            id: 'service-1',
            title: '台北101深度導覽',
            price: 800,
            guide: '專業導遊小美'
          }
        ]
      },
      {
        id: '2',
        name: '象山步道',
        description: '拍攝台北101的最佳地點，享受城市夜景的絕美視角',
        category: 'nature',
        distance: 1200,
        duration: '15分鐘',
        rating: 4.7,
        reviewCount: 2341,
        isOpen: true,
        openHours: '24小時開放',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        coordinates: { lat: 25.0235, lng: 121.5704 },
        address: '台北市信義區信義路五段150巷',
        tags: ['步道', '夜景', '攝影', '運動'],
        services: [
          {
            id: 'service-2',
            title: '象山夜景攝影之旅',
            price: 600,
            guide: '攝影達人阿明'
          }
        ]
      },
      {
        id: '3',
        name: '四四南村',
        description: '保存完整的眷村文化，體驗台北的歷史記憶',
        category: 'culture',
        distance: 800,
        duration: '10分鐘',
        rating: 4.3,
        reviewCount: 1876,
        isOpen: true,
        openHours: '09:00 - 17:00',
        phone: '+886-2-2723-7937',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        coordinates: { lat: 25.0312, lng: 121.5603 },
        address: '台北市信義區松勤街50號',
        tags: ['歷史', '文化', '眷村', '展覽'],
        services: [
          {
            id: 'service-3',
            title: '眷村文化深度體驗',
            price: 500,
            guide: '文史專家小華'
          }
        ]
      },
      {
        id: '4',
        name: '誠品信義店',
        description: '24小時營業的文化地標，閱讀與生活的完美結合',
        category: 'shopping',
        distance: 300,
        duration: '4分鐘',
        rating: 4.4,
        reviewCount: 3421,
        isOpen: true,
        openHours: '24小時營業',
        phone: '+886-2-8789-3388',
        website: 'https://www.eslite.com',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        coordinates: { lat: 25.0328, lng: 121.5645 },
        address: '台北市信義區松高路11號',
        tags: ['書店', '購物', '咖啡', '文化'],
        services: []
      },
      {
        id: '5',
        name: '國父紀念館',
        description: '紀念國父孫中山先生的重要文化場所，定期舉辦藝文活動',
        category: 'culture',
        distance: 1500,
        duration: '18分鐘',
        rating: 4.2,
        reviewCount: 1654,
        isOpen: true,
        openHours: '09:00 - 18:00',
        phone: '+886-2-2758-8008',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        coordinates: { lat: 25.0408, lng: 121.5603 },
        address: '台北市信義區仁愛路四段505號',
        tags: ['紀念館', '藝文', '廣場', '表演'],
        services: [
          {
            id: 'service-4',
            title: '國父紀念館文化導覽',
            price: 400,
            guide: '歷史老師大雄'
          }
        ]
      }
    ];

    setPlaces(mockPlaces);
    setLoading(false);
  };

  const categories = [
    { id: 'all', name: '全部', icon: '🌍', count: places.length },
    { id: 'landmark', name: '地標', icon: '🏛️', count: places.filter(p => p.category === 'landmark').length },
    { id: 'nature', name: '自然', icon: '🌲', count: places.filter(p => p.category === 'nature').length },
    { id: 'culture', name: '文化', icon: '🎭', count: places.filter(p => p.category === 'culture').length },
    { id: 'shopping', name: '購物', icon: '🛍️', count: places.filter(p => p.category === 'shopping').length },
    { id: 'food', name: '美食', icon: '🍜', count: places.filter(p => p.category === 'food').length }
  ];

  const filteredPlaces = places.filter(place => {
    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => a.distance - b.distance);

  const formatDistance = (distance: number) => {
    if (distance < 1000) {
      return `${distance}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
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
          <p style={{ fontSize: '18px', fontWeight: '500' }}>正在搜尋附近景點...</p>
          {locationPermission === 'pending' && (
            <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>
              請允許取得您的位置資訊
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #ecfdf5, #ffffff, #f0f9ff)' 
    }}>
      
      {/* 主標題區域 */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
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
            <MapPin style={{ width: '36px', height: '36px' }} />
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              margin: 0
            }}>
              附近景點
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
            探索您周圍的精彩景點，發現台灣在地文化與美景
          </p>
          
          {locationPermission === 'denied' && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '12px 20px',
              marginTop: '20px',
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              <p style={{ margin: 0, fontSize: '14px' }}>
                🔍 無法取得您的位置，顯示台北信義區景點
              </p>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* 工具列 */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* 重新定位按鈕 */}
          <button
            onClick={getCurrentLocation}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
            className="hover:bg-emerald-600"
          >
            <Locate style={{ width: '18px', height: '18px' }} />
            重新定位
          </button>

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
              placeholder="搜尋景點名稱..."
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
              className="focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* 檢視模式切換 */}
          <div style={{
            display: 'flex',
            backgroundColor: '#f3f4f6',
            borderRadius: '12px',
            padding: '4px'
          }}>
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
            <button
              onClick={() => setViewMode('map')}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: viewMode === 'map' ? 'white' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Map style={{ width: '20px', height: '20px', color: '#6b7280' }} />
            </button>
          </div>
        </div>

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
                backgroundColor: selectedCategory === category.id ? '#10b981' : 'white',
                color: selectedCategory === category.id ? 'white' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: selectedCategory === category.id ? 
                  '0 4px 12px rgba(16, 185, 129, 0.3)' : 
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

        {/* 景點列表 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease'
              }}
              className="hover:shadow-xl hover:transform hover:scale-105"
            >
              {/* 景點圖片 */}
              <div style={{ position: 'relative', height: '200px' }}>
                <img
                  src={place.image}
                  alt={place.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* 距離標籤 */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Navigation style={{ width: '12px', height: '12px' }} />
                  {formatDistance(place.distance)} • {place.duration}
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
                >
                  <Heart style={{ width: '18px', height: '18px', color: '#6b7280' }} />
                </button>

                {/* 營業狀態 */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: place.isOpen ? '#10b981' : '#ef4444'
                  }} />
                  {place.isOpen ? '營業中' : '已打烊'}
                </div>
              </div>

              {/* 景點資訊 */}
              <div style={{ padding: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {place.name}
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#fef3c7',
                    padding: '4px 8px',
                    borderRadius: '12px'
                  }}>
                    <Star style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#92400e' }}>
                      {place.rating}
                    </span>
                  </div>
                </div>

                <p style={{
                  color: '#6b7280',
                  fontSize: '14px',
                  margin: '0 0 16px 0',
                  lineHeight: '1.5'
                }}>
                  {place.description}
                </p>

                {/* 標籤 */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  marginBottom: '16px'
                }}>
                  {place.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {place.tags.length > 3 && (
                    <span style={{
                      color: '#6b7280',
                      fontSize: '12px',
                      padding: '4px 8px'
                    }}>
                      +{place.tags.length - 3} 更多
                    </span>
                  )}
                </div>

                {/* 聯絡資訊 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  marginBottom: '16px',
                  fontSize: '13px',
                  color: '#6b7280'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock style={{ width: '14px', height: '14px' }} />
                    {place.openHours}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users style={{ width: '14px', height: '14px' }} />
                    {place.reviewCount} 則評論
                  </div>
                </div>

                {/* 可預訂服務 */}
                {place.services && place.services.length > 0 && (
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                    padding: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#166534',
                      marginBottom: '8px'
                    }}>
                      📍 可預訂導覽服務
                    </div>
                    {place.services.map((service) => (
                      <div
                        key={service.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '12px',
                          color: '#15803d'
                        }}
                      >
                        <span>{service.title}</span>
                        <span style={{ fontWeight: '600' }}>NT$ {service.price}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 操作按鈕 */}
                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button
                    onClick={() => router.push(`/services?location=${encodeURIComponent(place.name)}`)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                    className="hover:bg-emerald-600"
                  >
                    <Search style={{ width: '16px', height: '16px' }} />
                    找導遊
                  </button>
                  
                  <button
                    style={{
                      padding: '12px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    className="hover:bg-gray-200"
                  >
                    <Navigation2 style={{ width: '16px', height: '16px' }} />
                  </button>

                  {place.website && (
                    <button
                      onClick={() => window.open(place.website, '_blank')}
                      style={{
                        padding: '12px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      className="hover:bg-gray-200"
                    >
                      <Globe style={{ width: '16px', height: '16px' }} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 空狀態 */}
        {filteredPlaces.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6b7280'
          }}>
            <MapPin style={{
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
              沒有找到符合條件的景點
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
                backgroundColor: '#10b981',
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