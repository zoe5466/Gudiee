// 綜合評論系統類型定義
// 功能：支援雙向評論、詳細評分類別、照片上傳、回覆系統、審核管理等

// 評論狀態枚舉
export type ReviewStatus = 
  | 'PENDING'     // 待審核
  | 'APPROVED'    // 已通過
  | 'REJECTED'    // 已拒絕
  | 'HIDDEN'      // 已隱藏
  | 'FLAGGED'     // 已檢舉
  | 'DELETED';    // 已刪除

// 評論者類型枚舉
export type ReviewerType = 
  | 'TRAVELER'    // 旅客
  | 'GUIDE';      // 導遊

// 回覆者類型枚舉
export type ResponderType = 
  | 'GUIDE'       // 導遊
  | 'ADMIN'       // 管理員
  | 'TRAVELER';   // 旅客

// 檢舉原因枚舉
export type ReportReason = 
  | 'INAPPROPRIATE_CONTENT'  // 不當內容
  | 'SPAM'                   // 垃圾訊息
  | 'FAKE_REVIEW'           // 虛假評論
  | 'HARASSMENT'            // 騷擾
  | 'DISCRIMINATION'        // 歧視
  | 'COPYRIGHT'             // 版權問題
  | 'OTHER';                // 其他

// 評分維度枚舉（針對導遊服務）
export type RatingDimension = 
  | 'overall'         // 整體滿意度
  | 'communication'   // 溝通能力
  | 'punctuality'     // 準時性
  | 'knowledge'       // 專業知識
  | 'friendliness'    // 友善度
  | 'value'          // 物有所值
  | 'safety'         // 安全性
  | 'flexibility'    // 彈性配合度
  | 'professionalism'; // 專業性

// 評分維度（針對旅客）
export type TravelerRatingDimension = 
  | 'overall'         // 整體體驗
  | 'communication'   // 溝通配合
  | 'punctuality'     // 準時出席
  | 'respect'        // 尊重態度
  | 'following_rules'; // 遵守規則

// 評分詳情介面
export interface RatingDetails {
  overall: number;                    // 整體評分 (1-5)
  communication?: number;             // 溝通評分
  punctuality?: number;               // 準時評分
  knowledge?: number;                 // 知識評分
  friendliness?: number;              // 友善評分
  value?: number;                    // 價值評分
  safety?: number;                   // 安全評分
  flexibility?: number;              // 彈性評分
  professionalism?: number;          // 專業評分
  respect?: number;                  // 尊重評分（旅客評價）
  following_rules?: number;          // 遵守規則評分（旅客評價）
}

// 照片資訊介面
export interface ReviewPhoto {
  id: string;                        // 照片 ID
  url: string;                       // 照片 URL
  thumbnailUrl?: string;             // 縮圖 URL
  caption?: string;                  // 照片說明
  uploadedAt: string;                // 上傳時間
  fileSize: number;                  // 檔案大小（位元組）
  dimensions?: {                     // 圖片尺寸
    width: number;
    height: number;
  };
}

// 檢舉資訊介面
export interface ReportInfo {
  id: string;                        // 檢舉 ID
  reporterId: string;                // 檢舉者 ID
  reason: ReportReason;              // 檢舉原因
  description?: string;              // 詳細說明
  reportedAt: string;                // 檢舉時間
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED'; // 檢舉狀態
  resolvedBy?: string;               // 處理者 ID
  resolvedAt?: string;               // 處理時間
  resolution?: string;               // 處理結果
}

// 評論回覆介面
export interface ReviewResponse {
  id: string;                        // 回覆 ID
  reviewId: string;                  // 評論 ID
  authorId: string;                  // 回覆者 ID
  authorType: ResponderType;         // 回覆者類型
  content: string;                   // 回覆內容
  isOfficial: boolean;               // 是否為官方回覆
  createdAt: string;                 // 建立時間
  updatedAt: string;                 // 更新時間
  author: {                          // 回覆者資訊
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
}

// 有用性投票介面
export interface HelpfulVote {
  id: string;                        // 投票 ID
  reviewId: string;                  // 評論 ID
  userId: string;                    // 投票者 ID
  isHelpful: boolean;               // 是否有用
  votedAt: string;                  // 投票時間
}

// 評論者資訊介面
export interface ReviewerInfo {
  id: string;                        // 用戶 ID
  name: string;                      // 姓名
  avatar?: string;                   // 頭像
  isVerified: boolean;              // 是否已驗證
  totalReviews: number;             // 總評論數
  averageRating: number;            // 平均給分
  joinedAt: string;                 // 註冊時間
  nationality?: string;             // 國籍
  languages?: string[];             // 語言能力
}

// 服務資訊介面（評論中的服務資訊）
export interface ReviewServiceInfo {
  id: string;                        // 服務 ID
  title: string;                     // 服務標題
  location: string;                  // 地點
  category: string;                  // 類別
  price: number;                     // 價格
  guide: {                           // 導遊資訊
    id: string;
    name: string;
    avatar?: string;
    isVerified: boolean;
  };
}

// 預訂資訊介面（評論中的預訂資訊）
export interface ReviewBookingInfo {
  id: string;                        // 預訂 ID
  bookingDate: string;               // 預訂日期
  serviceDate: string;               // 服務日期
  guests: number;                    // 參與人數
  totalPrice: number;                // 總價格
  duration: number;                  // 服務時長（小時）
}

// 主要評論介面
export interface Review {
  // 基本資訊
  id: string;                        // 評論 ID
  orderId: string;                   // 訂單 ID
  reviewerId: string;                // 評論者 ID
  revieweeId: string;                // 被評論者 ID
  reviewerType: ReviewerType;        // 評論者類型
  
  // 評分詳情
  rating: RatingDetails;             // 詳細評分
  
  // 評論內容
  title?: string;                    // 評論標題
  comment: string;                   // 評論內容
  pros: string[];                    // 優點列表
  cons: string[];                    // 缺點列表
  tags: string[];                    // 標籤列表
  
  // 媒體內容
  photos: ReviewPhoto[];             // 照片列表
  
  // 狀態與設置
  status: ReviewStatus;              // 評論狀態
  isAnonymous: boolean;             // 是否匿名
  isVerified: boolean;              // 是否已驗證
  isFeatured: boolean;              // 是否精選
  isEdited: boolean;                // 是否已編輯
  
  // 互動數據
  helpfulCount: number;             // 有用票數
  unhelpfulCount: number;           // 無用票數
  viewCount: number;                // 查看次數
  shareCount: number;               // 分享次數
  
  // 關聯資訊
  service?: ReviewServiceInfo;       // 服務資訊
  booking?: ReviewBookingInfo;       // 預訂資訊
  reviewer: ReviewerInfo;           // 評論者資訊
  
  // 回覆與檢舉
  responses: ReviewResponse[];       // 回覆列表
  reports: ReportInfo[];            // 檢舉列表
  helpfulVotes: HelpfulVote[];      // 有用性投票
  
  // 管理資訊
  moderatorNotes?: string;          // 審核備註
  moderatedBy?: string;             // 審核者 ID
  moderatedAt?: string;             // 審核時間
  
  // 時間戳記
  createdAt: string;                // 建立時間
  updatedAt: string;                // 更新時間
  publishedAt?: string;             // 發布時間
}

// 評論統計介面
export interface ReviewStatistics {
  // 基本統計
  totalReviews: number;             // 總評論數
  averageRating: number;            // 平均評分
  totalRatings: number;             // 總評分數
  
  // 評分分布
  ratingDistribution: Record<number, number>; // 1-5星分布
  
  // 維度評分統計
  dimensionAverages: {              // 各維度平均分
    communication?: number;
    punctuality?: number;
    knowledge?: number;
    friendliness?: number;
    value?: number;
    safety?: number;
    flexibility?: number;
    professionalism?: number;
  };
  
  // 內容統計
  verifiedReviewsCount: number;     // 已驗證評論數
  featuredReviewsCount: number;     // 精選評論數
  withPhotosCount: number;          // 含照片評論數
  withResponsesCount: number;       // 有回覆評論數
  
  // 互動統計
  totalHelpfulVotes: number;        // 總有用票數
  totalViews: number;               // 總查看次數
  totalShares: number;              // 總分享次數
  
