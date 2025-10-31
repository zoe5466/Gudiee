// 服務詳情頁面組件
// 功能：顯示導遊服務的詳細資訊，包含預訂功能
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Users, Heart, Share2, MessageCircle, Shield, Award, ChevronLeft, Calendar, Clock, ChevronRight, ImageIcon } from 'lucide-react';
import { useAuth } from '@/store/auth'; // 用戶認證狀態管理
import { useToast } from '@/components/ui/toast'; // 通知訊息組件
import { Rating } from '@/components/ui/rating'; // 評分顯示組件
import { Loading } from '@/components/ui/loading'; // 載入狀態組件
import { DatePicker } from '@/components/ui/date-picker'; // 日期選擇組件
import { ReviewsList } from '@/components/reviews/reviews-list'; // 評論列表組件
import { ReviewsSummary } from '@/components/reviews/reviews-summary'; // 評論摘要組件

// 服務資料的型別定義
interface ServiceData {
  id: string; // 服務唯一識別碼
  title: string; // 服務標題
  description: string; // 服務詳細描述
  location: string; // 服務地點
  price: number; // 每小時價格
  rating: number; // 平均評分
  reviewCount: number; // 評論數量
  duration: string; // 建議時長
  maxGuests: number; // 最大人數
  images: string[]; // 服務圖片列表
  guide: { // 導遊資訊
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
  highlights: string[]; // 主要亮點
  reviews: Review[]; // 評論列表
  category: string; // 服務類別
  isAvailable: boolean; // 是否可預訂
  cancellationPolicy: string; // 取消政策
  included: string[]; // 包含項目
  notIncluded: string[]; // 不包含項目
}

// 評論資料的型別定義
interface Review {
  id: string // 評論 ID
  userName: string // 評論用戶名稱
  userAvatar: string // 用戶頭像
  rating: number // 評分 (1-5)
  comment: string // 評論內容
  date: string // 評論日期
}

/**
 * 服務詳情頁面主組件
 * 
 * 功能：
 * 1. 顯示服務詳細資訊（標題、圖片、描述、導遊等）
 * 2. 提供預訂功能（日期選擇、人數設定）
 * 3. 支援收藏和分享功能
 * 4. 顯示評論和評分
 * 
 * @param params - 路由參數，包含服務 ID
 */
export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  // 路由和認證相關的 hooks
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  
  // 頁面狀態管理
  const [service, setService] = useState<ServiceData | null>(null); // 服務資料
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 用戶選擇的日期
  const [guests, setGuests] = useState(2); // 預訂人數
  const [isLoading, setIsLoading] = useState(true); // 載入狀態
  const [isBooking, setIsBooking] = useState(false); // 預訂中狀態
  const [isLiked, setIsLiked] = useState(false); // 是否已收藏
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 當前顯示的圖片索引
  const [showAllReviews, setShowAllReviews] = useState(false); // 是否顯示所有評論
  
  // 載入服務資料的副作用
  // 當組件載入或服務 ID 變更時觸發
  useEffect(() => {
    const loadService = async () => {
      setIsLoading(true);
      try {
        // 從 API 取得服務資料
        const response = await fetch(`/api/services/${params.id}`);
        if (!response.ok) {
          throw new Error('服務不存在');
        }
        const result = await response.json();
        
        if (result.success) {
          // 轉換後端 API 資料格式為前端界面所需的格式
          const serviceData: ServiceData = {
            id: result.data.id,
            title: result.data.title,
            description: result.data.description,
            location: result.data.location,
            price: result.data.price,
            rating: result.data.stats.averageRating, // 平均評分
            reviewCount: result.data.stats.totalReviews, // 評論總數
            duration: result.data.duration.toString(), // 時長（小時）
            maxGuests: result.data.maxGuests, // 最大人數
            images: result.data.images, // 服務圖片列表
            guide: { // 導遊資訊轉換
              id: result.data.guide.id,
              name: result.data.guide.name,
              avatar: result.data.guide.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', // 預設頭像
              rating: 4.9, // TODO: 從導遊評價計算實際評分
              reviewCount: 156, // TODO: 從導遊評價計算實際數量
              languages: result.data.guide.languages || ['中文'], // 支援語言
              experience: `${result.data.guide.experienceYears || 3}年導覽經驗`, // 經驗年數
              specialties: result.data.guide.specialties || ['專業導覽'], // 專長領域
              bio: result.data.guide.bio || '專業導遊，熱愛分享旅遊體驗' // 個人簡介
            },
            highlights: result.data.highlights, // 服務亮點
            reviews: result.data.reviews.map((review: any) => ({ // 評論資料轉換
              id: review.id,
              userName: review.reviewer?.name || '匿名用戶', // 處理匿名評論
              userAvatar: review.reviewer?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
              rating: review.rating,
              comment: review.comment,
              date: new Date(review.createdAt).toISOString().split('T')[0] // 日期格式化
            })),
            category: result.data.category?.name || '旅遊導覽', // 服務類別
            isAvailable: result.data.status === 'ACTIVE', // 是否可預訂
            cancellationPolicy: result.data.cancellationPolicy, // 取消政策
            included: result.data.included, // 包含項目
            notIncluded: result.data.excluded // 不包含項目
          };
          
          setService(serviceData);
        } else {
          throw new Error('載入失敗');
        }
        
      } catch (err) {
        // 錯誤處理：顯示錯誤訊息並跳轉到搜尋頁面
        error('載入失敗', '無法載入服務詳情，請稍後再試');
        router.push('/search');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadService();
  }, [params.id, error, router]); // 依賴陣列：服務 ID 變更時重新載入

  /**
   * 處理收藏/取消收藏操作
   * 需要用戶登入才能使用
   */
  const handleFavoriteToggle = async () => {
    // 檢查用戶是否已登入
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    try {
      // TODO: 實作收藏 API 請求到後端
      setIsLiked(!isLiked);
      success(isLiked ? '已取消收藏' : '已加入收藏', '');
    } catch (err) {
      error('操作失敗', '請稍後再試');
    }
  };
  
  /**
   * 處理預訂操作
   * 驗證用戶登入、日期選擇，然後跳轉到預訂頁面
   */
  const handleBooking = async () => {
    // 檢查用戶是否已登入
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // 檢查是否已選擇日期
    if (!selectedDate) {
      error('請選擇日期', '預訂前請選擇服務日期');
      return;
    }
    
    if (!service) return;
    
    setIsBooking(true);
    
    try {
      // TODO: 在跳轉前檢查日期可用性
      const bookingData = {
        serviceId: params.id,
        guideId: service.guide.id,
        date: selectedDate.toISOString(),
        guests,
        duration: parseInt(service.duration),
        totalPrice: service.price * parseInt(service.duration)
      };
      
      // 組裝 URL 參數並跳轉到預訂頁面
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


  /**
   * 處理分享操作
   * 優先使用原生分享 API，否則複製連結到剪貼板
   */
  const handleShare = async () => {
    try {
      // 檢查是否支援原生分享 API
      if (navigator.share) {
        await navigator.share({
          title: service?.title,
          text: service?.description,
          url: window.location.href
        });
      } else {
        // Fallback: 複製連結到剪貼板
        await navigator.clipboard.writeText(window.location.href);
        success('已複製連結', '連結已複製到剪貼板');
      }
    } catch (err) {
      error('分享失敗', '無法分享此服務');
    }
  };

  // 載入中的顯示狀態
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

  // 服務不存在或載入失敗的顯示狀態
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