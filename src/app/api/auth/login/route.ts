import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// 模擬用戶數據（臨時解決方案）
const mockUsers = [
  {
    id: 'guide-001',
    email: 'guide1@guidee.com',
    passwordHash: '$2a$12$LQv3c1yqBwEHxPVhf.A3POQlPhJ4lMSjH4F4.h7V0TmkMOZ4QzK2.', // password123
    name: '張小美',
    role: 'GUIDE',
    isEmailVerified: true,
    isKycVerified: true,
    permissions: ['user:read', 'guide:manage', 'booking:manage'],
    userProfile: {
      bio: '專業台北導遊，擁有5年導覽經驗',
      location: '台北市',
      languages: ['中文', '英文'],
      specialties: ['歷史文化', '美食導覽']
    }
  },
  {
    id: 'guide-002',
    email: 'guide2@guidee.com',
    passwordHash: '$2a$12$LQv3c1yqBwEHxPVhf.A3POQlPhJ4lMSjH4F4.h7V0TmkMOZ4QzK2.', // password123
    name: '李大明',
    role: 'GUIDE',
    isEmailVerified: true,
    isKycVerified: true,
    permissions: ['user:read', 'guide:manage', 'booking:manage'],
    userProfile: {
      bio: '資深地陪導遊，專精自然生態導覽',
      location: '台中市',
      languages: ['中文', '英文', '日文'],
      specialties: ['自然生態', '攝影指導']
    }
  },
  {
    id: 'admin-001',
    email: 'admin@guidee.com',
    passwordHash: '$2a$12$LQv3c1yqBwEHxPVhf.A3POQlPhJ4lMSjH4F4.h7V0TmkMOZ4QzK2.', // password123
    name: '系統管理員',
    role: 'ADMIN',
    isEmailVerified: true,
    isKycVerified: true,
    permissions: ['admin:full', 'user:manage', 'service:manage', 'booking:manage']
  }
];

// 簡化的密碼驗證（實際應該使用 bcrypt）
function verifyPassword(plainPassword: string, hashedPassword: string): boolean {
  // 臨時簡化：所有測試帳號密碼都是 password123
  return plainPassword === 'password123';
}

// 簡化的 JWT 生成
function generateToken(user: any): string {
  // 臨時簡化：返回一個包含用戶資訊的字串
  return btoa(JSON.stringify({
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7天後過期
  }));
}

export async function POST(request: NextRequest) {
  try {
    console.log('Login API called');
    
    const body = await request.json();
    const { email, password } = body;

    console.log('Login attempt for:', email);

    // 驗證必填欄位
    if (!email || !password) {
      return Response.json({
        success: false,
        error: 'Email 和密碼為必填項目'
      }, { status: 400 });
    }

    // 查找用戶
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      console.log('User not found:', email);
      return Response.json({
        success: false,
        error: 'Email 或密碼錯誤'
      }, { status: 401 });
    }

    // 驗證密碼
    const isValidPassword = verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      console.log('Invalid password for:', email);
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

    console.log('Login successful for:', email);

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