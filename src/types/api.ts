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

// refreshToken은 응답 바디뿐 아니라 httpOnly 쿠키로도 내려온다 (쿠키가 실제 갱신에 쓰이는 값)
export type LoginResponse = {
  accessToken: string
  refreshToken: string
  user: {
    userId: number
    email: string
  }
}

export type SignupRequest = {
  email: string
  password: string
  name: string
  phone: string
  agreeRequiredTerms: boolean
  agreeMarketing: boolean
}

export type EmailCheckResponse = {
  available: boolean
}

export type FindIdRequest = {
  name: string
  phone: string
}

export type FindIdResponse = {
  email: string
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

export type ProductListResponse = {
  products: Product[]
  page: number
  hasNext: boolean
}

export type ProductDetailResponse = {
  productId: number
  name: string
  originalPrice: number
  discountRate: number
  salePrice: number
  stock: number
  rating: number
  reviewCount: number
  wish: boolean
  description: string
  images: string[]
}

// WISHLIST
export type WishlistResponse = {
  products: Product[]
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

export type CartResponse = {
  items: CartItem[]
  totalPrice: number
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

// BANNER
export type Banner = {
  bannerId: number
  title: string
  imageUrl: string
  targetUrl: string
}

// ADDRESS
// 백엔드 AddressResponse의 boolean 필드 isDefault가 Lombok+Jackson 직렬화 과정에서 "default"로 내려옴
export type Address = {
  addressId: number
  receiver: string
  phone: string
  roadAddress: string
  detailAddress: string
  default: boolean
}
