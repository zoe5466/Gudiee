// 取消和退款系統類型定義
// 功能：定義取消預訂、退款處理等相關的所有資料結構

// 取消原因類型
export type CancellationReason = 
  | 'USER_REQUEST'       // 用戶主動要求
  | 'GUIDE_UNAVAILABLE'  // 導遊無法提供服務
  | 'WEATHER'            // 天氣因素
  | 'FORCE_MAJEURE'      // 不可抗力（天災、疫情等）
  | 'SCHEDULE_CONFLICT'  // 時間衝突
  | 'HEALTH_SAFETY'      // 健康安全考量
  | 'QUALITY_ISSUE'      // 服務品質問題
  | 'OTHER';             // 其他原因

// 退款狀態類型
export type RefundStatus = 
  | 'PENDING'       // 待處理
  | 'PROCESSING'    // 處理中
  | 'APPROVED'      // 已批准
  | 'REJECTED'      // 已拒絕
  | 'COMPLETED'     // 已完成
  | 'FAILED';       // 失敗

// 退款方式類型
export type RefundMethod = 
  | 'ORIGINAL_PAYMENT'  // 退回原付款方式
  | 'BANK_TRANSFER'     // 銀行轉帳
  | 'CREDIT'            // 平台信用額度
  | 'VOUCHER';          // 優惠券

// 爭議狀態類型
export type DisputeStatus = 
  | 'OPEN'         // 開啟
  | 'INVESTIGATING' // 調查中
  | 'RESOLVED'     // 已解決
  | 'ESCALATED'    // 已升級
  | 'CLOSED';      // 已關閉

