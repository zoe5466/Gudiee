// 評論功能狀態管理 Store
// 功能：管理服務評論、評論統計、篩選排序、用戶評論等功能
'use client';

import { create } from 'zustand'; // 狀態管理庫
import { persist } from 'zustand/middleware'; // 持久化中間件

// 評論資料介面定義
export interface Review {
  id: string; // 評論唯一識別碼
  serviceId: string; // 服務 ID
  guideId: string; // 導遊 ID
  userId: string; // 評論者 ID
  bookingId: string; // 預訂記錄 ID
  rating: number; // 評分 1-5 星
  comment: string; // 評論內容
  photos?: string[]; // 評論照片（可選）
  pros?: string[]; // 優點列表（可選）
  cons?: string[]; // 缺點列表（可選）
  isVerified: boolean; // 是否已驗證預訂
  isAnonymous: boolean; // 是否匿名評論
  helpful: number; // 有用評價數
  reported: number; // 檢舉數
  response?: { // 回覆內容（可選）
    content: string; // 回覆內容
    authorId: string; // 回覆者 ID
    authorType: 'guide' | 'admin'; // 回覆者類型
    createdAt: string; // 回覆時間
  };
  tags?: string[]; // 標籤：'準時', '專業', '親切', '知識豐富' 等
  createdAt: string; // 評論建立時間
  updatedAt: string; // 評論更新時間
  status: 'PENDING' | 'approved' | 'rejected' | 'hidden'; // 評論狀態
}

// 評論統計資料介面定義
export interface ReviewStatistics {
  averageRating: number; // 平均評分
  totalReviews: number; // 總評論數
  ratingDistribution: Record<number, number>; // 1-5星的數量分佈
  totalHelpful: number; // 總有用評價數
  verifiedReviewsCount: number; // 已驗證評論數
  responseRate: number; // 回覆率百分比
  tags: Record<string, number>; // 標籤統計
}

// 評論篩選條件介面定義
export interface ReviewFilters {
  rating?: number[]; // 評分篩選（可選）
  sortBy: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'; // 排序方式
  verified?: boolean; // 只顯示已驗證評論（可選）
  withPhotos?: boolean; // 只顯示有照片的評論（可選）
  withResponse?: boolean; // 只顯示有回覆的評論（可選）
  tags?: string[]; // 標籤篩選（可選）
  dateRange?: { // 日期範圍篩選（可選）
    start: Date; // 開始日期
    end: Date; // 結束日期
  };
}

// 評論狀態管理介面定義
interface ReviewState {
  // 評論資料
  reviews: Review[]; // 評論列表
  userReviews: Review[]; // 當前用戶的評論列表
  statistics: Record<string, ReviewStatistics>; // 按服務或導遊ID分組的統計資料
  
  // UI 狀態
  isLoading: boolean; // 是否正在載入
  isSubmitting: boolean; // 是否正在提交
  error: string | null; // 錯誤訊息
  
  // 篩選和分頁
  filters: ReviewFilters; // 篩選條件
  currentPage: number; // 當前頁碼
  totalPages: number; // 總頁數
  pageSize: number; // 每頁數量
  
