// 通用驗證工具函式

export interface ValidationRule<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => boolean | string;
  min?: number;
  max?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// 驗證單個欄位
export function validateField(value: any, rules: ValidationRule): ValidationResult {
  const errors: string[] = [];

  // 必填驗證
  if (rules.required && (value === undefined || value === null || value === '')) {
    errors.push('此欄位為必填');
    return { isValid: false, errors };
  }

  // 如果值為空且非必填，跳過其他驗證
  if (!value && !rules.required) {
    return { isValid: true, errors: [] };
  }

  // 字串長度驗證
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`最少需要 ${rules.minLength} 個字元`);
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`最多只能 ${rules.maxLength} 個字元`);
    }
  }

  // 數值範圍驗證
  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      errors.push(`值必須大於或等於 ${rules.min}`);
    }
    if (rules.max !== undefined && value > rules.max) {
      errors.push(`值必須小於或等於 ${rules.max}`);
    }
  }

  // 正規表達式驗證
  if (rules.pattern && typeof value === 'string') {
    if (!rules.pattern.test(value)) {
      errors.push('格式不正確');
    }
  }

  // 自訂驗證
  if (rules.custom) {
    const customResult = rules.custom(value);
    if (customResult !== true) {
      errors.push(typeof customResult === 'string' ? customResult : '驗證失敗');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// 驗證物件的多個欄位
export function validateObject<T extends Record<string, any>>(
  data: T,
  schema: Record<keyof T, ValidationRule>
): { isValid: boolean; errors: Record<keyof T, string[]> } {
  const errors: Record<keyof T, string[]> = {} as Record<keyof T, string[]>;
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const fieldResult = validateField(data[field], rules);
    if (!fieldResult.isValid) {
      errors[field as keyof T] = fieldResult.errors;
      isValid = false;
    }
  }

  return { isValid, errors };
}

// 常用驗證規則
export const commonRules = {
  // 電子郵件
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 255
  } as ValidationRule,

  // 密碼
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    custom: (value: string) => {
      if (!/(?=.*[a-z])/.test(value)) return '至少包含一個小寫字母';
      if (!/(?=.*[A-Z])/.test(value)) return '至少包含一個大寫字母';
      if (!/(?=.*\d)/.test(value)) return '至少包含一個數字';
      return true;
    }
  } as ValidationRule,

  // 簡單密碼（較寬鬆）
  simplePassword: {
    required: true,
    minLength: 6,
    maxLength: 128
  } as ValidationRule,

  // 姓名
  name: {
    required: true,
    minLength: 1,
    maxLength: 50,
    pattern: /^[\u4e00-\u9fa5a-zA-Z\s]+$/
  } as ValidationRule,

  // 電話號碼
  phone: {
    required: true,
    pattern: /^09\d{8}$/
  } as ValidationRule,

  // 信用卡號
  creditCard: {
    required: true,
    pattern: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
    custom: (value: string) => {
      // Luhn 演算法驗證
      const digits = value.replace(/\s/g, '');
      let sum = 0;
      let isEven = false;
      
      for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i] || '0');
        
        if (isEven) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        
        sum += digit;
        isEven = !isEven;
      }
      
      return sum % 10 === 0 || '信用卡號碼無效';
    }
  } as ValidationRule,

  // CVV
  cvv: {
    required: true,
    pattern: /^\d{3,4}$/
  } as ValidationRule,

  // 到期日
  expiryDate: {
    required: true,
    pattern: /^\d{2}\/\d{2}$/,
    custom: (value: string) => {
      const [month, year] = value.split('/').map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      
      if (!month || month < 1 || month > 12) {
        return '月份必須在 01-12 之間';
      }
      
      if (!year || year < currentYear || (year === currentYear && month < currentMonth)) {
        return '卡片已過期';
      }
      
      return true;
    }
  } as ValidationRule,

  // 評分
  rating: {
    required: true,
    min: 1,
    max: 5
  } as ValidationRule,

  // 價格
  price: {
    required: true,
    min: 0,
    max: 999999
  } as ValidationRule,

  // 人數
  guests: {
    required: true,
    min: 1,
    max: 20
  } as ValidationRule,

  // 時長
  duration: {
    required: true,
    min: 0.5,
    max: 24
  } as ValidationRule
};

// 驗證預訂資料
export function validateBookingDetails(data: any): ValidationResult {
  const schema = {
    serviceId: { required: true },
    guideId: { required: true },
    date: { 
      required: true,
      custom: (value: any) => {
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today || '日期不能早於今天';
      }
    },
    time: { required: true, pattern: /^\d{2}:\d{2}$/ },
    guests: commonRules.guests,
    duration: commonRules.duration,
    contactInfo: {
      required: true,
      custom: (contactInfo: any) => {
        if (!contactInfo || typeof contactInfo !== 'object') {
          return '聯絡資訊格式錯誤';
        }
        
        const nameResult = validateField(contactInfo.name, commonRules.name);
        if (!nameResult.isValid) return nameResult.errors[0] || '姓名驗證失敗';
        
        const emailResult = validateField(contactInfo.email, commonRules.email);
        if (!emailResult.isValid) return emailResult.errors[0] || '郵件驗證失敗';
        
        const phoneResult = validateField(contactInfo.phone, commonRules.phone);
        if (!phoneResult.isValid) return phoneResult.errors[0] || '電話驗證失敗';
        
        return true;
      }
    }
  };

  const result = validateObject(data, schema);
  return {
    isValid: result.isValid,
    errors: Object.values(result.errors).flat()
  };
}

// 驗證用戶註冊資料
export function validateRegistration(data: any): ValidationResult {
  const schema = {
    email: commonRules.email,
    password: commonRules.password,
    name: commonRules.name,
    role: {
      required: true,
      custom: (value: string) => ['traveler', 'guide'].includes(value) || '角色必須是旅客或導遊'
    }
  };

  const result = validateObject(data, schema);
  return {
    isValid: result.isValid,
    errors: Object.values(result.errors).flat()
  };
}

// 驗證登入資料
export function validateLogin(data: any): ValidationResult {
  const schema = {
    email: commonRules.email,
    password: { required: true, minLength: 1 }
  };

  const result = validateObject(data, schema);
  return {
    isValid: result.isValid,
    errors: Object.values(result.errors).flat()
  };
}

// 驗證評價資料
export function validateReview(data: any): ValidationResult {
  const schema = {
    rating: commonRules.rating,
    comment: {
      required: true,
      minLength: 10,
      maxLength: 1000
    }
  };

  const result = validateObject(data, schema);
  return {
    isValid: result.isValid,
    errors: Object.values(result.errors).flat()
  };
}

// 清理和標準化數據
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // 移除基本的 HTML 標籤字符
    .replace(/javascript:/gi, '') // 移除 javascript: 協議
    .replace(/on\w+=/gi, ''); // 移除事件處理器
}

// 驗證檔案上傳
export function validateFile(file: File, options: {
  maxSize?: number; // bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
}): ValidationResult {
  const errors: string[] = [];

  // 檔案大小驗證
  if (options.maxSize && file.size > options.maxSize) {
    errors.push(`檔案大小不能超過 ${(options.maxSize / (1024 * 1024)).toFixed(1)} MB`);
  }

  // 檔案類型驗證
  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    errors.push(`不支援的檔案類型: ${file.type}`);
  }

  // 檔案副檔名驗證
  if (options.allowedExtensions) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !options.allowedExtensions.includes(extension)) {
      errors.push(`不支援的檔案副檔名: ${extension}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}