  // 時間統計
  recentReviewsCount: number;       // 近期評論數（30天）
  responseRate: number;             // 回覆率百分比
  averageResponseTime: number;      // 平均回覆時間（小時）
  
  // 品質指標
  qualityScore: number;             // 品質評分 (0-100)
  recommendationRate: number;       // 推薦率百分比
  returnCustomerRate: number;       // 回頭客率百分比
  
  // 標籤統計
  popularTags: Array<{              // 熱門標籤
    tag: string;
    count: number;
    percentage: number;
  }>;
  
  // 月度趨勢
  monthlyTrends: Array<{            // 月度趨勢
    month: string;
    reviewCount: number;
    averageRating: number;
  }>;
}

// 評論篩選條件介面
export interface ReviewFilters {
  // 基本篩選
  rating?: number[];                // 評分篩選
  reviewerType?: ReviewerType[];    // 評論者類型
  status?: ReviewStatus[];          // 狀態篩選
  
  // 內容篩選
  verified?: boolean;               // 只顯示已驗證
  withPhotos?: boolean;             // 只顯示有照片
  withResponses?: boolean;          // 只顯示有回覆
  featured?: boolean;               // 只顯示精選
  
  // 時間篩選
  dateRange?: {
    start: Date;
    end: Date;
  };
  
  // 標籤篩選
  tags?: string[];                  // 包含標籤
  excludeTags?: string[];          // 排除標籤
  
  // 維度篩選
  dimensions?: {
    [key in RatingDimension]?: {
      min?: number;
      max?: number;
    };
  };
  
  // 排序設置
  sortBy: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful' | 'trending';
  sortOrder?: 'asc' | 'desc';
  
  // 分頁設置
  page: number;
  limit: number;
}

// 評論表單資料介面
export interface ReviewFormData {
  // 基本資訊
  orderId: string;                  // 訂單 ID
  revieweeId: string;               // 被評論者 ID
  reviewerType: ReviewerType;       // 評論者類型
  
  // 評分
  rating: RatingDetails;            // 詳細評分
  
  // 內容
  title?: string;                   // 標題
  comment: string;                  // 評論內容
  pros: string[];                   // 優點
  cons: string[];                   // 缺點
  tags: string[];                   // 標籤
  
  // 設置
  isAnonymous: boolean;            // 是否匿名
  
  // 媒體
  photos: File[];                  // 上傳的照片檔案
}

// 評論操作結果介面
export interface ReviewActionResult {
  success: boolean;                 // 是否成功
  data?: Review;                   // 評論資料
  error?: string;                  // 錯誤訊息
  message?: string;                // 成功訊息
}

// 評論列表回應介面
export interface ReviewListResponse {
  success: boolean;                 // 是否成功
  data?: {
    reviews: Review[];              // 評論列表
    statistics: ReviewStatistics;   // 統計資料
    pagination: {                   // 分頁資訊
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  error?: string;                  // 錯誤訊息
  message?: string;                // 成功訊息
}

// 評論分析報告介面
export interface ReviewAnalyticsReport {
  // 基本指標
  overview: {
    totalReviews: number;
    averageRating: number;
    qualityScore: number;
    recommendationRate: number;
  };
  
  // 趨勢分析
  trends: {
    ratingTrend: Array<{
      period: string;
      rating: number;
      count: number;
    }>;
    volumeTrend: Array<{
      period: string;
      count: number;
    }>;
  };
  
  // 維度分析
  dimensionAnalysis: {
    [key in RatingDimension]?: {
      average: number;
      trend: 'up' | 'down' | 'stable';
      benchmark: number;
    };
  };
  
  // 競爭分析
  competitorComparison?: {
    averageRating: number;
    marketAverage: number;
    percentile: number;
  };
  
  // 改進建議
  recommendations: Array<{
    category: string;
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
    impact: string;
  }>;
}

// 評論審核介面
export interface ReviewModeration {
  reviewId: string;                 // 評論 ID
  action: 'APPROVE' | 'REJECT' | 'HIDE' | 'FLAG'; // 審核動作
  reason?: string;                  // 審核原因
  notes?: string;                   // 審核備註
  moderatorId: string;              // 審核者 ID
  moderatedAt: string;              // 審核時間
}

// 注意：類型已在上方直接導出，無需重複導出