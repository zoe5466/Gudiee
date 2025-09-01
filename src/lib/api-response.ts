import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

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

export function errorResponse(
  error: string, 
  status: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error
  }, { status });
}

export function unauthorizedResponse(): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: '未經授權的請求'
  }, { status: 401 });
}

export function forbiddenResponse(): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: '權限不足'
  }, { status: 403 });
}

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