  // 行為方法
  fetchReviews: (targetId: string, targetType: 'service' | 'guide') => Promise<void>; // 載入評論
  fetchUserReviews: (userId: string) => Promise<void>; // 載入用戶評論
  submitReview: (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<void>; // 提交評論
  updateReview: (reviewId: string, updates: Partial<Review>) => Promise<void>; // 更新評論
  deleteReview: (reviewId: string) => Promise<void>; // 刪除評論
  reportReview: (reviewId: string, reason: string) => Promise<void>; // 檢舉評論
  markHelpful: (reviewId: string) => Promise<void>; // 標記有用
  respondToReview: (reviewId: string, response: string) => Promise<void>; // 回覆評論
  setFilters: (filters: Partial<ReviewFilters>) => void; // 設置篩選條件
  setPage: (page: number) => void; // 設置頁碼
  resetFilters: () => void; // 重置篩選條件
}

/**
 * 評論功能 Store
 * 
 * 功能：
 * - 載入和管理服務/導遊評論
 * - 用戶評論提交、更新、刪除
 * - 評論篩選和排序
 * - 評論統計資料計算
 * - 評論互動（有用、檢舉、回覆）
 * - 持久化用戶評論和統計資料
 */
export const useReviews = create<ReviewState>()(
  persist(
    (set, get) => ({
      // 初始狀態
      reviews: [], // 評論列表
      userReviews: [], // 用戶評論
      statistics: {}, // 統計資料
      isLoading: false, // 載入狀態
      isSubmitting: false, // 提交狀態
      error: null, // 錯誤訊息
      filters: { // 預設篩選條件
        sortBy: 'newest' // 預設按最新排序
      },
      currentPage: 1, // 當前頁碼
      totalPages: 1, // 總頁數
      pageSize: 10, // 每頁數量

      /**
       * 載入指定服務或導遊的評論
       * @param targetId 目標 ID（服務或導遊）
       * @param targetType 目標類型
       */
      fetchReviews: async (targetId: string, targetType: 'service' | 'guide') => {
        set({ isLoading: true, error: null }); // 設置載入狀態
        
        try {
          // 模擬 API 調用（實際應呼叫後端 API）
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // 生成模擬評論數據
          const mockReviews: Review[] = Array.from({ length: 15 }, (_, i) => ({
            id: `review-${targetId}-${i + 1}`,
            serviceId: targetType === 'service' ? targetId : `service-${Math.floor(Math.random() * 5) + 1}`,
            guideId: targetType === 'guide' ? targetId : `guide-${Math.floor(Math.random() * 10) + 1}`,
            userId: `user-${Math.floor(Math.random() * 100) + 1}`,
            bookingId: `booking-${Math.floor(Math.random() * 1000) + 1}`,
            rating: Math.floor(Math.random() * 5) + 1,
            comment: [
              '非常棒的體驗！導遊很專業，行程安排得很好。',
              '服務態度很好，但是時間安排有點緊湊。',
              '超級推薦！導遊知識豐富，而且很幽默。',
              '價格合理，服務品質很不錯。',
              '導遊很準時，講解詳細，整體體驗很滿意。'
            ][Math.floor(Math.random() * 5)]!,
            photos: Math.random() > 0.7 ? [`/images/review-${i + 1}-1.jpg`, `/images/review-${i + 1}-2.jpg`] : undefined,
            pros: Math.random() > 0.5 ? ['專業知識', '準時', '親切'] : undefined,
            cons: Math.random() > 0.8 ? ['時間安排緊湊'] : undefined,
            isVerified: Math.random() > 0.3,
            isAnonymous: Math.random() > 0.8,
            helpful: Math.floor(Math.random() * 20),
            reported: Math.floor(Math.random() * 3),
            response: Math.random() > 0.6 ? {
              content: '感謝您的評價！我們會繼續努力提供更好的服務。',
              authorId: targetType === 'guide' ? targetId : 'admin-1',
              authorType: targetType === 'guide' ? 'guide' : 'admin',
              createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString()
            } : undefined,
            tags: Math.random() > 0.5 ? ['專業', '準時', '親切'] : undefined,
            createdAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
            updatedAt: new Date(Date.now() - Math.random() * 86400000 * 15).toISOString(),
            status: 'approved'
          }));

          // 計算統計數據
          const statistics: ReviewStatistics = {
            averageRating: mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length,
            totalReviews: mockReviews.length,
            ratingDistribution: mockReviews.reduce((dist, r) => {
              dist[r.rating] = (dist[r.rating] || 0) + 1;
              return dist;
            }, {} as Record<number, number>),
            totalHelpful: mockReviews.reduce((sum, r) => sum + r.helpful, 0),
            verifiedReviewsCount: mockReviews.filter(r => r.isVerified).length,
            responseRate: mockReviews.filter(r => r.response).length / mockReviews.length * 100,
            tags: mockReviews.reduce((tagStats, r) => {
              r.tags?.forEach(tag => {
                tagStats[tag] = (tagStats[tag] || 0) + 1;
              });
              return tagStats;
            }, {} as Record<string, number>)
          };

          set({
            reviews: mockReviews,
            statistics: { ...get().statistics, [targetId]: statistics },
            isLoading: false
          });
          
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '載入評論失敗',
            isLoading: false 
          });
        }
      },

      fetchUserReviews: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // 模擬用戶評論數據
          const mockUserReviews: Review[] = Array.from({ length: 5 }, (_, i) => ({
            id: `user-review-${userId}-${i + 1}`,
            serviceId: `service-${Math.floor(Math.random() * 5) + 1}`,
            guideId: `guide-${Math.floor(Math.random() * 10) + 1}`,
            userId,
            bookingId: `booking-${Math.floor(Math.random() * 1000) + 1}`,
            rating: Math.floor(Math.random() * 5) + 1,
            comment: '很棒的體驗！',
            isVerified: true,
            isAnonymous: Math.random() > 0.7,
            helpful: Math.floor(Math.random() * 10),
            reported: 0,
            tags: ['專業', '準時'],
            createdAt: new Date(Date.now() - Math.random() * 86400000 * 60).toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'approved'
          }));

          set({
            userReviews: mockUserReviews,
            isLoading: false
          });
          
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '載入用戶評論失敗',
            isLoading: false 
          });
        }
      },

      submitReview: async (reviewData) => {
        set({ isSubmitting: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const newReview: Review = {
            ...reviewData,
            id: `review-${Date.now()}`,
            helpful: 0,
            reported: 0,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          set(state => ({
            reviews: [newReview, ...state.reviews],
            userReviews: [newReview, ...state.userReviews],
            isSubmitting: false
          }));
          
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '提交評論失敗',
            isSubmitting: false 
          });
          throw error;
        }
      },

      updateReview: async (reviewId: string, updates: Partial<Review>) => {
        set({ isSubmitting: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            reviews: state.reviews.map(r => 
              r.id === reviewId 
                ? { ...r, ...updates, updatedAt: new Date().toISOString() }
                : r
            ),
            userReviews: state.userReviews.map(r => 
              r.id === reviewId 
                ? { ...r, ...updates, updatedAt: new Date().toISOString() }
                : r
            ),
            isSubmitting: false
          }));
          
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '更新評論失敗',
            isSubmitting: false 
          });
          throw error;
        }
      },

      deleteReview: async (reviewId: string) => {
        set({ isSubmitting: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          
          set(state => ({
            reviews: state.reviews.filter(r => r.id !== reviewId),
            userReviews: state.userReviews.filter(r => r.id !== reviewId),
            isSubmitting: false
          }));
          
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '刪除評論失敗',
            isSubmitting: false 
          });
          throw error;
        }
      },

      reportReview: async (reviewId: string, reason: string) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            reviews: state.reviews.map(r => 
              r.id === reviewId 
                ? { ...r, reported: r.reported + 1 }
                : r
            )
          }));
          
        } catch (error) {
          set({ error: error instanceof Error ? error.message : '檢舉失敗' });
          throw error;
        }
      },

      markHelpful: async (reviewId: string) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            reviews: state.reviews.map(r => 
              r.id === reviewId 
                ? { ...r, helpful: r.helpful + 1 }
                : r
            )
          }));
          
        } catch (error) {
          set({ error: error instanceof Error ? error.message : '標記有用失敗' });
          throw error;
        }
      },

      respondToReview: async (reviewId: string, response: string) => {
        set({ isSubmitting: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newResponse = {
            content: response,
            authorId: 'current-user-id', // 實際應從 auth store 獲取
            authorType: 'guide' as const,
            createdAt: new Date().toISOString()
          };
          
          set(state => ({
            reviews: state.reviews.map(r => 
              r.id === reviewId 
                ? { ...r, response: newResponse, updatedAt: new Date().toISOString() }
                : r
            ),
            isSubmitting: false
          }));
          
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '回覆評論失敗',
            isSubmitting: false 
          });
          throw error;
        }
      },

      setFilters: (newFilters: Partial<ReviewFilters>) => {
        set(state => ({
          filters: { ...state.filters, ...newFilters },
          currentPage: 1 // 重置頁碼
        }));
      },

      setPage: (page: number) => {
        set({ currentPage: page });
      },

      resetFilters: () => {
        set({
          filters: { sortBy: 'newest' },
          currentPage: 1
        });
      }
    }),
    {
      name: 'guidee-reviews',
      partialize: (state) => ({
        userReviews: state.userReviews,
        statistics: state.statistics
      })
    }
  )
);