import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WishlistItem = {
  id: number
  name: string
  price: number
  originPrice?: number
  rating: number
  reviews: number
}

type WishlistState = {
  items: WishlistItem[]
  isWished: (id: number) => boolean
  toggle: (item: WishlistItem) => void
  remove: (id: number) => void
  setItems: (items: WishlistItem[]) => void
}

// persist로 새로고침해도 찜 목록 유지 (WishlistPage 진입 시 서버 목록으로 동기화됨)
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isWished: (id) => get().items.some((item) => item.id === id),
      toggle: (item) => {
        const wished = get().isWished(item.id)
        set({ items: wished ? get().items.filter((i) => i.id !== item.id) : [...get().items, item] })
      },
      remove: (id) => set({ items: get().items.filter((item) => item.id !== id) }),
      setItems: (items) => set({ items }),
    }),
    { name: 'wishlist' },
  ),
)
