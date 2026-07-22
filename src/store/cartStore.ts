import { create } from 'zustand'
import { addCartItem, deleteCartItem, getCart, updateCartQuantity } from '@/api/cart'

export type CartItem = {
  cartItemId: number
  productId: number
  productName: string
  thumbnail: string
  originalPrice: number
  discountRate: number
  salePrice: number
  quantity: number
  stock: number
  selected: boolean
}

type CartState = {
  items: CartItem[]
  loading: boolean
  fetchCart: () => Promise<void>
  addItem: (productId: number, quantity: number) => Promise<void>
  toggleSelect: (cartItemId: number) => void
  toggleSelectAll: () => void
  changeQuantity: (cartItemId: number, quantity: number) => Promise<void>
  removeItem: (cartItemId: number) => Promise<void>
  removeSelected: () => Promise<void>
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true })
    try {
      const { data } = await getCart()
      set({ items: data.data.items.map((item) => ({ ...item, selected: true })) })
    } finally {
      set({ loading: false })
    }
  },

  addItem: async (productId, quantity) => {
    await addCartItem(productId, quantity)
    await get().fetchCart()
  },

  toggleSelect: (cartItemId) =>
    set({
      items: get().items.map((item) => (item.cartItemId === cartItemId ? { ...item, selected: !item.selected } : item)),
    }),

  toggleSelectAll: () => {
    const allSelected = get().items.every((item) => item.selected)
    set({ items: get().items.map((item) => ({ ...item, selected: !allSelected })) })
  },

  changeQuantity: async (cartItemId, quantity) => {
    const { data } = await updateCartQuantity(cartItemId, quantity)
    set({
      items: get().items.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: data.data.quantity } : item,
      ),
    })
  },

  removeItem: async (cartItemId) => {
    await deleteCartItem(cartItemId)
    set({ items: get().items.filter((item) => item.cartItemId !== cartItemId) })
  },

  removeSelected: async () => {
    const selectedIds = get().items.filter((item) => item.selected).map((item) => item.cartItemId)
    // 백엔드에 일괄삭제 엔드포인트가 없어 단건 삭제를 병렬로 호출
    await Promise.all(selectedIds.map((id) => deleteCartItem(id)))
    set({ items: get().items.filter((item) => !item.selected) })
  },
}))
