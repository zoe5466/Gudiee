'use client';

import { useState, useEffect } from 'react';
import { Star, Users } from 'lucide-react';

interface ReviewsSummaryProps {
  serviceId?: string;
  guideId?: string;
  className?: string;
  showDetails?: boolean;
}

interface ReviewsStatistics {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

export function ReviewsSummary({ 
  serviceId, 
  guideId, 
  className = '',
  showDetails = false 
}: ReviewsSummaryProps) {
  const [statistics, setStatistics] = useState<ReviewsStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, [serviceId, guideId]);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams();
      if (serviceId) params.append('serviceId', serviceId);
      if (guideId) params.append('guideId', guideId);
      params.append('limit', '1'); // 只獲取統計資料

      const response = await fetch(`/api/reviews?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('獲取評價統計失敗');
      }

      const data = await response.json();
      setStatistics(data.statistics);
    } catch (err) {
      console.error('獲取評價統計失敗:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4'
    };

    return (
      <div style={{ display: 'flex', gap: '0.125rem' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            style={{
              color: star <= rating ? '#f59e0b' : '#e5e7eb',
              fill: star <= rating ? '#f59e0b' : 'none'
            }}
            className={sizeClasses[size]}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={className}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '5rem', height: '1rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem' }} />
          <div style={{ width: '3rem', height: '1rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem' }} />
        </div>
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className={className}>
      {statistics.totalReviews === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
          <Star style={{ width: '1rem', height: '1rem' }} />
          <span>暫無評價</span>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* 星級評分 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {renderStars(Math.round(statistics.averageRating))}
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
              {statistics.averageRating}
            </span>
          </div>

          {/* 評價數量 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280', fontSize: '0.875rem' }}>
            <Users style={{ width: '0.875rem', height: '0.875rem' }} />
            <span>{statistics.totalReviews} 則評價</span>
          </div>

          {/* 詳細分布 */}
          {showDetails && (
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: '0.125rem' }}>
                  <span>{rating}★</span>
                  <span>({statistics.ratingDistribution[rating]})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}