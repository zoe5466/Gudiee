'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface ReviewStatsProps {
  stats: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
  };
  className?: string;
}

export default function ReviewStats({ stats, className = '' }: ReviewStatsProps) {
  if (stats.totalReviews === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 text-center ${className}`}>
        <div className="text-gray-500">
          <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p className="text-lg font-medium">尚無評論</p>
          <p className="text-sm">成為第一個評論的用戶！</p>
        </div>
      </div>
    );
  }

  const getRatingLabel = (rating: number) => {
    switch (Math.round(rating)) {
      case 5: return '優秀';
      case 4: return '很好';
      case 3: return '一般';
      case 2: return '較差';
      case 1: return '很差';
      default: return '一般';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-start space-x-8">
        {/* 整體評分 */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center space-x-1 mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(stats.averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-600">
            {getRatingLabel(stats.averageRating)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            共 {stats.totalReviews} 則評論
          </div>
        </div>

        {/* 評分分布 */}
        <div className="flex-1 max-w-md">
          <h4 className="text-sm font-medium text-gray-700 mb-3">評分分布</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = stats.ratingDistribution[rating] || 0;
              const percentage = stats.totalReviews > 0 
                ? (count / stats.totalReviews) * 100 
                : 0;

              return (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600 w-2">{rating}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  </div>
                  
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                    <span className="text-xs text-gray-500">
                      ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 額外統計 */}
        <div className="text-right">
          <div className="space-y-3">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round((stats.ratingDistribution[5] || 0) + (stats.ratingDistribution[4] || 0))}
              </div>
              <div className="text-xs text-gray-600">好評數量</div>
            </div>
            
            <div>
              <div className="text-lg font-semibold text-blue-600">
                {stats.totalReviews > 0 
                  ? Math.round(((stats.ratingDistribution[5] || 0) + (stats.ratingDistribution[4] || 0)) / stats.totalReviews * 100)
                  : 0}%
              </div>
              <div className="text-xs text-gray-600">好評率</div>
            </div>

            {stats.ratingDistribution[5] && (
              <div>
                <div className="text-lg font-semibold text-yellow-600">
                  {Math.round((stats.ratingDistribution[5] / stats.totalReviews) * 100)}%
                </div>
                <div className="text-xs text-gray-600">五星好評</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 評分趨勢指示器 */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">
                推薦度: {stats.averageRating >= 4 ? '高' : stats.averageRating >= 3 ? '中等' : '較低'}
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                stats.totalReviews >= 10 ? 'bg-blue-500' : 
                stats.totalReviews >= 5 ? 'bg-yellow-500' : 'bg-gray-400'
              }`}></div>
              <span className="text-gray-600">
                評論量: {stats.totalReviews >= 10 ? '充足' : stats.totalReviews >= 5 ? '一般' : '較少'}
              </span>
            </div>
          </div>

          {stats.averageRating >= 4.5 && stats.totalReviews >= 10 && (
            <div className="flex items-center space-x-1 text-yellow-600">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-medium">優質服務</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}