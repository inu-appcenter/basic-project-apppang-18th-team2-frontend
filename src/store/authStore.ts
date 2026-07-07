import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/api'

type AuthState = {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

// persist로 새로고침해도 로그인 상태 유지 (자동 로그인)
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'auth' },
  ),
)
