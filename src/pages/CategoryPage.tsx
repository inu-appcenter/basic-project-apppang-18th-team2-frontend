import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProducts } from '@/api/product'
import type { Product } from '@/types/api'

const BANNER_COUNT = 5

function CategoryPage() {
  const navigate = useNavigate()
  const { categoryName } = useParams()
  const [current, setCurrent] = useState(0)
  const startX = useRef(0)

  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % BANNER_COUNT)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // categoryId ↔ 카테고리 슬러그 매핑이 백엔드에 아직 없어 임시로 전체 상품을 보여준다
  useEffect(() => {
    setLoading(true)
    setFailed(false)
    getProducts({ sort: 'rating', page: 0 })
      .then(({ data }) => setItems(data.data.products))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }, [categoryName])

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startX.current - e.changedTouches[0].clientX
    if (diff > 50) setCurrent((c) => (c + 1) % BANNER_COUNT)
    else if (diff < -50) setCurrent((c) => (c - 1 + BANNER_COUNT) % BANNER_COUNT)
  }

  return (
    <div className="bg-white">
      <h1 className="text-title-5 px-4 py-3 text-black">{categoryName ?? '패션'}</h1>

      <div
        className="relative mx-4 h-40 overflow-hidden rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-300"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {Array.from({ length: BANNER_COUNT }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => navigate('/products')}
              className={`flex h-full min-w-full items-center justify-center ${
                i % 2 === 0 ? 'bg-secondary-100' : 'bg-primary-100'
              }`}
            >
              <span className="text-body-3 text-gray-300">이벤트 배너 {i + 1}</span>
            </button>
          ))}
        </div>
        <span className="text-body-11 absolute right-3 bottom-3 rounded-full bg-black/45 px-2 py-1 text-white">
          {current + 1} / {BANNER_COUNT}
        </span>
      </div>

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
