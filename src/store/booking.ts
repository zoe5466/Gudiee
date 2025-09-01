import { create } from 'zustand';
import { useAuth } from './auth';

export interface BookingDetails {
  serviceId: string;
  guideId: string;
  date: Date;
  endDate?: Date;
  time: string;
  guests: number;
  duration: number; // in hours
  specialRequests?: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface Booking {
  id: string;
  serviceId: string;
  guideId: string;
  travelerId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';
  details: BookingDetails;
  pricing: {
    basePrice: number;
    serviceFee: number;
    total: number;
    currency: string;
  };
  payment: {
    method: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
}

interface BookingState {
  // Current booking flow
  currentBooking: Partial<BookingDetails> | null;
  bookingStep: 'details' | 'payment' | 'confirmation';
  
  // User's bookings
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  
  // Payment
  paymentIntent: string | null;
  isProcessingPayment: boolean;
  
  // Actions
  initializeBooking: (serviceId: string, guideId: string) => void;
  updateBookingDetails: (details: Partial<BookingDetails>) => void;
  setBookingStep: (step: BookingState['bookingStep']) => void;
  createBooking: () => Promise<string>; // Returns booking ID
  processPayment: (bookingId: string, paymentMethodId: string) => Promise<void>;
  confirmBooking: (bookingId: string) => Promise<void>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<void>;
  fetchBookings: () => Promise<void>;
  submitReview: (bookingId: string, rating: number, comment: string) => Promise<void>;
  clearCurrentBooking: () => void;
  setError: (error: string | null) => void;
}

export const useBooking = create<BookingState>((set, get) => ({
  // Initial state
  currentBooking: null,
  bookingStep: 'details',
  bookings: [],
  isLoading: false,
  error: null,
  paymentIntent: null,
  isProcessingPayment: false,

  // Actions
  initializeBooking: (serviceId: string, guideId: string) => {
    set({
      currentBooking: {
        serviceId,
        guideId,
        guests: 2,
      },
      bookingStep: 'details',
      error: null,
    });
  },

  updateBookingDetails: (details: Partial<BookingDetails>) => {
    set(state => ({
      currentBooking: state.currentBooking 
        ? { ...state.currentBooking, ...details }
        : details,
    }));
  },

  setBookingStep: (step: BookingState['bookingStep']) => {
    set({ bookingStep: step });
  },

  createBooking: async () => {
    const { currentBooking } = get();
    if (!currentBooking) {
      throw new Error('沒有預訂資料');
    }

    const { token } = useAuth.getState();
    if (!token) {
      throw new Error('請先登入');
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(currentBooking),
      });

      if (!response.ok) {
        throw new Error('建立預訂失敗');
      }

      const data = await response.json();
      
      set({
        paymentIntent: data.paymentIntent,
        bookingStep: 'payment',
        isLoading: false,
      });

      return data.bookingId;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '建立預訂時發生錯誤',
        isLoading: false,
      });
      throw error;
    }
  },

  processPayment: async (bookingId: string, paymentMethodId: string) => {
    const { token } = useAuth.getState();
    if (!token) {
      throw new Error('請先登入');
    }

    set({ isProcessingPayment: true, error: null });

    try {
      const response = await fetch('/api/bookings/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId,
          paymentMethodId,
        }),
      });

      if (!response.ok) {
        throw new Error('支付處理失敗');
      }

      const data = await response.json();
      
      if (data.status === 'succeeded') {
        set({
          bookingStep: 'confirmation',
          isProcessingPayment: false,
        });
      } else {
        throw new Error('支付未成功');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '支付處理時發生錯誤',
        isProcessingPayment: false,
      });
      throw error;
    }
  },

  confirmBooking: async (bookingId: string) => {
    const { token } = useAuth.getState();
    if (!token) {
      throw new Error('請先登入');
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/bookings/${bookingId}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('確認預訂失敗');
      }

      // Refresh bookings list
      await get().fetchBookings();
      
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '確認預訂時發生錯誤',
        isLoading: false,
      });
      throw error;
    }
  },

  cancelBooking: async (bookingId: string, reason?: string) => {
    const { token } = useAuth.getState();
    if (!token) {
      throw new Error('請先登入');
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('取消預訂失敗');
      }

      // Refresh bookings list
      await get().fetchBookings();
      
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '取消預訂時發生錯誤',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchBookings: async () => {
    const { token } = useAuth.getState();
    if (!token) {
      throw new Error('請先登入');
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('獲取預訂列表失敗');
      }

      const data = await response.json();
      
      set({
        bookings: data.bookings,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '獲取預訂列表時發生錯誤',
        isLoading: false,
      });
    }
  },

  submitReview: async (bookingId: string, rating: number, comment: string) => {
    const { token } = useAuth.getState();
    if (!token) {
      throw new Error('請先登入');
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/bookings/${bookingId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        throw new Error('提交評價失敗');
      }

      // Refresh bookings list
      await get().fetchBookings();
      
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '提交評價時發生錯誤',
        isLoading: false,
      });
      throw error;
    }
  },

  clearCurrentBooking: () => {
    set({
      currentBooking: null,
      bookingStep: 'details',
      paymentIntent: null,
      error: null,
    });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));