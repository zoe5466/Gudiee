'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Review {
  id: string;
  serviceId: string;
  guideId: string;
  userId: string;
  bookingId: string;
  rating: number; // 1-5
  comment: string;
  photos?: string[];
  pros?: string[];
  cons?: string[];
  isVerified: boolean; // 是否已驗證預訂
  isAnonymous: boolean;
  helpful: number; // 有用評價數
  reported: number; // 檢舉數
  response?: {
    content: string;
    authorId: string;
    authorType: 'guide' | 'admin';
    createdAt: string;
  };
  tags?: string[]; // 標籤：'準時', '專業', '親切', '知識豐富' 等
  createdAt: string;
  updatedAt: string;
  status: 'PENDING' | 'approved' | 'rejected' | 'hidden';
}

export interface ReviewStatistics {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>; // 1-5星的數量分佈
  totalHelpful: number;
  verifiedReviewsCount: number;
  responseRate: number; // 回覆率
  tags: Record<string, number>; // 標籤統計
}

export interface ReviewFilters {
  rating?: number[];
  sortBy: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
  verified?: boolean;
  withPhotos?: boolean;
  withResponse?: boolean;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface ReviewState {
  // Reviews data
  reviews: Review[];
  userReviews: Review[]; // 當前用戶的評論
  statistics: Record<string, ReviewStatistics>; // 按服務或導遊ID分組
  
  // UI state
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  
  // Filters and pagination
  filters: ReviewFilters;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  
  // Actions
  fetchReviews: (targetId: string, targetType: 'service' | 'guide') => Promise<void>;
  fetchUserReviews: (userId: string) => Promise<void>;
  submitReview: (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<void>;
  updateReview: (reviewId: string, updates: Partial<Review>) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  reportReview: (reviewId: string, reason: string) => Promise<void>;
  markHelpful: (reviewId: string) => Promise<void>;
  respondToReview: (reviewId: string, response: string) => Promise<void>;
  setFilters: (filters: Partial<ReviewFilters>) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useReviews = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [],
      userReviews: [],
      statistics: {},
      isLoading: false,
      isSubmitting: false,
      error: null,
      filters: {
        sortBy: 'newest'
      },
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,

      fetchReviews: async (targetId: string, targetType: 'service' | 'guide') => {
        set({ isLoading: true, error: null });
        
        try {
          // 模擬 API 調用
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