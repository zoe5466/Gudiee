// 用戶認證狀態管理 Store
// 功能：管理用戶登入狀態、權限驗證、自動刷新 token 等核心認證功能
import { create } from 'zustand'; // 狀態管理庫
import { persist } from 'zustand/middleware'; // 持久化中間件

// 用戶資料介面定義
export interface User {
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

// 認證狀態管理介面定義
interface AuthState {
  // 狀態屬性
  user: User | null; // 當前登入用戶
  token: string | null; // JWT 存取令牌
  refreshToken: string | null; // JWT 刷新令牌
  isLoading: boolean; // 載入狀態
  isAuthenticated: boolean; // 是否已認證
  
  // 行為方法
  login: (email: string, password: string) => Promise<void>; // 用戶登入
  register: (data: RegisterData) => Promise<void>; // 用戶註冊
  logout: () => Promise<void>; // 用戶登出
  updateUser: (userData: Partial<User>) => Promise<void>; // 更新用戶資料
  updateProfile: (profileData: Partial<User>) => Promise<void>; // 更新個人資料
  refreshAuth: () => Promise<void>; // 刷新認證令牌
  initializeAuth: () => Promise<void>; // 初始化認證狀態
  setLoading: (loading: boolean) => void; // 設置載入狀態
  hasPermission: (permission: string) => boolean; // 檢查用戶權限
}

// 用戶註冊資料介面定義
interface RegisterData {
  email: string; // 電子郵件（必填）
  password: string; // 密碼（必填）
  name: string; // 姓名（必填）
  phone?: string; // 電話號碼（可選）
  userType?: 'customer' | 'guide'; // 用戶類型（可選，預設為 customer）
  subscribeNewsletter?: boolean; // 是否訂閱電子報（可選）
}

/**
 * 用戶認證 Store
 * 
 * 功能：
 * - 用戶登入、註冊、登出
 * - JWT token 管理和自動刷新
 * - 用戶資料更新
 * - 權限驗證
 * - 持久化認證狀態
 */
export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始狀態
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,

      /**
       * 用戶登入方法
       * @param email 電子郵件
       * @param password 密碼
       */
      login: async (email: string, password: string) => {
        set({ isLoading: true }); // 設置載入狀態
        
        try {
          // 向後端發送登入請求
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // 包含 cookies
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          // 檢查請求是否成功
          if (!response.ok || !data.success) {
            throw new Error(data.error || data.message || '登入失敗');
          }

          // 轉換後端用戶資料為前端格式
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
            profile: { // 組裝用戶檔案資料
              phone: data.data.user.phone,
              bio: data.data.user.userProfile?.bio,
              location: data.data.user.userProfile?.location,
              birthDate: data.data.user.userProfile?.birthDate,
              languages: data.data.user.userProfile?.languages,
              specialties: data.data.user.userProfile?.specialties,
              experienceYears: data.data.user.userProfile?.experienceYears,
              certifications: data.data.user.userProfile?.certifications,
              socialLinks: data.data.user.userProfile?.socialLinks,
            }
          };
          
          // 更新狀態為已登入
          set({
            user,
            token: data.data.token,
            refreshToken: null, // TODO: 實作 refresh token
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // 登入失敗時清除載入狀態
          set({ isLoading: false });
          throw error; // 拋出錯誤供上層處理
        }
      },

      /**
       * 用戶註冊方法
       * @param data 註冊資料
       */
      register: async (data: RegisterData) => {
        set({ isLoading: true }); // 設置載入狀態
        
        try {
          // 向後端發送註冊請求
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // 包含 cookies
            body: JSON.stringify(data),
          });

          const result = await response.json();

          // 檢查請求是否成功
          if (!response.ok || !result.success) {
            throw new Error(result.error || result.message || '註冊失敗');
          }

          // 轉換後端用戶資料為前端格式（與登入相同的處理邏輯）
          const user: User = {
            id: result.data.user.id,
            email: result.data.user.email,
            name: result.data.user.name,
            avatar: result.data.user.avatar,
            role: result.data.user.role.toLowerCase() as 'customer' | 'guide' | 'admin',
            isEmailVerified: result.data.user.isEmailVerified || false,
            isKYCVerified: result.data.user.isKycVerified || false,
            createdAt: result.data.user.createdAt,
            permissions: result.data.user.permissions || [],
            profile: {
              phone: result.data.user.phone || data.phone,
              bio: result.data.user.userProfile?.bio,
              location: result.data.user.userProfile?.location,
              birthDate: result.data.user.userProfile?.birthDate,
              languages: result.data.user.userProfile?.languages,
              specialties: result.data.user.userProfile?.specialties,
              experienceYears: result.data.user.userProfile?.experienceYears,
              certifications: result.data.user.userProfile?.certifications,
              socialLinks: result.data.user.userProfile?.socialLinks,
            }
          };

          // 更新認證狀態
          set({
            user,
            token: result.data.token,
            refreshToken: null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error; // 拋出錯誤供上層處理
        }
      },

      /**
       * 用戶登出方法
       * 同時清除後端 session 和前端狀態
       */
      logout: async () => {
        try {
          // 調用後端登出 API 清除 session
          await fetch('/api/auth/me', {
            method: 'POST',
            credentials: 'include', // 包含 cookies
          });
        } catch (error) {
          console.error('Logout API error:', error);
          // 即使 API 失敗也要清除本地狀態
        }
        
        // 清除前端認證狀態
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      /**
       * 更新用戶資料方法
       * @param userData 要更新的用戶資料（部分）
       */
      updateUser: async (userData: Partial<User>) => {
        const { user } = get();
        // 檢查用戶是否已登入
        if (!user) {
          throw new Error('未登入');
        }
        
        set({ isLoading: true }); // 設置載入狀態
        
        try {
          console.log('Sending update request with data:', userData);
          
          // 向後端發送更新請求
          const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // 包含 cookies
            body: JSON.stringify(userData),
          });

          console.log('Update response status:', response.status);

          const result = await response.json();
          console.log('Update response data:', result);

          // 檢查請求是否成功
          if (!response.ok || !result.success) {
            const errorMessage = result.error || result.message || '更新個人資料失敗';
            console.error('Update failed:', errorMessage);
            throw new Error(errorMessage);
          }

          // 使用後端返回的用戶資料更新本地狀態
          const updatedUser: User = {
            id: result.data.user.id,
            email: result.data.user.email,
            name: result.data.user.name,
            avatar: result.data.user.avatar,
            role: result.data.user.role.toLowerCase() as 'customer' | 'guide' | 'admin',
            isEmailVerified: result.data.user.isEmailVerified,
            isKYCVerified: result.data.user.isKycVerified,
            createdAt: result.data.user.createdAt,
            permissions: result.data.user.permissions || [],
            profile: {
              phone: result.data.user.userProfile?.phone,
              bio: result.data.user.userProfile?.bio,
              location: result.data.user.userProfile?.location,
              birthDate: result.data.user.userProfile?.birthDate,
              languages: result.data.user.userProfile?.languages || [],
              specialties: result.data.user.userProfile?.specialties || [],
              experienceYears: result.data.user.userProfile?.experienceYears,
              certifications: result.data.user.userProfile?.certifications || [],
              socialLinks: result.data.user.userProfile?.socialLinks,
            }
          };
          
          console.log('Updated user data:', updatedUser);
          
          // 更新狀態
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          console.error('Update user error:', error);
          set({ isLoading: false });
          throw error; // 拋出錯誤供上層處理
        }
      },

