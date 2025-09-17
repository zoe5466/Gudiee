// 測試助手工具

/**
 * 模擬 API 回應
 */
export function mockApiResponse<T>(
  data: T,
  delay: number = 100,
  shouldFail: boolean = false
): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('模擬 API 錯誤'));
      } else {
        resolve(data);
      }
    }, delay);
  });
}

/**
 * 模擬用戶資料
 */
export const mockUsers = {
  traveler: {
    id: '1',
    email: 'traveler@guidee.com',
    name: '測試旅客',
    role: 'traveler' as const,
    isEmailVerified: true,
    isKYCVerified: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    profile: {
      phone: '0912345678',
      bio: '喜愛旅遊的測試用戶',
      location: '台北市',
      languages: ['中文', '英文'],
      specialties: []
    }
  },
  guide: {
    id: '2',
    email: 'guide@guidee.com',
    name: '測試導遊',
    role: 'guide' as const,
    isEmailVerified: true,
    isKYCVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    profile: {
      phone: '0987654321',
      bio: '專業導遊，熟悉台北各大景點',
      location: '台北市',
      languages: ['中文', '英文', '日文'],
      specialties: ['文化導覽', '美食體驗', '攝影指導']
    }
  }
};

/**
 * 模擬預訂資料
 */
export const mockBookings = [
  {
    id: '1',
    serviceId: '1',
    guideId: 'guide-1',
    travelerId: '1',
    status: 'CONFIRMED' as const,
    details: {
      serviceId: '1',
      guideId: 'guide-1',
      date: new Date('2024-02-01'),
      time: '10:00',
      guests: 2,
      duration: 4,
      specialRequests: '希望能介紹更多歷史背景',
      contactInfo: {
        name: '測試用戶',
        email: 'user@guidee.com',
        phone: '0912345678'
      }
    },
    pricing: {
      basePrice: 3200,
      serviceFee: 320,
      total: 3520,
      currency: 'TWD'
    },
    payment: {
      method: 'credit_card',
      status: 'completed' as const,
      transactionId: 'tx_123456789'
    },
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z'
  }
];

/**
 * 模擬服務資料
 */
export const mockServices = [
  {
    id: '1',
    title: '台北101 & 信義區深度導覽',
    description: '深入探索台北最具代表性的地標，了解現代台北的發展歷程',
    location: '台北市信義區',
    price: 800,
    rating: 4.9,
    reviewCount: 127,
    duration: '4小時',
    maxGuests: 8,
    images: [
      'https://images.unsplash.com/photo-1508150492017-3d1e63ecdfc5?w=400&h=300&fit=crop'
    ],
    guide: {
      id: 'guide-1',
      name: '小美',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
      rating: 4.8,
      reviewCount: 89,
      languages: ['中文', '英文'],
      experience: '5年導覽經驗',
      specialties: ['建築導覽', '攝影指導']
    },
    highlights: [
      '登上台北101觀景台',
      '探索信義區建築群',
      '品嚐在地美食',
      '專業攝影指導'
    ],
    category: '城市導覽',
    isAvailable: true,
    cancellationPolicy: '24小時前可免費取消',
    included: ['導覽解說', '台北101門票', '茶點'],
    notIncluded: ['交通費', '餐費', '個人消費']
  }
];

/**
 * 模擬評價資料
 */
export const mockReviews = [
  {
    id: '1',
    bookingId: '1',
    serviceId: '1',
    guideId: 'guide-1',
    travelerId: '1',
    rating: 5,
    comment: '非常棒的導覽體驗！小美非常專業，介紹了很多有趣的歷史故事。',
    createdAt: '2024-01-16T10:00:00.000Z',
    travelerName: '測試用戶',
    travelerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    response: {
      content: '謝謝您的好評！很高興能為您提供精彩的導覽體驗。',
      createdAt: '2024-01-16T14:00:00.000Z',
      guideName: '小美'
    }
  }
];

/**
 * 模擬 localStorage
 */
export class MockStorage implements Storage {
  private store: { [key: string]: string } = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}

/**
 * 測試工具函式
 */
export const testUtils = {
  /**
   * 等待指定時間
   */
  wait: (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * 等待直到條件為真
   */
  waitFor: async (
    condition: () => boolean,
    timeout: number = 5000,
    interval: number = 100
  ): Promise<void> => {
    const startTime = Date.now();
    
    while (!condition() && Date.now() - startTime < timeout) {
      await testUtils.wait(interval);
    }
    
    if (!condition()) {
      throw new Error(`等待條件超時 (${timeout}ms)`);
    }
  },

  /**
   * 模擬用戶輸入
   */
  fireEvent: {
    change: (element: HTMLInputElement, value: string) => {
      element.value = value;
      element.dispatchEvent(new Event('change', { bubbles: true }));
    },
    
    click: (element: HTMLElement) => {
      element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    },
    
    submit: (form: HTMLFormElement) => {
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  },

  /**
   * 驗證函式調用
   */
  spy: <T extends (...args: any[]) => any>(fn?: T): T & { calls: Parameters<T>[] } => {
    const calls: Parameters<T>[] = [];
    const spyFn = ((...args: Parameters<T>) => {
      calls.push(args);
      return fn?.(...args);
    }) as T & { calls: Parameters<T>[] };
    
    spyFn.calls = calls;
    return spyFn;
  },

  /**
   * 模擬錯誤
   */
  mockError: (message: string = '測試錯誤') => {
    return new Error(message);
  }
};

/**
 * 表單驗證測試案例
 */
export const validationTestCases = {
  email: {
    valid: [
      'user@example.com',
      'test.email@domain.co.uk',
      'user+tag@example.org'
    ],
    invalid: [
      '',
      'invalid-email',
      '@domain.com',
      'user@',
      'user@domain'
    ]
  },
  
  password: {
    valid: [
      'Password123',
      'MySecure@Pass1',
      'Test12345678'
    ],
    invalid: [
      '',
      '123',
      'password',
      'PASSWORD',
      '12345678'
    ]
  },
  
  phone: {
    valid: [
      '0912345678',
      '0987654321',
      '0923456789'
    ],
    invalid: [
      '',
      '123456789',
      '912345678',
      '09123456789',
      'abc1234567'
    ]
  },
  
  creditCard: {
    valid: [
      '4111 1111 1111 1111', // Visa
      '5555 5555 5555 4444', // Mastercard
      '3782 822463 10005'    // Amex (15 digits)
    ],
    invalid: [
      '',
      '1234 5678 9012 3456',
      '4111 1111 1111 1112',
      '123 456 789'
    ]
  }
};

/**
 * 效能測試工具
 */
export const performanceTestUtils = {
  /**
   * 測量函式執行時間
   */
  measureExecutionTime: async <T>(
    fn: () => Promise<T> | T,
    iterations: number = 1
  ): Promise<{ result: T; averageTime: number; times: number[] }> => {
    const times: number[] = [];
    let result: T;
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      result = await fn();
      const end = performance.now();
      times.push(end - start);
    }
    
    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    
    return {
      result: result!,
      averageTime,
      times
    };
  },

  /**
   * 測試記憶體使用量
   */
  measureMemoryUsage: (): { used: number; total: number } | null => {
    if (typeof window !== 'undefined' && (window.performance as any).memory) {
      const memory = (window.performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize
      };
    }
    return null;
  }
};

/**
 * API 測試助手
 */
export const apiTestUtils = {
  /**
   * 模擬成功的 API 回應
   */
  mockSuccessResponse: <T>(data: T, status: number = 200): Response => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  },

  /**
   * 模擬失敗的 API 回應
   */
  mockErrorResponse: (message: string, status: number = 400): Response => {
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  },

  /**
   * 模擬網路錯誤
   */
  mockNetworkError: (): Promise<never> => {
    return Promise.reject(new Error('Network Error'));
  }
};