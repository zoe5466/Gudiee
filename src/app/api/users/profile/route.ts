import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// 模擬用戶數據庫
let users: any[] = [
  {
    id: '1',
    email: 'user@guidee.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    name: '測試用戶',
    role: 'traveler',
    isEmailVerified: true,
    isKYCVerified: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    profile: {
      phone: '0912345678',
      bio: '我是一個喜歡旅遊的人',
      location: '台北市',
      languages: ['中文', '英文'],
      specialties: []
    }
  },
  {
    id: '2',
    email: 'guide@guidee.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    name: '專業地陪',
    role: 'guide',
    isEmailVerified: true,
    isKYCVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    profile: {
      phone: '0987654321',
      bio: '專業導遊，熟悉台北各大景點',
      location: '台北市',
      languages: ['中文', '英文', '日文'],
      specialties: ['文化導覽', '美食體驗', '攝影指導']
    }
  }
];

function getAuthenticatedUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback-secret'
    ) as any;

    const user = users.find(u => u.id === decoded.userId);
    return user;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: '未授權訪問' },
        { status: 401 }
      );
    }

    // 返回用戶信息（不包含密碼）
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: '服務器錯誤' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: '未授權訪問' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // 更新允許的字段
    const allowedFields = ['name', 'avatar', 'profile'];
    const updates: any = {};
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    // 合併更新到用戶對象
    Object.assign(user, updates);

    // 如果有 profile 更新，合併到現有 profile
    if (body.profile) {
      user.profile = { ...user.profile, ...body.profile };
    }

    // 返回更新後的用戶信息（不包含密碼）
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: '服務器錯誤' },
      { status: 500 }
    );
  }
}