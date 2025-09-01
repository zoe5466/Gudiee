import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse 
} from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 驗證輸入
    if (!email || !password) {
      return validationErrorResponse({
        email: email ? '' : 'Email 為必填項目',
        password: password ? '' : '密碼為必填項目'
      });
    }

    // 查找用戶
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        userProfile: true
      }
    });

    if (!user) {
      return errorResponse('Email 或密碼錯誤', 401);
    }

    // 驗證密碼
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return errorResponse('Email 或密碼錯誤', 401);
    }

    // 生成 JWT Token
    const token = generateToken(user);

    // 設置 HTTP-only Cookie
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 天
    });

    // 返回用戶資訊（不包含密碼）
    const { passwordHash, ...userWithoutPassword } = user;

    return successResponse({
      user: userWithoutPassword,
      token
    }, '登入成功');

  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('登入失敗，請稍後再試', 500);
  }
}