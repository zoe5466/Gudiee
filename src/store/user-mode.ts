import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserMode = 'traveler' | 'guide';

interface UserModeState {
  mode: UserMode;
  switchMode: (mode: UserMode) => void;
}

export const useUserMode = create<UserModeState>()(
  persist(
    (set) => ({
      mode: 'traveler', // 預設為旅客模式
      switchMode: (mode: UserMode) => set({ mode }),
    }),
    {
      name: 'guidee-user-mode',
    }
  )
);