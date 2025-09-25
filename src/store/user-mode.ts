// 用戶模式狀態管理 Store
// 功能：管理用戶在旅客和導遊模式之間的切換
import { create } from 'zustand'; // 狀態管理庫
import { persist } from 'zustand/middleware'; // 持久化中間件

// 用戶模式類型定義
export type UserMode = 'traveler' | 'guide'; // 旅客模式 | 導遊模式

// 用戶模式狀態介面定義
interface UserModeState {
  mode: UserMode; // 當前用戶模式
  switchMode: (mode: UserMode) => void; // 切換用戶模式方法
}

/**
 * 用戶模式 Store
 * 
 * 功能：
 * - 管理用戶在旅客和導遊模式之間的切換
 * - 持久化用戶模式選擇
 * - 影響 UI 顯示和功能可用性
 */
export const useUserMode = create<UserModeState>()(
  persist(
    (set) => ({
      mode: 'traveler', // 預設為旅客模式
      
      /**
       * 切換用戶模式
       * @param mode 要切換到的模式
       */
      switchMode: (mode: UserMode) => set({ mode }),
    }),
    {
      name: 'guidee-user-mode', // LocalStorage 鍵名
    }
  )
);