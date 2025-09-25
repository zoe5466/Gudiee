// 訂單系統類型定義
// 功能：定義訂單、預訂、支付等相關的所有資料結構

// 訂單狀態類型
export type OrderStatus = 
  | 'DRAFT'        // 草稿（未完成預訂）
  | 'PENDING'      // 待確認（等待導遊確認）
  | 'CONFIRMED'    // 已確認（導遊已確認）
  | 'PAID'         // 已付款
  | 'IN_PROGRESS'  // 進行中（服務開始）
  | 'COMPLETED'    // 已完成
  | 'CANCELLED'    // 已取消
  | 'REFUNDED';    // 已退款

// 支付狀態類型
export type PaymentStatus = 
  | 'PENDING'      // 待付款
  | 'PROCESSING'   // 處理中
  | 'COMPLETED'    // 已完成
  | 'FAILED'       // 失敗
  | 'REFUNDED'     // 已退款
  | 'CANCELLED';   // 已取消

// 支付方式類型
export type PaymentMethod = 
  | 'CREDIT_CARD'  // 信用卡
  | 'BANK_TRANSFER' // 銀行轉帳
  | 'PAYPAL'       // PayPal
  | 'LINE_PAY'     // LINE Pay
  | 'APPLE_PAY'    // Apple Pay
  | 'GOOGLE_PAY';  // Google Pay

// 取消原因類型
export type CancellationReason = 
  | 'USER_REQUEST'     // 用戶要求
  | 'GUIDE_UNAVAILABLE' // 導遊無法提供服務
  | 'WEATHER'          // 天氣因素
  | 'FORCE_MAJEURE'    // 不可抗力
  | 'SCHEDULE_CONFLICT' // 時間衝突
  | 'OTHER';           // 其他

// 預訂資訊介面
export interface BookingInfo {
  serviceId: string;           // 服務 ID
  serviceName: string;         // 服務名稱
  serviceImage: string;        // 服務圖片
  guideId: string;            // 導遊 ID
  guideName: string;          // 導遊姓名
  guideAvatar?: string;       // 導遊頭像
  date: string;               // 預訂日期 (ISO 8601)
  startTime: string;          // 開始時間
  endTime: string;            // 結束時間
  duration: number;           // 持續時間（小時）
  participants: number;       // 參與人數
  location: {                 // 集合地點
    name: string;             // 地點名稱
    address: string;          // 詳細地址
    coordinates?: {           // 座標（可選）
      lat: number;
      lng: number;
    };
  };
  specialRequests?: string;   // 特殊要求（可選）
}

// 價格計算介面
export interface PricingDetails {
  basePrice: number;          // 基礎價格（每人）
  participants: number;       // 參與人數
  subtotal: number;          // 小計
  serviceFee: number;        // 服務費
  tax: number;               // 稅費
  discount?: {               // 折扣（可選）
    type: 'PERCENTAGE' | 'FIXED'; // 折扣類型
    value: number;           // 折扣值
    code?: string;           // 優惠碼
    description: string;     // 折扣描述
  };
  total: number;             // 總計
  currency: string;          // 貨幣代碼（預設 TWD）
}

// 客戶資訊介面
export interface CustomerInfo {
  name: string;              // 姓名
  email: string;             // 電子郵件
  phone: string;             // 電話號碼
  nationality?: string;      // 國籍（可選）
  emergencyContact?: {       // 緊急聯絡人（可選）
    name: string;
    phone: string;
    relationship: string;
  };
  specialNeeds?: string;     // 特殊需求（可選）
}

// 支付資訊介面
export interface PaymentInfo {
  method: PaymentMethod;     // 支付方式
  status: PaymentStatus;     // 支付狀態
  transactionId?: string;    // 交易 ID
  paymentUrl?: string;       // 支付連結（用於第三方支付）
  paidAt?: string;          // 付款時間
  refundedAt?: string;      // 退款時間
  refundAmount?: number;     // 退款金額
  paymentDetails?: {        // 支付細節
    cardLast4?: string;     // 信用卡後四碼
    cardBrand?: string;     // 信用卡品牌
    bankName?: string;      // 銀行名稱
  };
}

// 取消資訊介面
export interface CancellationInfo {
  reason: CancellationReason; // 取消原因
  description?: string;       // 詳細說明
  cancelledBy: 'USER' | 'GUIDE' | 'ADMIN'; // 取消者
  cancelledAt: string;        // 取消時間
  refundPolicy: {            // 退款政策
    isRefundable: boolean;    // 是否可退款
    refundPercentage: number; // 退款比例 (0-100)
    refundAmount: number;     // 退款金額
    processingFee: number;    // 手續費
  };
}

// 主要訂單介面
export interface Order {
  id: string;                // 訂單 ID
  orderNumber: string;       // 訂單編號（對外顯示）
  userId: string;            // 用戶 ID
  status: OrderStatus;       // 訂單狀態
  booking: BookingInfo;      // 預訂資訊
  customer: CustomerInfo;    // 客戶資訊
  pricing: PricingDetails;   // 價格詳情
  payment: PaymentInfo;      // 支付資訊
  cancellation?: CancellationInfo; // 取消資訊（可選）
  
  // 時間戳記
  createdAt: string;         // 建立時間
  updatedAt: string;         // 更新時間
  confirmedAt?: string;      // 確認時間
  completedAt?: string;      // 完成時間
  
  // 其他資訊
  notes?: string;            // 訂單備註
  internalNotes?: string;    // 內部備註（管理員用）
  rating?: {                 // 評價（完成後）
    score: number;           // 評分 (1-5)
    comment?: string;        // 評論
    ratedAt: string;         // 評價時間
  };
}

// 建立訂單請求介面
export interface CreateOrderRequest {
  serviceId: string;
  date: string;
  startTime: string;
  participants: number;
  customer: CustomerInfo;
  specialRequests?: string;
}

// 訂單列表查詢參數
export interface OrderListParams {
  status?: OrderStatus[];    // 狀態篩選
  userId?: string;          // 用戶 ID 篩選
  guideId?: string;         // 導遊 ID 篩選
  startDate?: string;       // 開始日期篩選
  endDate?: string;         // 結束日期篩選
  page?: number;            // 頁數
  limit?: number;           // 每頁數量
  sortBy?: 'createdAt' | 'date' | 'total'; // 排序欄位
  sortOrder?: 'asc' | 'desc'; // 排序方向
}

// API 回應格式
export interface OrderResponse {
  success: boolean;
  data?: Order;
  error?: string;
  message?: string;
}

export interface OrderListResponse {
  success: boolean;
  data?: {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
  message?: string;
}