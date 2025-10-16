// 模擬訂單數據存儲
// 在實際應用中，這應該是資料庫操作
import { Order } from '@/types/order';

// 模擬的訂單數據存儲
let mockOrders: Order[] = [
  {
    id: 'order-001',
    orderNumber: 'GD240001',
    userId: 'guide-001',
    status: 'CONFIRMED',
    booking: {
      serviceId: 'service-001',
      serviceName: '台北101 & 信義區深度導覽',
      serviceImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      guideId: 'guide-001',
      guideName: '張小美',
      guideAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      date: '2024-02-15',
      startTime: '09:00',
      endTime: '13:00',
      duration: 4,
      participants: 2,
      location: {
        name: '台北101購物中心正門',
        address: '台北市信義區市府路45號',
        coordinates: {
          lat: 25.0339,
          lng: 121.5645
        }
      },
      specialRequests: '希望能多介紹建築歷史'
    },
    customer: {
      name: '王小明',
      email: 'wang@example.com',
      phone: '0912345678',
      nationality: '台灣',
      emergencyContact: {
        name: '王太太',
        phone: '0987654321',
        relationship: '配偶'
      }
    },
    pricing: {
      basePrice: 800,
      participants: 2,
      subtotal: 1600,
      serviceFee: 160,
      tax: 88,
      total: 1848,
      currency: 'TWD'
    },
    payment: {
      method: 'CREDIT_CARD',
      status: 'COMPLETED',
      transactionId: 'txn_123456789',
      paidAt: '2024-01-20T10:30:00Z',
      paymentDetails: {
        cardLast4: '1234',
        cardBrand: 'VISA'
      }
    },
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    confirmedAt: '2024-01-20T10:30:00Z'
  }
];

// 導出訂單操作函數
export const orderStorage = {
  // 獲取所有訂單
  getAll: (): Order[] => {
    return mockOrders;
  },

  // 根據 ID 獲取訂單
  getById: (id: string): Order | undefined => {
    return mockOrders.find(order => order.id === id);
  },

  // 根據用戶 ID 獲取訂單
  getByUserId: (userId: string): Order[] => {
    return mockOrders.filter(order => order.userId === userId || order.booking.guideId === userId);
  },

  // 添加新訂單
  add: (order: Order): void => {
    mockOrders.push(order);
  },

  // 更新訂單
  update: (id: string, updates: Partial<Order>): Order | null => {
    const index = mockOrders.findIndex(order => order.id === id);
    if (index === -1) return null;

    const currentOrder = mockOrders[index];
    if (!currentOrder) return null;
    
    const updatedOrder: Order = {
      id: currentOrder.id,
      orderNumber: currentOrder.orderNumber,
      userId: currentOrder.userId,
      status: updates.status || currentOrder.status,
      booking: updates.booking || currentOrder.booking,
      customer: updates.customer || currentOrder.customer,
      pricing: updates.pricing || currentOrder.pricing,
      payment: updates.payment || currentOrder.payment,
      cancellation: updates.cancellation || currentOrder.cancellation,
      createdAt: currentOrder.createdAt,
      updatedAt: updates.updatedAt || new Date().toISOString(),
      confirmedAt: updates.confirmedAt || currentOrder.confirmedAt,
      completedAt: updates.completedAt || currentOrder.completedAt,
      notes: updates.notes || currentOrder.notes,
      internalNotes: updates.internalNotes || currentOrder.internalNotes,
      rating: updates.rating || currentOrder.rating
    };

    mockOrders[index] = updatedOrder;
    return updatedOrder;
  },

  // 刪除訂單（軟刪除，實際上是標記為已取消）
  delete: (id: string): boolean => {
    const index = mockOrders.findIndex(order => order.id === id);
    if (index === -1) return false;

    const currentOrder = mockOrders[index];
    if (!currentOrder) return false;

    mockOrders[index] = { 
      ...currentOrder, 
      status: 'CANCELLED',
      updatedAt: new Date().toISOString()
    };
    return true;
  },

  // 獲取統計資訊
  getStats: () => {
    return {
      total: mockOrders.length,
      pending: mockOrders.filter(o => o.status === 'PENDING').length,
      confirmed: mockOrders.filter(o => o.status === 'CONFIRMED').length,
      completed: mockOrders.filter(o => o.status === 'COMPLETED').length,
      cancelled: mockOrders.filter(o => o.status === 'CANCELLED').length
    };
  }
};