import type { OrderStatus } from '@/types/api'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: '결제 대기',
  PAID: '결제 완료',
  PREPARING: '상품 준비중',
  DELIVERING: '배송중',
  DELIVERED: '배송 완료',
  CANCELED: '주문 취소',
}
