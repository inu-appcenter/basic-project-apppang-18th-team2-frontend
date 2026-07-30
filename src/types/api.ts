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
export type OrderStatus = 'PENDING' | 'PAID' | 'PREPARING' | 'DELIVERING' | 'DELIVERED' | 'CANCELED'

export type OrderSummary = {
  orderId: number
  orderedAt: string
  orderStatus: OrderStatus
  paymentStatus: string | null
  totalPrice: number
  thumbnail: string
  productName: string
  itemCount: number
}

export type OrderListResponse = {
  orders: OrderSummary[]
  page: number
  hasNext: boolean
}

export type OrderDetailResponse = {
  orderId: number
  orderedAt: string
  orderStatus: OrderStatus
  payment: {
    paymentMethod: string | null
    paymentStatus: string | null
    paidAt: string | null
  }
  receiver: {
    name: string
    phone: string
  }
  address: {
    roadAddress: string
    detailAddress: string
  }
  items: {
    productId: number
    productName: string
    thumbnail: string
    originalPrice: number
    discountRate: number
    salePrice: number
    quantity: number
    totalPrice: number
  }[]
  summary: {
    productPrice: number
    deliveryFee: number
    discountPrice: number
    totalPrice: number
  }
}

export type DeliveryResponse = {
  orderId: number
  status: OrderStatus
  trackingNumber: string
  deliveryCompany: string
  estimatedArrival: string
}

export type OrderItem = {
  productId: number
  quantity: number
}

export type CreateOrderResponse = {
  orderId: number
  totalPrice: number
}

// PAYMENT
export type PaymentMethod = 'CARD' | 'KAKAO_PAY' | 'TOSS_PAY'

export type PaymentResponse = {
  paymentId: number
  orderId: number
  amount: number
  paymentMethod: string
  paymentStatus: string
  paidAt: string
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

export type ReviewListResponse = {
  reviews: Review[]
  page: number
  hasNext: boolean
}

export type ReviewLikeResponse = {
  liked: boolean
  helpCount: number
}

// BANNER
export type Banner = {
  bannerId: number
  title: string
  imageUrl: string
  targetUrl: string
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
