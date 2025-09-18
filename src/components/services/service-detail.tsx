'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Calendar,
  Heart, 
  Share, 
  ChevronLeft, 
  ChevronRight,
  Check,
  X,
  Camera,
  MessageCircle,
  Shield,
  Award,
  Globe,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import BookingModal from './booking-modal';

interface ServiceData {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  price: number;
  location: string;
  duration: number;
  maxGuests: number;
  minGuests?: number;
  images: string[];
  highlights: string[];
  included: string[];
  excluded: string[];
  cancellationPolicy?: string;
  category?: {
    id: string;
    name: string;
  };
  stats: {
    averageRating: number;
    totalReviews: number;
    totalBookings: number;
    ratingDistribution: Record<number, number>;
  };
  availability: {
    availableDates: string[];
    bookedDates: string[];
  };
  guide: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
    location?: string;
    languages: string[];
    specialties: string[];
    experienceYears?: number;
  };
  reviews: Array<{
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    isAnonymous: boolean;
    reviewer?: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>;
}

interface ServiceDetailProps {
  serviceId: string;
}

export default function ServiceDetail({ serviceId }: ServiceDetailProps) {
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/services/${serviceId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch service');
        }

        const apiResponse = await response.json();
        setService(apiResponse.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入服務資料失敗');
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextImage = () => {
    if (service && service.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % service.images.length);
    }
  };

  const prevImage = () => {
    if (service && service.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + service.images.length) % service.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error || '找不到服務資料'}</div>
          <Link
            href="/guides"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回嚮導列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            返回
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            {service.images.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-96">
                  <img
                    src={service.images[currentImageIndex]}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {service.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {service.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => setIsFavorited(!isFavorited)}
                      className={`p-2 rounded-full transition-colors ${
                        isFavorited ? 'bg-red-500 text-white' : 'bg-white bg-opacity-90 text-gray-600 hover:bg-opacity-100'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 bg-white bg-opacity-90 text-gray-600 rounded-full hover:bg-opacity-100">
                      <Share className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Service Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {service.category?.name || '未分類'}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {service.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration} 小時
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      最多 {service.maxGuests} 人
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                      <span className="text-lg font-semibold">{service.stats.averageRating}</span>
                      <span className="text-gray-600 ml-1">({service.stats.totalReviews} 評論)</span>
                    </div>
                    <div className="text-gray-600">
                      {service.stats.totalBookings} 次預訂
                    </div>
                  </div>
                </div>
              </div>

              {service.description && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{service.description}</p>
                </div>
              )}

              {/* Highlights */}
              {service.highlights.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.highlights.map((highlight, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                      {highlight}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Guide Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">關於您的嚮導</h2>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden">
                    {service.guide.avatar ? (
                      <img
                        src={service.guide.avatar}
                        alt={service.guide.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-semibold">
                        {service.guide.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{service.guide.name}</h3>
                    <Link
                      href={`/guides/${service.guide.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      查看完整檔案
                    </Link>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    {service.guide.location && (
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {service.guide.location}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      {service.guide.experienceYears || 0} 年經驗
                    </div>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                      4.8 (156 則評價)
                    </div>
                  </div>
                  
                  {service.guide.bio && (
                    <p className="text-gray-700 text-sm mb-3">{service.guide.bio}</p>
                  )}
                  
                  <div className="flex items-center space-x-4">
                    {service.guide.languages.length > 0 && (
                      <div className="flex items-center">
                        <Globe className="w-3 h-3 mr-1 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {service.guide.languages.slice(0, 3).join(', ')}
                          {service.guide.languages.length > 3 && ` +${service.guide.languages.length - 3}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Service Highlights */}
            {service.highlights.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">服務亮點</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Included/Excluded */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.included.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">包含項目</h3>
                  <ul className="space-y-2">
                    {service.included.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.excluded.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">不包含項目</h3>
                  <ul className="space-y-2">
                    {service.excluded.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>


            {/* Cancellation Policy */}
            {service.cancellationPolicy && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">取消政策</h3>
                <p className="text-gray-700">{service.cancellationPolicy}</p>
              </div>
            )}

            {/* Reviews */}
            {service.reviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">客戶評價</h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                      <span className="text-lg font-semibold">{service.stats.averageRating}</span>
                      <span className="text-gray-600 ml-1">({service.stats.totalReviews} 評論)</span>
                    </div>
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="mb-6">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = service.stats.ratingDistribution[rating] || 0;
                      const percentage = service.stats.totalReviews > 0 
                        ? (count / service.stats.totalReviews) * 100 
                        : 0;
                      
                      return (
                        <div key={rating} className="flex items-center space-x-3">
                          <div className="flex items-center w-12">
                            <span className="text-sm w-3">{rating}</span>
                            <Star className="w-3 h-3 text-yellow-400 fill-current ml-1" />
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-6">
                  {service.reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {review.isAnonymous || !review.reviewer ? (
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-gray-400 text-xs">匿</span>
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden">
                              {review.reviewer.avatar ? (
                                <img
                                  src={review.reviewer.avatar}
                                  alt={review.reviewer.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-semibold">
                                  {review.reviewer.name.charAt(0)}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">
                              {review.isAnonymous || !review.reviewer ? '匿名用戶' : review.reviewer.name}
                            </h4>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          
                          {review.comment && (
                            <p className="text-gray-700 text-sm">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {service.reviews.length > 5 && (
                  <div className="mt-6 text-center">
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      查看更多評論
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(service.price)}
                </div>
                <div className="text-sm text-gray-600">每人</div>
              </div>

              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                立即預訂
              </button>

              <div className="mt-4 space-y-3">
                <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  聯繫嚮導
                </button>
              </div>

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>即時確認</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span>可使用行動票券</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-3">服務資訊</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>時長</span>
                    <span>{service.duration} 小時</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>最大人數</span>
                    <span>{service.maxGuests} 人</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>語言</span>
                    <span>{service.guide.languages.slice(0, 2).join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          service={service}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
}