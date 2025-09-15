// 用戶登入 API 路由
// 功能：處理用戶登入請求，驗證身份並返回 JWT token
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma'; // 資料庫連接
import { verifyPassword, generateToken } from '@/lib/auth'; // 密碼驗證和 Token 生成
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse 
} from '@/lib/api-response'; // 統一 API 回應格式

/**
 * POST /api/auth/login - 用戶登入端點
 * 
 * 請求格式：
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 * 
 * 回應格式：
 * {
 *   "success": true,
 *   "data": {
 *     "user": { 用戶資料 },
 *     "token": "JWT token"
 *   },
 *   "message": "登入成功"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 解析請求內容
    const body = await request.json();
    const { email, password } = body;

    // 驗證必填欄位：確保 email 和 password 都有提供
    if (!email || !password) {
      return validationErrorResponse({
        email: email ? '' : 'Email 為必填項目',
        password: password ? '' : '密碼為必填項目'
      });
    }

    // 從資料庫查找用戶：使用 email 查找，包含用戶檔案資料
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }, // 統一轉換為小寫避免大小寫問題
      include: {
        userProfile: true // 包含用戶詳細檔案
      }
    });

    // 檢查用戶是否存在
    if (!user) {
      return errorResponse('Email 或密碼錯誤', 401);
    }

    // 驗證密碼：使用 bcrypt 比對明文密碼與加密後的密碼
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return errorResponse('Email 或密碼錯誤', 401);
    }

    // 生成 JWT Token：包含用戶身份資訊，用於後續 API 驗證
    const token = generateToken(user);

    // 設置 HTTP-only Cookie：安全存儲 JWT token
    // HTTP-only cookie 無法被 JavaScript 存取，防止 XSS 攻擊
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true, // 只能透過 HTTP 請求存取
      secure: process.env.NODE_ENV === 'production', // 生產環境需要 HTTPS
      sameSite: 'lax', // CSRF 保護
      maxAge: 7 * 24 * 60 * 60 // 7 天有效期
    });

    // 準備回應資料：移除敏感資訊（密碼）後返回用戶資訊
    const { passwordHash, ...userWithoutPassword } = user;

    return successResponse({
      user: userWithoutPassword,
      token
    }, '登入成功');

  } catch (error) {
    // 錯誤處理：記錄錯誤並返回通用錯誤訊息（避免洩露敏感資訊）
    console.error('Login error:', error);
    return errorResponse('登入失敗，請稍後再試', 500);
  }
}