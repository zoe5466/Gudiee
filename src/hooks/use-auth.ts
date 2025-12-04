'use client'

import { useAuth as useAuthStore } from '@/store/auth'

export function useAuth() {
  const authStore = useAuthStore()

  return {
    user: authStore.user,
    loading: authStore.isLoading,
    isAuthenticated: authStore.isAuthenticated,
    login: authStore.login,
    logout: authStore.logout,
    register: authStore.register
  }
}