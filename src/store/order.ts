// 訂單狀態管理 Store
// 功能：管理訂單的建立、查詢、更新等狀態和操作
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, CreateOrderRequest, OrderListParams, OrderStatus, PaymentStatus, CancellationReason } from '@/types/order';

// 訂單狀態管理介面定義
interface OrderState {
  // 狀態屬性
  orders: Order[];                    // 訂單列表
  currentOrder: Order | null;         // 當前查看的訂單
  isLoading: boolean;                 // 載入狀態
  isCreating: boolean;                // 建立中狀態
  isUpdating: boolean;                // 更新中狀態
  error: string | null;               // 錯誤訊息
  
  // 分頁和篩選
  currentPage: number;                // 當前頁數
  totalPages: number;                 // 總頁數
  totalOrders: number;                // 訂單總數
  filters: Partial<OrderListParams>;  // 篩選條件
  
  // 行為方法
  createOrder: (orderData: CreateOrderRequest) => Promise<Order>;  // 建立訂單
  fetchOrders: (params?: Partial<OrderListParams>) => Promise<void>; // 查詢訂單列表
  fetchOrder: (orderId: string) => Promise<Order>;                   // 查詢單一訂單
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>; // 更新訂單狀態
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => Promise<void>; // 更新支付狀態
  cancelOrder: (orderId: string, reason: CancellationReason, description?: string) => Promise<void>; // 取消訂單
  rateOrder: (orderId: string, rating: number, comment?: string) => Promise<void>; // 評價訂單
  clearError: () => void;             // 清除錯誤
  setFilters: (filters: Partial<OrderListParams>) => void; // 設置篩選條件
  clearCurrentOrder: () => void;      // 清除當前訂單
}

/**
 * 訂單管理 Store
 * 
 * 功能：
 * - 訂單的 CRUD 操作
 * - 訂單狀態管理
 * - 支付狀態管理
 * - 訂單篩選和分頁
 * - 錯誤處理
 */
