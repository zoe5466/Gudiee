'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle, User, Shield, Flag, MoreVertical, Camera, Clock } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { useReviews, Review } from '@/store/reviews';
import { useAuth } from '@/store/auth';
import { RatingDisplay } from './rating-display';
import { ReviewFiltersComponent } from './review-filters';
import { useToast } from '@/components/ui/toast';

interface ReviewsListProps {
  targetId: string;
  targetType: 'service' | 'guide';
  showTitle?: boolean;
  showFilters?: boolean;
  showStatistics?: boolean;
  maxItems?: number;
  className?: string;
}

export function ReviewsList({ 
  targetId,
  targetType,
  showTitle = true, 
  showFilters = true,
  showStatistics = true,
  maxItems,
  className = ''
}: ReviewsListProps) {
  const { user } = useAuth();
  const { success, error } = useToast();
  const {
    reviews,
    statistics,
    isLoading,
    filters,
    fetchReviews,
    markHelpful,
    reportReview,
    respondToReview,
    setFilters,
    resetFilters
  } = useReviews();

  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [showResponseForm, setShowResponseForm] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    fetchReviews(targetId, targetType);
  }, [targetId, targetType, fetchReviews]);

  // 應用篩選和排序
  useEffect(() => {
    let filtered = [...reviews];

    // 評分篩選
    if (filters.rating && filters.rating.length < 5) {
      filtered = filtered.filter(review => filters.rating!.includes(review.rating));
    }

    // 驗證狀態篩選
    if (filters.verified !== undefined) {
      filtered = filtered.filter(review => review.isVerified === filters.verified);
    }

    // 照片篩選
    if (filters.withPhotos) {
      filtered = filtered.filter(review => review.photos && review.photos.length > 0);
    }

    // 回覆篩選
    if (filters.withResponse) {
      filtered = filtered.filter(review => review.response);
    }

    // 標籤篩選
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(review => 
        review.tags && filters.tags!.some(tag => review.tags!.includes(tag))
      );
    }

    // 日期範圍篩選
    if (filters.dateRange) {
      filtered = filtered.filter(review => {
        const reviewDate = new Date(review.createdAt);
        return reviewDate >= filters.dateRange!.start && reviewDate <= filters.dateRange!.end;
      });
    }

    // 排序
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filtered.sort((a, b) => b.helpful - a.helpful);
        break;
    }

    // 限制數量
    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    setFilteredReviews(filtered);
  }, [reviews, filters, maxItems]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} 小時前`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)} 天前`;
    } else {
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await markHelpful(reviewId);
      success('標記成功', '感謝您的回饋');
    } catch (err) {
      error('操作失敗', '請稍後再試');
    }
  };

  const handleReport = async (reviewId: string) => {
    const reason = prompt('請說明檢舉原因：');
    if (reason) {
      try {
        await reportReview(reviewId, reason);
        success('檢舉成功', '我們會盡快處理');
      } catch (err) {
        error('檢舉失敗', '請稍後再試');
      }
    }
  };

  const handleSubmitResponse = async (reviewId: string) => {
    if (!responseText.trim()) return;

    try {
      await respondToReview(reviewId, responseText.trim());
      setShowResponseForm(null);
      setResponseText('');
      success('回覆成功', '感謝您的回覆');
    } catch (err) {
      error('回覆失敗', '請稍後再試');
    }
  };

  const currentStatistics = statistics[targetId];
  const availableTags = currentStatistics ? Object.keys(currentStatistics.tags) : [];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={className}>
      {/* 標題和統計 */}
      {showTitle && currentStatistics && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">用戶評價</h2>
            <span className="text-sm text-gray-500">
              共 {currentStatistics.totalReviews} 則評論
            </span>
          </div>

          {showStatistics && (
            <RatingDisplay 
              statistics={currentStatistics}
              size="lg"
              className="mb-6"
            />
          )}
        </div>
      )}

      {/* 篩選器 */}
      {showFilters && (
        <ReviewFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
          totalReviews={reviews.length}
          availableTags={availableTags}
          className="mb-6"
        />
      )}

      {/* 評論列表 */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <MessageCircle className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500">暫無符合條件的評論</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
              {/* 評論標題 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {review.isAnonymous ? '匿名用戶' : `用戶 ${review.userId.slice(-4)}`}
                      </span>
                      {review.isVerified && (
                        <Shield className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 評論內容 */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>

              {/* 標籤 */}
              {review.tags && review.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {review.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 優缺點 */}
              {(review.pros || review.cons) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {review.pros && review.pros.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-green-700 mb-2">優點</h4>
                      <ul className="space-y-1">
                        {review.pros.map((pro, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-500 mt-1">+</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.cons && review.cons.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-red-700 mb-2">建議改進</h4>
                      <ul className="space-y-1">
                        {review.cons.map((con, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-red-500 mt-1">-</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* 照片 */}
              {review.photos && review.photos.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Camera className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">評論照片</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {review.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`評論照片 ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 商家回覆 */}
              {review.response && (
                <div className="bg-[#cfdbe9] rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {review.response.authorType === 'guide' ? '導遊回覆' : '官方回覆'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.response.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{review.response.content}</p>
                </div>
              )}

              {/* 回覆表單 */}
              {showResponseForm === review.id && (
                <div className="bg-[#cfdbe9] rounded-lg p-4 mb-4">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="撰寫回覆..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleSubmitResponse(review.id)}
                      disabled={!responseText.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      發布回覆
                    </button>
                    <button
                      onClick={() => {
                        setShowResponseForm(null);
                        setResponseText('');
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-[#cfdbe9]"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}

              {/* 操作按鈕 */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleMarkHelpful(review.id)}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">有用 ({review.helpful})</span>
                  </button>

                  {user && targetType === 'service' && !review.response && (
                    <button
                      onClick={() => setShowResponseForm(review.id)}
                      className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">回覆</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleReport(review.id)}
                  className="flex items-center gap-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Flag className="w-3 h-3" />
                  <span className="text-xs">檢舉</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}