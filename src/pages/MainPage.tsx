import { Camera, Gift, Globe, Grid3x3, Search, Shirt, ShoppingBag, Sparkles, Tag, Utensils, Watch, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const banners = [
  { id: 1, bg: 'bg-secondary-100' },
  { id: 2, bg: 'bg-primary-100' },
  { id: 3, bg: 'bg-secondary-100' },
  { id: 4, bg: 'bg-primary-100' },
  { id: 5, bg: 'bg-secondary-100' },
]

const categories = [
  { label: '자주 산 상품', path: '/category/frequent', icon: <ShoppingBag size={36} /> },
  { label: '베스트', path: '/category/best', icon: <Sparkles size={36} /> },
  { label: '신상품', path: '/category/new', icon: <Tag size={36} /> },
  { label: '오늘특가', path: '/category/deal', icon: <Zap size={36} /> },
  { label: '골드박스', path: '/category/goldbox', icon: <Gift size={36} /> },
  { label: '패션', path: '/category/fashion', icon: <Shirt size={36} /> },
  { label: '뷰티', path: '/category/beauty', icon: <Watch size={36} /> },
  { label: '식품', path: '/category/food', icon: <Utensils size={36} /> },
  { label: '전체', path: '/category/all', icon: <Grid3x3 size={36} /> },
  { label: '해외직구', path: '/category/global', icon: <Globe size={36} /> },
]

const recommended = [
  { id: 1, name: '남성 경량 구스다운 패딩', price: 61000, originPrice: 89000, sale: 31, rating: 4.8, reviews: 2104 },
  { id: 2, name: '베이직 니트 스웨터', price: 34900, rating: 4.6, reviews: 881 },
  { id: 3, name: '무선 핸디 청소기', price: 135150, originPrice: 159000, sale: 15, rating: 4.9, reviews: 540 },
  { id: 4, name: '플리스 머플러 세트', price: 14500, rating: 4.7, reviews: 312 },
]

function MainPage() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const startX = useRef(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startX.current - e.changedTouches[0].clientX
    if (diff > 50) setCurrent((prev) => (prev + 1) % banners.length)
    else if (diff < -50) setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <div className="bg-white">
      {/* 검색창 */}
      <div className="px-4 py-3">
        <button
          type="button"
          onClick={() => navigate('/search')}
          className="flex w-full items-center gap-3 rounded-full border-2 border-black px-4 py-3"
        >
          <Search size={16} className="shrink-0 text-black" />
          <span className="text-body-3 flex-1 text-left text-gray-300">앱팡에서 검색하세요!</span>
          <Camera size={24} className="shrink-0 text-black" />
        </button>
      </div>

      {/* 배너 슬라이더 */}
      <div className="relative h-52 overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="flex h-full transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
          {banners.map((banner) => (
            <button key={banner.id} type="button" onClick={() => navigate('/products')} className={`flex h-full min-w-full items-center justify-center ${banner.bg}`}>
              <span className="text-body-2 font-bold text-gray-300">이벤트 배너 {banner.id}</span>
            </button>
          ))}
        </div>
        <div className="absolute bottom-4 left-0 flex w-full items-center justify-center gap-2">
          {banners.map((banner, i) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`배너 ${i + 1}`}
              className={`h-2 w-2 rounded-full ${i === current ? 'bg-black' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </div>

      {/* 카테고리 */}
      <div className="grid grid-cols-5 px-2 py-4">
        {categories.map((cat) => (
          <button key={cat.label} type="button" onClick={() => navigate(cat.path)} className="flex flex-col items-center gap-1.5 py-3 text-black">
            {cat.icon}
            <span className="text-[11px] leading-tight break-keep">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="h-2 bg-gray-100" />

      {/* 오늘의 추천 */}
      <section className="px-4 py-5">
        <h2 className="text-title-5 mb-4 text-black">오늘의 추천</h2>
        <div className="grid grid-cols-2 gap-x-3 gap-y-5">
          {recommended.map((item) => (
            <button key={item.id} type="button" onClick={() => navigate(`/products/${item.id}`)} className="text-left">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                {item.sale && (
                  <span className="text-body-11 absolute top-0 left-0 rounded-br-lg bg-black px-2 py-1 text-white">{item.sale}%</span>
                )}
              </div>
              <p className="text-body-8 mt-2 text-black">{item.name}</p>
              {item.originPrice && <p className="text-body-11 text-gray-300 line-through">{item.originPrice.toLocaleString()}원</p>}
              <p className="text-body-5 text-black">{item.price.toLocaleString()}원</p>
              <p className="text-body-11 text-black">
                ★ {item.rating} <span className="text-gray-300">({item.reviews.toLocaleString()})</span>
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

export default MainPage
