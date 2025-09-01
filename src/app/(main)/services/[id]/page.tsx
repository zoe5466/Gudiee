'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Users, Heart, Share2, MessageCircle, Shield, Award, ChevronLeft, Calendar, Clock, ChevronRight, ImageIcon } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { useToast } from '@/components/ui/toast';
import { Rating } from '@/components/ui/rating';
import { Loading } from '@/components/ui/loading';
import { DatePicker } from '@/components/ui/date-picker';
import { FullNavigation } from '@/components/layout/page-navigation';
import { ReviewsList } from '@/components/reviews/reviews-list';
import { ReviewsSummary } from '@/components/reviews/reviews-summary';

interface ServiceData {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  duration: string;
  maxGuests: number;
  images: string[];
  guide: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    languages: string[];
    experience: string;
    specialties: string[];
    bio?: string;
  };
  highlights: string[];
  reviews: Review[];
  category: string;
  isAvailable: boolean;
  cancellationPolicy: string;
  included: string[];
  notIncluded: string[];
}

interface Review {
  id: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  date: string
}

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  
  const [service, setService] = useState<ServiceData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  // 載入服務資料
  useEffect(() => {
    const loadService = async () => {
      setIsLoading(true);
      try {
        // TODO: 實際 API 調用
        const response = await fetch(`/api/services/${params.id}`);
        if (!response.ok) {
          throw new Error('服務不存在');
        }
        const serviceData = await response.json();
        
        // 使用模擬資料
        const mockService = getMockService(params.id);
        setService(mockService);
        
      } catch (err) {
        error('載入失敗', '無法載入服務詳情，請稍後再試');
        router.push('/search');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadService();
  }, [params.id, error, router]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    try {
      // TODO: 實際收藏 API
      setIsLiked(!isLiked);
      success(isLiked ? '已取消收藏' : '已加入收藏', '');
    } catch (err) {
      error('操作失敗', '請稍後再試');
    }
  };
  
  const handleBooking = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!selectedDate) {
      error('請選擇日期', '預訂前請選擇服務日期');
      return;
    }
    
    if (!service) return;
    
    setIsBooking(true);
    
    try {
      // TODO: 檢查可用性並建立預訂
      const bookingData = {
        serviceId: params.id,
        guideId: service.guide.id,
        date: selectedDate.toISOString(),
        guests,
        duration: parseInt(service.duration),
        totalPrice: service.price * parseInt(service.duration)
      };
      
      // 暫時導向預訂頁面，傳遞必要資料
      const queryParams = new URLSearchParams({
        serviceId: params.id,
        date: selectedDate.toISOString(),
        guests: guests.toString()
      });
      
      router.push(`/booking?${queryParams.toString()}`);
      
    } catch (err) {
      error('預訂失敗', '無法建立預訂，請稍後再試');
    } finally {
      setIsBooking(false);
    }
  };

  const getMockService = (id: string): ServiceData => {
    // 模擬不同的服務資料
    const services: Record<string, ServiceData> = {
      '1': {
        id: '1',
        title: '台北101 & 信義區深度導覽',
        description: '帶您深度探索台北最精華的信義區，從台北101觀景台俯瞰整個台北盆地，漫步信義商圈感受現代都市魅力，並深入了解台灣的經濟發展歷程。專業導覽員將為您介紹台北的歷史變遷，並帶您品嚐道地美食。',
        location: '台北市信義區',
        price: 800,
        rating: 4.9,
        reviewCount: 127,
        duration: '4',
        maxGuests: 6,
        category: '文化導覽',
        isAvailable: true,
        cancellationPolicy: '免費取消，24小時前可全額退款',
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1519832064-53bbda4fb58f?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop'
        ],
        guide: {
          id: 'guide-1',
          name: '小美',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
          rating: 4.9,
          reviewCount: 156,
          languages: ['中文', '英文', '日文'],
          experience: '5年導覽經驗',
          specialties: ['文化導覽', '美食探索', '攝影指導'],
          bio: '擁有豐富的台北在地知識，熱愛分享台灣文化與美食。曾擔任國際旅遊雜誌特約撰稿人，精通多國語言。'
        },
        highlights: [
          '台北101觀景台門票包含',
          '專業攝影指導服務',
          '精選在地美食推薦',
          '深度文化歷史解說',
          '交通便利，捷運直達',
          '小班制精緻導覽'
        ],
        included: ['專業導覽服務', '台北101門票', '美食推薦', '攝影指導', '交通指引'],
        notIncluded: ['個人餐食費用', '交通費', '購物費用', '小費'],
        reviews: [
          {
            id: '1',
            userName: '張小明',
            userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
            rating: 5,
            comment: '小美導遊非常專業，對台北的歷史文化了解很深，行程安排也很合理。特別是在台北101的解說，讓我對台灣的經濟發展有了全新的認識。強烈推薦！',
            date: '2024-01-15'
          },
          {
            id: '2',
            userName: '李小華',
            userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
            rating: 5,
            comment: '超棒的體驗！小美不只是導遊，更像是台北的活字典。推薦的美食都很棒，攝影指導也很專業，拍了很多美照。',
            date: '2024-01-10'
          },
          {
            id: '3',
            userName: '王大明',
            userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            rating: 4,
            comment: '整體很不錯，導覽內容豐富，時間安排合理。唯一小建議是希望能多一些互動環節。',
            date: '2024-01-05'
          }
        ]
      }
    };
    
    return services[id] || services['1']!;
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: service?.title,
          text: service?.description,
          url: window.location.href
        });
      } else {
        // 複製連結到剪貼板
        await navigator.clipboard.writeText(window.location.href);
        success('已複製連結', '連結已複製到剪貼板');
      }
    } catch (err) {
      error('分享失敗', '無法分享此服務');
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Loading variant="spinner" size="lg" />
      </div>
    )
  }

  if (!service) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
            服務不存在
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            找不到您要查看的服務
          </p>
          <button
            onClick={() => router.push('/search')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#FF5A5F',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            返回搜尋
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)' 
    }}>
      <FullNavigation />

      <main style={{ backgroundColor: 'white', borderRadius: '1rem 1rem 0 0', marginTop: '1rem' }}>
        {/* Image Gallery */}
        <div style={{ position: 'relative', height: '24rem', overflow: 'hidden', borderRadius: '1rem 1rem 0 0' }}>
          {service ? (
            <img 
              src={service.images[currentImageIndex]} 
              alt={service.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'opacity 0.3s'
              }}
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              backgroundColor: '#f3f4f6', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <ImageIcon style={{ width: '4rem', height: '4rem', color: '#9ca3af' }} />
            </div>
          )}
          
          {/* 圖片導航 */}
          {service && service.images.length > 1 && (
            <>
              <button 
                onClick={() => setCurrentImageIndex(prev => prev === 0 ? service.images.length - 1 : prev - 1)}
                style={{
                  position: 'absolute',
                  left: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '2rem',
                  height: '2rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                className="hover:bg-white sm:left-4 sm:w-10 sm:h-10"
              >
                <ChevronLeft style={{ width: '1rem', height: '1rem', color: '#6b7280' }} className="sm:w-5 sm:h-5" />
              </button>
              <button 
                onClick={() => setCurrentImageIndex(prev => prev === service.images.length - 1 ? 0 : prev + 1)}
                style={{
                  position: 'absolute',
                  right: '3rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '2rem',
                  height: '2rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                className="hover:bg-white sm:right-16 sm:w-10 sm:h-10"
              >
                <ChevronRight style={{ width: '1rem', height: '1rem', color: '#6b7280' }} className="sm:w-5 sm:h-5" />
              </button>
              
              {/* 圖片指示器 */}
              <div style={{ 
                position: 'absolute', 
                bottom: '1rem', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                display: 'flex', 
                gap: '0.5rem' 
              }}>
                {service.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      borderRadius: '50%',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)'
                    }}
                  />
                ))}
              </div>
            </>
          )}
          
          <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.25rem' }} className="sm:top-4 sm:right-4 sm:gap-2">
            <button 
              onClick={handleShare}
              style={{
                width: '2rem',
                height: '2rem',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(4px)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              className="hover:bg-white sm:w-10 sm:h-10"
            >
              <Share2 style={{ width: '1rem', height: '1rem', color: '#6b7280' }} className="sm:w-5 sm:h-5" />
            </button>
            <button 
              onClick={handleFavoriteToggle}
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: isLiked ? '#ef4444' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: isLiked ? 'none' : 'blur(4px)',
                color: isLiked ? 'white' : '#6b7280'
              }}
              className="hover:bg-white sm:w-10 sm:h-10"
            >
              <Heart style={{ width: '1rem', height: '1rem', fill: isLiked ? 'currentColor' : 'none' }} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            {/* Main Content */}
            <div style={{ display: 'grid', gap: '2rem' }} className="lg:grid-cols-[2fr_1fr]">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', order: 2 }} className="lg:order-1">
                {/* Header */}
                <div>
                  <h1 style={{ 
                    fontSize: '2.25rem', 
                    fontWeight: '700', 
                    color: '#111827', 
                    marginBottom: '1rem',
                    lineHeight: '1.2'
                  }}>
                    {service.title}
                  </h1>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    fontSize: '0.875rem', 
                    color: '#6b7280', 
                    marginBottom: '1rem' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin style={{ width: '1rem', height: '1rem' }} />
                      <span>{service.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Star style={{ width: '1rem', height: '1rem', fill: '#fbbf24', color: '#fbbf24' }} />
                      <span>{service.rating}</span>
                      <span>({service.reviewCount} 則評價)</span>
                    </div>
                  </div>
                </div>

                {/* Guide Info */}
                <div style={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '1rem', 
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="sm:flex-row sm:items-center">
                    <img 
                      src={service.guide.avatar} 
                      alt={service.guide.name}
                      style={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover' }} className="sm:w-16 sm:h-16"
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
                        {service.guide.name}
                      </h3>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        fontSize: '0.875rem', 
                        color: '#6b7280', 
                        marginBottom: '0.5rem' 
                      }}>
                        <Star style={{ width: '1rem', height: '1rem', fill: '#fbbf24', color: '#fbbf24' }} />
                        <span>{service.guide.rating}</span>
                        <span>({service.guide.reviewCount} 則評價)</span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem', 
                        fontSize: '0.875rem', 
                        color: '#6b7280' 
                      }}>
                        <span>{service.guide.experience}</span>
                        <span>•</span>
                        <span>{service.guide.languages.join(', ')}</span>
                      </div>
                    </div>
                    <button style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'background-color 0.2s',
                      width: '100%'
                    }}
                    className="hover:bg-gray-200 sm:w-auto"
                    >
                      <MessageCircle style={{ width: '1rem', height: '1rem' }} />
                      <span className="hidden sm:inline">聯絡地陪</span>
                      <span className="sm:hidden">聯絡</span>
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                    關於此體驗
                  </h2>
                  <p style={{ color: '#374151', lineHeight: '1.7' }}>
                    {service.description}
                  </p>
                </div>

                {/* Highlights */}
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                    體驗亮點
                  </h2>
                  <ul style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr', 
                    gap: '0.75rem' 
                  }} className="sm:grid-cols-2">
                    {service.highlights.map((highlight, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                          width: '0.5rem', 
                          height: '0.5rem', 
                          backgroundColor: '#FF5A5F', 
                          borderRadius: '50%' 
                        }}></div>
                        <span style={{ color: '#374151' }}>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Reviews */}
                <div id="reviews">
                  <ReviewsList
                    targetId={service.id}
                    targetType="service"
                    showTitle={true}
                    showFilters={true}
                    showStatistics={true}
                  />
                </div>
              </div>

              {/* Booking Sidebar */}
              <div style={{ order: 1 }} className="lg:order-2">
                <div style={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '1rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '1.5rem'
                }} className="lg:sticky lg:top-24">
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }} className="sm:text-3xl">
                      NT$ {service?.price.toLocaleString() || 0}
                    </div>
                    <div style={{ color: '#6b7280' }}>每小時</div>
                    {service?.duration && (
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        建議時長：{service.duration} 小時
                      </div>
                    )}
                  </div>

                  {/* Booking Form */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="sm:grid sm:grid-cols-2 sm:gap-4 lg:flex lg:flex-col lg:gap-4">
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        color: '#374151', 
                        marginBottom: '0.5rem' 
                      }}>
                        日期
                      </label>
                      <DatePicker
                        value={selectedDate || undefined}
                        onChange={(date) => setSelectedDate(date || null)}
                        minDate={new Date()}
                        className="w-full"
                        placeholder="選擇日期"
                      />
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        color: '#374151', 
                        marginBottom: '0.5rem' 
                      }}>
                        人數
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          backgroundColor: 'white'
                        }}
                      >
                        {service && [...Array(service.maxGuests)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} 位旅客
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ paddingTop: '1rem' }} className="sm:col-span-2 lg:col-span-1">
                      <button 
                        onClick={handleBooking}
                        disabled={isBooking || !service?.isAvailable}
                        style={{
                          width: '100%',
                          padding: '1rem',
                          backgroundColor: service?.isAvailable ? '#FF5A5F' : '#d1d5db',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          cursor: service?.isAvailable ? 'pointer' : 'not-allowed',
                          transition: 'background-color 0.2s',
                          opacity: (isBooking || !service?.isAvailable) ? 0.5 : 1
                        }}
                      >
                        {isBooking ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: '1.25rem',
                              height: '1.25rem',
                              border: '2px solid transparent',
                              borderTop: '2px solid white',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }}></div>
                            處理中...
                          </div>
                        ) : !service?.isAvailable ? (
                          '暫不可預訂'
                        ) : (
                          '立即預訂'
                        )}
                      </button>
                    </div>

                    <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                      您不會被收費
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div style={{ 
                    marginTop: '1.5rem', 
                    paddingTop: '1.5rem', 
                    borderTop: '1px solid #e5e7eb' 
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '1rem', 
                      fontSize: '0.875rem', 
                      color: '#6b7280' 
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Shield style={{ width: '1rem', height: '1rem', color: '#FF5A5F' }} />
                        <span>安全保障</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Award style={{ width: '1rem', height: '1rem', color: '#FF5A5F' }} />
                        <span>品質保證</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}