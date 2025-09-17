import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 基本驗證
    if (!email || !password) {
      return errorResponse('請提供電子郵件和密碼', 400);
    }

    // 查找管理員用戶
    const user = await prisma.user.findUnique({
      where: { 
        email: email.toLowerCase(),
      },
      include: {
        userProfile: true
      }
    });

    // 檢查用戶是否存在且為管理員
    if (!user || (user.role !== 'GUIDE')) {
      console.log('Admin login failed - user not found or not admin:', { email, userRole: user?.role });
      return errorResponse('無效的管理員憑證', 401);
    }

    // 驗證密碼
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      console.log('Admin login failed - invalid password for user:', email);
      return errorResponse('無效的管理員憑證', 401);
    }

    // 生成 JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        isAdmin: true
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Note: User model doesn't have lastLoginAt field, so we skip this update

    // 準備返回的用戶數據（不包含密碼）
    const { passwordHash, ...userWithoutPassword } = user;

    console.log('Admin login successful:', { email, userId: user.id, role: user.role });

    // 創建響應並設置 HTTP-only cookie
    const response = successResponse({
      user: userWithoutPassword,
      token,
      isAdmin: true
    }, '管理員登入成功');

    // 設置 JWT token 為 HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Admin login error:', error);
    return errorResponse('登入失敗，請稍後重試', 500);
  }
}