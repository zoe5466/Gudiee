'use client';

import { Star, Shield, TrendingUp, Users } from 'lucide-react';
import { ReviewStatistics } from '@/store/reviews';

interface RatingDisplayProps {
  statistics: ReviewStatistics;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

export function RatingDisplay({ 
  statistics, 
  size = 'md', 
  showDetails = true,
  className = '' 
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: {
      container: 'p-3',
      rating: 'text-2xl',
      stars: 'w-4 h-4',
      text: 'text-sm'
    },
    md: {
      container: 'p-4',
      rating: 'text-3xl',
      stars: 'w-5 h-5',
      text: 'text-base'
    },
    lg: {
      container: 'p-6',
      rating: 'text-4xl',
      stars: 'w-6 h-6',
      text: 'text-lg'
    }
  };

  const classes = sizeClasses[size];

  const renderStars = (rating: number, size: string) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= fullStars
                ? 'text-yellow-400 fill-yellow-400'
                : star === fullStars + 1 && hasHalfStar
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg border ${classes.container} ${className}`}>
      {/* 主要評分顯示 */}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <div className={`font-bold text-gray-900 ${classes.rating}`}>
            {statistics.averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center mb-1">
            {renderStars(statistics.averageRating, classes.stars)}
          </div>
          <div className={`text-gray-600 ${classes.text}`}>
            {statistics.totalReviews} 則評論
          </div>
        </div>

        {showDetails && (
          <div className="flex-1 grid grid-cols-3 gap-4">
            {/* 驗證評論率 */}
            <div className="text-center">
              <div className="flex justify-center mb-1">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-sm font-medium text-gray-900">
                {Math.round((statistics.verifiedReviewsCount / statistics.totalReviews) * 100)}%
              </div>
              <div className="text-xs text-gray-600">已驗證</div>
            </div>

            {/* 回覆率 */}
            <div className="text-center">
              <div className="flex justify-center mb-1">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-sm font-medium text-gray-900">
                {Math.round(statistics.responseRate)}%
              </div>
              <div className="text-xs text-gray-600">回覆率</div>
            </div>

            {/* 有用評價 */}
            <div className="text-center">
              <div className="flex justify-center mb-1">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-sm font-medium text-gray-900">
                {statistics.totalHelpful}
              </div>
              <div className="text-xs text-gray-600">有用</div>
            </div>
          </div>
        )}
      </div>

      {/* 評分分佈 */}
      {showDetails && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-3">評分分佈</h4>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = statistics.ratingDistribution[rating] || 0;
            const percentage = statistics.totalReviews > 0 
              ? (count / statistics.totalReviews) * 100 
              : 0;
            
            return (
              <div key={rating} className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm text-gray-600">{rating}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                </div>
                
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <div className="text-sm text-gray-600 w-8 text-right">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 熱門標籤 */}
      {showDetails && Object.keys(statistics.tags).length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-3">服務特色</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(statistics.tags)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([tag, count]) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag} ({count})
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 簡化版評分顯示
export function SimpleRatingDisplay({ 
  rating, 
  reviewCount, 
  size = 'sm',
  className = '' 
}: {
  rating: number;
  reviewCount: number;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}) {
  const sizeConfig = {
    xs: { stars: 'w-3 h-3', text: 'text-xs' },
    sm: { stars: 'w-4 h-4', text: 'text-sm' },
    md: { stars: 'w-5 h-5', text: 'text-base' }
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${config.stars} ${
              star <= Math.floor(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : star === Math.floor(rating) + 1 && rating % 1 >= 0.5
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className={`font-medium text-gray-900 ${config.text}`}>
        {rating.toFixed(1)}
      </span>
      <span className={`text-gray-500 ${config.text}`}>
        ({reviewCount})
      </span>
    </div>
  );
}