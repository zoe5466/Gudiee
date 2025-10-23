import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// 模擬用戶數據（與登入 API 保持一致）
const mockUsers = [
  {
    id: 'guide-001',
    email: 'guide1@guidee.com',
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
    name: '系統管理員',
    role: 'ADMIN',
    isEmailVerified: true,
    isKycVerified: true,
    permissions: ['admin:full', 'user:manage', 'service:manage', 'booking:manage']
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
      user = {
        id: userData.id,
        email: userData.email,
        name: userData.name || '用戶',
        role: userData.role || 'CUSTOMER',
        isEmailVerified: true,
        isKycVerified: false, // 新註冊用戶需要完成 KYC
        permissions: userData.role === 'GUIDE' ? ['user:read', 'guide:manage'] : ['user:read'],
        phone: userData.phone || null,
        createdAt: new Date().toISOString(),
        userProfile: {
          phone: userData.phone || undefined,
          bio: undefined,
          location: undefined,
          birthDate: undefined,
          languages: [],
          specialties: [],
          experienceYears: 0,
          certifications: []
        }
      };
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