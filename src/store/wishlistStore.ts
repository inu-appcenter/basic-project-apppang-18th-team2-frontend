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
}

const initialItems: WishlistItem[] = [
  { id: 1, name: '남성 경량 구스다운 패딩 점퍼', price: 61000, originPrice: 89000, rating: 4.8, reviews: 2104 },
  { id: 5, name: '오버핏 울 코트', price: 92800, originPrice: 129000, rating: 4.7, reviews: 1028 },
  { id: 2, name: '베이직 니트 스웨터', price: 34900, rating: 4.6, reviews: 881 },
]

// persist로 새로고침해도 찜 목록 유지
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: initialItems,
      isWished: (id) => get().items.some((item) => item.id === id),
      toggle: (item) => {
        const wished = get().isWished(item.id)
        set({ items: wished ? get().items.filter((i) => i.id !== item.id) : [...get().items, item] })
      },
      remove: (id) => set({ items: get().items.filter((item) => item.id !== id) }),
    }),
    { name: 'wishlist' },
  ),
)
