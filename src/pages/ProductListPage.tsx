import { ArrowLeft, ChevronDown, Loader2, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getProducts } from '@/api/product'
import type { Product } from '@/types/api'

const SORT_OPTIONS = [
  { value: 'rating', label: '랭킹순' },
  { value: 'latest', label: '최신순' },
  { value: 'priceAsc', label: '최저가순' },
] as const

type SortValue = (typeof SORT_OPTIONS)[number]['value']

function ProductListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') ?? ''

  const [sort, setSort] = useState<SortValue>('rating')
  const [sortOpen, setSortOpen] = useState(false)
  const [items, setItems] = useState<Product[]>([])
  const [page, setPage] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // 검색어나 정렬이 바뀌면 목록을 처음부터 새로 조회한다
  useEffect(() => {
    setLoading(true)
    setFailed(false)
    getProducts({ keyword: keyword || undefined, sort, page: 0 })
      .then(({ data }) => {
        setItems(data.data.products)
        setPage(0)
        setHasNext(data.data.hasNext)
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }, [keyword, sort])

  useEffect(() => {
    const target = sentinelRef.current
    if (!hasNext || loading || !target) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const nextPage = page + 1
      setLoading(true)
      getProducts({ keyword: keyword || undefined, sort, page: nextPage })
        .then(({ data }) => {
          setItems((prev) => [...prev, ...data.data.products])
          setPage(nextPage)
          setHasNext(data.data.hasNext)
        })
        .catch(() => setFailed(true))
        .finally(() => setLoading(false))
    })
    observer.observe(target)

    return () => observer.disconnect()
  }, [hasNext, loading, page, keyword, sort])

  return (
    <div className="bg-white">
      {/* 뒤로가기 + 검색창 */}
      <div className="flex items-center gap-2 px-4 py-3">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기" className="shrink-0 text-black">
          <ArrowLeft size={22} />
        </button>
        <button
          type="button"
          onClick={() => navigate('/search')}
          className="flex flex-1 items-center gap-2 rounded-full border-2 border-black px-4 py-2.5"
        >
          <Search size={16} className="shrink-0 text-black" />
          <span className="text-body-6 flex-1 truncate text-left text-gray-300">
            {keyword || '앱팡에서 검색하세요!'}
          </span>
        </button>
      </div>

      {keyword && <h1 className="text-title-5 px-4 pb-2 text-black">&apos;{keyword}&apos; 검색결과</h1>}

      {/* 개수 + 정렬 */}
      <div className="flex items-center justify-between px-4 pb-2">
        <p className="text-body-9 text-gray-300">전체 {items.length}개</p>
        <div className="relative">
          <button type="button" onClick={() => setSortOpen((v) => !v)} className="flex items-center gap-1 text-black">
            <span className="text-body-8">{SORT_OPTIONS.find((o) => o.value === sort)?.label}</span>
            <ChevronDown size={16} />
          </button>
          {sortOpen && (
            <div className="absolute top-full right-0 z-10 mt-1 w-28 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSort(option.value)
                    setSortOpen(false)
                  }}
                  className={`text-body-8 block w-full px-3 py-2 text-left ${
                    sort === option.value ? 'text-primary-200' : 'text-black'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {items.length === 0 && (failed || !loading) ? (
        <p className="text-body-8 py-24 text-center text-gray-300">
          {failed ? '상품을 불러오지 못했습니다' : '등록된 상품이 없습니다'}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-4 py-2">
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

          <div ref={sentinelRef} className="flex items-center justify-center py-6">
            {loading && <Loader2 size={20} className="animate-spin text-gray-300" />}
            {!hasNext && !loading && items.length > 0 && <span className="text-body-9 text-gray-300">마지막 상품입니다</span>}
          </div>
        </>
      )}
    </div>
  )
}

export default ProductListPage
