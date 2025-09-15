import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse 
} from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, userType, phone, subscribeNewsletter } = body;

    // 驗證輸入
    const errors: Record<string, string> = {};
    
    if (!email) errors.email = 'Email 為必填項目';
    if (!password) errors.password = '密碼為必填項目';
    if (!name) errors.name = '姓名為必填項目';

    // 驗證 Email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.email = '請提供有效的 Email 地址';
    }

    // 驗證密碼強度
    if (password) {
      if (password.length < 8) {
        errors.password = '密碼必須至少 8 個字符';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        errors.password = '密碼必須包含大小寫字母和數字';
      }
    }

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    // 檢查 Email 是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return errorResponse('此 Email 已被註冊', 409);
    }

    // 加密密碼
    const hashedPassword = await hashPassword(password);

    // 確定用戶角色
    const role = userType === 'guide' ? 'GUIDE' : 'CUSTOMER';

    // 創建新用戶
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash: hashedPassword,
        name,
        phone: phone || null,
        role,
        isEmailVerified: false,
        isKycVerified: false,
        permissions: role === 'GUIDE' 
          ? ['user:read', 'guide:manage', 'booking:manage'] 
          : ['user:read', 'booking:create'],
        settings: {
          subscribeNewsletter: subscribeNewsletter || false,
          notifications: {
            email: true,
            push: true,
            sms: false
          }
        }
      },
      include: {
        userProfile: true
      }
    });

    // 創建用戶檔案
    if (role === 'GUIDE') {
      await prisma.userProfile.create({
        data: {
          userId: newUser.id,
          bio: '',
          location: '',
          languages: [],
          specialties: [],
          experienceYears: null,
          certifications: [],
          socialLinks: {}
        }
      });
    }

    // 生成 JWT Token
    const token = generateToken(newUser);

    // 設置 HTTP-only Cookie
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 天
    });

    // 返回用戶資訊（不包含密碼）
    const { passwordHash, ...userWithoutPassword } = newUser;

    return successResponse({
      user: userWithoutPassword,
      token
    }, '註冊成功，歡迎加入 Guidee！');

  } catch (error) {
    console.error('Register error:', error);
    return errorResponse('註冊失敗，請稍後再試', 500);
  }
}