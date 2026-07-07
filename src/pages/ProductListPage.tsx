import { ArrowLeft, ChevronDown, Loader2, Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const products = [
  { id: 1, name: '남성 경량 구스다운 패딩 점퍼', price: 61000, originPrice: 89000, sale: 31, rating: 4.8, reviews: 2104 },
  { id: 2, name: '베이직 니트 스웨터', price: 34900, rating: 4.6, reviews: 881 },
  { id: 3, name: '무선 핸디 청소기', price: 135150, originPrice: 159000, sale: 15, rating: 4.9, reviews: 540 },
  { id: 4, name: '플리스 머플러 세트', price: 14500, rating: 4.7, reviews: 312 },
  { id: 5, name: '오버핏 울 코트', price: 92800, originPrice: 129000, sale: 28, rating: 4.7, reviews: 1028 },
  { id: 6, name: '와이드 슬랙스', price: 29400, originPrice: 49000, sale: 40, rating: 4.5, reviews: 640 },
  { id: 7, name: '레더 첼시 부츠', price: 79000, rating: 4.6, reviews: 774 },
  { id: 8, name: '캐시미어 머플러', price: 24500, originPrice: 35000, sale: 30, rating: 4.9, reviews: 312 },
  { id: 9, name: '데일리 크로스백', price: 45000, rating: 4.4, reviews: 189 },
  { id: 10, name: '무선 블루투스 이어폰', price: 89000, originPrice: 119000, sale: 25, rating: 4.7, reviews: 3021, soldOut: true },
  { id: 11, name: '가습기 대용량', price: 42000, rating: 4.3, reviews: 456 },
  { id: 12, name: '캠핑 감성 의자', price: 38000, originPrice: 52000, sale: 27, rating: 4.5, reviews: 231 },
  { id: 13, name: '겨울 원피스', price: 41000, rating: 4.6, reviews: 512 },
  { id: 14, name: '남성 운동화', price: 59000, originPrice: 79000, sale: 25, rating: 4.4, reviews: 998 },
  { id: 15, name: '기계식 키보드', price: 68000, rating: 4.8, reviews: 1204, soldOut: true },
  { id: 16, name: '핸드크림 세트', price: 18900, originPrice: 25000, sale: 24, rating: 4.6, reviews: 662 },
  { id: 17, name: '숏패딩 조끼', price: 47000, rating: 4.5, reviews: 289 },
  { id: 18, name: '무선 청소기 스탠드형', price: 178000, originPrice: 219000, sale: 19, rating: 4.7, reviews: 402 },
  { id: 19, name: '니트 가디건', price: 33000, rating: 4.5, reviews: 175 },
  { id: 20, name: '겨울 장갑 세트', price: 12900, originPrice: 17900, sale: 28, rating: 4.4, reviews: 320 },
  { id: 21, name: '루즈핏 후드티', price: 27900, rating: 4.6, reviews: 830 },
  { id: 22, name: '전기 요 매트', price: 55000, originPrice: 69000, sale: 20, rating: 4.7, reviews: 561 },
  { id: 23, name: '겨울 부츠컷 팬츠', price: 31000, rating: 4.3, reviews: 142 },
  { id: 24, name: '무릎담요', price: 15900, originPrice: 21900, sale: 27, rating: 4.8, reviews: 720 },
]

const SORT_OPTIONS = [
  { value: 'rank', label: '랭킹순' },
  { value: 'latest', label: '최신순' },
  { value: 'price', label: '최저가순' },
] as const

type SortValue = (typeof SORT_OPTIONS)[number]['value']

const PAGE_SIZE = 8

function ProductListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') ?? ''

  const [sort, setSort] = useState<SortValue>('rank')
  const [sortOpen, setSortOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const list = keyword ? products.filter((p) => p.name.includes(keyword)) : products
    if (sort === 'latest') return [...list].sort((a, b) => b.id - a.id)
    if (sort === 'price') return [...list].sort((a, b) => a.price - b.price)
    return [...list].sort((a, b) => b.rating - a.rating)
  }, [keyword, sort])

  // 검색어나 정렬이 바뀌면 목록을 처음부터 다시 보여준다
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [keyword, sort])

  const visibleItems = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  useEffect(() => {
    const target = sentinelRef.current
    if (!hasMore || !target) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLoading(true)
        setTimeout(() => {
          setVisibleCount((count) => count + PAGE_SIZE)
          setLoading(false)
        }, 500)
      }
    })
    observer.observe(target)

    return () => observer.disconnect()
  }, [hasMore])

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
        <p className="text-body-9 text-gray-300">전체 {filtered.length}개</p>
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

      {filtered.length === 0 ? (
        <p className="text-body-8 py-24 text-center text-gray-300">등록된 상품이 없습니다</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-4 py-2">
            {visibleItems.map((item) => (
              <button key={item.id} type="button" onClick={() => navigate(`/products/${item.id}`)} className="text-left">
                <div className={`relative aspect-square w-full overflow-hidden rounded-xl ${item.id % 2 === 0 ? 'bg-primary-100' : 'bg-secondary-100'}`}>
                  {item.sale && !item.soldOut && (
                    <span className="text-body-11 absolute top-0 left-0 rounded-br-lg bg-black px-2 py-1 text-white">
                      {item.sale}%
                    </span>
                  )}
                  {item.soldOut && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="text-body-7 text-white">품절</span>
                    </div>
                  )}
                </div>
                <p className={`text-body-8 mt-2 ${item.soldOut ? 'text-gray-300' : 'text-black'}`}>{item.name}</p>
                {item.originPrice && (
                  <p className="text-body-11 text-gray-300 line-through">{item.originPrice.toLocaleString()}원</p>
                )}
                <p className={`text-body-5 ${item.soldOut ? 'text-gray-300' : 'text-black'}`}>
                  {item.price.toLocaleString()}원
                </p>
                <p className="text-body-11 text-black">
                  ★ {item.rating} <span className="text-gray-300">({item.reviews.toLocaleString()})</span>
                </p>
              </button>
            ))}
          </div>

          <div ref={sentinelRef} className="flex items-center justify-center py-6">
            {loading && <Loader2 size={20} className="animate-spin text-gray-300" />}
            {!hasMore && !loading && <span className="text-body-9 text-gray-300">마지막 상품입니다</span>}
          </div>
        </>
      )}
    </div>
  )
}

export default ProductListPage