// 取消政策類型
export interface CancellationPolicy {
  id: string;
  name: string;
  description: string;
  rules: CancellationRule[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// 取消規則
export interface CancellationRule {
  id: string;
  hoursBeforeStart: number;    // 服務開始前幾小時
  refundPercentage: number;    // 退款比例 (0-100)
  processingFee: number;       // 手續費
  description: string;
}

// 取消請求
export interface CancellationRequest {
  id: string;
  bookingId: string;
  orderId?: string;
  userId: string;              // 發起取消的用戶ID
  reason: CancellationReason;
  customReason?: string;       // 自定義原因說明
  description?: string;        // 詳細描述
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;        // 處理者ID
  adminNotes?: string;         // 管理員備註
  
  // 相關資訊
  booking: {
    id: string;
    serviceTitle: string;
    serviceDate: string;
    totalAmount: number;
    guide: {
      id: string;
      name: string;
    };
    customer: {
      id: string;
      name: string;
      email: string;
    };
  };
  
  // 退款計算
  refundCalculation?: RefundCalculation;
}

// 退款計算
export interface RefundCalculation {
  totalAmount: number;          // 總金額
  refundPercentage: number;     // 退款比例
  refundAmount: number;         // 退款金額
  processingFee: number;        // 手續費
  finalRefundAmount: number;    // 最終退款金額
  calculatedAt: string;
  policyApplied: {
    policyId: string;
    policyName: string;
    ruleApplied: CancellationRule;
  };
}

// 退款記錄
export interface RefundRecord {
  id: string;
  cancellationRequestId: string;
  bookingId: string;
  orderId?: string;
  amount: number;
  method: RefundMethod;
  status: RefundStatus;
  
  // 處理資訊
  initiatedBy: string;         // 發起者ID
  processedBy?: string;        // 處理者ID
  approvedBy?: string;         // 批准者ID
  
  // 時間戳記
  initiatedAt: string;
  processedAt?: string;
  completedAt?: string;
  
  // 外部系統資訊
  externalTransactionId?: string;  // 外部交易ID
  paymentGatewayResponse?: any;    // 支付網關回應
  
  // 備註
  adminNotes?: string;
  customerNotes?: string;
  
  // 錯誤資訊
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// 爭議案件
export interface DisputeCase {
  id: string;
  cancellationRequestId?: string;
  refundRecordId?: string;
  bookingId: string;
  
  // 爭議資訊
  type: 'CANCELLATION_DISPUTE' | 'REFUND_DISPUTE' | 'SERVICE_QUALITY';
  title: string;
  description: string;
  status: DisputeStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  
  // 參與者
  customer: {
    id: string;
    name: string;
    email: string;
  };
  guide: {
    id: string;
    name: string;
    email: string;
  };
  assignedTo?: string;         // 處理員ID
  
  // 證據和附件
  evidence: Evidence[];
  
  // 溝通記錄
  communications: Communication[];
  
  // 時間戳記
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  
  // 解決方案
  resolution?: {
    type: 'FULL_REFUND' | 'PARTIAL_REFUND' | 'NO_REFUND' | 'CREDIT' | 'REBOOK';
    amount?: number;
    description: string;
    agreedBy: string[];        // 同意的參與者ID
  };
}

// 證據
export interface Evidence {
  id: string;
  type: 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'LINK';
  title: string;
  content: string;             // 文字內容或檔案URL
  uploadedBy: string;          // 上傳者ID
  uploadedAt: string;
}

// 溝通記錄
export interface Communication {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserRole: 'CUSTOMER' | 'GUIDE' | 'ADMIN';
  message: string;
  attachments?: string[];      // 附件URL
  sentAt: string;
  isInternal: boolean;         // 是否為內部溝通
}

// 退款統計
export interface RefundStatistics {
  totalRefunds: number;
  totalRefundAmount: number;
  averageRefundAmount: number;
  refundsByStatus: Record<RefundStatus, number>;
  refundsByReason: Record<CancellationReason, number>;
  refundsByMonth: Array<{
    month: string;
    count: number;
    amount: number;
  }>;
  processingTimes: {
    average: number;            // 平均處理時間（小時）
    median: number;
    fastest: number;
    slowest: number;
  };
}

// API 請求和回應類型
export interface CreateCancellationRequest {
  bookingId: string;
  reason: CancellationReason;
  customReason?: string;
  description?: string;
}

export interface ProcessCancellationRequest {
  cancellationRequestId: string;
  action: 'APPROVE' | 'REJECT';
  adminNotes?: string;
  customRefundAmount?: number; // 自定義退款金額
}

export interface CreateDisputeRequest {
  bookingId: string;
  type: DisputeCase['type'];
  title: string;
  description: string;
  evidence?: Omit<Evidence, 'id' | 'uploadedBy' | 'uploadedAt'>[];
}

// 列表查詢參數
export interface CancellationListParams {
  status?: CancellationRequest['status'][];
  reason?: CancellationReason[];
  startDate?: string;
  endDate?: string;
  userId?: string;
  guideId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'requestedAt' | 'amount' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface RefundListParams {
  status?: RefundStatus[];
  method?: RefundMethod[];
  startDate?: string;
  endDate?: string;
  amountRange?: { min: number; max: number };
  page?: number;
  limit?: number;
  sortBy?: 'initiatedAt' | 'amount' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface DisputeListParams {
  status?: DisputeStatus[];
  type?: DisputeCase['type'][];
  priority?: DisputeCase['priority'][];
  assignedTo?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'priority' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// 郵件通知類型
export interface EmailNotification {
  id: string;
  type: 'CANCELLATION_CONFIRMED' | 'REFUND_PROCESSED' | 'DISPUTE_CREATED' | 'DISPUTE_RESOLVED';
  recipientEmail: string;
  recipientName: string;
  subject: string;
  templateId: string;
  templateData: Record<string, any>;
  sentAt?: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  error?: string;
}

// 退款處理批次
export interface RefundBatch {
  id: string;
  name: string;
  description: string;
  refundRecords: string[]; // RefundRecord IDs
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  processedBy: string;
  createdAt: string;
  processedAt?: string;
  completedAt?: string;
  notes?: string;
}

// 系統設定
export interface CancellationSystemSettings {
  id: string;
  defaultCancellationPolicyId: string;
  autoApprovalEnabled: boolean;
  autoApprovalThreshold: number; // 自動批准的金額閾值
  emailNotificationsEnabled: boolean;
  refundProcessingDays: number; // 退款處理天數
  disputeEscalationDays: number; // 爭議升級天數
  adminEmails: string[];
  supportEmail: string;
  updatedAt: string;
  updatedBy: string;
}

// API 回應格式
export interface CancellationResponse {
  success: boolean;
  data?: CancellationRequest;
  error?: string;
  message?: string;
}

export interface RefundResponse {
  success: boolean;
  data?: RefundRecord;
  error?: string;
  message?: string;
}

export interface DisputeResponse {
  success: boolean;
  data?: DisputeCase;
  error?: string;
  message?: string;
}

export interface CancellationListResponse {
  success: boolean;
  data?: {
    cancellations: CancellationRequest[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
  message?: string;
}

export interface RefundListResponse {
  success: boolean;
  data?: {
    refunds: RefundRecord[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
  message?: string;
}

export interface DisputeListResponse {
  success: boolean;
  data?: {
    disputes: DisputeCase[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
  message?: string;
}