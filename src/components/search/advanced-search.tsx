'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, MapPin, Calendar, Users, DollarSign, Star, Clock, Tag } from 'lucide-react';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClose?: () => void;
  initialFilters?: Partial<SearchFilters>;
}

interface SearchFilters {
  query: string;
  location: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  guests: number;
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  duration: string[];
  categories: string[];
  features: string[];
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'distance' | 'popularity';
  availability: 'any' | 'instant' | 'within_24h';
  languages: string[];
}

export function AdvancedSearch({ onSearch, onClose, initialFilters = {} }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    dateRange: { start: null, end: null },
    guests: 2,
    priceRange: { min: 0, max: 10000 },
    rating: 0,
    duration: [],
    categories: [],
    features: [],
    sortBy: 'relevance',
    availability: 'any',
    languages: [],
    ...initialFilters
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // 預設選項
  const durationOptions = [
    { value: '1-3h', label: '1-3 小時' },
    { value: '3-6h', label: '3-6 小時' },
    { value: '6-12h', label: '6-12 小時' },
    { value: 'full-day', label: '全日遊' },
    { value: 'multi-day', label: '多日遊' }
  ];

  const categoryOptions = [
    { value: 'culture', label: '文化體驗', icon: '🏛️' },
    { value: 'food', label: '美食品嚐', icon: '🍜' },
    { value: 'nature', label: '自然探索', icon: '🏔️' },
    { value: 'city', label: '城市導覽', icon: '🏙️' },
    { value: 'adventure', label: '冒險活動', icon: '🏃‍♂️' },
    { value: 'shopping', label: '購物血拼', icon: '🛍️' },
    { value: 'nightlife', label: '夜生活', icon: '🌃' },
    { value: 'photography', label: '攝影景點', icon: '📸' }
  ];

  const featureOptions = [
    { value: 'instant_booking', label: '即時預訂' },
    { value: 'free_cancellation', label: '免費取消' },
    { value: 'pickup_included', label: '包含接送' },
    { value: 'meal_included', label: '包含餐食' },
    { value: 'english_speaking', label: '英語導覽' },
    { value: 'small_group', label: '小團體驗' },
    { value: 'private_tour', label: '私人導覽' },
    { value: 'family_friendly', label: '親子友善' }
  ];

  const languageOptions = [
    { value: 'zh-TW', label: '繁體中文' },
    { value: 'zh-CN', label: '简体中文' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' }
  ];

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'duration' | 'categories' | 'features' | 'languages', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      location: '',
      dateRange: { start: null, end: null },
      guests: 2,
      priceRange: { min: 0, max: 10000 },
      rating: 0,
      duration: [],
      categories: [],
      features: [],
      sortBy: 'relevance',
      availability: 'any',
      languages: []
    });
  };

  const handleSearch = () => {
    onSearch(filters);
    if (onClose) onClose();
  };

  const hasActiveFilters = () => {
    return filters.query || 
           filters.location || 
           filters.dateRange.start || 
           filters.dateRange.end ||
           filters.guests !== 2 ||
           filters.priceRange.min > 0 ||
           filters.priceRange.max < 10000 ||
           filters.rating > 0 ||
           filters.duration.length > 0 ||
           filters.categories.length > 0 ||
           filters.features.length > 0 ||
           filters.languages.length > 0 ||
           filters.availability !== 'any' ||
           filters.sortBy !== 'relevance';
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* 標題區 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Filter style={{ width: '1.25rem', height: '1.25rem', color: '#3b82f6' }} />
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            進階搜尋
          </h3>
          {hasActiveFilters() && (
            <span style={{
              padding: '0.125rem 0.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '0.75rem',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              已套用篩選
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={resetFilters}
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
            className="hover:bg-[#cfdbe9]"
          >
            重設
          </button>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
              className="hover:bg-gray-100"
            >
              <X style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
            </button>
          )}
        </div>
      </div>

      {/* 搜尋內容 */}
      <div style={{ padding: '1.5rem' }}>
        {/* 基本搜尋 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {/* 關鍵字搜尋 */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              <Search style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
              關鍵字
            </label>
            <input
              type="text"
              placeholder="搜尋服務、地點或活動..."
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              className="focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 地點 */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              <MapPin style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
              地點
            </label>
            <input
              type="text"
              placeholder="台北、台中、高雄..."
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              className="focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 日期和人數 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {/* 開始日期 */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              <Calendar style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
              開始日期
            </label>
            <input
              type="date"
              value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
              onChange={(e) => updateFilter('dateRange', {
                ...filters.dateRange,
                start: e.target.value ? new Date(e.target.value) : null
              })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              className="focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 結束日期 */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              結束日期
            </label>
            <input
              type="date"
              value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
              onChange={(e) => updateFilter('dateRange', {
                ...filters.dateRange,
                end: e.target.value ? new Date(e.target.value) : null
              })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              className="focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 人數 */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              <Users style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
              人數
            </label>
            <select
              value={filters.guests}
              onChange={(e) => updateFilter('guests', parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num} 人</option>
              ))}
            </select>
          </div>
        </div>

        {/* 價格範圍 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            <DollarSign style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
            價格範圍 (NT$ {filters.priceRange.min.toLocaleString()} - NT$ {filters.priceRange.max.toLocaleString()})
          </label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              type="range"
              min="0"
              max="10000"
              step="500"
              value={filters.priceRange.min}
              onChange={(e) => updateFilter('priceRange', {
                ...filters.priceRange,
                min: parseInt(e.target.value)
              })}
              style={{ flex: 1 }}
            />
            <input
              type="range"
              min="0"
              max="10000"
              step="500"
              value={filters.priceRange.max}
              onChange={(e) => updateFilter('priceRange', {
                ...filters.priceRange,
                max: parseInt(e.target.value)
              })}
              style={{ flex: 1 }}
            />
          </div>
        </div>

        {/* 評分篩選 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            <Star style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
            最低評分
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[0, 3, 4, 4.5].map(rating => (
              <button
                key={rating}
                onClick={() => updateFilter('rating', rating)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: filters.rating === rating ? '#3b82f6' : 'white',
                  color: filters.rating === rating ? 'white' : '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
                className="hover:bg-[#cfdbe9]"
              >
                {rating === 0 ? '不限' : (
                  <>
                    {rating}
                    <Star style={{ width: '0.875rem', height: '0.875rem', fill: 'currentColor' }} />
                    以上
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 展開更多選項 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            color: '#374151',
            cursor: 'pointer',
            marginBottom: '1.5rem'
          }}
          className="hover:bg-gray-100"
        >
          {isExpanded ? '收起' : '展開更多選項'}
        </button>

        {/* 展開的選項 */}
        {isExpanded && (
          <div style={{ marginBottom: '1.5rem' }}>
            {/* 時長 */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                <Clock style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                活動時長
              </label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                {durationOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => toggleArrayFilter('duration', option.value)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: filters.duration.includes(option.value) ? '#3b82f6' : 'white',
                      color: filters.duration.includes(option.value) ? 'white' : '#374151',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                    className="hover:bg-[#cfdbe9]"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 類別 */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                <Tag style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                體驗類別
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '0.5rem'
              }}>
                {categoryOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => toggleArrayFilter('categories', option.value)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: filters.categories.includes(option.value) ? '#3b82f6' : 'white',
                      color: filters.categories.includes(option.value) ? 'white' : '#374151',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    className="hover:bg-[#cfdbe9]"
                  >
                    <span>{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 特色功能 */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                特色功能
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '0.5rem'
              }}>
                {featureOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => toggleArrayFilter('features', option.value)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: filters.features.includes(option.value) ? '#3b82f6' : 'white',
                      color: filters.features.includes(option.value) ? 'white' : '#374151',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                    className="hover:bg-[#cfdbe9]"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 語言 */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                導覽語言
              </label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                {languageOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => toggleArrayFilter('languages', option.value)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: filters.languages.includes(option.value) ? '#3b82f6' : 'white',
                      color: filters.languages.includes(option.value) ? 'white' : '#374151',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                    className="hover:bg-[#cfdbe9]"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 排序和可用性 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  排序方式
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="relevance">相關性</option>
                  <option value="price_low">價格由低到高</option>
                  <option value="price_high">價格由高到低</option>
                  <option value="rating">評分最高</option>
                  <option value="distance">距離最近</option>
                  <option value="popularity">最受歡迎</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  可預訂性
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) => updateFilter('availability', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="any">不限</option>
                  <option value="instant">即時預訂</option>
                  <option value="within_24h">24小時內確認</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 搜尋按鈕 */}
        <button
          onClick={handleSearch}
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
          className="hover:bg-blue-600"
        >
          <Search style={{ width: '1.25rem', height: '1.25rem' }} />
          搜尋服務
        </button>
      </div>
    </div>
  );
}