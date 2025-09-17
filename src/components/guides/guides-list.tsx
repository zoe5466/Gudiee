'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Users, Sliders, X } from 'lucide-react';
import GuideCard from './guide-card';

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

interface FilterOptions {
  locations: Array<{ location: string; _count: { location: number } }>;
  languages: string[];
  specialties: string[];
}

interface GuideListResponse {
  guides: GuideProfile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: FilterOptions;
}

interface GuidesListProps {
  className?: string;
}

export default function GuidesList({ className = '' }: GuidesListProps) {
  const [guides, setGuides] = useState<GuideProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFilters] = useState<FilterOptions>({
    locations: [],
    languages: [],
    specialties: []
  });

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [minRating, setMinRating] = useState('');
  const [minExperience, setMinExperience] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  const fetchGuides = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        sortOrder
      });

      if (searchQuery) params.append('q', searchQuery);
      if (selectedLocation) params.append('location', selectedLocation);
      if (selectedLanguage) params.append('language', selectedLanguage);
      if (selectedSpecialty) params.append('specialty', selectedSpecialty);
      if (minRating) params.append('minRating', minRating);
      if (minExperience) params.append('minExperience', minExperience);

      const response = await fetch(`/api/guides?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch guides');
      }

      const apiResponse = await response.json();
      const data: GuideListResponse = apiResponse.data;
      setGuides(data.guides);
      setPagination(data.pagination);
      setFilters(data.filters);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入嚮導列表失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides(1);
  }, [searchQuery, selectedLocation, selectedLanguage, selectedSpecialty, minRating, minExperience, sortBy, sortOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGuides(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('');
    setSelectedLanguage('');
    setSelectedSpecialty('');
    setMinRating('');
    setMinExperience('');
    setSortBy('rating');
    setSortOrder('desc');
  };

  const hasActiveFilters = searchQuery || selectedLocation || selectedLanguage || selectedSpecialty || minRating || minExperience;

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => fetchGuides(pagination.page)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          重新載入
        </button>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜尋嚮導姓名或專業..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* Filter Toggle and Sort */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                篩選
                {hasActiveFilters && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                    !
                  </span>
                )}
              </button>

              <select
                value={`${sortBy}_${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('_');
                  setSortBy(newSortBy || 'rating');
                  setSortOrder(newSortOrder as 'asc' | 'desc' || 'desc');
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="rating_desc">評分高到低</option>
                <option value="rating_asc">評分低到高</option>
                <option value="services_desc">服務數量多到少</option>
                <option value="services_asc">服務數量少到多</option>
                <option value="experience_desc">經驗豐富到新手</option>
                <option value="experience_asc">新手到經驗豐富</option>
                <option value="name_asc">姓名 A-Z</option>
                <option value="name_desc">姓名 Z-A</option>
              </select>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    地點
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">所有地點</option>
                    {filters.locations.map((loc) => (
                      <option key={loc.location} value={loc.location}>
                        {loc.location} ({loc._count.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    語言
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">所有語言</option>
                    {filters.languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    專業領域
                  </label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">所有專業</option>
                    {filters.specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最低評分
                  </label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">不限</option>
                    <option value="4.5">4.5+ 星</option>
                    <option value="4">4+ 星</option>
                    <option value="3.5">3.5+ 星</option>
                    <option value="3">3+ 星</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最少經驗年數
                  </label>
                  <select
                    value={minExperience}
                    onChange={(e) => setMinExperience(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">不限</option>
                    <option value="1">1+ 年</option>
                    <option value="2">2+ 年</option>
                    <option value="3">3+ 年</option>
                    <option value="5">5+ 年</option>
                    <option value="10">10+ 年</option>
                  </select>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-4 h-4 mr-1" />
                    清除篩選
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            找到 {pagination.total} 位嚮導
            {hasActiveFilters && (
              <span className="ml-2 text-blue-600">
                (已套用篩選條件)
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            第 {pagination.page} 頁，共 {pagination.pages} 頁
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : guides.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              沒有找到符合條件的嚮導
            </h3>
            <p className="text-gray-600 mb-6">
              試試調整搜尋條件或清除篩選器
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                清除所有篩選
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <button
              onClick={() => fetchGuides(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              上一頁
            </button>

            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              const page = Math.max(1, pagination.page - 2) + i;
              if (page > pagination.pages) return null;

              return (
                <button
                  key={page}
                  onClick={() => fetchGuides(page)}
                  className={`px-3 py-2 border rounded-md ${
                    page === pagination.page
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => fetchGuides(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              下一頁
            </button>
          </div>
        )}
      </div>
    </div>
  );
}