import instance from '@/api/instance'
import type { ApiResponse, CreateOrderResponse, OrderItem } from '@/types/api'

export function createOrder(addressId: number, items: OrderItem[]) {
  return instance.post<ApiResponse<CreateOrderResponse>>('/api/orders', { addressId, items })
}
