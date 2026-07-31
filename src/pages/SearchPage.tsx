import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAutocomplete, getPopular } from '@/api/search'
import { useSearchStore } from '@/store/searchStore'

function SearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [popular, setPopular] = useState<string[]>([])
  const recent = useSearchStore((state) => state.recent)
  const addRecent = useSearchStore((state) => state.addRecent)
  const removeRecent = useSearchStore((state) => state.removeRecent)
  const clearRecent = useSearchStore((state) => state.clearRecent)
  const [suggestions, setSuggestions] = useState<string[]>([])

  // 진입 시 실제 검색 집계 기반 인기 검색어 조회 (Redis ZSET 순위)
  useEffect(() => {
    getPopular()
      .then(({ data }) => setPopular(data.data))
      .catch(() => setPopular([]))
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      return undefined
    }
    const timer = setTimeout(() => {
      getAutocomplete(query)
        .then(({ data }) => setSuggestions(data.data))
        .catch(() => setSuggestions([]))
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const search = (keyword: string) => {
    if (!keyword.trim()) return
    addRecent(keyword)
    navigate(`/products?keyword=${encodeURIComponent(keyword)}`)
  }

  return (
    <div className="bg-white">
      {/* 검색 입력 */}
      <div className="px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            search(query)
          }}
          className="flex items-center gap-2 rounded-full border-2 border-black px-4 py-2.5"
        >
          <Search size={18} className="shrink-0 text-black" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="상품을 검색해보세요"
            autoFocus
            className="text-body-6 flex-1 outline-none placeholder:text-gray-300"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="입력 지우기" className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
              <X size={12} className="text-white" />
            </button>
          )}
        </form>
      </div>

      {query ? (
        // 자동완성 / 연관 검색어
        <ul>
          {suggestions.length > 0 ? (
            suggestions.map((word) => {
              const matchIndex = word.indexOf(query)
              return (
                <li key={word}>
                  <button type="button" onClick={() => search(word)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
                    <Search size={16} className="shrink-0 text-gray-300" />
                    <span className="text-body-6 text-black">
                      {word.slice(0, matchIndex)}
                      <span className="text-primary-200 font-bold">{query}</span>
                      {word.slice(matchIndex + query.length)}
                    </span>
                  </button>
                </li>
              )
            })
          ) : (
            <li className="text-body-8 px-4 py-10 text-center text-gray-300">검색 결과가 없습니다</li>
          )}
        </ul>
      ) : (
        <>
          {/* 최근 검색어 */}
          <section className="px-4 pt-2 pb-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-body-5 text-black">최근 검색어</h2>
              {recent.length > 0 && (
                <button type="button" onClick={clearRecent} className="text-body-9 text-gray-300">
                  전체 삭제
                </button>
              )}
            </div>
            {recent.length > 0 ? (
              // 줄바꿈 대신 한 줄 가로 슬라이드 — 개수가 늘어도 세로 공간을 차지하지 않는다 (스크롤바는 숨김)
              <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {recent.map((word) => (
                  <div key={word} className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 py-1.5 pr-2 pl-3 whitespace-nowrap">
                    <button type="button" onClick={() => search(word)} className="text-body-8 text-black">
                      {word}
                    </button>
                    <button type="button" onClick={() => removeRecent(word)} aria-label={`${word} 삭제`}>
                      <X size={14} className="text-gray-300" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body-9 py-6 text-center text-gray-300">최근 검색어가 없습니다</p>
            )}
          </section>

          <div className="h-2 bg-gray-100" />

          {/* 인기 검색어 */}
          <section className="px-4 py-5">
            <h2 className="text-body-5 mb-3 text-black">인기 검색어</h2>
            {popular.length === 0 ? (
              <p className="text-body-9 py-6 text-center text-gray-300">아직 인기 검색어가 없습니다</p>
            ) : (
              <ol>
                {popular.map((word, i) => (
                  <li key={word}>
                    <button type="button" onClick={() => search(word)} className="flex w-full items-center gap-3 py-2.5 text-left">
                      <span className={`text-body-7 w-5 ${i < 3 ? 'text-primary-200' : 'text-gray-300'}`}>{i + 1}</span>
                      <span className="text-body-7 text-black">{word}</span>
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default SearchPage
