// 用戶個人資料管理 API
// 功能：處理用戶個人資料的查詢和更新
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

// 模擬用戶資料庫（與認證 API 保持一致）
const mockUsers = [
  {
    id: 'guide-001',
    email: 'guide1@guidee.com',
    name: '張小美',
    role: 'GUIDE',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    isEmailVerified: true,
    isKycVerified: true,
    permissions: ['user:read', 'guide:manage', 'booking:manage'],
    createdAt: '2024-01-15T08:00:00.000Z',
    userProfile: {
      phone: '0912345678',
      bio: '專業台北導遊，擁有5年導覽經驗，熟悉台北各大景點和在地文化。',
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
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isEmailVerified: true,
    isKycVerified: true,
    permissions: ['user:read', 'guide:manage', 'booking:manage'],
    createdAt: '2024-02-10T10:30:00.000Z',
    userProfile: {
      phone: '0923456789',
      bio: '資深地陪導遊，專精自然生態導覽，擁有豐富的戶外活動經驗。',
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
    avatar: null,
    isEmailVerified: true,
    isKycVerified: true,
    permissions: ['admin:full', 'user:manage', 'service:manage', 'booking:manage'],
    createdAt: '2024-01-01T00:00:00.000Z',
    userProfile: {
      phone: null,
      bio: null,
      location: null,
      languages: ['中文'],
      specialties: []
    }
  },
  // 新增測試用戶 - 尚未完成 KYC 驗證的用戶
  {
    id: 'user-new-001',
    email: 'newuser@test.com',
    name: '測試用戶',
    role: 'CUSTOMER',
    avatar: null,
    isEmailVerified: true,
    isKycVerified: false, // 尚未完成 KYC
    permissions: ['user:read'],
    createdAt: new Date().toISOString(),
    userProfile: {
      phone: null,
      bio: null,
      location: null,
      languages: [],
      specialties: []
    }
  },
  {
    id: 'guide-new-001',
    email: 'newguide@test.com',
    name: '新導遊',
    role: 'GUIDE',
    avatar: null,
    isEmailVerified: true,
    isKycVerified: false, // 尚未完成 KYC
    permissions: ['user:read'],
    createdAt: new Date().toISOString(),
    userProfile: {
      phone: null,
      bio: null,
      location: null,
      languages: [],
      specialties: []
    }
  }
];

// 獲取當前用戶資訊
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
        avatar: null,
        isEmailVerified: true,
        isKycVerified: false, // 新註冊用戶需要完成 KYC
        permissions: userData.role === 'GUIDE' ? ['user:read', 'guide:manage'] : ['user:read'],
        createdAt: new Date().toISOString(),
        userProfile: {
          phone: userData.phone || null,
          bio: null,
          location: null,
          birthDate: null,
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

/**
 * GET - 獲取用戶個人資料
 */
export async function GET(request: NextRequest) {
  try {
    console.log('Get user profile API called');
    
    const user = getCurrentUser();
    
    if (!user) {
      console.log('User not authenticated');
      return unauthorizedResponse();
    }

    console.log('Get profile for user:', user.email);

    // 移除敏感資訊並返回用戶資料
    const { ...userProfile } = user;
    
    return successResponse({
      user: userProfile
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    return errorResponse('獲取個人資料失敗', 500);
  }
}

/**
 * PUT - 更新用戶個人資料
 */
export async function PUT(request: NextRequest) {
  try {
    console.log('Update user profile API called');
    
    const user = getCurrentUser();
    
    if (!user) {
      console.log('User not authenticated');
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { name, avatar, profile, isKYCVerified } = body;

    console.log('Update profile for user:', user.email, body);

    // 驗證必填欄位
    if (!name || name.trim().length < 2) {
      return errorResponse('姓名至少需要2個字元', 400);
    }

    // 驗證手機號碼格式（如果提供）
    if (profile?.phone && !/^09\d{8}$/.test(profile.phone.replace(/\D/g, ''))) {
      return errorResponse('請輸入有效的台灣手機號碼格式', 400);
    }

    // 驗證自我介紹長度
    if (profile?.bio && profile.bio.length > 500) {
      return errorResponse('自我介紹不能超過500個字元', 400);
    }

    // 驗證生日日期格式
    if (profile?.birthDate) {
      const birthDate = new Date(profile.birthDate);
      if (isNaN(birthDate.getTime())) {
        return errorResponse('請輸入有效的出生日期', 400);
      }
      
      // 檢查年齡合理性（18-100歲）
      const age = new Date().getFullYear() - birthDate.getFullYear();
      if (age < 18 || age > 100) {
        return errorResponse('年齡必須在18至100歲之間', 400);
      }
    }

    // 更新用戶資料（在實際應用中這裡會更新資料庫）
    const updatedUser = {
      ...user,
      name: name.trim(),
      avatar: avatar || user.avatar,
      // 更新 KYC 驗證狀態
      ...(isKYCVerified !== undefined && { isKycVerified: isKYCVerified }),
      userProfile: {
        ...user.userProfile,
        phone: profile?.phone || user.userProfile?.phone,
        bio: profile?.bio || user.userProfile?.bio,
        location: profile?.location || user.userProfile?.location,
        birthDate: profile?.birthDate || user.userProfile?.birthDate,
        languages: profile?.languages || user.userProfile?.languages || [],
        specialties: profile?.specialties || user.userProfile?.specialties || [],
        experienceYears: profile?.experienceYears !== undefined ? profile.experienceYears : user.userProfile?.experienceYears,
        certifications: profile?.certifications || user.userProfile?.certifications || []
      },
      updatedAt: new Date().toISOString()
    };

    // 在實際應用中，這裡應該更新資料庫
    // await updateUserInDatabase(user.id, updatedUser);

    // 暫時更新模擬資料
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = updatedUser;
    } else {
      // 如果是新用戶，將其添加到 mockUsers 列表中
      mockUsers.push(updatedUser);
      console.log('Added new user to mockUsers:', user.email);
    }

    console.log('Profile updated successfully for:', user.email);

    return successResponse({
      user: updatedUser
    }, '個人資料更新成功');

  } catch (error) {
    console.error('Update user profile error:', error);
    return errorResponse('更新個人資料失敗', 500);
  }
}

/**
 * PATCH - 部分更新用戶個人資料
 */
export async function PATCH(request: NextRequest) {
  try {
    console.log('Partial update user profile API called');
    
    const user = getCurrentUser();
    
    if (!user) {
      console.log('User not authenticated');
      return unauthorizedResponse();
    }

    const body = await request.json();
    
    console.log('Partial update for user:', user.email, body);

    // 驗證個別欄位
    if (body.name !== undefined && body.name.trim().length < 2) {
      return errorResponse('姓名至少需要2個字元', 400);
    }

    if (body.profile?.phone !== undefined && body.profile.phone && !/^09\d{8}$/.test(body.profile.phone.replace(/\D/g, ''))) {
      return errorResponse('請輸入有效的台灣手機號碼格式', 400);
    }

    if (body.profile?.bio !== undefined && body.profile.bio && body.profile.bio.length > 500) {
      return errorResponse('自我介紹不能超過500個字元', 400);
    }

    // 部分更新用戶資料
    const updatedUser = {
      ...user,
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.avatar !== undefined && { avatar: body.avatar }),
      userProfile: {
        ...user.userProfile,
        ...(body.profile?.phone !== undefined && { phone: body.profile.phone }),
        ...(body.profile?.bio !== undefined && { bio: body.profile.bio }),
        ...(body.profile?.location !== undefined && { location: body.profile.location }),
        ...(body.profile?.languages !== undefined && { languages: body.profile.languages }),
        ...(body.profile?.specialties !== undefined && { specialties: body.profile.specialties })
      },
      updatedAt: new Date().toISOString()
    };

    // 暫時更新模擬資料
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = updatedUser;
    } else {
      // 如果是新用戶，將其添加到 mockUsers 列表中
      mockUsers.push(updatedUser);
      console.log('Added new user to mockUsers:', user.email);
    }

    console.log('Profile partially updated successfully for:', user.email);

    return successResponse({
      user: updatedUser
    }, '個人資料更新成功');

  } catch (error) {
    console.error('Partial update user profile error:', error);
    return errorResponse('更新個人資料失敗', 500);
  }
}