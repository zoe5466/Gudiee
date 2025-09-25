// 認證狀態提供者組件
// 功能：在應用啟動時自動初始化用戶認證狀態，確保用戶登入狀態的持續性
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/store/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * 認證狀態提供者
 * 在應用啟動時自動檢查用戶登入狀態並初始化
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { initializeAuth } = useAuth();

  useEffect(() => {
    // 在應用啟動時初始化認證狀態
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}