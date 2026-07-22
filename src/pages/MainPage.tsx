import { Camera, Gift, Globe, Grid3x3, Search, Shirt, ShoppingBag, Sparkles, Tag, Utensils, Watch, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBanners } from '@/api/banner'
import type { Banner } from '@/types/api'

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

function MainPage() {
  const navigate = useNavigate()
  const [banners, setBanners] = useState<Banner[]>([])
  const [current, setCurrent] = useState(0)
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
  }, [banners.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (banners.length <= 1) return
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
                onClick={() => setCurrent(i)}
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
