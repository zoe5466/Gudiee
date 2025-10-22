import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// 簡化的註冊 API（臨時解決方案）
export async function POST(request: NextRequest) {
  try {
    console.log('Register API called');
    
    const body = await request.json();
    const { email, password, name, phone, userType = 'customer', subscribeNewsletter = false } = body;

    console.log('Registration attempt for:', email);

    // 驗證必填欄位
    if (!email || !password || !name) {
      return Response.json({
        success: false,
        error: 'Email、密碼和姓名為必填項目'
      }, { status: 400 });
    }

    // 簡化的 email 格式驗證
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({
        success: false,
        error: '請輸入有效的電子郵件格式'
      }, { status: 400 });
    }

    // 密碼長度驗證
    if (password.length < 6) {
      return Response.json({
        success: false,
        error: '密碼至少需要6個字符'
      }, { status: 400 });
    }

    // 檢查 email 是否已存在（簡化版本）
    const existingEmails = [
      'guide1@guidee.com',
      'guide2@guidee.com', 
      'admin@guidee.com'
    ];
    
    if (existingEmails.includes(email.toLowerCase())) {
      return Response.json({
        success: false,
        error: '此電子郵件已被註冊'
      }, { status: 409 });
    }

    // 創建新用戶（模擬）
    const newUser = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      name,
      phone: phone || null,
      role: userType.toUpperCase(),
      isEmailVerified: false,
      isKycVerified: false,
      permissions: userType === 'guide' ? ['user:read', 'guide:manage'] : ['user:read'],
      createdAt: new Date().toISOString(),
      subscribeNewsletter
    };

    // 生成 token
    const token = btoa(JSON.stringify({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000)
    }));

    // 設置 cookie
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60
    });

    console.log('Registration successful for:', email);
    console.log('Generated user:', newUser);
    console.log('Generated token:', token);

    return Response.json({
      success: true,
      data: {
        user: newUser,
        token
      },
      message: '註冊成功'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({
      success: false,
      error: '註冊失敗，請稍後再試'
    }, { status: 500 });
  }
}