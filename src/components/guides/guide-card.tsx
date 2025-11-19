'use client';

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, MessageCircle, Heart, Users, Calendar } from 'lucide-react';

interface GuideProfile {
  id: string;
  name: string;
  avatar?: string;
  userProfile: {
    bio?: string;
    location?: string;
    languages: string[];
    specialties: string[];
    experienceYears?: number;
  };
  stats: {
    averageRating: number;
    totalReviews: number;
    totalBookings: number;
    activeServices: number;
    responseRate: number;
  };
  guidedServices: Array<{
    id: string;
    title: string;
    price: number;
    location: string;
    images: string[];
  }>;
}

interface GuideCardProps {
  guide: GuideProfile;
  className?: string;
}

export default function GuideCard({ guide, className = '' }: GuideCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const minPrice = Math.min(...guide.guidedServices.map(s => Number(s.price)));

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow touch-manipulation ${className}`}>
      {/* Guide Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full overflow-hidden">
              {guide.avatar ? (
                <img
                  src={guide.avatar}
                  alt={guide.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-semibold">
                  {guide.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                {guide.name}
              </h3>
              <button className="text-gray-400 hover:text-red-500 transition-colors p-1 -m-1 touch-manipulation" style={{minWidth: '32px', minHeight: '32px'}}>
                <Heart className="w-5 h-5" />
              </button>
            </div>
            
            {guide.userProfile.location && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {guide.userProfile.location}
              </div>
            )}
            
            <div className="flex items-center space-x-2 sm:space-x-4 mt-2 flex-wrap gap-1">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="text-sm font-medium text-gray-900">
                  {guide.stats.averageRating}
                </span>
                <span className="text-sm text-gray-600 ml-1">
                  ({guide.stats.totalReviews})
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                {guide.stats.totalBookings} 次預訂
              </div>
            </div>
          </div>
        </div>

        {guide.userProfile.bio && (
          <p className="text-gray-700 text-sm mt-4 line-clamp-2">
            {guide.userProfile.bio}
          </p>
        )}

        {/* Languages and Specialties */}
        <div className="mt-4 space-y-2">
          {guide.userProfile.languages.length > 0 && (
            <div className="flex items-center">
              <span className="text-xs text-gray-500 w-12">語言:</span>
              <div className="flex flex-wrap gap-1">
                {guide.userProfile.languages.slice(0, 3).map((lang, index) => (
                  <span key={index} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                    {lang}
                  </span>
                ))}
                {guide.userProfile.languages.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{guide.userProfile.languages.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {guide.userProfile.specialties.length > 0 && (
            <div className="flex items-center">
              <span className="text-xs text-gray-500 w-12">專長:</span>
              <div className="flex flex-wrap gap-1">
                {guide.userProfile.specialties.slice(0, 2).map((specialty, index) => (
                  <span key={index} className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                    {specialty}
                  </span>
                ))}
                {guide.userProfile.specialties.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{guide.userProfile.specialties.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Services Preview */}
      {guide.guidedServices.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">服務項目</h4>
              <span className="text-xs text-gray-500">
                {guide.stats.activeServices} 項服務
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {guide.guidedServices.slice(0, 2).map((service) => (
                <div key={service.id} className="bg-[#cfdbe9] rounded-lg p-2 sm:p-3">
                  {service.images.length > 0 && (
                    <div className="w-full h-16 sm:h-20 bg-gray-200 rounded mb-2 overflow-hidden">
                      <img
                        src={service.images[0]}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h5 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
                    {service.title}
                  </h5>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {service.location}
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-100 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap gap-1">
            <div className="text-sm text-gray-600 whitespace-nowrap">
              起價 <span className="text-lg font-semibold text-gray-900">{formatPrice(minPrice)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              {guide.userProfile.experienceYears || 0} 年經驗
            </div>
          </div>
          
          <div className="flex space-x-2 self-start sm:self-auto">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation" style={{minWidth: '40px', minHeight: '40px'}}>
              <MessageCircle className="w-4 h-4" />
            </button>
            <Link
              href={`/guides/${guide.id}`}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors touch-manipulation" style={{minHeight: '40px'}}
            >
              查看詳情
            </Link>
          </div>
        </div>
        
        {guide.stats.responseRate > 0 && (
          <div className="mt-3 text-xs text-gray-500">
            回覆率 {guide.stats.responseRate}%
          </div>
        )}
      </div>
    </div>
  );
}