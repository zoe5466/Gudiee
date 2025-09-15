// 用戶註冊 API 路由
// 功能：處理新用戶註冊，包含客戶和導遊兩種角色
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma'; // 資料庫連接
import { hashPassword, generateToken } from '@/lib/auth'; // 密碼加密和 Token 生成
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse 
} from '@/lib/api-response'; // 統一 API 回應格式

/**
 * POST /api/auth/register - 用戶註冊端點
 * 
 * 請求格式：
 * {
 *   "email": "user@example.com",
 *   "password": "Password123",
 *   "name": "張三",
 *   "userType": "customer" | "guide",
 *   "phone": "0912345678",
 *   "subscribeNewsletter": true
 * }
 * 
 * 回應格式：
 * {
 *   "success": true,
 *   "data": {
 *     "user": { 用戶資料 },
 *     "token": "JWT token"
 *   },
 *   "message": "註冊成功，歡迎加入 Guidee！"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 解析請求內容
    const body = await request.json();
    const { email, password, name, userType, phone, subscribeNewsletter } = body;

    // 驗證必填欄位：準備錯誤訊息物件
    const errors: Record<string, string> = {};
    
    if (!email) errors.email = 'Email 為必填項目';
    if (!password) errors.password = '密碼為必填項目';
    if (!name) errors.name = '姓名為必填項目';

    // 驗證 Email 格式：使用正則表達式檢查 Email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.email = '請提供有效的 Email 地址';
    }

    // 驗證密碼強度：至少 8 位，包含大小寫字母和數字
    if (password) {
      if (password.length < 8) {
        errors.password = '密碼必須至少 8 個字符';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        errors.password = '密碼必須包含大小寫字母和數字';
      }
    }

    // 如果有驗證錯誤，立即返回錯誤訊息
    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    // 檢查 Email 是否已被註冊：避免重複註冊
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return errorResponse('此 Email 已被註冊', 409);
    }

    // 加密密碼：使用 bcrypt 加密，不存儲明文密碼
    const hashedPassword = await hashPassword(password);

    // 確定用戶角色：導遊或一般客戶
    const role = userType === 'guide' ? 'GUIDE' : 'CUSTOMER';

    // 創建新用戶：在資料庫中建立用戶記錄
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(), // 統一轉換為小寫
        passwordHash: hashedPassword, // 加密後的密碼
        name,
        phone: phone || null,
        role, // 用戶角色（GUIDE 或 CUSTOMER）
        isEmailVerified: false, // 預設 Email 未驗證
        isKycVerified: false, // 預設 KYC 未驗證
        permissions: role === 'GUIDE' 
          ? ['user:read', 'guide:manage', 'booking:manage'] // 導遊權限
          : ['user:read', 'booking:create'], // 一般用戶權限
        settings: {
          subscribeNewsletter: subscribeNewsletter || false, // 電子報訂閱
          notifications: { // 通知設定
            email: true,
            push: true,
            sms: false
          }
        }
      },
      include: {
        userProfile: true // 包含用戶檔案資料
      }
    });

    // 創建用戶檔案：只為導遊建立詳細檔案，一般用戶不需要
    if (role === 'GUIDE') {
      await prisma.userProfile.create({
        data: {
          userId: newUser.id,
          bio: '', // 個人簡介
          location: '', // 所在地點
          languages: [], // 語言能力
          specialties: [], // 專業領域
          experienceYears: null, // 經驗年數
          certifications: [], // 證照資格
          socialLinks: {} // 社交媒體連結
        }
      });
    }

    // 生成 JWT Token：包含用戶身份資訊，用於後續 API 驗證
    const token = generateToken(newUser);

    // 設置 HTTP-only Cookie：安全存儲 JWT token
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true, // 只能透過 HTTP 請求存取
      secure: process.env.NODE_ENV === 'production', // 生產環境需要 HTTPS
      sameSite: 'lax', // CSRF 保護
      maxAge: 7 * 24 * 60 * 60 // 7 天有效期
    });

    // 準備回應資料：移除敏感資訊（密碼）後返回用戶資訊
    const { passwordHash, ...userWithoutPassword } = newUser;

    return successResponse({
      user: userWithoutPassword,
      token
    }, '註冊成功，歡迎加入 Guidee！');

  } catch (error) {
    // 錯誤處理：記錄錯誤並返回通用錯誤訊息（避免洩露敏感資訊）
    console.error('Register error:', error);
    return errorResponse('註冊失敗，請稍後再試', 500);
  }
}