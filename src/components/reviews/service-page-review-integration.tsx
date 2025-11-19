// 服務頁面評論整合組件
// 功能：將評論系統完整整合到服務頁面，提供評論展示、提交、篩選等功能
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Star,
  Filter,
  SortAsc,
  MessageSquare,
  ThumbsUp,
  Eye,
  Camera,
  CheckCircle,
  Award,
  TrendingUp,
  BarChart3,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  Plus,
  Search,
  RefreshCw
} from 'lucide-react';
import { ResponderType } from '@/types/review';
import { useAuth } from '@/store/auth';
import ComprehensiveReviewForm from './comprehensive-review-form';
import EnhancedReviewDisplay from './enhanced-review-display';
import type { 
  Review, 
  ReviewStatistics, 
  ReviewFilters, 
  ReviewFormData 
} from '@/types/review';

// 組件屬性介面
interface ServicePageReviewIntegrationProps {
  serviceId: string;                   // 服務 ID
  serviceName: string;                 // 服務名稱
  guideId: string;                     // 導遊 ID
  guideName: string;                   // 導遊名稱
  userBookingId?: string;              // 用戶預訂 ID（如果已預訂）
  allowReviewSubmission?: boolean;     // 是否允許提交評論
  className?: string;                  // 自定義樣式
}

// 篩選選項
const FILTER_OPTIONS = {
  rating: [
    { value: [], label: '全部評分' },
    { value: [5], label: '5 星' },
    { value: [4, 5], label: '4 星以上' },
    { value: [3, 4, 5], label: '3 星以上' },
    { value: [1, 2], label: '2 星以下' }
  ],
  sort: [
    { value: 'newest', label: '最新優先' },
    { value: 'oldest', label: '最舊優先' },
    { value: 'rating_high', label: '評分高到低' },
    { value: 'rating_low', label: '評分低到高' },
    { value: 'helpful', label: '最有用' },
    { value: 'trending', label: '熱門討論' }
  ]
};

/**
 * 服務頁面評論整合主組件
 */
