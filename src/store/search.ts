// 搜尋功能狀態管理 Store
// 功能：管理服務搜尋、篩選條件、搜尋結果、分頁、排序和我的最愛等功能
import { create } from 'zustand'; // 狀態管理庫

// 搜尋篩選條件介面定義
export interface SearchFilters {
  location: string; // 搜尋地點
  date?: Date; // 開始日期（可選）
  endDate?: Date; // 結束日期（可選）
  guests: number; // 旅客人數
  priceRange: [number, number]; // 價格範圍 [最低, 最高]
  rating: number; // 最低評分要求
  serviceTypes: string[]; // 服務類型篩選
  languages: string[]; // 語言篩選
  duration?: string; // 服務時長篩選（可選）
  instantBook?: boolean; // 是否支援即時預訂（可選）
}

// 搜尋結果項目介面定義
export interface SearchResult {
  id: string; // 服務唯一識別碼
  title: string; // 服務標題
  description: string; // 服務描述
  location: string; // 服務地點
  price: number; // 服務價格
  priceUnit: 'hour' | 'day' | 'trip'; // 價格單位
  rating: number; // 平均評分
  reviewCount: number; // 評論數量
  duration: string; // 服務時長
  maxGuests: number; // 最大旅客數
  images: string[]; // 服務圖片列表
  guide: { // 導遊資訊
    id: string; // 導遊 ID
    name: string; // 導遊姓名
    avatar: string; // 導遊頭像
    rating: number; // 導遊評分
    reviewCount: number; // 導遊評論數
    languages: string[]; // 導遊語言能力
    responseTime: string; // 回覆時間
  };
  tags: string[]; // 服務標籤
  isInstantBook: boolean; // 是否支援即時預訂
  availability: string[]; // 可預訂日期
}

// 搜尋狀態管理介面定義
interface SearchState {
  // 搜尋查詢和結果
  query: string; // 搜尋關鍵字
  filters: SearchFilters; // 篩選條件
  results: SearchResult[]; // 搜尋結果列表
  totalResults: number; // 搜尋結果總數
  isLoading: boolean; // 是否正在載入
  error: string | null; // 錯誤訊息
  
  // 分頁功能
  currentPage: number; // 當前頁碼
  pageSize: number; // 每頁顯示數量
  
  // 排序功能
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'reviews'; // 排序方式
  
  // 我的最愛功能
  favorites: string[]; // 收藏的服務 ID 列表
  
  // 搜尋歷史功能
  recentSearches: string[]; // 最近搜尋紀錄
  
  // 行為方法
  setQuery: (query: string) => void; // 設置搜尋關鍵字
  setFilters: (filters: Partial<SearchFilters>) => void; // 設置篩選條件
  resetFilters: () => void; // 重置篩選條件
  search: () => Promise<void>; // 執行搜尋
  loadMore: () => Promise<void>; // 載入更多結果
  setSortBy: (sortBy: SearchState['sortBy']) => void; // 設置排序方式
  addToFavorites: (serviceId: string) => void; // 加入我的最愛
  removeFromFavorites: (serviceId: string) => void; // 移除我的最愛
  addRecentSearch: (query: string) => void; // 加入搜尋歷史
  clearRecentSearches: () => void; // 清除搜尋歷史
}

// 預設篩選條件
const defaultFilters: SearchFilters = {
  location: '', // 預設無地點限制
  guests: 2, // 預設 2 位旅客
  priceRange: [0, 5000], // 預設價格範圍 0-5000
  rating: 0, // 預設無評分限制
  serviceTypes: [], // 預設無服務類型限制
  languages: [], // 預設無語言限制
};

/**
 * 搜尋功能 Store
 * 
 * 功能：
 * - 管理搜尋關鍵字和篩選條件
 * - 執行搜尋和載入更多結果
 * - 分頁和排序功能
 * - 我的最愛管理
 * - 搜尋歷史記錄
 */
export const useSearch = create<SearchState>((set, get) => ({
  // 初始狀態
  query: '', // 搜尋關鍵字
  filters: defaultFilters, // 篩選條件
  results: [], // 搜尋結果
  totalResults: 0, // 結果總數
  isLoading: false, // 載入狀態
  error: null, // 錯誤訊息
  currentPage: 1, // 當前頁碼
  pageSize: 12, // 每頁結果數
  sortBy: 'relevance', // 排序方式
  favorites: [], // 收藏列表
  recentSearches: [], // 搜尋歷史

  // 行為方法
  
  /**
   * 設置搜尋關鍵字
   * @param query 搜尋關鍵字
   */
  setQuery: (query: string) => {
    set({ query });
  },

  /**
   * 設置篩選條件
   * @param newFilters 新的篩選條件（部分更新）
   */
  setFilters: (newFilters: Partial<SearchFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1, // 篩選條件變更時重置到第一頁
    }));
  },

  /**
   * 重置所有篩選條件為預設值
   */
  resetFilters: () => {
    set({
      filters: defaultFilters,
      currentPage: 1,
    });
  },

  /**
   * 執行搜尋操作
   * 根據當前的搜尋關鍵字和篩選條件向後端 API 發送請求
   */
  search: async () => {
    const { query, filters, pageSize, sortBy } = get();
    
    set({ isLoading: true, error: null }); // 設置載入狀態

    try {
      // TODO: 實際 API 調用（目前為模擬實作）
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

      // 將非空搜尋關鍵字加入搜尋歷史
      if (query.trim()) {
        get().addRecentSearch(query.trim());
      }
    } catch (error) {
      // 處理錯誤狀態
      set({
        error: error instanceof Error ? error.message : '搜尋發生錯誤',
        isLoading: false,
      });
    }
  },

  /**
   * 載入更多搜尋結果（分頁功能）
   * 載入下一頁的搜尋結果並追加到現有結果中
   */
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

  /**
   * 設置排序方式
   * @param sortBy 排序方式
   */
  setSortBy: (sortBy: SearchState['sortBy']) => {
    set({ sortBy });
    // 排序方式變更時自動重新搜尋
    get().search();
  },

  /**
   * 將服務加入我的最愛
   * @param serviceId 服務 ID
   */
  addToFavorites: (serviceId: string) => {
    set(state => ({
      favorites: [...state.favorites.filter(id => id !== serviceId), serviceId] // 移除重複項目並加入最後
    }));
  },

  /**
   * 從我的最愛移除服務
   * @param serviceId 服務 ID
   */
  removeFromFavorites: (serviceId: string) => {
    set(state => ({
      favorites: state.favorites.filter(id => id !== serviceId)
    }));
  },

  /**
   * 加入搜尋歷史記錄
   * @param query 搜尋關鍵字
   */
  addRecentSearch: (query: string) => {
    set(state => ({
      recentSearches: [
        query,
        ...state.recentSearches.filter(s => s !== query) // 移除重複項目
      ].slice(0, 10) // 只保留最近 10 筆搜尋記錄
    }));
  },

  /**
   * 清除所有搜尋歷史記錄
   */
  clearRecentSearches: () => {
    set({ recentSearches: [] });
  },
}));