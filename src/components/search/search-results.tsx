'use client';

import React from 'react';
import { Star, MapPin, Clock, Users, Heart, Share } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SearchResultsProps {
  results: SearchResult[];
  loading?: boolean;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  onLoadMore?: () => void;
  onFavorite?: (serviceId: string) => void;
  onShare?: (service: SearchResult) => void;
  className?: string;
}

interface SearchResult {
  id: string;
  title: string;
  shortDescription?: string;
  location: string;
  price: number;
  currency: string;
  durationHours: number;
  maxGuests: number;
  images: string[];
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  popularity: number;
  guide: {
    id: string;
    name: string;
    avatar?: string;
    userProfile?: {
      languages: string[];
      experienceYears?: number;
    };
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function SearchResults({
  results,
  loading = false,
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  onLoadMore,
  onFavorite,
  onShare,
  className = ''
}: SearchResultsProps) {

  const handleFavorite = (serviceId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavorite?.(serviceId);
  };

  const handleShare = (service: SearchResult, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(service);
  };

  const formatDuration = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}分鐘`;
    } else if (hours === 1) {
      return '1小時';
    } else if (hours < 24) {
      return `${hours}小時`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return remainingHours === 0 ? `${days}天` : `${days}天${remainingHours}小時`;
    }
  };

  const renderStars = (rating: number, reviewCount: number) => (
    <div className="flex items-center space-x-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : i < rating
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600">
        {rating > 0 ? rating.toFixed(1) : '暫無評分'}
      </span>
      {reviewCount > 0 && (
        <span className="text-sm text-gray-500">
          ({reviewCount})
        </span>
      )}
    </div>
  );

  if (loading && results.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
            <div className="flex">
              <div className="w-64 h-48 bg-gray-300 flex-shrink-0"></div>
              <div className="flex-1 p-6">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-4 w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <MapPin className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">找不到符合條件的服務</h3>
          <p className="text-gray-600 mb-4">
            試試調整搜尋條件或篩選器，或許能找到您想要的服務
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>• 擴大搜尋範圍或地點</p>
            <p>• 調整價格或時間範圍</p>
            <p>• 嘗試不同的關鍵字</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 結果統計 */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-gray-700">
          找到 <span className="font-medium">{totalCount}</span> 個結果
          {totalCount > 0 && (
            <span className="text-gray-500 ml-2">
              第 {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, totalCount)} 項
            </span>
          )}
        </div>
      </div>

      {/* 搜尋結果列表 */}
      <div className="space-y-6">
        {results.map((service) => (
          <Link
            key={service.id}
            href={`/services/${service.id}`}
            className="block bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden group"
          >
            <div className="flex flex-col md:flex-row">
              {/* 圖片 */}
              <div className="relative w-full md:w-80 h-48 md:h-64 flex-shrink-0 overflow-hidden">
                {service.images.length > 0 ? (
                  <Image
                    src={service.images[0] || '/images/placeholder.jpg'}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                {/* 收藏和分享按鈕 */}
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={(e) => handleFavorite(service.id, e)}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                    title="加入收藏"
                  >
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                  </button>
                  <button
                    onClick={(e) => handleShare(service, e)}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                    title="分享"
                  >
                    <Share className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* 分類標籤 */}
                {service.category && (
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-block px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                      {service.category.name}
                    </span>
                  </div>
                )}

                {/* 熱門標籤 */}
                {service.popularity >= 3 && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs rounded">
                      熱門
                    </span>
                  </div>
                )}
              </div>

              {/* 內容 */}
              <div className="flex-1 p-6">
                <div className="flex flex-col h-full">
                  {/* 標題和評分 */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {service.title}
                      </h3>
                      <div className="flex-shrink-0 ml-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            NT$ {service.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">每人</div>
                        </div>
                      </div>
                    </div>

                    {/* 描述 */}
                    {service.shortDescription && (
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {service.shortDescription}
                      </p>
                    )}

                    {/* 服務信息 */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{service.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(service.durationHours)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>最多 {service.maxGuests} 人</span>
                      </div>
                    </div>

                    {/* 評分 */}
                    <div className="mb-4">
                      {renderStars(service.averageRating, service.totalReviews)}
                    </div>
                  </div>

                  {/* 嚮導信息 */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {service.guide.avatar ? (
                          <Image
                            src={service.guide.avatar}
                            alt={service.guide.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                            {service.guide.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {service.guide.name}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          {service.guide.userProfile?.experienceYears && (
                            <span>{service.guide.userProfile.experienceYears}年經驗</span>
                          )}
                          {service.guide.userProfile?.languages && service.guide.userProfile.languages.length > 0 && (
                            <span>• {service.guide.userProfile.languages.join(', ')}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 預訂統計 */}
                    {service.totalBookings > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {service.totalBookings} 次預訂
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 載入更多按鈕 */}
      {totalPages > currentPage && onLoadMore && (
        <div className="text-center mt-8">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '載入中...' : '載入更多'}
          </button>
        </div>
      )}
    </div>
  );
}