export default function ServicePageReviewIntegration({
  serviceId,
  serviceName,
  guideId,
  guideName,
  userBookingId,
  allowReviewSubmission = true,
  className = ''
}: ServicePageReviewIntegrationProps) {
  const { user } = useAuth();

  // 狀態管理
  const [reviews, setReviews] = useState<Review[]>([]);
  const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  // 篩選和搜尋狀態
  const [filters, setFilters] = useState<ReviewFilters>({
    sortBy: 'newest',
    page: 1,
    limit: 10
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'submit'>('overview');

  // 分頁狀態
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  /**
   * 載入評論數據
   */
  const fetchReviews = async (loadMore = false) => {
    if (loadMore) {
      setLoadingMore(true);
    } else {
      setIsLoading(true);
      setError(null);
    }

    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成模擬評論數據
      const mockReviews: Review[] = Array.from({ length: loadMore ? 5 : 20 }, (_, i) => {
        const baseIndex = loadMore ? reviews.length + i : i;
        return {
          id: `review-${serviceId}-${baseIndex + 1}`,
          orderId: `order-${Math.floor(Math.random() * 100)}`,
          reviewerId: `user-${Math.floor(Math.random() * 50)}`,
          revieweeId: guideId,
          reviewerType: 'TRAVELER',
          rating: {
            overall: Math.floor(Math.random() * 5) + 1,
            communication: Math.floor(Math.random() * 5) + 1,
            punctuality: Math.floor(Math.random() * 5) + 1,
            knowledge: Math.floor(Math.random() * 5) + 1,
            friendliness: Math.floor(Math.random() * 5) + 1,
            value: Math.floor(Math.random() * 5) + 1,
            safety: Math.floor(Math.random() * 5) + 1,
            flexibility: Math.floor(Math.random() * 5) + 1,
            professionalism: Math.floor(Math.random() * 5) + 1
          },
          title: Math.random() > 0.6 ? '很棒的服務體驗！' : undefined,
          comment: [
            '這是一次非常棒的旅遊體驗！導遊非常專業，對當地的歷史和文化了解很深，講解生動有趣。行程安排得很合理，時間充裕，不會感到匆忙。特別推薦給喜歡深度遊的朋友們！',
            '服務很不錯，導遊準時到達，態度親切。帶我們去了很多當地人才知道的景點，拍了很多美照。唯一的小建議是希望能提供更多關於當地美食的介紹。',
            '超級滿意！導遊不僅專業知識豐富，而且很會照顧我們的需求。路線安排得很好，避開了人潮，讓我們能好好欣賞風景。價格也很合理，性價比很高！',
            '整體體驗不錯，導遊很友善，也很有耐心。行程內容豐富，學到了很多當地的歷史文化知識。建議可以在某些景點多停留一些時間。',
            '很棒的一日遊！導遊英文很好，溝通無障礙。帶我們體驗了當地的特色活動，還推薦了很棒的餐廳。會推薦給其他朋友！',
            '服務態度很好，行程安排也不錯。導遊對當地很熟悉，帶我們避開了擁擠的觀光路線。不過希望能提供更多拍照的機會和建議。'
          ][Math.floor(Math.random() * 6)] || '',
          pros: Math.random() > 0.3 ? [
            ['專業知識豐富', '準時可靠', '路線安排佳'][Math.floor(Math.random() * 3)]!,
            ['溝通良好', '服務周到', '價格合理'][Math.floor(Math.random() * 3)]!
          ] : [],
          cons: Math.random() > 0.7 ? [
            ['時間稍緊', '人數較多', '某些景點停留時間短'][Math.floor(Math.random() * 3)]!
          ] : [],
          tags: Math.random() > 0.4 ? [
            ['專業', '準時', '友善', '知識豐富'][Math.floor(Math.random() * 4)]!,
            ['推薦', '值得', '滿意'][Math.floor(Math.random() * 3)]!
          ] : [],
          photos: Math.random() > 0.6 ? Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, photoIndex) => ({
            id: `photo-${baseIndex}-${photoIndex}`,
            url: `/images/review-${baseIndex}-${photoIndex}.jpg`,
            uploadedAt: new Date().toISOString(),
            fileSize: 1024000
          })) : [],
          status: 'APPROVED',
          isAnonymous: Math.random() > 0.9,
          isVerified: Math.random() > 0.2,
          isFeatured: Math.random() > 0.95,
          isEdited: false,
          helpfulCount: Math.floor(Math.random() * 30),
          unhelpfulCount: Math.floor(Math.random() * 5),
          viewCount: Math.floor(Math.random() * 150) + 50,
          shareCount: Math.floor(Math.random() * 10),
          service: {
            id: serviceId,
            title: serviceName,
            location: '台北市',
            category: '文化導覽',
            price: 1500,
            guide: {
              id: guideId,
              name: guideName,
              avatar: `/avatars/guide-${guideId}.jpg`,
              isVerified: true
            }
          },
          booking: {
            id: `booking-${baseIndex}`,
            bookingDate: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
            serviceDate: new Date(Date.now() - Math.random() * 86400000 * 60).toISOString(),
            guests: Math.floor(Math.random() * 4) + 1,
            totalPrice: 1500,
            duration: 4
          },
          reviewer: {
            id: `user-${Math.floor(Math.random() * 50)}`,
            name: `旅客${baseIndex + 1}`,
            avatar: Math.random() > 0.5 ? `/avatars/user-${baseIndex}.jpg` : undefined,
            isVerified: Math.random() > 0.4,
            totalReviews: Math.floor(Math.random() * 15) + 1,
            averageRating: 3.5 + Math.random() * 1.5,
            joinedAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
            nationality: ['台灣', '日本', '美國', '韓國', '新加坡'][Math.floor(Math.random() * 5)]
          },
          responses: Math.random() > 0.4 ? [{
            id: `response-${baseIndex}`,
            reviewId: `review-${serviceId}-${baseIndex + 1}`,
            authorId: guideId,
            authorType: 'GUIDE' as ResponderType,
            content: [
              '謝謝您的評價！很高興能為您提供滿意的服務，希望這次的旅程為您留下美好的回憶。',
              '感謝您的建議！我們會繼續改進服務品質，希望下次有機會再為您服務。',
              '非常感謝您的推薦！能獲得您的認可是我們最大的鼓勵，期待與您再次相遇。',
              '謝謝您的回饋！我們會根據您的建議調整行程安排，提供更好的體驗。'
            ][Math.floor(Math.random() * 4)] || '',
            isOfficial: true,
            createdAt: new Date(Date.now() - Math.random() * 86400000 * 20).toISOString(),
            updatedAt: new Date().toISOString(),
            author: {
              id: guideId,
              name: guideName,
              avatar: `/avatars/guide-${guideId}.jpg`
            }
          }] : [],
          reports: [],
          helpfulVotes: [],
          createdAt: new Date(Date.now() - Math.random() * 86400000 * 90).toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: new Date(Date.now() - Math.random() * 86400000 * 85).toISOString()
        };
      });

      // 生成統計數據
      const allReviews = loadMore ? [...reviews, ...mockReviews] : mockReviews;
      const mockStatistics: ReviewStatistics = {
        totalReviews: allReviews.length,
        averageRating: allReviews.reduce((sum, r) => sum + r.rating.overall, 0) / allReviews.length,
        totalRatings: allReviews.length,
        ratingDistribution: allReviews.reduce((dist, r) => {
          dist[r.rating.overall] = (dist[r.rating.overall] || 0) + 1;
          return dist;
        }, {} as Record<number, number>),
        dimensionAverages: {
          communication: allReviews.reduce((sum, r) => sum + (r.rating.communication || 0), 0) / allReviews.filter(r => r.rating.communication).length,
          punctuality: allReviews.reduce((sum, r) => sum + (r.rating.punctuality || 0), 0) / allReviews.filter(r => r.rating.punctuality).length,
          knowledge: allReviews.reduce((sum, r) => sum + (r.rating.knowledge || 0), 0) / allReviews.filter(r => r.rating.knowledge).length,
          friendliness: allReviews.reduce((sum, r) => sum + (r.rating.friendliness || 0), 0) / allReviews.filter(r => r.rating.friendliness).length,
          value: allReviews.reduce((sum, r) => sum + (r.rating.value || 0), 0) / allReviews.filter(r => r.rating.value).length,
          safety: allReviews.reduce((sum, r) => sum + (r.rating.safety || 0), 0) / allReviews.filter(r => r.rating.safety).length,
          flexibility: allReviews.reduce((sum, r) => sum + (r.rating.flexibility || 0), 0) / allReviews.filter(r => r.rating.flexibility).length,
          professionalism: allReviews.reduce((sum, r) => sum + (r.rating.professionalism || 0), 0) / allReviews.filter(r => r.rating.professionalism).length
        },
        verifiedReviewsCount: allReviews.filter(r => r.isVerified).length,
        featuredReviewsCount: allReviews.filter(r => r.isFeatured).length,
        withPhotosCount: allReviews.filter(r => r.photos.length > 0).length,
        withResponsesCount: allReviews.filter(r => r.responses.length > 0).length,
        totalHelpfulVotes: allReviews.reduce((sum, r) => sum + r.helpfulCount, 0),
        totalViews: allReviews.reduce((sum, r) => sum + r.viewCount, 0),
        totalShares: allReviews.reduce((sum, r) => sum + r.shareCount, 0),
        recentReviewsCount: allReviews.filter(r => {
          const reviewDate = new Date(r.createdAt);
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          return reviewDate >= thirtyDaysAgo;
        }).length,
        responseRate: (allReviews.filter(r => r.responses.length > 0).length / allReviews.length) * 100,
        averageResponseTime: 8.5,
        qualityScore: 88,
        recommendationRate: ((allReviews.filter(r => r.rating.overall >= 4).length / allReviews.length) * 100),
        returnCustomerRate: 23.5,
        popularTags: Object.entries(
          allReviews.reduce((tagCounts, review) => {
            review.tags.forEach(tag => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
            return tagCounts;
          }, {} as Record<string, number>)
        )
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([tag, count]) => ({
            tag,
            count,
            percentage: (count / allReviews.length) * 100
          })),
        monthlyTrends: Array.from({ length: 6 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return {
            month: date.toISOString().slice(0, 7),
            reviewCount: Math.floor(Math.random() * 15) + 5,
            averageRating: 4.0 + Math.random() * 1.0
          };
        }).reverse()
      };

      if (loadMore) {
        setReviews(prev => [...prev, ...mockReviews]);
        setHasMore(mockReviews.length === 5);
      } else {
        setReviews(mockReviews);
        setStatistics(mockStatistics);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : '載入評論失敗');
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  /**
   * 應用篩選和搜尋
   */
  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // 搜尋過濾
    if (searchQuery) {
      result = result.filter(review => 
        review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        review.reviewer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 評分過濾
    if (filters.rating && filters.rating.length > 0) {
      result = result.filter(review => filters.rating!.includes(review.rating.overall));
    }

    // 其他過濾條件
    if (filters.verified !== undefined) {
      result = result.filter(review => review.isVerified === filters.verified);
    }

    if (filters.withPhotos) {
      result = result.filter(review => review.photos.length > 0);
    }

    if (filters.withResponses) {
      result = result.filter(review => review.responses.length > 0);
    }

    if (filters.featured) {
      result = result.filter(review => review.isFeatured);
    }

    // 排序
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'rating_high':
          return b.rating.overall - a.rating.overall;
        case 'rating_low':
          return a.rating.overall - b.rating.overall;
        case 'helpful':
          return b.helpfulCount - a.helpfulCount;
        case 'trending':
          return (b.viewCount + b.shareCount) - (a.viewCount + a.shareCount);
        default:
          return 0;
      }
    });

    return result;
  }, [reviews, searchQuery, filters]);

  /**
   * 檢查用戶是否可以提交評論
   */
  const canSubmitReview = useMemo(() => {
    if (!user || !allowReviewSubmission || !userBookingId) return false;
    
    // 檢查是否已經提交過評論
    const existingReview = reviews.find(review => 
      review.reviewer.id === user.id && review.booking?.id === userBookingId
    );
    
    return !existingReview;
  }, [user, allowReviewSubmission, userBookingId, reviews]);

  /**
   * 處理評論提交
   */
  const handleReviewSubmit = useCallback(async (reviewData: ReviewFormData) => {
    if (!user || !userBookingId) {
      throw new Error('用戶未登入或無有效預訂');
    }

    setIsSubmittingReview(true);

    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 創建新評論
      const newReview: Review = {
        id: `review-${Date.now()}`,
        orderId: userBookingId,
        reviewerId: user.id,
        revieweeId: guideId,
        reviewerType: 'TRAVELER',
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        pros: reviewData.pros,
        cons: reviewData.cons,
        tags: reviewData.tags,
        photos: [], // 在實際應用中需要上傳照片並獲取 URL
        status: 'APPROVED',
        isAnonymous: reviewData.isAnonymous,
        isVerified: true,
        isFeatured: false,
        isEdited: false,
        helpfulCount: 0,
        unhelpfulCount: 0,
        viewCount: 0,
        shareCount: 0,
        service: {
          id: serviceId,
          title: serviceName,
          location: '台北市',
          category: '文化導覽',
          price: 1500,
          guide: {
            id: guideId,
            name: guideName,
            isVerified: true
          }
        },
        booking: {
          id: userBookingId,
          bookingDate: new Date().toISOString(),
          serviceDate: new Date().toISOString(),
          guests: 2,
          totalPrice: 1500,
          duration: 4
        },
        reviewer: {
          id: user.id,
          name: user.name || '用戶',
          avatar: user.avatar,
          isVerified: true,
          totalReviews: 1,
          averageRating: reviewData.rating.overall,
          joinedAt: new Date().toISOString(),
          nationality: '台灣'
        },
        responses: [],
        reports: [],
        helpfulVotes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString()
      };

      // 更新評論列表
      setReviews(prev => [newReview, ...prev]);
      
      // 更新統計數據
      if (statistics) {
        const newStats = { ...statistics };
        newStats.totalReviews += 1;
        newStats.averageRating = (newStats.averageRating * (newStats.totalReviews - 1) + reviewData.rating.overall) / newStats.totalReviews;
        newStats.ratingDistribution[reviewData.rating.overall] = (newStats.ratingDistribution[reviewData.rating.overall] || 0) + 1;
        
        setStatistics(newStats);
      }

      setShowReviewForm(false);

    } catch (error) {
      console.error('提交評論失敗:', error);
      throw error;
    } finally {
      setIsSubmittingReview(false);
    }
  }, [user, userBookingId, guideId, serviceId, serviceName, guideName, statistics]);

  /**
   * 處理有用投票
   */
  const handleHelpfulVote = useCallback(async (reviewId: string) => {
    if (!user) return;

    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 300));

      setReviews(prev => prev.map(review => 
        review.id === reviewId
          ? { ...review, helpfulCount: review.helpfulCount + 1 }
          : review
      ));
    } catch (error) {
      console.error('投票失敗:', error);
    }
  }, [user]);

  /**
   * 處理回覆
   */
  const handleReply = useCallback(async (reviewId: string, content: string) => {
    if (!user) return;

    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 500));

      const newResponse = {
        id: `response-${Date.now()}`,
        reviewId,
        authorId: user.id,
        authorType: (user.id === guideId ? 'GUIDE' : 'ADMIN') as ResponderType,
        content,
        isOfficial: user.id === guideId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: user.id,
          name: user.name || '用戶',
          avatar: user.avatar
        }
      };

      setReviews(prev => prev.map(review => 
        review.id === reviewId
          ? { ...review, responses: [...review.responses, newResponse] }
          : review
      ));
    } catch (error) {
      console.error('回覆失敗:', error);
      throw error;
    }
  }, [user, guideId]);

  useEffect(() => {
    fetchReviews();
  }, [serviceId]);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border ${className}`} style={{ padding: '24px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ marginTop: '16px', fontSize: '16px', color: '#6b7280' }}>
            載入評論中...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border ${className}`} style={{ padding: '24px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px'
        }}>
          <MessageSquare size={48} color="#ef4444" />
          <p style={{ marginTop: '16px', fontSize: '16px', color: '#ef4444', textAlign: 'center' }}>
            {error}
          </p>
          <button
            onClick={() => fetchReviews()}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg border ${className}`} style={{ padding: '24px' }}>
      {/* 標題和標籤導航 */}
      <div style={{
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '16px'
        }}>
          用戶評論
        </h2>

        {/* 標籤導航 */}
        <div style={{ display: 'flex', gap: '0' }}>
          {[
            { key: 'overview', label: '總覽', icon: BarChart3 },
            { key: 'reviews', label: `評論 (${filteredReviews.length})`, icon: MessageSquare },
            ...(canSubmitReview ? [{ key: 'submit', label: '撰寫評論', icon: Plus }] : [])
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeTab === tab.key ? '#3b82f6' : '#6b7280',
                borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 總覽標籤 */}
      {activeTab === 'overview' && statistics && (
        <div>
          {/* 快速洞察 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              padding: '16px',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#166534', margin: 0 }}>
                  推薦率
                </h4>
                <TrendingUp size={16} color="#059669" />
              </div>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#166534', margin: 0 }}>
                {statistics.recommendationRate.toFixed(1)}%
              </p>
              <p style={{ fontSize: '12px', color: '#166534', margin: '4px 0 0 0' }}>
                {(statistics.ratingDistribution[5] || 0) + (statistics.ratingDistribution[4] || 0)} 位用戶推薦
              </p>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              border: '1px solid #bfdbfe'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af', margin: 0 }}>
                  回覆率
                </h4>
                <MessageSquare size={16} color="#3b82f6" />
              </div>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#1e40af', margin: 0 }}>
                {statistics.responseRate.toFixed(1)}%
              </p>
              <p style={{ fontSize: '12px', color: '#1e40af', margin: '4px 0 0 0' }}>
                平均 {statistics.averageResponseTime} 小時內回覆
              </p>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              border: '1px solid #fde68a'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', margin: 0 }}>
                  附圖評論
                </h4>
                <Camera size={16} color="#d97706" />
              </div>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#92400e', margin: 0 }}>
                {statistics.withPhotosCount}
              </p>
              <p style={{ fontSize: '12px', color: '#92400e', margin: '4px 0 0 0' }}>
                {((statistics.withPhotosCount / statistics.totalReviews) * 100).toFixed(1)}% 包含照片
              </p>
            </div>
          </div>

          {/* 最新評論預覽 */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                最新評論
              </h3>
              <button
                onClick={() => setActiveTab('reviews')}
                style={{
                  fontSize: '14px',
                  color: '#3b82f6',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                查看全部評論 →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredReviews.slice(0, 3).map(review => (
                <EnhancedReviewDisplay
                  key={review.id}
                  review={review}
                  showDetailedRatings={false}
                  maxCommentLength={150}
                  onHelpful={handleHelpfulVote}
                  onReply={handleReply}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 評論列表標籤 */}
      {activeTab === 'reviews' && (
        <div>
          {/* 搜尋和篩選 */}
          <div style={{ marginBottom: '24px' }}>
            {/* 搜尋列 */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280'
                }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜尋評論內容、用戶名稱或標籤..."
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  padding: '12px 16px',
                  backgroundColor: showFilters ? '#dbeafe' : '#f3f4f6',
                  border: `1px solid ${showFilters ? '#3b82f6' : '#d1d5db'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  color: showFilters ? '#1e40af' : '#374151'
                }}
              >
                <Filter size={16} />
                篩選
              </button>

              <button
                onClick={() => fetchReviews()}
                style={{
                  padding: '12px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#374151'
                }}
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {/* 篩選面板 */}
            {showFilters && (
              <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  {/* 評分篩選 */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1f2937',
                      marginBottom: '6px'
                    }}>
                      評分
                    </label>
                    <select
                      value={filters.rating?.join(',') || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const rating = value ? value.split(',').map(Number) : [];
                        setFilters(prev => ({ ...prev, rating: rating.length > 0 ? rating : undefined }));
                      }}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      {FILTER_OPTIONS.rating.map(option => (
                        <option key={option.value.join(',')} value={option.value.join(',')}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 排序 */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1f2937',
                      marginBottom: '6px'
                    }}>
                      排序
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      {FILTER_OPTIONS.sort.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 其他篩選 */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1f2937',
                      marginBottom: '6px'
                    }}>
                      篩選選項
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                        <input
                          type="checkbox"
                          checked={filters.verified === true}
                          onChange={(e) => setFilters(prev => ({ 
                            ...prev, 
                            verified: e.target.checked ? true : undefined 
                          }))}
                        />
                        只顯示已驗證
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                        <input
                          type="checkbox"
                          checked={filters.withPhotos === true}
                          onChange={(e) => setFilters(prev => ({ 
                            ...prev, 
                            withPhotos: e.target.checked || undefined 
                          }))}
                        />
                        含照片評論
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                        <input
                          type="checkbox"
                          checked={filters.withResponses === true}
                          onChange={(e) => setFilters(prev => ({ 
                            ...prev, 
                            withResponses: e.target.checked || undefined 
                          }))}
                        />
                        有回覆評論
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 評論列表 */}
          <div>
            {filteredReviews.length === 0 ? (
              <div style={{
                padding: '48px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <MessageSquare size={48} style={{ margin: '0 auto 16px' }} />
                <p style={{ fontSize: '16px', margin: '0 0 8px 0' }}>
                  {searchQuery || Object.keys(filters).some(key => key !== 'sortBy' && key !== 'page' && key !== 'limit' && (filters as any)[key])
                    ? '暫無符合條件的評論'
                    : '暫無評論'
                  }
                </p>
                <p style={{ fontSize: '14px', margin: '0' }}>
                  {searchQuery || Object.keys(filters).some(key => key !== 'sortBy' && key !== 'page' && key !== 'limit' && (filters as any)[key])
                    ? '嘗試調整搜尋或篩選條件'
                    : '成為第一個評論的用戶！'
                  }
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredReviews.map(review => (
                  <EnhancedReviewDisplay
                    key={review.id}
                    review={review}
                    showDetailedRatings={true}
                    allowInteractions={true}
                    allowReplies={true}
                    allowReporting={true}
                    allowSharing={true}
                    onHelpful={handleHelpfulVote}
                    onReply={handleReply}
                  />
                ))}

                {/* 載入更多按鈕 */}
                {hasMore && (
                  <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <button
                      onClick={() => fetchReviews(true)}
                      disabled={loadingMore}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        cursor: loadingMore ? 'not-allowed' : 'pointer',
                        opacity: loadingMore ? 0.6 : 1
                      }}
                    >
                      {loadingMore ? '載入中...' : '載入更多評論'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 撰寫評論標籤 */}
      {activeTab === 'submit' && canSubmitReview && (
        <div>
          <ComprehensiveReviewForm
            orderId={userBookingId!}
            revieweeId={guideId}
            reviewerType="TRAVELER"
            serviceName={serviceName}
            revieweeName={guideName}
            onSubmit={handleReviewSubmit}
            onCancel={() => setActiveTab('overview')}
            isLoading={isSubmittingReview}
          />
        </div>
      )}

      {/* CSS 動畫 */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}