      /**
       * 更新個人資料方法 (mock implementation)
       * @param profileData 要更新的個人資料
       */
      updateProfile: async (profileData: Partial<User>) => {
        const { user } = get();
        if (!user) {
          throw new Error('未登入');
        }
        
        set({ isLoading: true });
        
        try {
          // Mock API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update user data locally (mock implementation)
          const updatedUser: User = {
            ...user,
            ...profileData,
            profile: {
              ...user.profile,
              ...profileData.profile
            }
          };
          
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      /**
       * 刷新認證令牌方法
       * 用於延長用戶登入狀態
       */
      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return; // 沒有 refresh token 則跳過

        try {
          // 使用 refresh token 獲取新的 access token
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (!response.ok) {
            throw new Error('Token 刷新失敗');
          }

          const data = await response.json();
          
          // 更新 tokens
          set({
            token: data.token,
            refreshToken: data.refreshToken,
          });
        } catch (error) {
          // Token 過期或無效，自動登出用戶
          get().logout();
        }
      },

      /**
       * 初始化認證狀態方法
       * 應用啟動時檢查用戶是否已登入（基於 cookie）
       */
      initializeAuth: async () => {
        try {
          // 向後端查詢當前用戶狀態
          const response = await fetch('/api/auth/me', {
            credentials: 'include', // 包含 cookies
          });

          if (response.ok) {
            const data = await response.json();
            
            if (data.success && data.data.user) {
              // 直接使用後端返回的用戶資料
              const user: User = {
                ...data.data.user,
                role: data.data.user.role.toLowerCase() as 'customer' | 'guide' | 'admin',
                isKYCVerified: data.data.user.isKycVerified || false,
                permissions: data.data.user.permissions || [],
                profile: {
                  phone: data.data.user.phone,
                  bio: data.data.user.userProfile?.bio,
                  location: data.data.user.userProfile?.location,
                  birthDate: data.data.user.userProfile?.birthDate,
                  languages: data.data.user.userProfile?.languages,
                  specialties: data.data.user.userProfile?.specialties,
                  experienceYears: data.data.user.userProfile?.experienceYears,
                  certifications: data.data.user.userProfile?.certifications,
                  socialLinks: data.data.user.userProfile?.socialLinks,
                }
              };

              // 恢復登入狀態
              set({
                user,
                isAuthenticated: true,
              });
            }
          }
        } catch (error) {
          console.error('Initialize auth error:', error);
          // 初始化失敗不拋出錯誤，保持未登入狀態
        }
      },

      /**
       * 設置載入狀態方法
       * @param loading 是否正在載入
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      /**
       * 檢查用戶權限方法
       * @param permission 權限名稱
       * @returns 是否擁有該權限
       */
      hasPermission: (permission: string) => {
        const { user } = get();
        if (!user) return false; // 未登入用戶無權限
        
        // 管理員擁有所有權限
        if (user.role === 'admin') return true;
        
        // 檢查用戶權限列表中是否包含指定權限
        return user.permissions?.includes(permission) || false;
      },
    }),
    {
      // 持久化配置
      name: 'guidee-auth', // LocalStorage 鍵名
      partialize: (state) => ({ // 指定哪些狀態需要持久化
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // 注意：token 由 cookie 管理，不需要持久化到 localStorage
        // 注意：不持久化 isLoading 狀態
      }),
    }
  )
); // useAuth Hook 結束