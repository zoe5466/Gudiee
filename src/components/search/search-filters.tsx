'use client';

import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, Star, MapPin, Clock, Users, DollarSign } from 'lucide-react';

interface SearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  priceRange?: { min: number; max: number };
  categories?: Array<{ id: string; name: string; slug: string; count: number }>;
  locations?: Array<{ location: string; count: number }>;
  className?: string;
}

interface FilterState {
  priceMin?: number;
  priceMax?: number;
  category?: string;
  location?: string;
  rating?: number;
  duration?: number[];
  maxGuests?: number;
  tags?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export default function SearchFilters({
  filters,
  onFiltersChange,
  priceRange = { min: 0, max: 10000 },
  categories = [],
  locations = [],
  className = ''
}: SearchFiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    category: true,
    location: false,
    rating: true,
    duration: false,
    features: false
  });

  const sortOptions = [
    { value: 'relevance', label: '相關性', order: 'desc' },
    { value: 'price_low', label: '價格：低到高', order: 'asc' },
    { value: 'price_high', label: '價格：高到低', order: 'desc' },
    { value: 'rating', label: '評分：高到低', order: 'desc' },
    { value: 'newest', label: '最新發布', order: 'desc' },
    { value: 'duration', label: '時長：短到長', order: 'asc' }
  ];

  const ratingOptions = [
    { value: 5, label: '5星' },
    { value: 4, label: '4星以上' },
    { value: 3, label: '3星以上' },
    { value: 2, label: '2星以上' }
  ];

  const durationOptions = [
    { value: [0, 2], label: '2小時內' },
    { value: [2, 4], label: '2-4小時' },
    { value: [4, 8], label: '4-8小時' },
    { value: [8, 24], label: '全天 (8小時以上)' }
  ];

  const guestOptions = [
    { value: 1, label: '1人' },
    { value: 2, label: '2人以上' },
    { value: 4, label: '4人以上' },
    { value: 6, label: '6人以上' },
    { value: 10, label: '10人以上' }
  ];

  const featureTags = [
    '戶外活動', '文化體驗', '美食之旅', '拍照打卡', '親子友善',
    '無障礙設施', '包含交通', '專業導覽', '小團體', '私人訂製'
  ];

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: keyof FilterState) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    updateFilter('tags', newTags.length > 0 ? newTags : undefined);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) count++;
    if (filters.category) count++;
    if (filters.location) count++;
    if (filters.rating) count++;
    if (filters.duration) count++;
    if (filters.maxGuests) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    return count;
  };

  const renderFilterSection = (
    title: string,
    key: string,
    icon: React.ReactNode,
    children: React.ReactNode,
    hasActiveFilter = false
  ) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        onClick={() => toggleSection(key)}
        className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 ${
          hasActiveFilter ? 'bg-blue-50' : ''
        }`}
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span className="font-medium text-gray-900">{title}</span>
          {hasActiveFilter && (
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            expandedSections[key] ? 'rotate-180' : ''
          }`}
        />
      </button>
      {expandedSections[key] && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* 桌面版篩選器 */}
      <div className={`hidden lg:block bg-white rounded-lg shadow border border-gray-200 ${className}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">篩選條件</h3>
              {getActiveFilterCount() > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getActiveFilterCount()}
                </span>
              )}
            </div>
            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                清除全部
              </button>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {/* 排序 */}
          {renderFilterSection(
            '排序方式',
            'sort',
            <ChevronDown className="w-4 h-4 text-gray-500" />,
            (
              <select
                value={filters.sortBy || 'relevance'}
                onChange={(e) => {
                  const option = sortOptions.find(opt => opt.value === e.target.value);
                  updateFilter('sortBy', e.target.value);
                  updateFilter('sortOrder', option?.order || 'desc');
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ),
            filters.sortBy !== undefined
          )}

          {/* 價格範圍 */}
          {renderFilterSection(
            '價格範圍',
            'price',
            <DollarSign className="w-4 h-4 text-gray-500" />,
            (
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="最低價格"
                    value={filters.priceMin || ''}
                    onChange={(e) => updateFilter('priceMin', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="self-center text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="最高價格"
                    value={filters.priceMax || ''}
                    onChange={(e) => updateFilter('priceMax', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  範圍：NT$ {priceRange.min.toLocaleString()} - NT$ {priceRange.max.toLocaleString()}
                </div>
              </div>
            ),
            filters.priceMin !== undefined || filters.priceMax !== undefined
          )}

          {/* 分類 */}
          {categories.length > 0 && renderFilterSection(
            '服務分類',
            'category',
            <Filter className="w-4 h-4 text-gray-500" />,
            (
              <div className="space-y-2">
                <div className="max-h-32 overflow-y-auto">
                  {categories.map(category => (
                    <label
                      key={category.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="category"
                          checked={filters.category === category.slug}
                          onChange={() => updateFilter('category', 
                            filters.category === category.slug ? undefined : category.slug
                          )}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">({category.count})</span>
                    </label>
                  ))}
                </div>
              </div>
            ),
            filters.category !== undefined
          )}

          {/* 評分 */}
          {renderFilterSection(
            '評分',
            'rating',
            <Star className="w-4 h-4 text-gray-500" />,
            (
              <div className="space-y-2">
                {ratingOptions.map(option => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === option.value}
                      onChange={() => updateFilter('rating', 
                        filters.rating === option.value ? undefined : option.value
                      )}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            ),
            filters.rating !== undefined
          )}

          {/* 時長 */}
          {renderFilterSection(
            '活動時長',
            'duration',
            <Clock className="w-4 h-4 text-gray-500" />,
            (
              <div className="space-y-2">
                {durationOptions.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="duration"
                      checked={JSON.stringify(filters.duration) === JSON.stringify(option.value)}
                      onChange={() => updateFilter('duration', 
                        JSON.stringify(filters.duration) === JSON.stringify(option.value) ? undefined : option.value
                      )}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            ),
            filters.duration !== undefined
          )}

          {/* 團體人數 */}
          {renderFilterSection(
            '團體人數',
            'guests',
            <Users className="w-4 h-4 text-gray-500" />,
            (
              <div className="space-y-2">
                {guestOptions.map(option => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="maxGuests"
                      checked={filters.maxGuests === option.value}
                      onChange={() => updateFilter('maxGuests', 
                        filters.maxGuests === option.value ? undefined : option.value
                      )}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            ),
            filters.maxGuests !== undefined
          )}

          {/* 特色標籤 */}
          {renderFilterSection(
            '服務特色',
            'features',
            <Filter className="w-4 h-4 text-gray-500" />,
            (
              <div className="flex flex-wrap gap-2">
                {featureTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      filters.tags?.includes(tag)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            ),
            filters.tags && filters.tags.length > 0
          )}
        </div>
      </div>

      {/* 手機版篩選按鈕 */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter className="w-4 h-4" />
          <span>篩選</span>
          {getActiveFilterCount() > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
      </div>

      {/* 手機版篩選面板 */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">篩選條件</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-full overflow-y-auto pb-20">
              {/* 這裡重複桌面版的篩選內容 */}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                查看結果
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}