export const useOrder = create<OrderState>()(
  persist(
    (set, get) => ({
      // 初始狀態
      orders: [],
      currentOrder: null,
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalOrders: 0,
      filters: {},

      /**
       * 建立訂單
       * @param orderData 訂單資料
       * @returns 建立的訂單
       */
      createOrder: async (orderData: CreateOrderRequest) => {
        set({ isCreating: true, error: null });
        
        try {
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(orderData),
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.error || '建立訂單失敗');
          }

          const newOrder = result.data;
          
          // 更新訂單列表
          set(state => ({
            orders: [newOrder, ...state.orders],
            currentOrder: newOrder,
            totalOrders: state.totalOrders + 1,
            isCreating: false
          }));

          return newOrder;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '建立訂單失敗';
          set({ error: errorMessage, isCreating: false });
          throw error;
        }
      },

      /**
       * 查詢訂單列表
       * @param params 查詢參數
       */
      fetchOrders: async (params?: Partial<OrderListParams>) => {
        set({ isLoading: true, error: null });
        
        try {
          const queryParams = { ...get().filters, ...params };
          const searchParams = new URLSearchParams();
          
          Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              if (Array.isArray(value)) {
                searchParams.append(key, value.join(','));
              } else {
                searchParams.append(key, value.toString());
              }
            }
          });

          const response = await fetch(`/api/orders?${searchParams.toString()}`, {
            credentials: 'include',
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.error || '查詢訂單失敗');
          }

          set({
            orders: result.data.orders,
            currentPage: result.data.page,
            totalPages: result.data.totalPages,
            totalOrders: result.data.total,
            filters: queryParams,
            isLoading: false
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '查詢訂單失敗';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * 查詢單一訂單
       * @param orderId 訂單 ID
       * @returns 訂單資料
       */
      fetchOrder: async (orderId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`/api/orders/${orderId}`, {
            credentials: 'include',
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.error || '查詢訂單失敗');
          }

          const order = result.data;
          
          set({
            currentOrder: order,
            isLoading: false
          });

          return order;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '查詢訂單失敗';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      /**
       * 更新訂單狀態
       * @param orderId 訂單 ID
       * @param status 新狀態
       */
      updateOrderStatus: async (orderId: string, status: OrderStatus) => {
        set({ isUpdating: true, error: null });
        
        try {
          const response = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ status }),
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.error || '更新訂單狀態失敗');
          }

          const updatedOrder = result.data;
          
          // 更新訂單列表和當前訂單
          set(state => ({
            orders: state.orders.map(order => 
              order.id === orderId ? updatedOrder : order
            ),
            currentOrder: state.currentOrder?.id === orderId ? updatedOrder : state.currentOrder,
            isUpdating: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '更新訂單狀態失敗';
          set({ error: errorMessage, isUpdating: false });
          throw error;
        }
      },

      /**
       * 更新支付狀態
       * @param orderId 訂單 ID
       * @param status 支付狀態
       */
      updatePaymentStatus: async (orderId: string, status: PaymentStatus) => {
        set({ isUpdating: true, error: null });
        
        try {
          const response = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ paymentStatus: status }),
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.error || '更新支付狀態失敗');
          }

          const updatedOrder = result.data;
          
          // 更新訂單列表和當前訂單
          set(state => ({
            orders: state.orders.map(order => 
              order.id === orderId ? updatedOrder : order
            ),
            currentOrder: state.currentOrder?.id === orderId ? updatedOrder : state.currentOrder,
            isUpdating: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '更新支付狀態失敗';
          set({ error: errorMessage, isUpdating: false });
          throw error;
        }
      },

      /**
       * 取消訂單
       * @param orderId 訂單 ID
       * @param reason 取消原因
       * @param description 詳細說明
       */
      cancelOrder: async (orderId: string, reason: CancellationReason, description?: string) => {
        set({ isUpdating: true, error: null });
        
        try {
          const response = await fetch(`/api/orders/${orderId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ reason, description }),
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.error || '取消訂單失敗');
          }

          const cancelledOrder = result.data;
          
          // 更新訂單列表和當前訂單
          set(state => ({
            orders: state.orders.map(order => 
              order.id === orderId ? cancelledOrder : order
            ),
            currentOrder: state.currentOrder?.id === orderId ? cancelledOrder : state.currentOrder,
            isUpdating: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '取消訂單失敗';
          set({ error: errorMessage, isUpdating: false });
          throw error;
        }
      },

      /**
       * 評價訂單
       * @param orderId 訂單 ID
       * @param rating 評分
       * @param comment 評論
       */
      rateOrder: async (orderId: string, rating: number, comment?: string) => {
        set({ isUpdating: true, error: null });
        
        try {
          const response = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
              rating: {
                score: rating,
                comment,
                ratedAt: new Date().toISOString()
              }
            }),
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.error || '評價失敗');
          }

          const ratedOrder = result.data;
          
          // 更新訂單列表和當前訂單
          set(state => ({
            orders: state.orders.map(order => 
              order.id === orderId ? ratedOrder : order
            ),
            currentOrder: state.currentOrder?.id === orderId ? ratedOrder : state.currentOrder,
            isUpdating: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '評價失敗';
          set({ error: errorMessage, isUpdating: false });
          throw error;
        }
      },

      /**
       * 清除錯誤訊息
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * 設置篩選條件
       * @param filters 篩選條件
       */
      setFilters: (filters: Partial<OrderListParams>) => {
        set(state => ({
          filters: { ...state.filters, ...filters },
          currentPage: 1 // 重置頁數
        }));
      },

      /**
       * 清除當前訂單
       */
      clearCurrentOrder: () => {
        set({ currentOrder: null });
      },
    }),
    {
      // 持久化配置
      name: 'guidee-order',
      partialize: (state) => ({
        // 只持久化篩選條件，不持久化訂單資料
        filters: state.filters,
      }),
    }
  )
);