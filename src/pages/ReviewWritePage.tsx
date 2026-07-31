import { AxiosError } from 'axios'
import { Camera, ChevronLeft, Star, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { uploadImage } from '@/api/image'
import { createReview, updateReview } from '@/api/review'
import type { ApiResponse } from '@/types/api'

const ratingLabels = ['', '별로예요', '그저 그래요', '보통이에요', '만족해요', '최고예요']

type ReviewWriteState = {
  orderId?: number
  productId: number
  productName: string
  option?: string
  //수정 모드일 때만 전달됨
  mode?: 'edit'
  reviewId?: number
  initialRating?: number
  initialContent?: string
  initialImages?: string[]
}

function ReviewWritePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as ReviewWriteState | null
  const isEdit = state?.mode === 'edit' && !!state.reviewId

  const [rating, setRating] = useState(state?.initialRating ?? 4)
  const [content, setContent] = useState(state?.initialContent ?? '')
  const [images, setImages] = useState<File[]>([])
  //수정 모드에서 유지 중인 기존 이미지 URL들 (X로 빼면 최종 목록에서 제외 → 서버가 덮어쓰기로 삭제)
  const [existingImages, setExistingImages] = useState<string[]>(state?.initialImages ?? [])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canSubmit = rating > 0 && content.trim().length >= 10 && !!state

  const addImages = (files: FileList | null) => {
    if (!files) return
    //최대 2장 — 초과 선택분은 잘라낸다
    setImages((prev) => [...prev, ...Array.from(files)].slice(0, Math.max(0, 2 - existingImages.length)))
  }

  const handleSubmit = async () => {
    if (!canSubmit || !state || submitting) return
    setSubmitting(true)
    setError('')
    try {
      if (isEdit && state.reviewId) {
        //수정 모드: 새 파일만 업로드하고 "남긴 기존 + 새 이미지"의 최종 목록으로 덮어쓴다
        const uploaded = await Promise.all(images.map((file) => uploadImage(file)))
        const finalUrls = [...existingImages, ...uploaded.map(({ data }) => data.data.imageUrl)]
        await updateReview(state.reviewId, rating, content.trim(), finalUrls)
      } else {
        //방식 B: 미리보기는 로컬로만 보여주다가, 등록 버튼을 누른 지금 시점에만 S3 업로드
        let imageUrls: string[] | undefined
        if (images.length > 0) {
          const uploaded = await Promise.all(images.map((file) => uploadImage(file)))
          imageUrls = uploaded.map(({ data }) => data.data.imageUrl)
        }
        await createReview({
          orderId: state.orderId!,
          productId: state.productId,
          rating,
          content: content.trim(),
          imageUrls,
        })
      }
      //성공 토스트를 잠깐 보여준 뒤 이전 페이지로 복귀 (버튼은 비활성 유지해 중복 제출 방지)
      setToast(true)
      setTimeout(() => navigate(-1), 800)
    } catch (err) {
      //서버가 알려준 실패 이유("이미 리뷰를 작성한 주문입니다" 등)를 그대로 보여준다
      const message = (err as AxiosError<ApiResponse<unknown>>).response?.data?.message
      setError(message ?? '리뷰 등록에 실패했습니다. 다시 시도해주세요.')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen justify-center bg-white">
      <div className="flex w-full max-w-120 flex-col bg-white pb-24">
        <header className="relative flex h-14 items-center justify-center border-b border-gray-100 px-3">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
            <ChevronLeft size={24} className="text-black" />
          </button>
          <h1 className="text-body-3 text-black">{isEdit ? '리뷰 수정' : '리뷰 작성'}</h1>
        </header>

        <section className="flex items-center gap-3 px-4 py-4">
          <div className="h-16 w-16 shrink-0 rounded-lg bg-gray-100" />
          <div>
            <p className="text-body-7 text-black">{state?.productName ?? '상품 정보 없음'}</p>
            {state?.option && <p className="text-body-10 text-gray-300">{state.option}</p>}
          </div>
        </section>

        <div className="h-2 bg-gray-100" />

        <section className="flex flex-col items-center gap-2 px-4 py-6">
          <h2 className="text-body-5 text-black">상품은 어떠셨나요?</h2>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={(e) => {
                  //별의 왼쪽 절반 클릭 = 반 개(n-0.5), 오른쪽 절반 = 온전한 별(n). 최소 1점 보장(백엔드 검증과 일치)
                  const rect = e.currentTarget.getBoundingClientRect()
                  const isLeftHalf = e.clientX - rect.left < rect.width / 2
                  setRating(Math.max(1, isLeftHalf ? n - 0.5 : n))
                }}
                aria-label={`${n}점`}
              >
                <span className="relative inline-block">
                  <Star size={36} className="text-gray-200" fill="none" />
                  {/* 채움 별을 위에 겹치고 너비로 잘라서 100%/50%/0% 표현 */}
                  <span
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: rating >= n ? '100%' : rating >= n - 0.5 ? '50%' : '0%' }}
                  >
                    <Star size={36} className="text-yellow-300" fill="currentColor" />
                  </span>
                </span>
              </button>
            ))}
          </div>
          <p className="text-body-9 text-gray-300">{rating}점 · {ratingLabels[Math.ceil(rating)]}</p>
        </section>

        <div className="h-2 bg-gray-100" />

        <section className="px-4 py-4">
          <h2 className="text-body-5 mb-2 text-black">상품평</h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 1000))}
            placeholder="상품에 대한 솔직한 평가를 남겨주세요. (최소 10자 이상)"
            className="text-body-6 h-28 w-full resize-none rounded-xl border border-gray-300 p-3 outline-none placeholder:text-gray-300"
          />
          <p className="text-body-11 mt-1 text-right text-gray-300">{content.length} / 1000</p>
        </section>

        <section className="px-4 pb-4">
          <h2 className="text-body-5 mb-2 text-black">
            사진 첨부 <span className="text-body-10 text-gray-300">(선택 · 최대 2장)</span>
          </h2>
          <div className="flex gap-2">
            {existingImages.map((url) => (
              <div key={url} className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                <img src={url} alt="기존 사진" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setExistingImages((prev) => prev.filter((u) => u !== url))}
                  aria-label="기존 사진 삭제"
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            ))}
            {images.map((file, i) => (
              <div key={`${file.name}-${i}`} className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                {/* 로컬 미리보기 — 아직 업로드 전, 등록 시점에만 S3로 올라간다 */}
                <img src={URL.createObjectURL(file)} alt={`첨부 ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  aria-label="사진 삭제"
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            ))}
            {existingImages.length + images.length < 2 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300"
              >
                <Camera size={22} className="text-gray-300" />
                <span className="text-body-11 text-gray-300">{existingImages.length + images.length}/2</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              addImages(e.target.files)
              e.target.value = ''
            }}
          />
        </section>

        <div className="fixed bottom-0 left-1/2 w-full max-w-120 -translate-x-1/2 border-t border-gray-100 bg-white p-4">
          {error && <p className="text-body-8 mb-2 text-center font-semibold text-red-300">{error}</p>}
          <button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={handleSubmit}
            className={`text-body-5 w-full rounded-lg py-3.5 text-white ${canSubmit ? 'bg-primary-200' : 'bg-gray-200'}`}
          >
            {isEdit ? '리뷰 수정 완료' : '리뷰 작성 완료'}
          </button>
        </div>

        {toast && (
          <div className="text-body-7 fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-5 py-2.5 text-white">
            {isEdit ? '리뷰가 수정되었습니다' : '리뷰가 작성되었습니다'}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewWritePage
