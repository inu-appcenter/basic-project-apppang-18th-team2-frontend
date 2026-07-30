import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBanners } from '@/api/banner'
import { getProducts, type ProductListParams } from '@/api/product'
import type { Banner, Product } from '@/types/api'

// 카테고리 테이블이 백엔드에 아직 없어서(추가 예정, 추가되면 DB 초기화됨) categoryId로는 필터링 못함.
// "오늘특가"만 discountOnly 쿼리로 실제 필터링되고, 나머지는 라벨만 맞춰두고 전체 상품을 보여준다.
// 카테고리 테이블 생기면 각 슬러그에 실제 categoryId만 채우면 됨.
const CATEGORY_CONFIG: Record<string, { title: string; params: Partial<ProductListParams> }> = {
  deal: { title: '오늘특가', params: { discountOnly: true } },
  life: { title: '생활용품', params: {} },
  digital: { title: '가전디지털', params: {} },
  food: { title: '식품', params: {} },
  fashion: { title: '패션의류', params: {} },
  book: { title: '도서', params: {} },
  stationery: { title: '문구', params: {} },
  kitchen: { title: '주방용품', params: {} },
  beauty: { title: '뷰티', params: {} },
  health: { title: '헬스/건강식품', params: {} },
}

function CategoryPage() {
  const navigate = useNavigate()
  const { categoryName } = useParams()
  const [banners, setBanners] = useState<Banner[]>([])
  const [current, setCurrent] = useState(0)
  const startX = useRef(0)

  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    getBanners()
      .then(({ data }) => setBanners(data.data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return undefined
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [banners.length])

  const config = CATEGORY_CONFIG[categoryName ?? ''] ?? { title: categoryName ?? '카테고리', params: {} }

  useEffect(() => {
    setLoading(true)
    setFailed(false)
    getProducts({ page: 0, ...config.params })
      .then(({ data }) => setItems(data.data.products))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryName])

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (banners.length <= 1) return
    const diff = startX.current - e.changedTouches[0].clientX
    if (diff > 50) setCurrent((c) => (c + 1) % banners.length)
    else if (diff < -50) setCurrent((c) => (c - 1 + banners.length) % banners.length)
  }

  return (
    <div className="bg-white">
      <h1 className="text-title-5 px-4 py-3 text-black">{config.title}</h1>

      {banners.length > 0 && (
        <div
          className="relative mx-4 h-40 overflow-hidden rounded-2xl"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex h-full transition-transform duration-300"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
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
          <span className="text-body-11 absolute right-3 bottom-3 rounded-full bg-black/45 px-2 py-1 text-white">
            {current + 1} / {banners.length}
          </span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={20} className="animate-spin text-gray-300" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-body-8 py-24 text-center text-gray-300">
          {failed ? '상품을 불러오지 못했습니다' : '등록된 상품이 없습니다'}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-4 py-5">
          {items.map((item) => (
            <button key={item.productId} type="button" onClick={() => navigate(`/products/${item.productId}`)} className="text-left">
              <div className={`relative aspect-square w-full overflow-hidden rounded-xl ${item.productId % 2 === 0 ? 'bg-primary-100' : 'bg-secondary-100'}`}>
                {item.thumbnail && (
                  <img src={item.thumbnail} alt={item.name} className="h-full w-full object-cover" />
                )}
                {item.discountRate > 0 && (
                  <span className="text-body-11 absolute top-0 left-0 rounded-br-lg bg-black px-2 py-1 text-white">
                    {item.discountRate}%
                  </span>
                )}
              </div>
              <p className="text-body-8 mt-2 text-black">{item.name}</p>
              {item.discountRate > 0 && (
                <p className="text-body-11 text-gray-300 line-through">{item.originalPrice.toLocaleString()}원</p>
              )}
              <p className="text-body-5 text-black">{item.salePrice.toLocaleString()}원</p>
              <p className="text-body-11 text-black">
                ★ {item.rating} <span className="text-gray-300">({item.reviewCount.toLocaleString()})</span>
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryPage
