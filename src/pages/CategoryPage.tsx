import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const products = [
  { id: 1, name: '오버핏 울 코트', price: 92800, originPrice: 129000, sale: 28, rating: 4.7, reviews: 1028 },
  { id: 2, name: '베이직 니트 스웨터', price: 34900, rating: 4.8, reviews: 2560 },
  { id: 3, name: '와이드 슬랙스', price: 29400, originPrice: 49000, sale: 40, rating: 4.5, reviews: 640 },
  { id: 4, name: '레더 첼시 부츠', price: 79000, rating: 4.6, reviews: 774 },
  { id: 5, name: '캐시미어 머플러', price: 24500, originPrice: 35000, sale: 30, rating: 4.9, reviews: 312 },
  { id: 6, name: '데일리 크로스백', price: 45000, rating: 4.4, reviews: 189 },
]

const BANNER_COUNT = 5

function CategoryPage() {
  const navigate = useNavigate()
  const { categoryName } = useParams()
  const [current, setCurrent] = useState(0)
  const startX = useRef(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % BANNER_COUNT)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

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

      <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-4 py-5">
        {products.map((p) => (
          <button key={p.id} type="button" onClick={() => navigate(`/products/${p.id}`)} className="text-left">
            <div className={`relative aspect-square w-full overflow-hidden rounded-xl ${p.id % 2 === 0 ? 'bg-primary-100' : 'bg-secondary-100'}`}>
              {p.sale && (
                <span className="text-body-11 absolute top-0 left-0 rounded-br-lg bg-black px-2 py-1 text-white">
                  {p.sale}%
                </span>
              )}
            </div>
            <p className="text-body-8 mt-2 text-black">{p.name}</p>
            {p.originPrice && (
              <p className="text-body-11 text-gray-300 line-through">{p.originPrice.toLocaleString()}원</p>
            )}
            <p className="text-body-5 text-black">{p.price.toLocaleString()}원</p>
            <p className="text-body-11 text-black">
              ★ {p.rating} <span className="text-gray-300">({p.reviews.toLocaleString()})</span>
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryPage
