// 統一錯誤處理工具
// 功能：提供一致的錯誤處理和用戶友好的錯誤訊息

export interface ErrorDetails {
  code: string;
  message: string;
  userMessage: string;
  statusCode: number;
}

// 訂單相關錯誤代碼
export enum OrderErrorCode {
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  INVALID_ORDER_STATUS = 'INVALID_ORDER_STATUS',
  INVALID_STATUS_TRANSITION = 'INVALID_STATUS_TRANSITION',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_REQUIRED = 'PAYMENT_REQUIRED',
  CANCELLATION_NOT_ALLOWED = 'CANCELLATION_NOT_ALLOWED',
  REFUND_NOT_AVAILABLE = 'REFUND_NOT_AVAILABLE',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  INVALID_REQUEST_DATA = 'INVALID_REQUEST_DATA',
  SERVICE_NOT_AVAILABLE = 'SERVICE_NOT_AVAILABLE',
  BOOKING_CONFLICT = 'BOOKING_CONFLICT',
  PARTICIPANT_LIMIT_EXCEEDED = 'PARTICIPANT_LIMIT_EXCEEDED'
}

// 錯誤定義映射
const errorDefinitions: Record<OrderErrorCode, Omit<ErrorDetails, 'code'>> = {
  [OrderErrorCode.ORDER_NOT_FOUND]: {
    message: 'Order not found',
    userMessage: '找不到指定的訂單',
    statusCode: 404
  },
  [OrderErrorCode.INVALID_ORDER_STATUS]: {
    message: 'Invalid order status',
    userMessage: '訂單狀態不正確',
    statusCode: 400
  },
  [OrderErrorCode.INVALID_STATUS_TRANSITION]: {
    message: 'Invalid status transition',
    userMessage: '無法執行此狀態轉換',
    statusCode: 400
  },
  [OrderErrorCode.PAYMENT_FAILED]: {
    message: 'Payment processing failed',
    userMessage: '支付處理失敗，請稍後再試',
    statusCode: 400
  },
  [OrderErrorCode.PAYMENT_REQUIRED]: {
    message: 'Payment is required to proceed',
    userMessage: '需要完成支付才能繼續',
    statusCode: 402
  },
  [OrderErrorCode.CANCELLATION_NOT_ALLOWED]: {
    message: 'Order cancellation is not allowed',
    userMessage: '此訂單無法取消',
    statusCode: 400
  },
  [OrderErrorCode.REFUND_NOT_AVAILABLE]: {
    message: 'Refund is not available for this order',
    userMessage: '此訂單不支持退款',
    statusCode: 400
  },
  [OrderErrorCode.INSUFFICIENT_PERMISSIONS]: {
    message: 'Insufficient permissions to access this resource',
    userMessage: '權限不足，無法執行此操作',
    statusCode: 403
  },
  [OrderErrorCode.INVALID_REQUEST_DATA]: {
    message: 'Invalid or missing request data',
    userMessage: '請求資料不完整或格式錯誤',
    statusCode: 400
  },
  [OrderErrorCode.SERVICE_NOT_AVAILABLE]: {
    message: 'Service is not available for booking',
    userMessage: '此服務目前無法預訂',
    statusCode: 400
  },
  [OrderErrorCode.BOOKING_CONFLICT]: {
    message: 'Booking conflict detected',
    userMessage: '該時段已被預訂，請選擇其他時間',
    statusCode: 409
  },
  [OrderErrorCode.PARTICIPANT_LIMIT_EXCEEDED]: {
    message: 'Participant limit exceeded',
    userMessage: '參與人數超過限制',
    statusCode: 400
  }
};

// 自定義錯誤類
export class OrderError extends Error {
  public readonly code: OrderErrorCode;
  public readonly userMessage: string;
  public readonly statusCode: number;
  public readonly timestamp: string;

  constructor(code: OrderErrorCode, additionalMessage?: string) {
    const errorDef = errorDefinitions[code];
    const message = additionalMessage ? `${errorDef.message}: ${additionalMessage}` : errorDef.message;
    
    super(message);
    
    this.name = 'OrderError';
    this.code = code;
    this.userMessage = errorDef.userMessage;
    this.statusCode = errorDef.statusCode;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      statusCode: this.statusCode,
      timestamp: this.timestamp
    };
  }
}

// 錯誤處理工具函數
export const errorHandler = {
  // 創建訂單錯誤
  createOrderError: (code: OrderErrorCode, additionalMessage?: string) => {
    return new OrderError(code, additionalMessage);
  },

  // 處理未知錯誤
  handleUnknownError: (error: unknown): ErrorDetails => {
    if (error instanceof OrderError) {
      return {
        code: error.code,
        message: error.message,
        userMessage: error.userMessage,
        statusCode: error.statusCode
      };
    }

    if (error instanceof Error) {
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        userMessage: '系統發生錯誤，請稍後再試',
        statusCode: 500
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      userMessage: '系統發生未知錯誤',
      statusCode: 500
    };
  },

  // 驗證訂單狀態轉換
  validateStatusTransition: (currentStatus: string, newStatus: string): void => {
    const allowedTransitions: Record<string, string[]> = {
      'DRAFT': ['PENDING', 'CANCELLED'],
      'PENDING': ['CONFIRMED', 'CANCELLED'],
      'CONFIRMED': ['PAID', 'CANCELLED'],
      'PAID': ['IN_PROGRESS', 'CANCELLED'],
      'IN_PROGRESS': ['COMPLETED'],
      'COMPLETED': [],
      'CANCELLED': ['REFUNDED'],
      'REFUNDED': []
    };

    const allowed = allowedTransitions[currentStatus];
    if (!allowed || !allowed.includes(newStatus)) {
      throw new OrderError(
        OrderErrorCode.INVALID_STATUS_TRANSITION,
        `Cannot transition from ${currentStatus} to ${newStatus}`
      );
    }
  },

  // 驗證權限
  validatePermissions: (userRole: string, orderId: string, userId: string, guideId?: string): void => {
    // 管理員可以存取所有訂單
    if (userRole === 'admin') return;

    // 用戶只能存取自己的訂單或作為導遊的訂單
    if (userId !== orderId && (!guideId || userId !== guideId)) {
      throw new OrderError(OrderErrorCode.INSUFFICIENT_PERMISSIONS);
    }
  },

  // 格式化 API 錯誤回應
  formatErrorResponse: (error: ErrorDetails) => {
    return {
      success: false,
      error: error.userMessage,
      details: {
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString()
      }
    };
  }
};

// 通用錯誤中間件（用於 API 路由）
export const withErrorHandler = (handler: Function) => {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('API Error:', error);
      
      const errorDetails = errorHandler.handleUnknownError(error);
      const response = errorHandler.formatErrorResponse(errorDetails);
      
      return Response.json(response, { status: errorDetails.statusCode });
    }
  };
};