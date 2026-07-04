import { ChevronLeft, Plus, Star } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ratingLabels = ['', '별로예요', '그저 그래요', '보통이에요', '만족해요', '최고예요']

function ReviewWritePage() {
  const navigate = useNavigate()
  const [rating, setRating] = useState(4)
  const [content, setContent] = useState('')

  const canSubmit = rating > 0 && content.trim().length >= 10

  return (
    <div className="flex min-h-screen justify-center bg-white">
      <div className="flex w-full max-w-120 flex-col bg-white pb-24">
        <header className="relative flex h-14 items-center justify-center border-b border-gray-100 px-3">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
            <ChevronLeft size={24} className="text-black" />
          </button>
          <h1 className="text-body-3 text-black">리뷰 작성</h1>
        </header>

        <section className="flex items-center gap-3 px-4 py-4">
          <div className="h-16 w-16 shrink-0 rounded-lg bg-gray-100" />
          <div>
            <p className="text-body-7 text-black">남성 경량 구스다운 패딩</p>
            <p className="text-body-10 text-gray-300">블랙 / L</p>
          </div>
        </section>

        <div className="h-2 bg-gray-100" />

        <section className="flex flex-col items-center gap-2 px-4 py-6">
          <h2 className="text-body-5 text-black">상품은 어떠셨나요?</h2>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n}점`}>
                <Star size={36} className={n <= rating ? 'text-yellow-300' : 'text-gray-200'} fill={n <= rating ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
          <p className="text-body-9 text-gray-300">{rating}점 · {ratingLabels[rating]}</p>
        </section>

        <div className="h-2 bg-gray-100" />

        <section className="px-4 py-4">
          <h2 className="text-body-5 mb-2 text-black">상품평</h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 500))}
            placeholder="상품에 대한 솔직한 평가를 남겨주세요. (최소 10자 이상)"
            className="text-body-6 h-28 w-full resize-none rounded-xl border border-gray-300 p-3 outline-none placeholder:text-gray-300"
          />
          <p className="text-body-11 mt-1 text-right text-gray-300">{content.length} / 500</p>
        </section>

        <section className="px-4 py-2">
          <h2 className="text-body-5 mb-2 text-black">사진 첨부</h2>
          <button type="button" className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-gray-300">
            <Plus size={22} className="text-gray-300" />
            <span className="text-body-11 text-gray-300">0/5</span>
          </button>
        </section>

        <div className="fixed bottom-0 left-1/2 w-full max-w-120 -translate-x-1/2 border-t border-gray-100 bg-white p-4">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => navigate(-1)}
            className={`text-body-5 w-full rounded-lg py-3.5 text-white ${canSubmit ? 'bg-primary-200' : 'bg-gray-200'}`}
          >
            리뷰 작성 완료
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewWritePage
