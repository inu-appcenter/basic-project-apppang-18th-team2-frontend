import { Check, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getDelivery, getOrderDetail } from '@/api/order'
import type { OrderDetailResponse } from '@/types/api'

type OrderCompleteState = {
  orderId: number
}

function OrderCompletePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as OrderCompleteState | null

  const [order, setOrder] = useState<OrderDetailResponse | null>(null)
  const [arrival, setArrival] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!state?.orderId) {
      setLoading(false)
      return
    }
    getOrderDetail(state.orderId)
      .then(({ data }) => setOrder(data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
    getDelivery(state.orderId)
      .then(({ data }) => setArrival(new Date(data.data.estimatedArrival).toLocaleDateString('ko-KR')))
      .catch(() => {})
  }, [state?.orderId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 size={20} className="animate-spin text-gray-300" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen justify-center bg-white">
      <div className="flex w-full max-w-120 flex-col items-center px-4">
        <div className="bg-primary-200 mt-24 flex h-20 w-20 items-center justify-center rounded-full">
          <Check size={40} strokeWidth={3} className="text-white" />
        </div>
        <h1 className="text-title-5 mt-6 text-black">주문이 완료되었습니다</h1>
        {order && <p className="text-body-9 mt-2 text-gray-300">주문번호 {order.orderId}</p>}

        {order && (
          <div className="mt-8 w-full rounded-2xl bg-gray-100 p-5">
            {arrival && (
              <div className="flex justify-between py-1.5">
                <span className="text-body-8 text-gray-300">도착 예정</span>
                <span className="text-body-8 text-black">{arrival}</span>
              </div>
            )}
            <div className="flex justify-between py-1.5">
              <span className="text-body-8 text-gray-300">배송지</span>
              <span className="text-body-8 text-black">
                {order.address.roadAddress} {order.address.detailAddress}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-body-8 text-gray-300">결제 금액</span>
              <span className="text-body-5 text-black">{order.summary.totalPrice.toLocaleString()}원</span>
            </div>
          </div>
        )}

        <div className="mt-8 flex w-full gap-3">
          <button type="button" onClick={() => navigate('/')} className="text-body-5 flex-1 rounded-lg border border-gray-200 py-3.5 text-black">
            쇼핑 계속하기
          </button>
          <button type="button" onClick={() => navigate('/orders')} className="bg-primary-200 text-body-5 flex-1 rounded-lg py-3.5 text-white">
            주문 상세보기
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderCompletePage
