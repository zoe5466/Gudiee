// 設定模擬數據存儲
// 功能：為開發階段提供用戶設定相關的模擬數據

export interface UserSettings {
  userId: string;
  notifications: {
    email: {
      bookingUpdates: boolean;
      messageNotifications: boolean;
      promotionalEmails: boolean;
      weeklyDigest: boolean;
      securityAlerts: boolean;
    };
    push: {
      bookingReminders: boolean;
      messageNotifications: boolean;
      guideRequests: boolean;
      reviewUpdates: boolean;
    };
    sms: {
      bookingConfirmation: boolean;
      urgentUpdates: boolean;
    };
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowMessages: 'everyone' | 'verified' | 'none';
    shareDataWithPartners: boolean;
    allowMarketing: boolean;
    showOnlineStatus: boolean;
    shareBookingHistory: boolean;
  };
  language: {
    selectedLanguage: string;
    autoDetect: boolean;
    dateFormat: 'YYYY/MM/DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
    timeFormat: '24' | '12';
    currency: 'TWD' | 'USD' | 'JPY';
  };
  payment: {
    defaultPaymentMethod?: string;
    autoSavePaymentMethods: boolean;
    requireCvvForSavedCards: boolean;
  };
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'credit' | 'debit' | 'paypal' | 'bank';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  holderName: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'payment' | 'refund' | 'payout';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  paymentMethodId?: string;
  createdAt: string;
}

// 預設設定
const defaultSettings: Omit<UserSettings, 'userId' | 'updatedAt'> = {
  notifications: {
    email: {
      bookingUpdates: true,
      messageNotifications: true,
      promotionalEmails: false,
      weeklyDigest: true,
      securityAlerts: true
    },
    push: {
      bookingReminders: true,
      messageNotifications: true,
      guideRequests: true,
      reviewUpdates: false
    },
    sms: {
      bookingConfirmation: true,
      urgentUpdates: true
    }
  },
  privacy: {
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowMessages: 'verified',
    shareDataWithPartners: false,
    allowMarketing: false,
    showOnlineStatus: true,
    shareBookingHistory: false
  },
  language: {
    selectedLanguage: 'zh-TW',
    autoDetect: true,
    dateFormat: 'YYYY/MM/DD',
    timeFormat: '24',
    currency: 'TWD'
  },
  payment: {
    autoSavePaymentMethods: true,
    requireCvvForSavedCards: true
  }
};

// 模擬付款方式數據
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'card-1',
    userId: 'user-001',
    type: 'credit',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2027,
    isDefault: true,
    holderName: '王小美',
    createdAt: '2023-01-15T10:00:00Z'
  },
  {
    id: 'card-2',
    userId: 'user-001',
    type: 'credit',
    last4: '5555',
    brand: 'Mastercard',
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false,
    holderName: '王小美',
    createdAt: '2023-06-20T14:30:00Z'
  }
];

// 模擬交易記錄
const mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    userId: 'user-001',
    type: 'payment',
    amount: 2800,
    currency: 'TWD',
    status: 'completed',
    description: '台北101 & 信義商圈深度導覽',
    paymentMethodId: 'card-1',
    createdAt: '2024-01-15T14:30:00Z'
  },
  {
    id: 'txn-2',
    userId: 'user-001',
    type: 'payout',
    amount: 3500,
    currency: 'TWD',
    status: 'completed',
    description: '導遊服務收入',
    createdAt: '2024-01-10T09:15:00Z'
  },
  {
    id: 'txn-3',
    userId: 'user-001',
    type: 'payment',
    amount: 1800,
    currency: 'TWD',
    status: 'pending',
    description: '夜市美食文化體驗',
    paymentMethodId: 'card-2',
    createdAt: '2024-01-08T16:45:00Z'
  }
];

// 設定存儲類別
class SettingsStorage {
  private settingsKey = 'guidee-user-settings';
  private paymentMethodsKey = 'guidee-payment-methods';
  private transactionsKey = 'guidee-transactions';

  // 獲取用戶設定
  getUserSettings(userId: string): UserSettings {
    if (typeof window === 'undefined') {
      return {
        userId,
        ...defaultSettings,
        updatedAt: new Date().toISOString()
      };
    }

    try {
      const stored = localStorage.getItem(`${this.settingsKey}-${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load user settings:', error);
    }

    // 返回預設設定
    const userSettings: UserSettings = {
      userId,
      ...defaultSettings,
      updatedAt: new Date().toISOString()
    };

    this.saveUserSettings(userSettings);
    return userSettings;
  }

  // 保存用戶設定
  saveUserSettings(settings: UserSettings): void {
    if (typeof window === 'undefined') return;

    try {
      settings.updatedAt = new Date().toISOString();
      localStorage.setItem(`${this.settingsKey}-${settings.userId}`, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save user settings:', error);
    }
  }

  // 更新特定設定類別
  updateSettings<K extends keyof Omit<UserSettings, 'userId' | 'updatedAt'>>(
    userId: string,
    category: K,
    updates: Partial<UserSettings[K]>
  ): UserSettings {
    const currentSettings = this.getUserSettings(userId);
    const updatedSettings: UserSettings = {
      ...currentSettings,
      [category]: {
        ...currentSettings[category],
        ...updates
      },
      updatedAt: new Date().toISOString()
    };

    this.saveUserSettings(updatedSettings);
    return updatedSettings;
  }

  // 獲取用戶付款方式
  getPaymentMethods(userId: string): PaymentMethod[] {
    if (typeof window === 'undefined') {
      return mockPaymentMethods.filter(method => method.userId === userId);
    }

    try {
      const stored = localStorage.getItem(`${this.paymentMethodsKey}-${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    }

    // 返回模擬數據
    const userPaymentMethods = mockPaymentMethods.filter(method => method.userId === userId);
    this.savePaymentMethods(userId, userPaymentMethods);
    return userPaymentMethods;
  }

  // 保存付款方式
  savePaymentMethods(userId: string, methods: PaymentMethod[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(`${this.paymentMethodsKey}-${userId}`, JSON.stringify(methods));
    } catch (error) {
      console.error('Failed to save payment methods:', error);
    }
  }

  // 新增付款方式
  addPaymentMethod(method: Omit<PaymentMethod, 'id' | 'createdAt'>): PaymentMethod {
    const newMethod: PaymentMethod = {
      ...method,
      id: `card-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const currentMethods = this.getPaymentMethods(method.userId);
    
    // 如果新卡片設為預設，將其他卡片設為非預設
    if (newMethod.isDefault) {
      currentMethods.forEach(m => m.isDefault = false);
    }

    const updatedMethods = [...currentMethods, newMethod];
    this.savePaymentMethods(method.userId, updatedMethods);
    
    return newMethod;
  }

  // 更新付款方式
  updatePaymentMethod(userId: string, methodId: string, updates: Partial<PaymentMethod>): PaymentMethod | null {
    const methods = this.getPaymentMethods(userId);
    const methodIndex = methods.findIndex(m => m.id === methodId);
    
    if (methodIndex === -1) return null;

    // 如果設為預設，將其他方式設為非預設
    if (updates.isDefault) {
      methods.forEach(m => m.isDefault = false);
    }

    methods[methodIndex] = { ...methods[methodIndex], ...updates } as PaymentMethod;
    this.savePaymentMethods(userId, methods);
    
    return methods[methodIndex];
  }

  // 刪除付款方式
  deletePaymentMethod(userId: string, methodId: string): boolean {
    const methods = this.getPaymentMethods(userId);
    const methodIndex = methods.findIndex(m => m.id === methodId);
    
    if (methodIndex === -1) return false;

    // 不能刪除預設付款方式
    if (methods[methodIndex]?.isDefault && methods.length > 1) {
      return false;
    }

    methods.splice(methodIndex, 1);
    this.savePaymentMethods(userId, methods);
    
    return true;
  }

  // 獲取交易記錄
  getTransactions(userId: string, limit?: number): Transaction[] {
    if (typeof window === 'undefined') {
      return mockTransactions
        .filter(tx => tx.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    }

    try {
      const stored = localStorage.getItem(`${this.transactionsKey}-${userId}`);
      if (stored) {
        const transactions: Transaction[] = JSON.parse(stored);
        return transactions
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }

    // 返回模擬數據
    const userTransactions = mockTransactions
      .filter(tx => tx.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    
    this.saveTransactions(userId, userTransactions);
    return userTransactions;
  }

  // 保存交易記錄
  saveTransactions(userId: string, transactions: Transaction[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(`${this.transactionsKey}-${userId}`, JSON.stringify(transactions));
    } catch (error) {
      console.error('Failed to save transactions:', error);
    }
  }

  // 新增交易記錄
  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const currentTransactions = this.getTransactions(transaction.userId);
    const updatedTransactions = [newTransaction, ...currentTransactions];
    
    this.saveTransactions(transaction.userId, updatedTransactions);
    return newTransaction;
  }

  // 重置用戶設定
  resetUserSettings(userId: string): UserSettings {
    const resetSettings: UserSettings = {
      userId,
      ...defaultSettings,
      updatedAt: new Date().toISOString()
    };

    this.saveUserSettings(resetSettings);
    return resetSettings;
  }
}

// 導出全局實例
export const settingsStorage = new SettingsStorage();