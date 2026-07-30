import instance from '@/api/instance'
import type { ApiResponse, CreateOrderResponse, DeliveryResponse, OrderDetailResponse, OrderItem, OrderListResponse } from '@/types/api'

export function createOrder(addressId: number, items: OrderItem[]) {
  return instance.post<ApiResponse<CreateOrderResponse>>('/api/orders', { addressId, items })
}

// page는 1부터 시작 (백엔드가 1-indexed로 받고 내부에서 -1 처리)
export function getMyOrders(page: number) {
  return instance.get<ApiResponse<OrderListResponse>>('/api/orders', { params: { page } })
}

export function getOrderDetail(orderId: number) {
  return instance.get<ApiResponse<OrderDetailResponse>>(`/api/orders/${orderId}`)
}

export function cancelOrder(orderId: number) {
  return instance.patch<ApiResponse<void>>(`/api/orders/${orderId}/cancel`)
}

export function getDelivery(orderId: number) {
  return instance.get<ApiResponse<DeliveryResponse>>(`/api/orders/${orderId}/delivery`)
}
