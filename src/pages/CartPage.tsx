import { Check, ChevronUp, Loader2, Minus, Plus, ShoppingCart, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'

function CartPage() {
  const navigate = useNavigate()
  const { items, loading, fetchCart, toggleSelect, toggleSelectAll, changeQuantity, removeItem, removeSelected } =
    useCartStore()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)

  useEffect(() => {
    fetchCart().catch(() => {})
  }, [fetchCart])

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-gray-300" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <ShoppingCart size={48} className="text-gray-200" />
        <p className="text-body-6 text-gray-300">장바구니에 담긴 상품이 없습니다</p>
        <button type="button" onClick={() => navigate('/')} className="bg-primary-200 text-body-5 rounded-lg px-6 py-3 text-white">
          쇼핑하러 가기
        </button>
      </div>
    )
  }

  const allSelected = items.every((item) => item.selected)
  const selectedItems = items.filter((item) => item.selected)
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.salePrice * item.quantity, 0)

  return (
    <div className="bg-white">
      <div className="px-4 py-3">
        <h1 className="text-title-5 text-black">장바구니</h1>
      </div>

      {/* 전체선택 / 선택삭제 */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <button type="button" onClick={toggleSelectAll} className="flex items-center gap-2">
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
              allSelected ? 'border-primary-200 bg-primary-200' : 'border-gray-200'
            }`}
          >
            {allSelected && <Check size={14} className="text-white" />}
          </span>
          <span className="text-body-8 text-black">
            전체선택 ({selectedItems.length}/{items.length})
          </span>
        </button>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={selectedItems.length === 0}
          className="text-body-9 text-gray-300 disabled:opacity-40"
        >
          선택삭제
        </button>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item.cartItemId} className="flex gap-3 border-b border-gray-100 px-4 py-4">
            <button type="button" onClick={() => toggleSelect(item.cartItemId)} aria-label="상품 선택" className="pt-1">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  item.selected ? 'border-primary-200 bg-primary-200' : 'border-gray-200'
                }`}
              >
                {item.selected && <Check size={14} className="text-white" />}
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate(`/products/${item.productId}`)}
              className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100"
            >
              {item.thumbnail && <img src={item.thumbnail} alt={item.productName} className="h-full w-full object-cover" />}
            </button>

            <div className="flex flex-1 flex-col">
              <button type="button" onClick={() => navigate(`/products/${item.productId}`)} className="text-body-7 text-left text-black">
                {item.productName}
              </button>
              <p className="text-body-9 mt-1 text-secondary-300">무료배송 · 내일 도착 예정</p>

              <div className="mt-2 flex items-center justify-between">
                <p className="text-body-3 text-black">{(item.salePrice * item.quantity).toLocaleString()}원</p>
                <div className="flex items-center rounded-full border border-gray-200">
                  <button
                    type="button"
                    onClick={() => changeQuantity(item.cartItemId, item.quantity - 1).catch(() => {})}
                    disabled={item.quantity <= 1}
                    aria-label="수량 감소"
                    className="px-2.5 py-1 text-black disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-body-8 w-6 text-center text-black">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => changeQuantity(item.cartItemId, item.quantity + 1).catch(() => {})}
                    disabled={item.quantity >= item.stock}
                    aria-label="수량 증가"
                    className="px-2.5 py-1 text-black disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {item.quantity >= item.stock && (
                <p className="text-body-12 mt-1 text-red-300">재고가 부족하여 수량을 변경할 수 없습니다</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeItem(item.cartItemId).catch(() => {})}
              aria-label="삭제"
              className="self-start p-1 text-gray-300"
            >
              <X size={18} />
            </button>
          </li>
        ))}
      </ul>

      {/* 결제 요약 */}
      <div className="sticky bottom-0 border-t border-gray-100 bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => setSummaryOpen((v) => !v)}
          aria-label="결제 금액 상세 보기"
          className="mb-2 flex w-full items-center justify-center text-gray-300"
        >
          <ChevronUp size={16} className={summaryOpen ? '' : 'rotate-180'} />
        </button>

        {summaryOpen && (
          <div className="mb-3 space-y-1.5 border-b border-gray-100 pb-3">
            <div className="text-body-9 flex justify-between text-gray-300">
              <span>상품금액</span>
              <span>{totalPrice.toLocaleString()}원</span>
            </div>
            <div className="text-body-9 flex justify-between text-gray-300">
              <span>배송비</span>
              <span>무료</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-body-9 text-gray-300">총 결제금액</p>
            <p className="text-body-2 text-black">{totalPrice.toLocaleString()}원</p>
          </div>
          <button
            type="button"
            disabled={selectedItems.length === 0}
            onClick={() => navigate('/checkout')}
            className="bg-primary-200 text-body-5 flex-1 rounded-lg py-3 text-white disabled:bg-gray-200"
          >
            구매하기 ({selectedItems.length})
          </button>
        </div>
      </div>

      {/* 선택 삭제 확인 모달 */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8">
          <div className="w-full max-w-80 rounded-2xl bg-white p-5">
            <p className="text-body-5 text-center text-black">선택한 상품을 삭제하시겠습니까?</p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="text-body-6 flex-1 rounded-lg border border-gray-200 py-2.5 text-black"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  removeSelected().catch(() => {})
                  setConfirmOpen(false)
                }}
                className="bg-primary-200 text-body-6 flex-1 rounded-lg py-2.5 text-white"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage
