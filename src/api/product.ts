import instance from '@/api/instance'
import type { ApiResponse, ProductDetailResponse, ProductListResponse } from '@/types/api'

export type ProductListParams = {
  keyword?: string
  categoryId?: number
  discountOnly?: boolean
  event?: string
  sort?: 'latest' | 'rating' | 'priceAsc' | 'priceDesc'
  page: number
}

export function getProducts(params: ProductListParams) {
  return instance.get<ApiResponse<ProductListResponse>>('/api/products', { params })
}

export function getProduct(productId: number) {
  return instance.get<ApiResponse<ProductDetailResponse>>(`/api/products/${productId}`)
}
