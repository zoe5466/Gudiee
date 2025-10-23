'use client'

import { useState, useEffect } from 'react'

// 用戶資料介面定義（與 store/auth.ts 保持一致）
interface User {
  id: string; // 用戶唯一識別碼
  email: string; // 電子郵件
  name: string; // 用戶姓名
  avatar?: string; // 頭像 URL（可選）
  role: 'customer' | 'guide' | 'admin'; // 用戶角色
  isEmailVerified: boolean; // Email 驗證狀態
  isKYCVerified: boolean; // KYC 驗證狀態
  createdAt: string; // 帳戶建立時間
  permissions?: string[]; // 權限列表（可選）
  profile?: { // 用戶詳細檔案（可選）
    phone?: string; // 電話號碼
    bio?: string; // 個人簡介
    location?: string; // 所在地點
    birthDate?: string; // 生日
    languages?: string[]; // 語言能力
    specialties?: string[]; // 專長領域
    experienceYears?: number; // 經驗年數
    certifications?: string[]; // 認證資格
    socialLinks?: { // 社群連結
      website?: string;
      instagram?: string;
      facebook?: string;
      linkedin?: string;
    };
    avatar?: string; // 檔案頭像
  };
}

// 模擬的認證 Hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模擬檢查登入狀態
    const checkAuth = async () => {
      try {
        // 這裡之後會連接真實的 API
        const token = localStorage.getItem('token')
        if (token) {
          // 模擬用戶資料
          setUser({
            id: '1',
            name: '張小明',
            email: 'user@example.com',
            role: 'customer',
            isEmailVerified: true,
            isKYCVerified: false,
            createdAt: '2024-01-01T00:00:00.000Z',
            permissions: ['user:read']
          })
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    // 模擬登入 API
    console.log('Login:', email, password)
    // 之後會實作真實的登入邏輯
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const register = async (data: any) => {
    // 模擬註冊 API
    console.log('Register:', data)
    // 之後會實作真實的註冊邏輯
  }

  return {
    user,
    loading,
    login,
    logout,
    register
  }
}