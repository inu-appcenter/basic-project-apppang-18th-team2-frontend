// API 명세 기반 공통 응답 래퍼
export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

// AUTH / USER
export type User = {
  userId: number
  email: string
  name: string
  phone?: string
  profileImage?: string
}

// refreshToken은 응답 바디가 아니라 httpOnly 쿠키로 내려온다.
// 백엔드가 아직 로그인 응답에 user 정보를 포함하지 않아 accessToken만 온다 (2026-07-10 기준 develop 브랜치)
export type LoginResponse = {
  accessToken: string
}

export type SignupRequest = {
  email: string
  password: string
  name: string
  phone: string
  agreeRequiredTerms: boolean
  agreeMarketing: boolean
}

// PRODUCT
export type Product = {
  productId: number
  name: string
  thumbnail: string
  originalPrice: number
  discountRate: number
  salePrice: number
  rating: number
  reviewCount: number
  wish: boolean
}

// CART
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
}

// ORDER
export type OrderStatus = 'PAID' | 'PREPARING' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED'
export type PaymentStatus = 'PAID' | 'PENDING' | 'CANCELLED'

export type OrderSummary = {
  orderId: number
  orderedAt: string
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
  totalPrice: number
  thumbnail: string
  productName: string
  itemCount: number
}

// REVIEW
export type Review = {
  reviewId: number
  userName: string
  rating: number
  content: string
  images: string[]
  createdAt: string
  helpCount: number
  helped: boolean
}

// ADDRESS
export type Address = {
  addressId: number
  receiver: string
  phone: string
  roadAddress: string
  detailAddress: string
  isDefault: boolean
}
