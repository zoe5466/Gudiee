import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// 模擬用戶數據（與登入 API 保持一致）
const mockUsers = [
  {
    id: 'guide-001',
    email: 'guide1@guidee.com',
    name: '張小美',
    role: 'guide',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    isEmailVerified: true,
    isKycVerified: true,
    permissions: ['user:read', 'guide:manage', 'booking:manage'],
    createdAt: '2024-01-01T00:00:00.000Z',
    profile: {
      phone: '0912345678',
      bio: '專業台北導遊，擁有5年導覽經驗',
      location: '台北市',
      birthDate: '1990-01-01',
      languages: ['中文', '英文'],
      specialties: ['歷史文化', '美食導覽'],
      experienceYears: 5,
      certifications: ['導遊證照', '急救證照']
    }
  },
  {
    id: 'guide-002',
    email: 'guide2@guidee.com',
    name: '李大明',
    role: 'guide',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isEmailVerified: true,
    isKycVerified: true,
    permissions: ['user:read', 'guide:manage', 'booking:manage'],
    createdAt: '2024-01-15T00:00:00.000Z',
    profile: {
      phone: '0923456789',
      bio: '資深地陪導遊，專精自然生態導覽',
      location: '台中市',
      birthDate: '1985-05-15',
      languages: ['中文', '英文', '日文'],
      specialties: ['自然生態', '攝影指導'],
      experienceYears: 8,
      certifications: ['生態導遊證照', '攝影專業證照']
    }
  },
  {
    id: 'admin-001',
    email: 'admin@guidee.com',
    name: '系統管理員',
    role: 'admin',
    avatar: null,
    isEmailVerified: true,
    isKycVerified: true,
    permissions: ['admin:full', 'user:manage', 'service:manage', 'booking:manage'],
    createdAt: '2023-12-01T00:00:00.000Z',
    profile: {
      languages: ['中文'],
      specialties: [],
      experienceYears: 0,
      certifications: []
    }
  }
];

// 簡化的獲取當前用戶函數
function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    // 解析 token
    const userData = JSON.parse(atob(token));
    
    // 檢查 token 是否過期
    if (userData.exp && userData.exp < Date.now()) {
      return null;
    }

    // 從模擬數據中找到用戶
    let user = mockUsers.find(u => u.id === userData.id);
    
    // 如果在預定義用戶中找不到，表示是新註冊的用戶，從 token 中構建用戶資料
    if (!user && userData.id && userData.email) {
      const newUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name || '用戶',
        role: (userData.role?.toLowerCase() || 'customer') as 'customer' | 'guide' | 'admin',
        avatar: null,
        isEmailVerified: true,
        isKycVerified: false, // 新註冊用戶需要完成 KYC
        permissions: userData.role === 'GUIDE' ? ['user:read', 'guide:manage'] : ['user:read'],
        createdAt: new Date().toISOString(),
        profile: {
          ...(userData.phone && { phone: userData.phone }),
          languages: [],
          specialties: [],
          experienceYears: 0,
          certifications: []
        }
      };
      user = newUser;
    }
    
    return user || null;

  } catch (error) {
    console.error('Parse token error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Get current user API called');
    
    const user = getCurrentUser();
    
    if (!user) {
      console.log('User not authenticated');
      return Response.json({
        success: false,
        error: '未認證'
      }, { status: 401 });
    }

    console.log('Current user:', user.email);

    return Response.json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    return Response.json({
      success: false,
      error: '獲取用戶資訊失敗'
    }, { status: 500 });
  }
}

// 登出
export async function POST(request: NextRequest) {
  try {
    console.log('Logout API called');
    
    const cookieStore = cookies();
    
    // 清除 auth token cookie
    cookieStore.delete('auth-token');

    console.log('Logout successful');

    return Response.json({
      success: true,
      data: null,
      message: '登出成功'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return Response.json({
      success: false,
      error: '登出失敗'
    }, { status: 500 });
  }
}