import { ArrowLeft, ChevronRight, Heart, Minus, Plus, ThumbsUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProduct } from '@/api/product'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import type { ProductDetailResponse } from '@/types/api'

const REVIEW_TEMPLATES = [
  { author: '김**', rating: 5, content: '생각보다 훨씬 좋아요. 배송도 빠르고 만족스러운 구매였습니다.' },
  { author: '이**', rating: 4, content: '가격 대비 품질 괜찮습니다. 재구매 의사 있어요.' },
  { author: '박**', rating: 5, content: '사진이랑 실물이랑 거의 똑같아요. 다음에 또 살 것 같아요.' },
  { author: '최**', rating: 4, content: '무난하게 잘 쓰고 있습니다. 다만 배송이 조금 늦었어요.' },
]

function buildReviews() {
  return REVIEW_TEMPLATES.map((review, i) => ({ id: i, ...review, helpful: (i + 1) * 3, helped: false }))
}

function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const addToCart = useCartStore((state) => state.addItem)
  const toggleWish = useWishlistStore((state) => state.toggle)

  const [product, setProduct] = useState<ProductDetailResponse | null>(null)
  const wished = useWishlistStore((state) => state.items.some((item) => item.id === product?.productId))
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState(buildReviews)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [toast, setToast] = useState('')
  const startX = useRef(0)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setCurrentImage(0)
    setQuantity(1)
    setReviews(buildReviews())
    setShowAllReviews(false)

    getProduct(Number(productId))
      .then(({ data }) => setProduct(data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [productId])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 1600)
    return () => clearTimeout(timer)
  }, [toast])

  if (loading) return null

  if (notFound || !product) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-body-6 text-gray-300">존재하지 않는 상품입니다</p>
        <button type="button" onClick={() => navigate('/')} className="bg-primary-200 text-body-5 rounded-lg px-6 py-3 text-white">
          홈으로 가기
        </button>
      </div>
    )
  }

  const { stock } = product
  const images = product.images.filter(Boolean)
  const imageCount = Math.max(images.length, 1)

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startX.current - e.changedTouches[0].clientX
    if (diff > 50) setCurrentImage((i) => Math.min(i + 1, imageCount - 1))
    else if (diff < -50) setCurrentImage((i) => Math.max(i - 1, 0))
  }

  const handleToggleWish = () => {
    toggleWish({
      id: product.productId,
      name: product.name,
      price: product.salePrice,
      originPrice: product.discountRate > 0 ? product.originalPrice : undefined,
      rating: product.rating,
      reviews: product.reviewCount,
    }).catch(() => {})
  }

  const handleAddToCart = async () => {
    if (stock === 0) return
    await addToCart(product.productId, quantity)
    setToast('장바구니에 담았습니다')
  }

  const handleBuyNow = async () => {
    if (stock === 0) return
    await addToCart(product.productId, quantity)
    navigate('/checkout')
  }

  const toggleHelpful = (reviewId: number) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + (review.helped ? -1 : 1), helped: !review.helped }
          : review,
      ),
    )
  }

  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 2)

  return (
    <div className="relative bg-white pb-28">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="뒤로가기"
        className="absolute top-3 left-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-black"
      >
        <ArrowLeft size={20} />
      </button>

      {/* 이미지 슬라이더 */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="flex h-full transition-transform duration-300" style={{ transform: `translateX(-${currentImage * 100}%)` }}>
          {Array.from({ length: imageCount }).map((_, i) => (
            <div key={i} className={`flex h-full min-w-full items-center justify-center ${i % 2 === 0 ? 'bg-primary-100' : 'bg-secondary-100'}`}>
              {images[i] && <img src={images[i]} alt={`${product.name} 이미지 ${i + 1}`} className="h-full w-full object-cover" />}
              {stock === 0 && i === 0 && (
                <span className="text-body-5 rounded-full bg-black/60 px-4 py-2 text-white">품절된 상품입니다</span>
              )}
            </div>
          ))}
        </div>
        <div className="absolute bottom-3 left-0 flex w-full justify-center gap-1.5">
          {Array.from({ length: imageCount }).map((_, i) => (
            <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === currentImage ? 'bg-black' : 'bg-white/70'}`} />
          ))}
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="px-4 py-4">
        <h1 className="text-title-5 text-black">{product.name}</h1>
        <div className="mt-2 flex items-center gap-2">
          {product.discountRate > 0 && <span className="text-body-3 text-red-300 font-bold">{product.discountRate}%</span>}
          <span className="text-title-4 text-black">{product.salePrice.toLocaleString()}원</span>
        </div>
        {product.discountRate > 0 && <p className="text-body-9 text-gray-300 line-through">{product.originalPrice.toLocaleString()}원</p>}
        <p className="text-body-9 mt-2 text-black">
          ★ {product.rating} <span className="text-gray-300">리뷰 {product.reviewCount.toLocaleString()}개</span>
        </p>
      </div>

      <div className="h-2 bg-gray-100" />

      {/* 수량 */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <p className="text-body-7 text-black">수량</p>
          <div className="flex items-center rounded-full border border-gray-200">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="수량 감소"
              className="px-3 py-1.5 text-black"
            >
              <Minus size={14} />
            </button>
            <span className="text-body-8 w-8 text-center text-black">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
              aria-label="수량 증가"
              className="px-3 py-1.5 text-black"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
        {stock > 0 && quantity >= stock && <p className="text-body-12 mt-1 text-right text-red-300">재고가 부족합니다</p>}
      </div>

      <div className="h-2 bg-gray-100" />

      {/* 상세 설명 */}
      <div className="px-4 py-5">
        <h2 className="text-title-5 mb-3 text-black">상품 정보</h2>
        <p className="text-body-8 text-black">{product.description}</p>
      </div>

      <div className="h-2 bg-gray-100" />

      {/* 리뷰 */}
      <div className="px-4 py-5">
        <div className="flex items-center justify-between">
          <h2 className="text-title-5 text-black">리뷰 ({product.reviewCount.toLocaleString()})</h2>
          {!showAllReviews && reviews.length > 2 && (
            <button type="button" onClick={() => setShowAllReviews(true)} className="text-body-9 flex items-center text-gray-300">
              전체보기 <ChevronRight size={14} />
            </button>
          )}
        </div>

        <ul className="mt-3">
          {visibleReviews.map((review) => (
            <li key={review.id} className="border-b border-gray-100 py-4 last:border-none">
              <div className="flex items-center justify-between">
                <p className="text-body-9 text-black">{review.author}</p>
                <p className="text-body-11 text-black">★ {review.rating}</p>
              </div>
              <p className="text-body-8 mt-1.5 text-black">{review.content}</p>
              <button
                type="button"
                onClick={() => toggleHelpful(review.id)}
                className={`text-body-11 mt-2 flex items-center gap-1 ${review.helped ? 'text-primary-200' : 'text-gray-300'}`}
              >
                <ThumbsUp size={12} /> 도움이 돼요 {review.helpful}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 하단 고정 액션바 */}
      <div className="fixed bottom-16 left-1/2 flex w-full max-w-120 -translate-x-1/2 items-center gap-2 border-t border-gray-100 bg-white px-4 py-3">
        <button
          type="button"
          onClick={handleToggleWish}
          aria-label="찜하기"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-200"
        >
          <Heart size={22} className={wished ? 'text-red-300' : 'text-gray-300'} fill={wished ? 'currentColor' : 'none'} />
        </button>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={stock === 0}
          className="text-body-5 border-primary-200 text-primary-200 flex-1 rounded-lg border py-3 disabled:border-gray-200 disabled:text-gray-300"
        >
          장바구니
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={stock === 0}
          className="bg-primary-200 text-body-5 flex-1 rounded-lg py-3 text-white disabled:bg-gray-200"
        >
          구매하기
        </button>
      </div>

      {toast && (
        <div className="text-body-9 fixed bottom-32 left-1/2 -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-white">
          {toast}
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage
