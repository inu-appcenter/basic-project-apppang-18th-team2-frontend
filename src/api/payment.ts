import instance from '@/api/instance'
import type { ApiResponse, PaymentMethod, PaymentResponse } from '@/types/api'

export function requestPayment(orderId: number, paymentMethod: PaymentMethod, isFromCart: boolean) {
  return instance.post<ApiResponse<PaymentResponse>>('/api/payments', { orderId, paymentMethod, isFromCart })
}
