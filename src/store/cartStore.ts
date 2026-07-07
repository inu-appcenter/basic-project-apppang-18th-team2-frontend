import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: number
  name: string
  option: string
  price: number
  quantity: number
  stock: number
  selected: boolean
}

type CartState = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'selected'>) => void
  toggleSelect: (id: number) => void
  toggleSelectAll: () => void
  changeQuantity: (id: number, quantity: number) => void
  removeItem: (id: number) => void
  removeSelected: () => void
}

const initialItems: CartItem[] = [
  { id: 1, name: '남성 경량 구스다운 패딩 점퍼', option: '블랙 / L', price: 61000, quantity: 1, stock: 5, selected: true },
  { id: 2, name: '베이직 니트 스웨터', option: '그레이 / M', price: 34900, quantity: 2, stock: 8, selected: true },
  { id: 3, name: '무선 핸디 청소기', option: '화이트', price: 135150, quantity: 1, stock: 1, selected: true },
  { id: 4, name: '플리스 머플러 세트', option: '네이비', price: 14500, quantity: 1, stock: 6, selected: false },
]

// persist로 새로고침해도 장바구니 유지
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: initialItems,
      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id && i.option === item.option)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id && i.option === item.option
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                : i,
            ),
          })
          return
        }
        set({ items: [...get().items, { ...item, selected: true }] })
      },
      toggleSelect: (id) =>
        set({ items: get().items.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)) }),
      toggleSelectAll: () => {
        const allSelected = get().items.every((item) => item.selected)
        set({ items: get().items.map((item) => ({ ...item, selected: !allSelected })) })
      },
      changeQuantity: (id, quantity) =>
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: Math.min(Math.max(quantity, 1), item.stock) } : item,
          ),
        }),
      removeItem: (id) => set({ items: get().items.filter((item) => item.id !== id) }),
      removeSelected: () => set({ items: get().items.filter((item) => !item.selected) }),
    }),
    { name: 'cart' },
  ),
)
