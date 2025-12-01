import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

    // 從資料庫查找用戶
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        userProfile: true
      }
    });
    
    if (!user) {
      return Response.json({
        success: false,
        error: 'Email 或密碼錯誤'
      }, { status: 401 });
    }

    // 驗證密碼
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return Response.json({
        success: false,
        error: 'Email 或密碼錯誤'
      }, { status: 401 });
    }

    // 生成 token
    const token = generateToken(user);

    // 設置 cookie
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 天
    });

    // 準備回應資料（移除密碼）
    const { passwordHash, ...userWithoutPassword } = user;

    return Response.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: '登入成功'
    });

  } catch (error) {
    console.error('Login error:', error);
    return Response.json({
      success: false,
      error: '登入失敗，請稍後再試'
    }, { status: 500 });
  }
}