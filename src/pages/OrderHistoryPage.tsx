import { ChevronRight, Loader2, ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyOrders, getOrderDetail } from '@/api/order'
import { useCartStore } from '@/store/cartStore'
import { ORDER_STATUS_LABELS } from '@/constants/order'
import type { OrderSummary } from '@/types/api'

function OrderHistoryPage() {
  const navigate = useNavigate()
  const addToCart = useCartStore((state) => state.addItem)
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [toast, setToast] = useState('')
  const [reordering, setReordering] = useState(false)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    getMyOrders(1)
      .then(({ data }) => {
        setOrders(data.data.orders)
        setPage(1)
        setHasNext(data.data.hasNext)
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 2000)
    return () => clearTimeout(timer)
  }, [toast])

  //주문 전체 재담기: 주문 상세를 조회해 담긴 상품 전부를 각 1개씩 장바구니에 추가
  //일부 상품이 품절·재고 부족이어도 되는 것만 담고 결과를 알려준다 (부분 성공 허용)
  const handleReorder = async (orderId: number) => {
    if (reordering) return
    setReordering(true)
    try {
      const { data } = await getOrderDetail(orderId)
      const results = await Promise.allSettled(
        data.data.items.map((item) => addToCart(item.productId, 1)),
      )
      const ok = results.filter((r) => r.status === 'fulfilled').length
      const fail = results.length - ok
      if (fail === 0) setToast(`${ok}개 상품을 장바구니에 담았습니다`)
      else if (ok === 0) setToast('장바구니에 담지 못했습니다 (품절·재고 부족)')
      else setToast(`${ok}개 담았습니다 · ${fail}개는 품절·재고 부족으로 제외`)
    } catch {
      setToast('장바구니 담기에 실패했습니다')
    } finally {
      setReordering(false)
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setLoading(true)
    getMyOrders(nextPage)
      .then(({ data }) => {
        setOrders((prev) => [...prev, ...data.data.orders])
        setPage(nextPage)
        setHasNext(data.data.hasNext)
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }

  return (
    <div className="bg-white">
      <h1 className="text-title-5 px-4 py-3 text-black">주문 내역</h1>

      {loading && orders.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={20} className="animate-spin text-gray-300" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-body-8 py-24 text-center text-gray-300">
          {failed ? '주문 내역을 불러오지 못했습니다' : '주문 내역이 없습니다'}
        </p>
      ) : (
        <div className="flex flex-col gap-3 px-4">
          {orders.map((order) => (
            <div key={order.orderId} className="rounded-2xl border border-gray-100 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-body-7 text-black">{new Date(order.orderedAt).toLocaleDateString('ko-KR')} 주문</span>
                <span className="text-body-8 text-primary-200">{ORDER_STATUS_LABELS[order.orderStatus]}</span>
              </div>

              <div className="flex gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {order.thumbnail && <img src={order.thumbnail} alt={order.productName} className="h-full w-full object-cover" />}
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="text-body-8 text-black">
                    {order.productName}
                    {order.itemCount > 1 && ` 외 ${order.itemCount - 1}건`}
                  </span>
                  <span className="text-body-5 text-black">{order.totalPrice.toLocaleString()}원</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleReorder(order.orderId)}
                  disabled={reordering}
                  aria-label="주문 상품 전체 장바구니 담기"
                  className="flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-lg border border-gray-200 disabled:opacity-40"
                >
                  <ShoppingCart size={16} className="text-black" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/orders/${order.orderId}`)}
                className="mt-3 flex w-full items-center justify-center gap-0.5 border-t border-gray-100 pt-3 text-black"
              >
                <span className="text-body-8">배송/주문 관리</span>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            </div>
          ))}
        </div>
      )}

      {orders.length > 0 && (
        <div className="flex items-center gap-3 px-8 py-8">
          {hasNext ? (
            <button
              type="button"
              onClick={loadMore}
              disabled={loading}
              className="text-body-8 mx-auto flex items-center gap-2 rounded-full border border-gray-200 px-6 py-2 text-black"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              더보기
            </button>
          ) : (
            <>
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-body-10 text-gray-300">주문조회를 완료했습니다</span>
              <div className="h-px flex-1 bg-gray-100" />
            </>
          )}
        </div>
      )}

      {toast && (
        <div className="text-body-9 fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-white">
          {toast}
        </div>
      )}
    </div>
  )
}

export default OrderHistoryPage
