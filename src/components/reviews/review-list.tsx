'use client';

import React, { useState, useEffect } from 'react';
import { Star, Filter, SortAsc } from 'lucide-react';
import ReviewCard from './review-card';

interface ReviewListProps {
  serviceId?: string;
  guideId?: string;
  userId?: string;
  showService?: boolean;
  className?: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  photos: string[];
  pros: string[];
  cons: string[];
  tags: string[];
  isAnonymous: boolean;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    avatar?: string;
  };
  service?: {
    id: string;
    title: string;
    location: string;
    guide: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
  booking?: {
    id: string;
    bookingDate: string;
    guests: number;
  };
  responses?: Array<{
    id: string;
    content: string;
    authorType: 'GUIDE' | 'ADMIN';
    createdAt: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
      role: string;
    };
  }>;
  helpful?: Array<{
    userId: string;
  }>;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

export default function ReviewList({
  serviceId,
  guideId,
  userId,
  showService = false,
  className = ''
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 篩選和排序狀態
  const [filters, setFilters] = useState({
    rating: 0,
    verified: null as boolean | null,
    sortBy: 'newest' as 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful'
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchReviews = async (loadMore = false) => {
    try {
      if (!loadMore) {
        setLoading(true);
      }

      const params = new URLSearchParams();
      if (serviceId) params.append('serviceId', serviceId);
      if (guideId) params.append('guideId', guideId);
      if (userId) params.append('userId', userId);
      if (filters.rating) params.append('rating', filters.rating.toString());
      if (filters.verified !== null) params.append('verified', filters.verified.toString());
      params.append('page', (loadMore ? page + 1 : 1).toString());
      params.append('limit', '10');

      const response = await fetch(`/api/reviews?${params.toString()}`);
      if (!response.ok) {
        throw new Error('載入評論失敗');
      }

      const data = await response.json();
      
      if (loadMore) {
        setReviews(prev => [...prev, ...data.data.reviews]);
        setPage(prev => prev + 1);
      } else {
        setReviews(data.data.reviews);
        setStats(data.data.stats);
        setPage(1);
      }

      setHasMore(data.data.reviews.length === 10);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [serviceId, guideId, userId, filters.rating, filters.verified]);

  const handleHelpful = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(reviews.map(review => 
          review.id === reviewId
            ? { 
                ...review, 
                helpfulCount: data.data.helpfulCount,
                helpful: [...(review.helpful || []), { userId: 'current-user' }]
              }
            : review
        ));
      }
    } catch (error) {
      console.error('Mark helpful error:', error);
    }
  };

  const handleUnhelpful = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(reviews.map(review => 
          review.id === reviewId
            ? { 
                ...review, 
                helpfulCount: data.data.helpfulCount,
                helpful: review.helpful?.filter(h => h.userId !== 'current-user') || []
              }
            : review
        ));
      }
    } catch (error) {
      console.error('Remove helpful error:', error);
    }
  };

  const handleReply = (reviewId: string) => {
    // TODO: 實現回復功能
    console.log('Reply to review:', reviewId);
  };

  const renderRatingFilter = () => {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">評分篩選：</span>
        <div className="flex space-x-1">
          <button
            onClick={() => setFilters({ ...filters, rating: 0 })}
            className={`px-3 py-1 rounded-full text-sm ${
              filters.rating === 0
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {[5, 4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => setFilters({ ...filters, rating })}
              className={`flex items-center px-3 py-1 rounded-full text-sm ${
                filters.rating === rating
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {rating}
              <Star className="w-3 h-3 ml-1 fill-current text-yellow-400" />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderStats = () => {
    if (stats.totalReviews === 0) return null;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center space-x-1 mt-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(stats.averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                共 {stats.totalReviews} 則評論
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-md ml-8">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center space-x-2 mb-1">
                <span className="text-sm text-gray-600 w-8">{rating}星</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${stats.totalReviews > 0 
                        ? ((stats.ratingDistribution[rating] || 0) / stats.totalReviews) * 100 
                        : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {stats.ratingDistribution[rating] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading && reviews.length === 0) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">載入評論中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchReviews()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          重新載入
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 統計信息 */}
      {renderStats()}

      {/* 篩選和排序 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
          {renderRatingFilter()}
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filters.verified === null ? 'all' : filters.verified.toString()}
              onChange={(e) => setFilters({
                ...filters,
                verified: e.target.value === 'all' ? null : e.target.value === 'true'
              })}
              className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部評論</option>
              <option value="true">已驗證評論</option>
              <option value="false">未驗證評論</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <SortAsc className="w-4 h-4 text-gray-500" />
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({
                ...filters,
                sortBy: e.target.value as any
              })}
              className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">最新優先</option>
              <option value="oldest">最舊優先</option>
              <option value="rating_high">評分高到低</option>
              <option value="rating_low">評分低到高</option>
              <option value="helpful">最有用</option>
            </select>
          </div>
        </div>
      </div>

      {/* 評論列表 */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">尚無評論</p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              showService={showService}
              onHelpful={handleHelpful}
              onUnhelpful={handleUnhelpful}
              onReply={handleReply}
            />
          ))
        )}
      </div>

      {/* 載入更多 */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => fetchReviews(true)}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? '載入中...' : '載入更多'}
          </button>
        </div>
      )}
    </div>
  );
}