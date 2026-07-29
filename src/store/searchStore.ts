import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_RECENT = 10

type SearchState = {
  recent: string[]
  addRecent: (keyword: string) => void
  removeRecent: (keyword: string) => void
  clearRecent: () => void
}

// 기기(브라우저) 로컬에 최근 검색어를 저장해 재방문 시에도 유지한다
export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      recent: [],
      addRecent: (keyword) => {
        const trimmed = keyword.trim()
        if (!trimmed) return
        set({ recent: [trimmed, ...get().recent.filter((word) => word !== trimmed)].slice(0, MAX_RECENT) })
      },
      removeRecent: (keyword) => set({ recent: get().recent.filter((word) => word !== keyword) }),
      clearRecent: () => set({ recent: [] }),
    }),
    { name: 'recentSearch' },
  ),
)
