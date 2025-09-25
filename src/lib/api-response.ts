// API 回應標準化工具
// 功能：提供統一的 API 回應格式和常用的回應函數，確保前後端接口的一致性
import { NextResponse } from 'next/server'; // Next.js 伺服器回應

// API 回應介面定義
export interface ApiResponse<T = any> {
  success: boolean; // 是否成功
  data?: T; // 回應資料（可選）
  error?: string; // 錯誤訊息（可選）
  message?: string; // 成功訊息（可選）
  pagination?: { // 分頁資訊（可選）
    page: number; // 當前頁碼
    limit: number; // 每頁筆數
    total: number; // 總筆數
    totalPages: number; // 總頁數
  };
}

/**
 * 成功回應
 * @param data 要回傳的資料
 * @param message 成功訊息（可選）
 * @param pagination 分頁資訊（可選）
 * @returns 標準化的成功回應
 */
export function successResponse<T>(
  data: T, 
  message?: string, 
  pagination?: ApiResponse['pagination']
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
    pagination
  });
}

/**
 * 錯誤回應
 * @param error 錯誤訊息
 * @param status HTTP 狀態碼（預設 400）
 * @returns 標準化的錯誤回應
 */
export function errorResponse(
  error: string, 
  status: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error
  }, { status });
}

/**
 * 未授權回應（401）
 * @returns 401 未授權錯誤回應
 */
export function unauthorizedResponse(): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: '未經授權的請求'
  }, { status: 401 });
}

/**
 * 權限不足回應（403）
 * @returns 403 禁止訪問錯誤回應
 */
export function forbiddenResponse(): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: '權限不足'
  }, { status: 403 });
}

/**
 * 資源不存在回應（404）
 * @param resource 資源名稱
 * @returns 404 找不到資源錯誤回應
 */
export function notFoundResponse(resource: string = '資源'): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: `${resource}不存在`
  }, { status: 404 });
}

export function validationErrorResponse(errors: Record<string, string>): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: '驗證失敗',
    data: errors
  }, { status: 422 });
}

export function serverErrorResponse(error?: string): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: error || '伺服器內部錯誤'
  }, { status: 500 });
}

// Legacy compatibility function
export function createApiResponse<T>(
  data: T,
  success: boolean,
  message?: string,
  errorType?: string
): ApiResponse<T> {
  return {
    success,
    data: success ? data : undefined,
    error: success ? undefined : message,
    message: success ? message : undefined
  };
}