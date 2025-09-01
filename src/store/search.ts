import { create } from 'zustand';

export interface SearchFilters {
  location: string;
  date?: Date;
  endDate?: Date;
  guests: number;
  priceRange: [number, number];
  rating: number;
  serviceTypes: string[];
  languages: string[];
  duration?: string;
  instantBook?: boolean;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  priceUnit: 'hour' | 'day' | 'trip';
  rating: number;
  reviewCount: number;
  duration: string;
  maxGuests: number;
  images: string[];
  guide: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    languages: string[];
    responseTime: string;
  };
  tags: string[];
  isInstantBook: boolean;
  availability: string[];
}

interface SearchState {
  // Search query and results
  query: string;
  filters: SearchFilters;
  results: SearchResult[];
  totalResults: number;
  isLoading: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  
  // Sorting
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'reviews';
  
  // Favorites
  favorites: string[];
  
  // Recent searches
  recentSearches: string[];
  
  // Actions
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  search: () => Promise<void>;
  loadMore: () => Promise<void>;
  setSortBy: (sortBy: SearchState['sortBy']) => void;
  addToFavorites: (serviceId: string) => void;
  removeFromFavorites: (serviceId: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

const defaultFilters: SearchFilters = {
  location: '',
  guests: 2,
  priceRange: [0, 5000],
  rating: 0,
  serviceTypes: [],
  languages: [],
};

export const useSearch = create<SearchState>((set, get) => ({
  // Initial state
  query: '',
  filters: defaultFilters,
  results: [],
  totalResults: 0,
  isLoading: false,
  error: null,
  currentPage: 1,
  pageSize: 12,
  sortBy: 'relevance',
  favorites: [],
  recentSearches: [],

  // Actions
  setQuery: (query: string) => {
    set({ query });
  },

  setFilters: (newFilters: Partial<SearchFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1, // Reset to first page when filters change
    }));
  },

  resetFilters: () => {
    set({
      filters: defaultFilters,
      currentPage: 1,
    });
  },

  search: async () => {
    const { query, filters, pageSize, sortBy } = get();
    
    set({ isLoading: true, error: null });

    try {
      // TODO: 實際 API 調用
      const searchParams = new URLSearchParams({
        q: query,
        location: filters.location,
        guests: filters.guests.toString(),
        priceMin: filters.priceRange[0].toString(),
        priceMax: filters.priceRange[1].toString(),
        rating: filters.rating.toString(),
        page: '1',
        limit: pageSize.toString(),
        sortBy,
      });

      if (filters.date) {
        searchParams.append('date', filters.date.toISOString());
      }
      if (filters.endDate) {
        searchParams.append('endDate', filters.endDate.toISOString());
      }
      if (filters.serviceTypes.length > 0) {
        searchParams.append('serviceTypes', filters.serviceTypes.join(','));
      }
      if (filters.languages.length > 0) {
        searchParams.append('languages', filters.languages.join(','));
      }

      const response = await fetch(`/api/search?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('搜尋失敗');
      }

      const data = await response.json();
      
      set({
        results: data.results,
        totalResults: data.total,
        currentPage: 1,
        isLoading: false,
      });

      // Add to recent searches if query is not empty
      if (query.trim()) {
        get().addRecentSearch(query.trim());
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '搜尋發生錯誤',
        isLoading: false,
      });
    }
  },

  loadMore: async () => {
    const { query, filters, currentPage, pageSize, sortBy, results } = get();
    
    set({ isLoading: true });

    try {
      const searchParams = new URLSearchParams({
        q: query,
        location: filters.location,
        guests: filters.guests.toString(),
        priceMin: filters.priceRange[0].toString(),
        priceMax: filters.priceRange[1].toString(),
        rating: filters.rating.toString(),
        page: (currentPage + 1).toString(),
        limit: pageSize.toString(),
        sortBy,
      });

      const response = await fetch(`/api/search?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('載入更多結果失敗');
      }

      const data = await response.json();
      
      set({
        results: [...results, ...data.results],
        currentPage: currentPage + 1,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '載入更多結果發生錯誤',
        isLoading: false,
      });
    }
  },

  setSortBy: (sortBy: SearchState['sortBy']) => {
    set({ sortBy });
    // Auto search when sort changes
    get().search();
  },

  addToFavorites: (serviceId: string) => {
    set(state => ({
      favorites: [...state.favorites.filter(id => id !== serviceId), serviceId]
    }));
  },

  removeFromFavorites: (serviceId: string) => {
    set(state => ({
      favorites: state.favorites.filter(id => id !== serviceId)
    }));
  },

  addRecentSearch: (query: string) => {
    set(state => ({
      recentSearches: [
        query,
        ...state.recentSearches.filter(s => s !== query)
      ].slice(0, 10) // Keep only last 10 searches
    }));
  },

  clearRecentSearches: () => {
    set({ recentSearches: [] });
  },
}));