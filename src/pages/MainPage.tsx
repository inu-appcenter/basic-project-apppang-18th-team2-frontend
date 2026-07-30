import {
  BookOpen,
  CookingPot,
  Dumbbell,
  PenTool,
  Search,
  Shirt,
  ShoppingBag,
  Sparkles,
  Tv,
  Utensils,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBanners } from '@/api/banner'
import type { Banner } from '@/types/api'

// 특가 1개 + 나머지 9개 카테고리. categoryId 실매핑은 백엔드 카테고리 테이블 생성 후 연결 예정
const categories = [
  { label: '오늘특가', path: '/category/deal', icon: <Zap size={36} /> },
  { label: '생활용품', path: '/category/life', icon: <ShoppingBag size={36} /> },
  { label: '가전디지털', path: '/category/digital', icon: <Tv size={36} /> },
  { label: '식품', path: '/category/food', icon: <Utensils size={36} /> },
  { label: '패션의류', path: '/category/fashion', icon: <Shirt size={36} /> },
  { label: '도서', path: '/category/book', icon: <BookOpen size={36} /> },
  { label: '문구', path: '/category/stationery', icon: <PenTool size={36} /> },
  { label: '주방용품', path: '/category/kitchen', icon: <CookingPot size={36} /> },
  { label: '뷰티', path: '/category/beauty', icon: <Sparkles size={36} /> },
  { label: '헬스/건강식품', path: '/category/health', icon: <Dumbbell size={36} /> },
]

function MainPage() {
  const navigate = useNavigate()
  const [banners, setBanners] = useState<Banner[]>([])
  const [current, setCurrent] = useState(0)
  const [resetSignal, setResetSignal] = useState(0)
  const startX = useRef(0)

  useEffect(() => {
    getBanners()
      .then(({ data }) => setBanners(data.data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return undefined
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 3000)
    return () => clearInterval(timer)
    // resetSignal이 바뀔 때마다(수동 조작 시) 자동 전환 타이머를 처음부터 다시 시작한다
  }, [banners.length, resetSignal])

  const goToSlide = (i: number) => {
    setCurrent(i)
    setResetSignal((s) => s + 1)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (banners.length <= 1) return
    const diff = startX.current - e.changedTouches[0].clientX
    if (diff > 50) goToSlide((current + 1) % banners.length)
    else if (diff < -50) goToSlide((current - 1 + banners.length) % banners.length)
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
        </button>
      </div>

      {/* 배너 슬라이더 */}
      {banners.length > 0 && (
        <div className="relative h-52 overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="flex h-full transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
            {banners.map((banner) => (
              <button
                key={banner.bannerId}
                type="button"
                onClick={() => navigate(banner.targetUrl || '/products')}
                className="bg-secondary-100 flex h-full min-w-full items-center justify-center"
              >
                <img src={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="absolute bottom-4 left-0 flex w-full items-center justify-center gap-2">
            {banners.map((banner, i) => (
              <button
                key={banner.bannerId}
                type="button"
                onClick={() => goToSlide(i)}
                aria-label={`배너 ${i + 1}`}
                className={`h-2 w-2 rounded-full ${i === current ? 'bg-black' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 카테고리 */}
      <div className="grid grid-cols-5 px-2 py-4">
        {categories.map((cat) => (
          <button key={cat.label} type="button" onClick={() => navigate(cat.path)} className="flex flex-col items-center gap-1.5 py-3 text-black">
            {cat.icon}
            <span className="text-[11px] leading-tight break-keep">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default MainPage
