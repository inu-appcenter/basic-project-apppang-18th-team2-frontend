import instance from '@/api/instance'
import type { ApiResponse, WishlistResponse } from '@/types/api'

export function getWishlist() {
  return instance.get<ApiResponse<WishlistResponse>>('/api/wishlist')
}

export function addWishlist(productId: number) {
  return instance.post<ApiResponse<null>>('/api/wishlist', { productId })
}
