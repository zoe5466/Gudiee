import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'customer' | 'guide' | 'admin';
  isEmailVerified: boolean;
  isKYCVerified: boolean;
  createdAt: string;
  permissions?: string[];
  profile?: {
    phone?: string;
    bio?: string;
    location?: string;
    languages?: string[];
    specialties?: string[];
    avatar?: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshAuth: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  hasPermission: (permission: string) => boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  userType?: 'customer' | 'guide';
  subscribeNewsletter?: boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.error || data.message || '登入失敗');
          }

          const user: User = {
            id: data.data.user.id,
            email: data.data.user.email,
            name: data.data.user.name,
            avatar: data.data.user.avatar,
            role: data.data.user.role.toLowerCase() as 'customer' | 'guide' | 'admin',
            isEmailVerified: data.data.user.isEmailVerified,
            isKYCVerified: data.data.user.isKycVerified,
            createdAt: data.data.user.createdAt,
            permissions: data.data.user.permissions || [],
            profile: {
              phone: data.data.user.phone,
              bio: data.data.user.userProfile?.bio,
              location: data.data.user.userProfile?.location,
              languages: data.data.user.userProfile?.languages,
              specialties: data.data.user.userProfile?.specialties,
            }
          };
          
          set({
            user,
            token: data.data.token,
            refreshToken: null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        
        try {
          // 模擬註冊 API 調用
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // 模擬新用戶數據
          const mockUser: User = {
            id: Date.now().toString(),
            email: data.email,
            name: data.name,
            role: (data.userType || 'customer') as 'customer' | 'guide' | 'admin',
            isEmailVerified: false,
            isKYCVerified: false,
            createdAt: new Date().toISOString(),
            permissions: data.userType === 'guide' ? ['user:read', 'guide:manage', 'booking:manage'] : ['user:read', 'booking:create'],
            profile: {
              phone: data.phone
            }
          };
          
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          set({
            user: mockUser,
            token: mockToken,
            refreshToken: 'mock-refresh-token',
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          // 調用登出 API
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
        } catch (error) {
          console.error('Logout API error:', error);
        }
        
        // 清除本地狀態
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: async (userData: Partial<User>) => {
        const { user, token } = get();
        if (!user || !token) {
          throw new Error('未登入');
        }
        
        set({ isLoading: true });
        
        try {
          // TODO: 實際 API 調用
          const response = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            throw new Error('更新失敗');
          }

          const updatedUser = await response.json();
          
          set({
            user: { ...user, ...updatedUser },
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;

        try {
          // TODO: 實際 API 調用
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (!response.ok) {
            throw new Error('Token 刷新失敗');
          }

          const data = await response.json();
          
          set({
            token: data.token,
            refreshToken: data.refreshToken,
          });
        } catch (error) {
          // Token 過期，清除認證狀態
          get().logout();
        }
      },

      initializeAuth: async () => {
        try {
          const response = await fetch('/api/auth/me', {
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            
            if (data.success && data.data.user) {
              const user: User = {
                id: data.data.user.id,
                email: data.data.user.email,
                name: data.data.user.name,
                avatar: data.data.user.avatar,
                role: data.data.user.role.toLowerCase() as 'customer' | 'guide' | 'admin',
                isEmailVerified: data.data.user.isEmailVerified,
                isKYCVerified: data.data.user.isKycVerified,
                createdAt: data.data.user.createdAt,
                permissions: data.data.user.permissions || [],
                profile: {
                  phone: data.data.user.phone,
                  bio: data.data.user.userProfile?.bio,
                  location: data.data.user.userProfile?.location,
                  languages: data.data.user.userProfile?.languages,
                  specialties: data.data.user.userProfile?.specialties,
                }
              };

              set({
                user,
                isAuthenticated: true,
              });
            }
          }
        } catch (error) {
          console.error('Initialize auth error:', error);
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      hasPermission: (permission: string) => {
        const { user } = get();
        if (!user) return false;
        
        // 管理員擁有所有權限
        if (user.role === 'admin') return true;
        
        // 檢查用戶權限列表
        return user.permissions?.includes(permission) || false;
      },
    }),
    {
      name: 'guidee-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);