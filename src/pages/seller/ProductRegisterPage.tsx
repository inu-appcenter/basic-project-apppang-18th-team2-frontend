import { ChevronLeft, Plus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ProductRegisterPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('')
  const [name, setName] = useState('')
  const [stock, setStock] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [shipping, setShipping] = useState('택배')

  const canSubmit = category && name && stock && price && description

  return (
    <div className="flex min-h-screen justify-center bg-white">
      <div className="flex w-full max-w-120 flex-col bg-white pb-24">
        <header className="relative flex h-14 items-center justify-center border-b border-gray-100 px-3">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
            <ChevronLeft size={24} className="text-black" />
          </button>
          <h1 className="text-body-3 text-black">상품 등록</h1>
        </header>

        <div className="flex flex-col gap-4 px-4 py-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-body-9 text-gray-300">카테고리 *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-body-6 border border-gray-300 px-3 py-3 outline-none"
            >
              <option value="">카테고리를 선택하세요</option>
              <option value="fashion">패션</option>
              <option value="beauty">뷰티</option>
              <option value="food">식품</option>
              <option value="digital">가전</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-body-9 text-gray-300">상품명 *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="상품명을 입력하세요"
              className="text-body-6 border border-gray-300 px-3 py-3 outline-none placeholder:text-gray-300"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-body-9 text-gray-300">재고 *</label>
              <input
                value={stock}
                onChange={(e) => setStock(e.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
                placeholder="0"
                className="text-body-6 border border-gray-300 px-3 py-3 outline-none placeholder:text-gray-300"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-body-9 text-gray-300">가격 *</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
                placeholder="0 원"
                className="text-body-6 border border-gray-300 px-3 py-3 outline-none placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-body-9 text-gray-300">상품 상세설명 *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="상품 상세 정보를 입력하세요"
              className="text-body-6 h-24 resize-none border border-gray-300 p-3 outline-none placeholder:text-gray-300"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-body-9 text-gray-300">상품 이미지 *</label>
            <div className="flex gap-2">
              <button type="button" className="flex h-20 w-20 flex-col items-center justify-center gap-1 border border-dashed border-gray-300">
                <Plus size={22} className="text-gray-300" />
                <span className="text-body-11 text-gray-300">0/10</span>
              </button>
              <div className="h-20 w-20 bg-gray-100" />
              <div className="h-20 w-20 bg-gray-100" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-body-9 text-gray-300">배송정보 *</label>
            <div className="flex gap-3">
              <select
                value={shipping}
                onChange={(e) => setShipping(e.target.value)}
                className="text-body-6 flex-1 border border-gray-300 px-3 py-3 outline-none"
              >
                <option value="택배">택배</option>
                <option value="직접배송">직접배송</option>
                <option value="방문수령">방문수령</option>
              </select>
              <input
                placeholder="배송비 3,000원"
                className="text-body-6 flex-1 border border-gray-300 px-3 py-3 outline-none placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 w-full max-w-120 -translate-x-1/2 border-t border-gray-100 bg-white p-4">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => navigate('/seller/products')}
            className={`text-body-5 w-full rounded-lg py-3.5 text-white ${canSubmit ? 'bg-primary-200' : 'bg-gray-200'}`}
          >
            상품 등록
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductRegisterPage
