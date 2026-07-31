import instance from '@/api/instance'
import type { ApiResponse, ReviewLikeResponse, ReviewListResponse } from '@/types/api'

export type CreateReviewRequest = {
  orderId: number
  productId: number
  rating: number
  content: string
  imageUrls?: string[]
}

export function getReviews(productId: number, page = 0) {
  return instance.get<ApiResponse<ReviewListResponse>>(`/api/products/${productId}/reviews`, { params: { page } })
}

export function createReview(payload: CreateReviewRequest) {
  return instance.post<ApiResponse<{ reviewId: number }>>('/api/reviews', payload)
}

export function updateReview(reviewId: number, rating: number, content: string, imageUrls?: string[]) {
  //imageUrls는 "수정 후 남아야 할 최종 목록" — 백엔드가 이 목록으로 덮어쓰고, 빠진 파일은 GC 배치가 회수한다
  return instance.patch<ApiResponse<void>>(`/api/reviews/${reviewId}`, { rating, content, imageUrls })
}

export function deleteReview(reviewId: number) {
  return instance.delete<ApiResponse<void>>(`/api/reviews/${reviewId}`)
}

export function toggleReviewLike(reviewId: number) {
  return instance.post<ApiResponse<ReviewLikeResponse>>(`/api/reviews/${reviewId}/likes`)
}
