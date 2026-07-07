import { ArrowLeft, ChevronRight, Heart, Minus, Plus, ThumbsUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

const products = [
  { id: 1, name: '남성 경량 구스다운 패딩 점퍼', price: 61000, originPrice: 89000, sale: 31, rating: 4.8, reviews: 2104, stock: 12, options: ['블랙 / M', '블랙 / L', '네이비 / L'] },
  { id: 2, name: '베이직 니트 스웨터', price: 34900, rating: 4.6, reviews: 881, stock: 20, options: ['그레이', '베이지', '블랙'] },
  { id: 3, name: '무선 핸디 청소기', price: 135150, originPrice: 159000, sale: 15, rating: 4.9, reviews: 540, stock: 4, options: ['화이트'] },
  { id: 4, name: '플리스 머플러 세트', price: 14500, rating: 4.7, reviews: 312, stock: 25, options: ['네이비', '베이지'] },
  { id: 5, name: '오버핏 울 코트', price: 92800, originPrice: 129000, sale: 28, rating: 4.7, reviews: 1028, stock: 8, options: ['블랙 / M', '블랙 / L'] },
  { id: 6, name: '와이드 슬랙스', price: 29400, originPrice: 49000, sale: 40, rating: 4.5, reviews: 640, stock: 15, options: ['S', 'M', 'L'] },
  { id: 7, name: '레더 첼시 부츠', price: 79000, rating: 4.6, reviews: 774, stock: 6, options: ['250', '260', '270'] },
  { id: 8, name: '캐시미어 머플러', price: 24500, originPrice: 35000, sale: 30, rating: 4.9, reviews: 312, stock: 3, options: ['그레이', '카멜'] },
  { id: 9, name: '데일리 크로스백', price: 45000, rating: 4.4, reviews: 189, stock: 18, options: ['블랙', '브라운'] },
  { id: 10, name: '무선 블루투스 이어폰', price: 89000, originPrice: 119000, sale: 25, rating: 4.7, reviews: 3021, stock: 0, options: ['화이트', '블랙'], soldOut: true },
  { id: 11, name: '가습기 대용량', price: 42000, rating: 4.3, reviews: 456, stock: 14, options: ['화이트'] },
  { id: 12, name: '캠핑 감성 의자', price: 38000, originPrice: 52000, sale: 27, rating: 4.5, reviews: 231, stock: 9, options: ['카키', '블랙'] },
  { id: 13, name: '겨울 원피스', price: 41000, rating: 4.6, reviews: 512, stock: 11, options: ['S', 'M'] },
  { id: 14, name: '남성 운동화', price: 59000, originPrice: 79000, sale: 25, rating: 4.4, reviews: 998, stock: 16, options: ['260', '270', '280'] },
  { id: 15, name: '기계식 키보드', price: 68000, rating: 4.8, reviews: 1204, stock: 0, options: ['적축', '갈축'], soldOut: true },
  { id: 16, name: '핸드크림 세트', price: 18900, originPrice: 25000, sale: 24, rating: 4.6, reviews: 662, stock: 30, options: ['기본 세트'] },
  { id: 17, name: '숏패딩 조끼', price: 47000, rating: 4.5, reviews: 289, stock: 13, options: ['블랙', '카키'] },
  { id: 18, name: '무선 청소기 스탠드형', price: 178000, originPrice: 219000, sale: 19, rating: 4.7, reviews: 402, stock: 5, options: ['화이트'] },
  { id: 19, name: '니트 가디건', price: 33000, rating: 4.5, reviews: 175, stock: 17, options: ['아이보리', '그레이'] },
  { id: 20, name: '겨울 장갑 세트', price: 12900, originPrice: 17900, sale: 28, rating: 4.4, reviews: 320, stock: 22, options: ['기본 세트'] },
  { id: 21, name: '루즈핏 후드티', price: 27900, rating: 4.6, reviews: 830, stock: 19, options: ['S', 'M', 'L'] },
  { id: 22, name: '전기 요 매트', price: 55000, originPrice: 69000, sale: 20, rating: 4.7, reviews: 561, stock: 7, options: ['싱글', '더블'] },
  { id: 23, name: '겨울 부츠컷 팬츠', price: 31000, rating: 4.3, reviews: 142, stock: 10, options: ['S', 'M', 'L'] },
  { id: 24, name: '무릎담요', price: 15900, originPrice: 21900, sale: 27, rating: 4.8, reviews: 720, stock: 28, options: ['그레이', '베이지'] },
]

const IMAGE_COUNT = 4

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
  const isWished = useWishlistStore((state) => state.isWished)
  const toggleWish = useWishlistStore((state) => state.toggle)

  const product = products.find((p) => p.id === Number(productId))

  const [currentImage, setCurrentImage] = useState(0)
  const [selectedOption, setSelectedOption] = useState(product?.options[0] ?? '')
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState(buildReviews)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [toast, setToast] = useState('')
  const startX = useRef(0)

  useEffect(() => {
    setCurrentImage(0)
    setSelectedOption(product?.options[0] ?? '')
    setQuantity(1)
    setReviews(buildReviews())
    setShowAllReviews(false)
  }, [productId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 1600)
    return () => clearTimeout(timer)
  }, [toast])

  if (!product) {
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
  const wished = isWished(product.id)

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startX.current - e.changedTouches[0].clientX
    if (diff > 50) setCurrentImage((i) => Math.min(i + 1, IMAGE_COUNT - 1))
    else if (diff < -50) setCurrentImage((i) => Math.max(i - 1, 0))
  }

  const handleAddToCart = () => {
    if (stock === 0) return
    addToCart({ id: product.id, name: product.name, option: selectedOption, price: product.price, quantity, stock })
    setToast('장바구니에 담았습니다')
  }

  const handleBuyNow = () => {
    if (stock === 0) return
    addToCart({ id: product.id, name: product.name, option: selectedOption, price: product.price, quantity, stock })
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
          {Array.from({ length: IMAGE_COUNT }).map((_, i) => (
            <div key={i} className={`flex h-full min-w-full items-center justify-center ${i % 2 === 0 ? 'bg-primary-100' : 'bg-secondary-100'}`}>
              {stock === 0 && i === 0 && (
                <span className="text-body-5 rounded-full bg-black/60 px-4 py-2 text-white">품절된 상품입니다</span>
              )}
            </div>
          ))}
        </div>
        <div className="absolute bottom-3 left-0 flex w-full justify-center gap-1.5">
          {Array.from({ length: IMAGE_COUNT }).map((_, i) => (
            <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === currentImage ? 'bg-black' : 'bg-white/70'}`} />
          ))}
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="px-4 py-4">
        <h1 className="text-title-5 text-black">{product.name}</h1>
        <div className="mt-2 flex items-center gap-2">
          {product.sale && <span className="text-body-3 text-red-300 font-bold">{product.sale}%</span>}
          <span className="text-title-4 text-black">{product.price.toLocaleString()}원</span>
        </div>
        {product.originPrice && <p className="text-body-9 text-gray-300 line-through">{product.originPrice.toLocaleString()}원</p>}
        <p className="text-body-9 mt-2 text-black">
          ★ {product.rating} <span className="text-gray-300">리뷰 {product.reviews.toLocaleString()}개</span>
        </p>
      </div>

      <div className="h-2 bg-gray-100" />

      {/* 옵션 & 수량 */}
      <div className="px-4 py-4">
        <p className="text-body-7 mb-2 text-black">옵션</p>
        <div className="flex flex-wrap gap-2">
          {product.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSelectedOption(option)}
              className={`text-body-9 rounded-full border px-3 py-1.5 ${
                selectedOption === option ? 'border-primary-200 bg-primary-100 text-primary-200' : 'border-gray-200 text-black'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
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
        <p className="text-body-8 text-black">
          {product.name}, 지금 가장 인기 있는 상품이에요. 꼼꼼한 검수를 거쳐 안전하게 배송해 드립니다.
        </p>
        <div className="mt-4 space-y-2">
          <div className="aspect-[4/3] w-full rounded-xl bg-primary-100" />
          <div className="aspect-[4/3] w-full rounded-xl bg-secondary-100" />
        </div>
      </div>

      <div className="h-2 bg-gray-100" />

      {/* 리뷰 */}
      <div className="px-4 py-5">
        <div className="flex items-center justify-between">
          <h2 className="text-title-5 text-black">리뷰 ({product.reviews.toLocaleString()})</h2>
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
          onClick={() => toggleWish({ id: product.id, name: product.name, price: product.price, originPrice: product.originPrice, rating: product.rating, reviews: product.reviews })}
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
