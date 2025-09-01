'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Filter, 
  Star, 
  Shield, 
  Image, 
  MessageCircle, 
  Calendar,
  ChevronDown,
  X
} from 'lucide-react';
import { ReviewFilters } from '@/store/reviews';

interface ReviewFiltersProps {
  filters: ReviewFilters;
  onFiltersChange: (filters: Partial<ReviewFilters>) => void;
  onReset: () => void;
  totalReviews: number;
  availableTags?: string[];
  className?: string;
}

export function ReviewFiltersComponent({
  filters,
  onFiltersChange,
  onReset,
  totalReviews,
  availableTags = [],
  className = ''
}: ReviewFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortOptions = [
    { value: 'newest', label: '最新發布' },
    { value: 'oldest', label: '最早發布' },
    { value: 'highest', label: '評分最高' },
    { value: 'lowest', label: '評分最低' },
    { value: 'helpful', label: '最有用' }
  ];

  const ratingOptions = [
    { value: [5], label: '5 星' },
    { value: [4, 5], label: '4 星以上' },
    { value: [3, 4, 5], label: '3 星以上' },
    { value: [2, 3, 4, 5], label: '2 星以上' },
    { value: [1, 2, 3, 4, 5], label: '全部評分' }
  ];

  const toggleRating = (rating: number) => {
    const currentRatings = filters.rating || [];
    const newRatings = currentRatings.includes(rating)
      ? currentRatings.filter(r => r !== rating)
      : [...currentRatings, rating].sort((a, b) => b - a);
    
    onFiltersChange({ 
      rating: newRatings.length === 5 ? undefined : newRatings 
    });
  };

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onFiltersChange({ 
      tags: newTags.length === 0 ? undefined : newTags 
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.rating && filters.rating.length < 5) count++;
    if (filters.verified !== undefined) count++;
    if (filters.withPhotos) count++;
    if (filters.withResponse) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    if (filters.dateRange) count++;
    return count;
  };

  const hasActiveFilters = getActiveFiltersCount() > 0;

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* 排序選擇 */}
          <select
            value={filters.sortBy}
            onChange={(e) => onFiltersChange({ sortBy: e.target.value as any })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* 篩選按鈕 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-md text-sm transition-colors ${
              hasActiveFilters 
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            篩選
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {getActiveFiltersCount()}
              </span>
            )}
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* 重置按鈕 */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              清除篩選
            </button>
          )}
        </div>

        <div className="text-sm text-gray-500">
          共 {totalReviews} 則評論
        </div>
      </div>

      {/* 篩選下拉選單 */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-900">篩選選項</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 評分篩選 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                評分
              </h4>
              <div className="space-y-2">
                {ratingOptions.map((option) => (
                  <label key={option.label} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={
                        option.value.length === 5 
                          ? !filters.rating || filters.rating.length === 5
                          : JSON.stringify(filters.rating?.sort((a, b) => b - a)) === JSON.stringify(option.value)
                      }
                      onChange={() => onFiltersChange({ 
                        rating: option.value.length === 5 ? undefined : option.value 
                      })}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 驗證狀態 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                驗證狀態
              </h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="verified"
                    checked={filters.verified === undefined}
                    onChange={() => onFiltersChange({ verified: undefined })}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">全部</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="verified"
                    checked={filters.verified === true}
                    onChange={() => onFiltersChange({ verified: true })}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">僅已驗證</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="verified"
                    checked={filters.verified === false}
                    onChange={() => onFiltersChange({ verified: false })}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">僅未驗證</span>
                </label>
              </div>
            </div>

            {/* 附加內容 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">附加內容</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.withPhotos || false}
                    onChange={(e) => onFiltersChange({ withPhotos: e.target.checked || undefined })}
                    className="text-blue-600"
                  />
                  <Image className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">有照片</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.withResponse || false}
                    onChange={(e) => onFiltersChange({ withResponse: e.target.checked || undefined })}
                    className="text-blue-600"
                  />
                  <MessageCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">有回覆</span>
                </label>
              </div>
            </div>

            {/* 標籤篩選 */}
            {availableTags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">服務特色</h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2 py-1 rounded-full text-sm border transition-colors ${
                        filters.tags?.includes(tag)
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 日期範圍 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                日期範圍
              </h4>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-left hover:bg-gray-50"
              >
                {filters.dateRange 
                  ? `${filters.dateRange.start.toLocaleDateString()} - ${filters.dateRange.end.toLocaleDateString()}`
                  : '選擇日期範圍'
                }
              </button>
              
              {showDatePicker && (
                <div className="mt-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">開始日期</label>
                      <input
                        type="date"
                        value={filters.dateRange?.start.toISOString().split('T')[0] || ''}
                        onChange={(e) => {
                          const start = new Date(e.target.value);
                          onFiltersChange({
                            dateRange: {
                              start,
                              end: filters.dateRange?.end || new Date()
                            }
                          });
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">結束日期</label>
                      <input
                        type="date"
                        value={filters.dateRange?.end.toISOString().split('T')[0] || ''}
                        onChange={(e) => {
                          const end = new Date(e.target.value);
                          onFiltersChange({
                            dateRange: {
                              start: filters.dateRange?.start || new Date(),
                              end
                            }
                          });
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onFiltersChange({ dateRange: undefined });
                      setShowDatePicker(false);
                    }}
                    className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    清除日期範圍
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 活動篩選器標籤 */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.rating && filters.rating.length < 5 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {filters.rating.length === 1 ? `${filters.rating[0]} 星` : `${Math.min(...filters.rating)}-${Math.max(...filters.rating)} 星`}
              <button
                onClick={() => onFiltersChange({ rating: undefined })}
                className="hover:text-blue-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.verified !== undefined && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {filters.verified ? '已驗證' : '未驗證'}
              <button
                onClick={() => onFiltersChange({ verified: undefined })}
                className="hover:text-green-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.withPhotos && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              有照片
              <button
                onClick={() => onFiltersChange({ withPhotos: undefined })}
                className="hover:text-purple-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.withResponse && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
              有回覆
              <button
                onClick={() => onFiltersChange({ withResponse: undefined })}
                className="hover:text-orange-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.tags?.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
              {tag}
              <button
                onClick={() => toggleTag(tag)}
                className="hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          
          {filters.dateRange && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
              {filters.dateRange.start.toLocaleDateString()} - {filters.dateRange.end.toLocaleDateString()}
              <button
                onClick={() => onFiltersChange({ dateRange: undefined })}
                className="hover:text-indigo-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}