// API 客戶端工具

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export class ApiClientError extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

/**
 * 增強的 fetch 客戶端，包含錯誤處理、重試和超時機制
 */
export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;
  private defaultRetries: number;

  constructor(
    baseURL: string = '',
    defaultHeaders: Record<string, string> = {},
    defaultTimeout: number = 10000,
    defaultRetries: number = 2
  ) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders
    };
    this.defaultTimeout = defaultTimeout;
    this.defaultRetries = defaultRetries;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithTimeout(
    url: string,
    config: RequestConfig
  ): Promise<Response> {
    const timeout = config.timeout || this.defaultTimeout;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
        headers: {
          ...this.defaultHeaders,
          ...config.headers
        }
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiClientError('請求超時', 408, 'TIMEOUT');
      }
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const retries = config.retries ?? this.defaultRetries;
    const retryDelay = config.retryDelay ?? 1000;

    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, config);

        // 處理 HTTP 錯誤狀態
        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}`;
          let errorDetails;

          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
            errorDetails = errorData;
          } catch {
            // 如果無法解析 JSON，使用狀態文字
            errorMessage = response.statusText || errorMessage;
          }

          throw new ApiClientError(
            errorMessage,
            response.status,
            response.status.toString(),
            errorDetails
          );
        }

        // 解析回應
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          return await response.json();
        } else {
          return await response.text() as unknown as T;
        }

      } catch (error) {
        lastError = error as Error;

        // 如果是最後一次嘗試，拋出錯誤
        if (attempt === retries) {
          throw error;
        }

        // 只對特定類型的錯誤重試
        if (error instanceof ApiClientError) {
          const shouldRetry = error.status >= 500 || error.status === 408 || error.status === 429;
          if (!shouldRetry) {
            throw error;
          }
        }

        // 等待後重試
        await this.sleep(retryDelay * (attempt + 1));
      }
    }

    throw lastError!;
  }

  // HTTP 方法
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // 設定認證標頭
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // 移除認證標頭
  clearAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  // 檔案上傳
  async upload<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    config?: RequestConfig
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
      });
    }

    const headers: Record<string, string> = {};
    if (config?.headers) {
      if (config.headers instanceof Headers) {
        config.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(config.headers)) {
        config.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, config.headers);
      }
    }
    delete headers['Content-Type']; // 讓瀏覽器自動設定 multipart/form-data

    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: formData,
      headers
    });
  }
}

// 預設 API 客戶端實例
export const apiClient = new ApiClient();

// 錯誤處理助手函式
export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiClientError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code,
      details: error.details
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 0,
      code: 'UNKNOWN_ERROR'
    };
  }

  return {
    message: '發生未知錯誤',
    status: 0,
    code: 'UNKNOWN_ERROR'
  };
}

// 重試配置助手
export const retryConfig = {
  // 快速重試（用於輕量級操作）
  fast: { retries: 1, retryDelay: 500 },
  // 標準重試
  standard: { retries: 2, retryDelay: 1000 },
  // 慢速重試（用於重要操作）
  slow: { retries: 3, retryDelay: 2000 },
  // 不重試
  none: { retries: 0 }
};

// 特定 API 端點的配置
export const endpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    refresh: '/api/auth/refresh',
    logout: '/api/auth/logout',
    profile: '/api/users/profile'
  },
  bookings: {
    list: '/api/bookings',
    create: '/api/bookings',
    payment: '/api/bookings/payment',
    confirm: (id: string) => `/api/bookings/${id}/confirm`,
    cancel: (id: string) => `/api/bookings/${id}/cancel`,
    review: (id: string) => `/api/bookings/${id}/review`
  },
  reviews: {
    list: '/api/reviews',
    reply: '/api/reviews'
  },
  services: {
    list: '/api/services',
    detail: (id: string) => `/api/services/${id}`,
    search: '/api/services/search'
  }
} as const;