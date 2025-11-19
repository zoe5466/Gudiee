'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Star, 
  MapPin, 
  MessageCircle, 
  Heart, 
  Share, 
  Calendar, 
  Users, 
  Clock,
  Award,
  CheckCircle,
  Globe,
  Camera,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Shield
} from 'lucide-react';

interface GuideProfileData {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  languages: string[];
  specialties: string[];
  experienceYears?: number;
  certifications: string[];
  socialLinks: Record<string, string>;
  memberSince: string;
  verifications: {
    email: boolean;
    phone: boolean;
    identity: boolean;
    profile: boolean;
  };
  stats: {
    averageRating: number;
    totalReviews: number;
    totalBookings: number;
    totalEarnings: number;
    monthlyBookings: number;
    monthlyEarnings: number;
    activeServices: number;
    responseRate: number;
    responseTime: number;
  };
  ratingDistribution: Record<number, number>;
  services: Array<{
    id: string;
    title: string;
    description?: string;
    price: number;
    location: string;
    duration: number;
    maxGuests: number;
    images: string[];
    averageRating: number;
    totalReviews: number;
    totalBookings: number;
    category: {
      name: string;
    };
  }>;
  recentReviews: Array<{
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
    service: {
      id: string;
      title: string;
    };
  }>;
}

interface GuideProfileProps {
  guideId: string;
}

export default function GuideProfile({ guideId }: GuideProfileProps) {
  const [guide, setGuide] = useState<GuideProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServiceImages, setSelectedServiceImages] = useState<Record<string, number>>({});
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/guides/${guideId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch guide profile');
        }

        const apiResponse = await response.json();
        const data: GuideProfileData = apiResponse.data;
        setGuide(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入嚮導資料失敗');
      } finally {
        setLoading(false);
      }
    };

    if (guideId) {
      fetchGuide();
    }
  }, [guideId]);

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
      month: 'long'
    });
  };

  const nextServiceImage = (serviceId: string, totalImages: number) => {
    setSelectedServiceImages(prev => ({
      ...prev,
      [serviceId]: ((prev[serviceId] || 0) + 1) % totalImages
    }));
  };

  const prevServiceImage = (serviceId: string, totalImages: number) => {
    setSelectedServiceImages(prev => ({
      ...prev,
      [serviceId]: ((prev[serviceId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  if (loading) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-start space-x-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen bg-[#cfdbe9] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error || '找不到嚮導資料'}</div>
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
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/guides"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            返回嚮導列表
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gray-100 rounded-full overflow-hidden">
                      {guide.avatar ? (
                        <img
                          src={guide.avatar}
                          alt={guide.name || 'Guide avatar'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-semibold">
                          {guide.name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{guide.name || 'Unknown Guide'}</h1>
                      {guide.verifications.identity && (
                        <div className="flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          已認證
                        </div>
                      )}
                    </div>
                    
                    {guide.location && (
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-2" />
                        {guide.location}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-6 mb-4">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                        <span className="text-xl font-semibold text-gray-900">{guide.stats.averageRating}</span>
                        <span className="text-gray-600 ml-1">({guide.stats.totalReviews} 評論)</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {guide.stats.totalBookings} 次預訂
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {guide.experienceYears || 0} 年經驗
                      </div>
                    </div>

                    {guide.bio && (
                      <p className="text-gray-700 leading-relaxed">{guide.bio}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-2 rounded-lg transition-colors ${
                      isFavorited ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-[#cfdbe9] rounded-lg">
                    <Share className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Languages and Specialties */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {guide.languages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      語言能力
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {guide.languages.map((lang, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {guide.specialties.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      專業領域
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {guide.specialties.map((specialty, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">提供的服務</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guide.services.map((service) => {
                  const currentImageIndex = selectedServiceImages[service.id] || 0;
                  return (
                    <div key={service.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {service.images.length > 0 && (
                        <div className="relative h-48 bg-gray-200">
                          <img
                            src={service.images[currentImageIndex]}
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                          {service.images.length > 1 && (
                            <>
                              <button
                                onClick={() => prevServiceImage(service.id, service.images.length)}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => nextServiceImage(service.id, service.images.length)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                {service.images.map((_, index) => (
                                  <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${
                                      index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                          <span className="text-lg font-bold text-blue-600">{formatPrice(service.price)}</span>
                        </div>
                        
                        {service.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {service.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {service.duration} 小時
                          </div>
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            最多 {service.maxGuests} 人
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="font-medium">{service.averageRating}</span>
                            <span className="text-gray-500 ml-1">({service.totalReviews})</span>
                          </div>
                          
                          <Link
                            href={`/services/${service.id}`}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            查看詳情
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews */}
            {guide.recentReviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">最新評價</h2>
                <div className="space-y-6">
                  {guide.recentReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {review.isAnonymous || !review.reviewer ? (
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-gray-400 text-sm">匿</span>
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
                              {review.reviewer.avatar ? (
                                <img
                                  src={review.reviewer.avatar}
                                  alt={review.reviewer.name || 'Reviewer avatar'}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-semibold">
                                  {review.reviewer.name?.charAt(0) || '?'}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h4 className="font-medium text-gray-900">
                              {review.isAnonymous || !review.reviewer ? '匿名用戶' : review.reviewer.name || '未知用戶'}
                            </h4>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-2">{review.comment}</p>
                          
                          <div className="text-sm text-gray-500">
                            服務項目: {review.service.title}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">聯繫嚮導</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">平均回覆時間</span>
                  <span className="font-medium">{guide.stats.responseTime} 小時內</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">回覆率</span>
                  <span className="font-medium">{guide.stats.responseRate}%</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  發送訊息
                </button>
                
                {guide.verifications.phone && (
                  <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-[#cfdbe9] transition-colors">
                    <Phone className="w-4 h-4 mr-2" />
                    致電詢問
                  </button>
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">統計資料</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">總預訂數</span>
                  <span className="font-semibold">{guide.stats.totalBookings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">本月預訂</span>
                  <span className="font-semibold">{guide.stats.monthlyBookings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">活躍服務</span>
                  <span className="font-semibold">{guide.stats.activeServices}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">加入時間</span>
                  <span className="font-semibold">{formatDate(guide.memberSince)}</span>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">評分分佈</h3>
              
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = guide.ratingDistribution[rating] || 0;
                  const percentage = guide.stats.totalReviews > 0 
                    ? (count / guide.stats.totalReviews) * 100 
                    : 0;
                  
                  return (
                    <div key={rating} className="flex items-center space-x-3">
                      <div className="flex items-center">
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

            {/* Verifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">身份驗證</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className={`w-5 h-5 ${guide.verifications.email ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className="text-sm">電子信箱驗證</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className={`w-5 h-5 ${guide.verifications.phone ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className="text-sm">手機號碼驗證</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className={`w-5 h-5 ${guide.verifications.identity ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className="text-sm">身份證件驗證</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className={`w-5 h-5 ${guide.verifications.profile ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className="text-sm">個人檔案完整</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}