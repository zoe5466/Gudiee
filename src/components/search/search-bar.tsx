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

  // 點擊外部關閉建議
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
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
      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center divide-x divide-gray-200">
          {/* 搜尋關鍵字 */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="搜尋服務、地點或活動..."
                value={searchParams.query}
                onChange={(e) => handleInputChange('query', e.target.value)}
                onFocus={() => {
                  setActiveField('query');
                  setShowSuggestions(true);
                  if (searchParams.query) {
                    fetchSuggestions(searchParams.query);
                  }
                }}
                className="w-full pl-10 pr-4 py-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 rounded-l-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              {searchParams.query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 地點 */}
          {showFilters && (
            <div className="flex-shrink-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="地點"
                  value={searchParams.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  onFocus={() => setActiveField('location')}
                  className="w-32 md:w-40 pl-8 pr-4 py-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:bg-gray-50"
                />
                <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}

          {/* 日期 */}
          {showFilters && (
            <div className="flex-shrink-0">
              <div className="relative">
                <input
                  type="date"
                  value={searchParams.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  onFocus={() => setActiveField('date')}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-32 md:w-40 pl-8 pr-4 py-4 text-gray-900 focus:outline-none focus:ring-0 focus:bg-gray-50"
                />
                <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}

          {/* 人數 */}
          {showFilters && (
            <div className="flex-shrink-0">
              <div className="relative">
                <select
                  value={searchParams.guests}
                  onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                  onFocus={() => setActiveField('guests')}
                  className="w-20 md:w-24 pl-8 pr-4 py-4 text-gray-900 focus:outline-none focus:ring-0 focus:bg-gray-50 appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>
                      {num}人
                    </option>
                  ))}
                  <option value={9}>9+人</option>
                </select>
                <Users className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}

          {/* 搜尋按鈕 */}
          <div className="flex-shrink-0">
            <button
              type="submit"
              className="px-6 py-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <span className="hidden sm:inline">搜尋</span>
              <Search className="w-5 h-5 sm:hidden" />
            </button>
          </div>
        </div>
      </form>

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