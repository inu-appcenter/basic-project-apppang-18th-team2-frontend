import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { addWishlist, deleteWishlist } from '@/api/wishlist'

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
  toggle: (item: WishlistItem) => Promise<void>
  remove: (id: number) => Promise<void>
  setItems: (items: WishlistItem[]) => void
}

// persist로 새로고침해도 찜 목록 유지 (WishlistPage 진입 시 서버 목록으로 동기화됨)
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isWished: (id) => get().items.some((item) => item.id === id),
      toggle: async (item) => {
        const wished = get().isWished(item.id)
        if (wished) {
          set({ items: get().items.filter((i) => i.id !== item.id) })
          await deleteWishlist(item.id)
        } else {
          set({ items: [...get().items, item] })
          await addWishlist(item.id)
        }
      },
      remove: async (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
        await deleteWishlist(id)
      },
      setItems: (items) => set({ items }),
    }),
    { name: 'wishlist' },
  ),
)
