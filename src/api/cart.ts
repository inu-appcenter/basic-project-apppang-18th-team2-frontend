import instance from '@/api/instance'
import type { ApiResponse, CartResponse } from '@/types/api'

export function getCart() {
  return instance.get<ApiResponse<CartResponse>>('/api/cart/items')
}

export function addCartItem(productId: number, quantity: number) {
  return instance.post<ApiResponse<void>>('/api/cart/items', { productId, quantity })
}

export function updateCartQuantity(cartItemId: number, quantity: number) {
  return instance.patch<ApiResponse<{ quantity: number }>>(`/api/cart/items/${cartItemId}`, { quantity })
}

export function deleteCartItem(cartItemId: number) {
  return instance.delete<ApiResponse<void>>(`/api/cart/items/${cartItemId}`)
}
