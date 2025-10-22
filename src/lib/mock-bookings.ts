// 預訂模擬數據存儲
// 功能：為開發階段提供預訂相關的模擬數據

export interface MockBooking {
  id: string;
  serviceId: string;
  travelerId: string;
  guideId: string;
  bookingDate: string;
  startTime: string;
  durationHours: number;
  guests: number;
  basePrice: number;
  serviceFee: number;
  totalAmount: number;
  currency: string;
  specialRequests?: string;
  contactInfo: Record<string, any>;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  service: {
    id: string;
    title: string;
    location: string;
    images: string[];
    guide: {
      id: string;
      name: string;
      avatar: string;
    };
  };
  traveler: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// 模擬預訂數據
const mockBookings: MockBooking[] = [];

// 預訂存儲類
class BookingStorage {
  private bookings: MockBooking[] = [];
  private storageKey = 'guidee_mock_bookings';

  constructor() {
    this.loadBookings();
  }

  // 從localStorage載入預訂
  private loadBookings() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          this.bookings = JSON.parse(stored);
        } else {
          // 首次載入使用空數據
          this.bookings = [...mockBookings];
          this.saveBookings();
        }
      } catch (error) {
        console.error('載入預訂數據失敗:', error);
        this.bookings = [...mockBookings];
      }
    } else {
      // 服務端渲染時使用預設數據
      this.bookings = [...mockBookings];
    }
  }

  // 保存預訂到localStorage
  private saveBookings() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.bookings));
      } catch (error) {
        console.error('保存預訂數據失敗:', error);
      }
    }
  }

  // 獲取所有預訂
  getAll(): MockBooking[] {
    return this.bookings;
  }

  // 根據ID獲取預訂
  getById(id: string): MockBooking | null {
    return this.bookings.find(booking => booking.id === id) || null;
  }

  // 根據用戶ID獲取預訂
  getByTravelerId(travelerId: string): MockBooking[] {
    return this.bookings.filter(booking => booking.travelerId === travelerId);
  }

  // 根據導遊ID獲取預訂
  getByGuideId(guideId: string): MockBooking[] {
    return this.bookings.filter(booking => booking.guideId === guideId);
  }

  // 添加預訂
  add(booking: Omit<MockBooking, 'id' | 'createdAt' | 'updatedAt'>): MockBooking {
    const newBooking: MockBooking = {
      ...booking,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.bookings.push(newBooking);
    this.saveBookings(); // 保存到localStorage
    return newBooking;
  }

  // 更新預訂
  update(id: string, updates: Partial<Omit<MockBooking, 'id'>>): MockBooking | null {
    const index = this.bookings.findIndex(booking => booking.id === id);
    if (index === -1) return null;

    const currentBooking = this.bookings[index]!;
    const updatedBooking: MockBooking = {
      ...currentBooking,
      ...updates,
      id, // 保持ID不變
      updatedAt: new Date().toISOString()
    };

    this.bookings[index] = updatedBooking;
    this.saveBookings(); // 保存到localStorage
    return this.bookings[index];
  }

  // 刪除預訂
  delete(id: string): boolean {
    const index = this.bookings.findIndex(booking => booking.id === id);
    if (index === -1) return false;

    this.bookings.splice(index, 1);
    this.saveBookings(); // 保存到localStorage
    return true;
  }

  // 搜尋預訂
  search(filters: {
    travelerId?: string;
    guideId?: string;
    status?: string;
    sortBy?: 'newest' | 'oldest' | 'date';
  }): MockBooking[] {
    let results = this.bookings;

    // 根據旅客ID篩選
    if (filters.travelerId) {
      results = results.filter(booking => booking.travelerId === filters.travelerId);
    }

    // 根據導遊ID篩選
    if (filters.guideId) {
      results = results.filter(booking => booking.guideId === filters.guideId);
    }

    // 根據狀態篩選
    if (filters.status) {
      results = results.filter(booking => booking.status === filters.status);
    }

    // 排序
    if (filters.sortBy) {
      results.sort((a, b) => {
        switch (filters.sortBy) {
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'date':
            return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime();
          default:
            return 0;
        }
      });
    }

    return results;
  }
}

// 導出單例實例
export const bookingStorage = new BookingStorage();