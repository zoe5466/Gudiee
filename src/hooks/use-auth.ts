'use client'

import { useState, useEffect } from 'react'

// 模擬的用戶型別
interface User {
  id: string
  name: string
  email: string
  role: 'traveler' | 'provider' | 'admin'
  avatar?: string
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
            role: 'traveler'
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