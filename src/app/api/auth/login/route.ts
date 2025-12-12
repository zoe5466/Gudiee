import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// JWT 生成函數
function generateToken(user: any): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not set');
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isKYCVerified: user.isKycVerified,
      isCriminalRecordVerified: user.isCriminalRecordVerified
    },
    jwtSecret,
    { expiresIn: '7d' }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 驗證必填欄位
    if (!email || !password) {
      return Response.json({
        success: false,
        error: 'Email 和密碼為必填項目'
      }, { status: 400 });
    }

    console.log('[Login] Attempting login for:', email);

    // 從資料庫查找用戶
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });
      console.log('[Login] User found:', user ? 'yes' : 'no');
    } catch (dbError) {
      console.error('[Login] Database error:', dbError);
      throw new Error('Database connection failed');
    }

    if (!user) {
      return Response.json({
        success: false,
        error: 'Email 或密碼錯誤'
      }, { status: 401 });
    }

    // 驗證密碼
    let isValidPassword;
    try {
      isValidPassword = await bcrypt.compare(password, user.passwordHash);
      console.log('[Login] Password valid:', isValidPassword);
    } catch (bcryptError) {
      console.error('[Login] Bcrypt error:', bcryptError);
      throw new Error('Password validation failed');
    }

    if (!isValidPassword) {
      return Response.json({
        success: false,
        error: 'Email 或密碼錯誤'
      }, { status: 401 });
    }

    // 生成 token
    let token;
    try {
      token = generateToken(user);
      console.log('[Login] Token generated successfully');
    } catch (tokenError) {
      console.error('[Login] Token generation error:', tokenError);
      throw new Error('Token generation failed - check JWT_SECRET');
    }

    // 設置 cookie
    try {
      const cookieStore = cookies();
      cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7 天
      });
      console.log('[Login] Cookie set successfully');
    } catch (cookieError) {
      console.error('[Login] Cookie error:', cookieError);
      throw new Error('Failed to set authentication cookie');
    }

    // 準備回應資料（移除密碼）
    const { passwordHash, ...userWithoutPassword } = user;

    console.log('[Login] Login successful for user:', user.id);
    return Response.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: '登入成功'
    });

  } catch (error: any) {
    console.error('[Login] Error:', error);
    return Response.json({
      success: false,
      error: error.message || '登入失敗，請稍後再試',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}