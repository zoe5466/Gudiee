import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phone, userType = 'customer', subscribeNewsletter = false } = body;

    // 驗證必填欄位
    if (!email || !password || !name) {
      return NextResponse.json({
        success: false,
        error: 'Email、密碼和姓名為必填項目'
      }, { status: 400 });
    }

    // 簡化的 email 格式驗證
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({
        success: false,
        error: '請輸入有效的電子郵件格式'
      }, { status: 400 });
    }

    // 密碼長度驗證
    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        error: '密碼至少需要6個字符'
      }, { status: 400 });
    }

    // 檢查 email 是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: '此電子郵件已被註冊'
      }, { status: 409 });
    }

    // 密碼雜湊化
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 創建新用戶
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash: hashedPassword,
        name,
        phone: phone || null,
        role: userType.toLowerCase() as 'customer' | 'guide' | 'admin',
        isEmailVerified: false,
        isKycVerified: false,
        isCriminalRecordVerified: userType === 'guide' ? false : null,
        permissions: userType === 'guide' ? ['user:read', 'guide:manage'] : ['user:read'],
        settings: { subscribeNewsletter }
      }
    });

    // 生成 token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({
        success: false,
        error: '伺服器設定錯誤'
      }, { status: 500 });
    }

    const token = jwt.sign({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      phone: newUser.phone,
      isKYCVerified: newUser.isKycVerified,
      isCriminalRecordVerified: newUser.isCriminalRecordVerified
    }, jwtSecret, { expiresIn: '7d' });

    // 準備回應資料（移除密碼）
    const { passwordHash, ...userWithoutPassword } = newUser;

    // 設置 cookie
    const response = NextResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: '註冊成功'
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60
    });

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error details:', errorMessage);
    const response: any = {
      success: false,
      error: '註冊失敗，請稍後再試'
    };
    if (process.env.NODE_ENV === 'development') {
      response.debug = errorMessage;
    }
    return NextResponse.json(response, { status: 500 });
  }
}