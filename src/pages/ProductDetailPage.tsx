import { ArrowLeft, ChevronRight, Heart, Minus, Plus, ThumbsUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProduct } from '@/api/product'
import { getReviews, toggleReviewLike } from '@/api/review'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import type { ProductDetailResponse, Review } from '@/types/api'

function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const addToCart = useCartStore((state) => state.addItem)
  const toggleWish = useWishlistStore((state) => state.toggle)

  const [product, setProduct] = useState<ProductDetailResponse | null>(null)
  const wished = useWishlistStore((state) => state.items.some((item) => item.id === product?.productId))
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState<Review[]>([])
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setQuantity(1)
    setReviews([])
    setShowAllReviews(false)

    getProduct(Number(productId))
      .then(({ data }) => setProduct(data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))

    getReviews(Number(productId))
      .then(({ data }) => setReviews(data.data.reviews))
      .catch(() => {})
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
  // 백엔드가 항상 [대표 이미지, 상세 이미지] 순서로 내려줌
  const mainImage = images[0]
  const subImages = images.slice(1)

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

  const handleBuyNow = () => {
    if (stock === 0) return
    navigate('/checkout', {
      state: {
        fromCart: false,
        items: [
          {
            productId: product.productId,
            name: product.name,
            thumbnail: mainImage ?? '',
            salePrice: product.salePrice,
            quantity,
          },
        ],
      },
    })
  }

  const toggleHelpful = (reviewId: number) => {
    toggleReviewLike(reviewId)
      .then(({ data }) => {
        setReviews((prev) =>
          prev.map((review) =>
            review.reviewId === reviewId
              ? { ...review, helpCount: data.data.helpCount, helped: data.data.liked }
              : review,
          ),
        )
      })
      .catch(() => {})
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

      {/* 메인 이미지 */}
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gray-100">
        {mainImage && <img src={mainImage} alt={product.name} className="h-full w-full object-cover" />}
        {stock === 0 && (
          <span className="text-body-5 absolute rounded-full bg-black/60 px-4 py-2 text-white">품절된 상품입니다</span>
        )}
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

      {subImages.length > 0 && (
        <>
          <div className="h-2 bg-gray-100" />
          {/* 상세 이미지 */}
          <div className="flex flex-col">
            {subImages.map((src, i) => (
              <img key={src} src={src} alt={`${product.name} 상세 이미지 ${i + 1}`} loading="lazy" className="w-full" />
            ))}
          </div>
        </>
      )}

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
          {visibleReviews.length === 0 ? (
            <li className="text-body-9 py-6 text-center text-gray-300">아직 작성된 리뷰가 없습니다</li>
          ) : (
            visibleReviews.map((review) => (
              <li key={review.reviewId} className="border-b border-gray-100 py-4 last:border-none">
                <div className="flex items-center justify-between">
                  <p className="text-body-9 text-black">{review.userName}</p>
                  <p className="text-body-11 text-black">★ {review.rating}</p>
                </div>
                <p className="text-body-8 mt-1.5 text-black">{review.content}</p>
                <button
                  type="button"
                  onClick={() => toggleHelpful(review.reviewId)}
                  className={`text-body-11 mt-2 flex items-center gap-1 ${review.helped ? 'text-primary-200' : 'text-gray-300'}`}
                >
                  <ThumbsUp size={12} /> 도움이 돼요 {review.helpCount}
                </button>
              </li>
            ))
          )}
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
