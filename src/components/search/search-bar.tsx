'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, Filter, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  initialValues?: {
    query?: string;
    location?: string;
    date?: string;
    guests?: number;
  };
  onSearch?: (params: SearchParams) => void;
  showFilters?: boolean;
  className?: string;
}

interface SearchParams {
  query: string;
  location: string;
  date: string;
  guests: number;
}

interface Suggestion {
  type: 'service' | 'location' | 'category' | 'guide';
  title: string;
  subtitle?: string;
  url: string;
  image?: string;
  avatar?: string;
  count?: number;
}

export default function SearchBar({
  initialValues = {},
  onSearch,
  showFilters = true,
  className = ''
}: SearchBarProps) {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: initialValues.query || '',
    location: initialValues.location || '',
    date: initialValues.date || '',
    guests: initialValues.guests || 1
  });

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [showDetailedSearch, setShowDetailedSearch] = useState(false);

  // 防抖搜尋
  const debounceRef = useRef<NodeJS.Timeout>();

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/services/suggestions?q=${encodeURIComponent(query)}&limit=8`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.data.suggestions || []);
      }
    } catch (error) {
      console.error('Fetch suggestions error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SearchParams, value: string | number) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));

    if (field === 'query') {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(value as string);
      }, 300);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setShowSuggestions(false);
    setShowDetailedSearch(false);

    if (onSearch) {
      onSearch(searchParams);
    } else {
      // 使用路由導航
      const params = new URLSearchParams();
      if (searchParams.query) params.set('q', searchParams.query);
      if (searchParams.location) params.set('location', searchParams.location);
      if (searchParams.date) params.set('date', searchParams.date);
      if (searchParams.guests > 1) params.set('guests', searchParams.guests.toString());

      router.push(`/search?${params.toString()}`);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setShowSuggestions(false);
    router.push(suggestion.url);
  };

  const clearSearch = () => {
    setSearchParams({
      query: '',
      location: '',
      date: '',
      guests: 1
    });
    setSuggestions([]);
    inputRef.current?.focus();
  };

  // 點擊外部關閉建議和詳細搜尋
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowDetailedSearch(false);
        setActiveField(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderSuggestionIcon = (type: string) => {
    switch (type) {
      case 'location':
        return <MapPin className="w-4 h-4 text-gray-500" />;
      case 'service':
        return <Search className="w-4 h-4 text-gray-500" />;
      case 'category':
        return <Filter className="w-4 h-4 text-gray-500" />;
      case 'guide':
        return <Users className="w-4 h-4 text-gray-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="bg-white rounded-full shadow-lg border border-gray-200 px-2 py-2">
        <div className="flex items-center">
          {/* 主搜尋欄位 */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="地點入住         旅客"
                value={searchParams.query}
                onChange={(e) => handleInputChange('query', e.target.value)}
                onFocus={() => {
                  setActiveField('query');
                  setShowDetailedSearch(true);
                  if (searchParams.query) {
                    fetchSuggestions(searchParams.query);
                    setShowSuggestions(true);
                  }
                }}
                onClick={() => setShowDetailedSearch(true)}
                className="w-full pl-6 pr-12 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 rounded-full text-lg font-medium"
              />
              {searchParams.query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-14 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 搜尋按鈕 */}
          <div className="flex-shrink-0">
            <button
              type="submit"
              className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors shadow-md"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>

      {/* 詳細搜尋欄位 (可展開) */}
      {showDetailedSearch && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 z-40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 地點 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">地點</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="隨處任何一週新增旅客"
                  value={searchParams.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  onFocus={() => setActiveField('location')}
                  className="w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* 日期 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">入住日期</label>
              <div className="relative">
                <input
                  type="date"
                  value={searchParams.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  onFocus={() => setActiveField('date')}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* 旅客人數 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">旅客</label>
              <div className="relative">
                <select
                  value={searchParams.guests}
                  onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                  onFocus={() => setActiveField('guests')}
                  className="w-full pl-10 pr-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none cursor-pointer bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>
                      {num}位旅客
                    </option>
                  ))}
                  <option value={9}>9+位旅客</option>
                </select>
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
            >
              搜尋
            </button>
          </div>
        </div>
      )}
    </div>

      {/* 搜尋建議 */}
      {showSuggestions && activeField === 'query' && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-3 text-center text-gray-500">
              <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                >
                  <div className="flex-shrink-0">
                    {suggestion.image ? (
                      <img
                        src={suggestion.image}
                        alt={suggestion.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : suggestion.avatar ? (
                      <img
                        src={suggestion.avatar}
                        alt={suggestion.title}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        {renderSuggestionIcon(suggestion.type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {suggestion.title}
                    </div>
                    {suggestion.subtitle && (
                      <div className="text-sm text-gray-500 truncate">
                        {suggestion.subtitle}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs text-gray-400 capitalize">
                      {suggestion.type === 'service' && '服務'}
                      {suggestion.type === 'location' && '地點'}
                      {suggestion.type === 'category' && '分類'}
                      {suggestion.type === 'guide' && '嚮導'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : searchParams.query.length >= 2 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>找不到相關結果</p>
              <p className="text-sm">試試其他關鍵字或條件</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}