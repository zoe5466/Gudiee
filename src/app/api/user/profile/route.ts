// 用戶個人資料管理 API
// 功能：處理用戶個人資料的查詢和更新
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// 用戶資料介面定義
interface UserProfile {
  phone?: string;
  bio?: string;
  location?: string;
  birthDate?: string;
  languages: string[];
  specialties: string[];
  experienceYears?: number;
  certifications: string[];
}

interface MockUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string | null;
  phone?: string | null;
  isEmailVerified: boolean;
  isKycVerified: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt?: string;
  profile: UserProfile;
}

// 模擬用戶資料庫（與認證 API 保持一致）
const mockUsers: MockUser[] = [
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
    profile: {
      phone: '0912345678',
      bio: '專業台北導遊，擁有5年導覽經驗，熟悉台北各大景點和在地文化。',
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
    role: 'GUIDE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isEmailVerified: true,
    isKycVerified: true,
    permissions: ['user:read', 'guide:manage', 'booking:manage'],
    createdAt: '2024-02-10T10:30:00.000Z',
    profile: {
      phone: '0923456789',
      bio: '資深地陪導遊，專精自然生態導覽，擁有豐富的戶外活動經驗。',
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
    role: 'ADMIN',
    avatar: null,
    isEmailVerified: true,
    isKycVerified: true,
    permissions: ['admin:full', 'user:manage', 'service:manage', 'booking:manage'],
    createdAt: '2024-01-01T00:00:00.000Z',
    profile: {
      languages: ['中文'],
      specialties: [] as string[],
      experienceYears: 0,
      certifications: [] as string[]
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
    profile: {
      languages: [] as string[],
      specialties: [] as string[],
      experienceYears: 0,
      certifications: [] as string[]
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
    profile: {
      languages: [] as string[],
      specialties: [] as string[],
      experienceYears: 0,
      certifications: [] as string[]
    }
  }
];

// 獲取當前用戶資訊
function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      console.error('No auth token found');
      return null;
    }

    // JWT 令牌格式為 header.payload.signature
    // 我們需要解碼 payload 部分（第二段）
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid token format');
      return null;
    }

    try {
      // 解析 JWT payload（第二段）
      // 添加必要的 padding 以確保 Base64 正確解碼
      const payload = parts[1];
      if (!payload) {
        console.error('JWT payload is missing');
        return null;
      }
      const padded = payload + '='.repeat((4 - payload.length % 4) % 4);
      const decoded = Buffer.from(padded, 'base64').toString('utf-8');
      const userData = JSON.parse(decoded);

      console.log('Parsed token data:', { id: userData.id, email: userData.email, role: userData.role });

      // 檢查 token 是否過期
      if (userData.exp && userData.exp * 1000 < Date.now()) {
        console.error('Token expired');
        return null;
      }

      // 從模擬數據中找到用戶
      let user = mockUsers.find(u => u.id === userData.id);

      // 如果在預定義用戶中找不到，表示是新註冊的用戶，從 token 中構建用戶資料
      if (!user && userData.id && userData.email) {
        console.log('Creating new user from token:', userData.email);
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
          profile: {
            ...(userData.phone && { phone: userData.phone }),
            languages: [],
            specialties: [],
            experienceYears: 0,
            certifications: []
          }
        };
      }

      return user || null;
    } catch (parseError) {
      console.error('Failed to parse JWT payload:', parseError);
      return null;
    }

  } catch (error) {
    console.error('Get current user error:', error);
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
    const { ...userData } = user;
    
    return successResponse({
      user: userData
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

    // 構建更新的資料
    const profileData = {
      phone: profile?.phone || user.profile?.phone,
      bio: profile?.bio || user.profile?.bio,
      location: profile?.location || user.profile?.location,
      birthDate: profile?.birthDate || user.profile?.birthDate,
      languages: profile?.languages || user.profile?.languages || [],
      specialties: profile?.specialties || user.profile?.specialties || [],
      experienceYears: profile?.experienceYears !== undefined ? profile.experienceYears : user.profile?.experienceYears,
      certifications: profile?.certifications || user.profile?.certifications || []
    };

    // 更新用戶資料到資料庫
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name.trim(),
        avatar: avatar || user.avatar,
        phone: profile?.phone || user.phone,
        profile: profileData,
        ...(isKYCVerified !== undefined && { isKycVerified: isKYCVerified })
      }
    });

    // 如果是導遊，也更新 UserProfile 表
    if (user.role === 'GUIDE') {
      try {
        const userProfileExists = await prisma.userProfile.findUnique({
          where: { userId: user.id }
        });

        if (userProfileExists) {
          await prisma.userProfile.update({
            where: { userId: user.id },
            data: {
              bio: profile?.bio,
              location: profile?.location,
              languages: profile?.languages || [],
              specialties: profile?.specialties || [],
              experienceYears: profile?.experienceYears,
              certifications: profile?.certifications || []
            }
          });
        } else {
          await prisma.userProfile.create({
            data: {
              userId: user.id,
              bio: profile?.bio,
              location: profile?.location,
              languages: profile?.languages || [],
              specialties: profile?.specialties || [],
              experienceYears: profile?.experienceYears,
              certifications: profile?.certifications || []
            }
          });
        }
      } catch (profileError) {
        console.error('Error updating user profile record:', profileError);
        // 不要因為 UserProfile 錯誤而失敗，因為主要資料已存儲到 User 表
      }
    }

    // 更新模擬資料以保持一致性
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      const mockUser = mockUsers[userIndex]!;
      mockUsers[userIndex] = {
        id: mockUser.id,
        email: mockUser.email,
        name: name.trim(),
        avatar: avatar || mockUser.avatar,
        phone: mockUser.phone,
        role: mockUser.role,
        isEmailVerified: mockUser.isEmailVerified,
        isKycVerified: isKYCVerified !== undefined ? isKYCVerified : mockUser.isKycVerified,
        permissions: mockUser.permissions,
        createdAt: mockUser.createdAt,
        updatedAt: new Date().toISOString(),
        profile: profileData
      };
    }

    console.log('Profile updated successfully for:', user.email);

    return successResponse({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        isEmailVerified: updatedUser.isEmailVerified,
        isKycVerified: updatedUser.isKycVerified,
        permissions: updatedUser.permissions,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        profile: profileData
      }
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

    // 構建更新數據
    const updateData: any = {};

    if (body.name !== undefined) {
      updateData.name = body.name.trim();
    }

    if (body.avatar !== undefined) {
      updateData.avatar = body.avatar;
    }

    if (body.profile) {
      const currentProfile = user.profile || {};
      updateData.profile = {
        ...currentProfile,
        ...(body.profile.phone !== undefined && { phone: body.profile.phone }),
        ...(body.profile.bio !== undefined && { bio: body.profile.bio }),
        ...(body.profile.location !== undefined && { location: body.profile.location }),
        ...(body.profile.languages !== undefined && { languages: body.profile.languages }),
        ...(body.profile.specialties !== undefined && { specialties: body.profile.specialties })
      };
    }

    // 更新用戶資料到資料庫
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData
    });

    // 如果是導遊，也更新 UserProfile 表
    if (user.role === 'GUIDE' && body.profile) {
      try {
        const userProfileExists = await prisma.userProfile.findUnique({
          where: { userId: user.id }
        });

        const profileUpdateData: any = {};
        if (body.profile.bio !== undefined) profileUpdateData.bio = body.profile.bio;
        if (body.profile.location !== undefined) profileUpdateData.location = body.profile.location;
        if (body.profile.languages !== undefined) profileUpdateData.languages = body.profile.languages;
        if (body.profile.specialties !== undefined) profileUpdateData.specialties = body.profile.specialties;

        if (userProfileExists && Object.keys(profileUpdateData).length > 0) {
          await prisma.userProfile.update({
            where: { userId: user.id },
            data: profileUpdateData
          });
        } else if (!userProfileExists && Object.keys(profileUpdateData).length > 0) {
          await prisma.userProfile.create({
            data: {
              userId: user.id,
              ...profileUpdateData
            }
          });
        }
      } catch (profileError) {
        console.error('Error updating user profile record:', profileError);
        // 不要因為 UserProfile 錯誤而失敗
      }
    }

    // 更新模擬資料以保持一致性
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
    }

    console.log('Profile partially updated successfully for:', user.email);

    const profileData = updateData.profile || user.profile || {};

    return successResponse({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        isEmailVerified: updatedUser.isEmailVerified,
        isKycVerified: updatedUser.isKycVerified,
        permissions: updatedUser.permissions,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        profile: profileData
      }
    }, '個人資料更新成功');

  } catch (error) {
    console.error('Partial update user profile error:', error);
    return errorResponse('更新個人資料失敗', 500);
  }
}