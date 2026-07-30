import { ChevronLeft, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { cancelOrder, getDelivery, getOrderDetail } from '@/api/order'
import type { DeliveryResponse, OrderDetailResponse, OrderStatus } from '@/types/api'

const steps = ['결제완료', '상품준비', '배송중', '배송완료']

const STEP_INDEX: Record<OrderStatus, number> = {
  PENDING: 0,
  PAID: 0,
  PREPARING: 1,
  DELIVERING: 2,
  DELIVERED: 3,
  CANCELED: 0,
}

const STATUS_TITLE: Record<OrderStatus, string> = {
  PENDING: '결제 대기',
  PAID: '결제 완료',
  PREPARING: '상품 준비중',
  DELIVERING: '배송중',
  DELIVERED: '배송 완료',
  CANCELED: '주문 취소됨',
}

const CANCELABLE_STATUSES: OrderStatus[] = ['PENDING', 'PAID', 'PREPARING', 'DELIVERING']

function OrderManagePage() {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const [order, setOrder] = useState<OrderDetailResponse | null>(null)
  const [delivery, setDelivery] = useState<DeliveryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    if (!orderId) return
    getOrderDetail(Number(orderId))
      .then(({ data }) => setOrder(data.data))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }, [orderId])

  useEffect(() => {
    if (!orderId || !order) return
    if (order.orderStatus !== 'DELIVERING' && order.orderStatus !== 'DELIVERED') return
    getDelivery(Number(orderId))
      .then(({ data }) => setDelivery(data.data))
      .catch(() => {})
  }, [orderId, order])

  const handleCancel = async () => {
    if (!orderId || canceling) return
    if (!window.confirm('주문을 취소하시겠습니까?')) return
    setCanceling(true)
    try {
      await cancelOrder(Number(orderId))
      const { data } = await getOrderDetail(Number(orderId))
      setOrder(data.data)
    } catch {
      window.alert('주문 취소에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setCanceling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 size={20} className="animate-spin text-gray-300" />
      </div>
    )
  }

  if (failed || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white">
        <p className="text-body-8 text-gray-300">주문 정보를 불러오지 못했습니다</p>
        <button type="button" onClick={() => navigate(-1)} className="text-body-8 text-black underline">
          돌아가기
        </button>
      </div>
    )
  }

  const canceled = order.orderStatus === 'CANCELED'
  const cancelable = CANCELABLE_STATUSES.includes(order.orderStatus)

  return (
    <div className="flex min-h-screen justify-center bg-white">
      <div className="flex w-full max-w-120 flex-col bg-white pb-8">
        <header className="relative flex h-14 items-center justify-center border-b border-gray-100 px-3">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
            <ChevronLeft size={24} className="text-black" />
          </button>
          <h1 className="text-body-3 text-black">주문/배송 관리</h1>
        </header>

        <section className="px-4 py-5">
          <h2 className="text-title-5 text-black">{STATUS_TITLE[order.orderStatus]}</h2>
          <p className="text-body-8 mt-1 text-gray-300">
            {new Date(order.orderedAt).toLocaleDateString('ko-KR')} 주문
          </p>
          <p className="text-body-11 mt-1 text-gray-200">주문번호 {order.orderId}</p>

          {!canceled && (
            <div className="relative mt-6 flex justify-between">
              <div className="absolute top-2 right-2 left-2 h-0.5 bg-gray-200" />
              <div
                className="bg-primary-200 absolute top-2 left-2 h-0.5"
                style={{ width: `calc(${STEP_INDEX[order.orderStatus] * (100 / (steps.length - 1))}% - ${STEP_INDEX[order.orderStatus] === 0 ? '0px' : '0.33rem'})` }}
              />
              {steps.map((step, i) => (
                <div key={step} className="relative flex flex-col items-center gap-2">
                  <span className={`h-4 w-4 rounded-full ${i <= STEP_INDEX[order.orderStatus] ? 'bg-primary-200' : 'bg-gray-200'}`} />
                  <span className={`text-body-11 ${i === STEP_INDEX[order.orderStatus] ? 'text-black' : 'text-gray-300'}`}>{step}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="h-2 bg-gray-100" />

        <section className="flex flex-col gap-3 px-4 py-4">
          {order.items.map((item) => (
            <div key={item.productId} className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(`/products/${item.productId}`)}
                className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100"
              >
                {item.thumbnail && <img src={item.thumbnail} alt={item.productName} className="h-full w-full object-cover" />}
              </button>
              <div className="flex flex-1 flex-col">
                <button type="button" onClick={() => navigate(`/products/${item.productId}`)} className="text-body-7 text-left text-black">
                  {item.productName}
                </button>
                <p className="text-body-10 text-gray-300">{item.quantity}개</p>
                <p className="text-body-8 text-black">{item.totalPrice.toLocaleString()}원</p>
              </div>
              {order.orderStatus === 'DELIVERED' && (
                <button
                  type="button"
                  onClick={() =>
                    navigate('/review/write', {
                      state: { orderId: order.orderId, productId: item.productId, productName: item.productName },
                    })
                  }
                  className="text-body-9 h-fit shrink-0 self-center rounded-lg border border-black px-3 py-2 text-black"
                >
                  리뷰 작성
                </button>
              )}
            </div>
          ))}
        </section>

        {cancelable && (
          <div className="px-4 pb-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={canceling}
              className="text-body-5 flex w-full items-center justify-center gap-2 rounded-lg border border-black py-3.5 text-black disabled:opacity-50"
            >
              {canceling && <Loader2 size={18} className="animate-spin" />}
              주문 취소
            </button>
          </div>
        )}

        <div className="h-2 bg-gray-100" />

        {delivery && (
          <>
            <section className="px-4 py-4">
              <h2 className="text-body-5 mb-3 text-black">배송 정보</h2>
              <div className="flex justify-between py-1">
                <span className="text-body-8 text-gray-300">택배사</span>
                <span className="text-body-8 text-black">{delivery.deliveryCompany}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-body-8 text-gray-300">운송장번호</span>
                <span className="text-body-8 text-black">{delivery.trackingNumber}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-body-8 text-gray-300">도착 예정일</span>
                <span className="text-body-8 text-black">{new Date(delivery.estimatedArrival).toLocaleDateString('ko-KR')}</span>
              </div>
            </section>

            <div className="h-2 bg-gray-100" />
          </>
        )}

        <section className="px-4 py-4">
          <h2 className="text-body-5 mb-3 text-black">배송지 정보</h2>
          <div className="flex justify-between py-1">
            <span className="text-body-8 text-gray-300">받는 사람</span>
            <span className="text-body-8 text-black">{order.receiver.name}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-body-8 text-gray-300">주소</span>
            <span className="text-body-8 text-black">
              {order.address.roadAddress} {order.address.detailAddress}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-body-8 text-gray-300">연락처</span>
            <span className="text-body-8 text-black">{order.receiver.phone}</span>
          </div>
        </section>

        <div className="h-2 bg-gray-100" />

        <section className="px-4 py-4">
          <h2 className="text-body-5 mb-3 text-black">결제 금액</h2>
          <div className="flex justify-between py-1">
            <span className="text-body-8 text-gray-300">상품금액</span>
            <span className="text-body-8 text-black">{order.summary.productPrice.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-body-8 text-gray-300">할인금액</span>
            <span className="text-body-8 text-black">-{order.summary.discountPrice.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-body-8 text-gray-300">배송비</span>
            <span className="text-body-8 text-black">{order.summary.deliveryFee === 0 ? '무료' : `${order.summary.deliveryFee.toLocaleString()}원`}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-gray-100 pt-3">
            <span className="text-body-5 text-black">총 결제 금액</span>
            <span className="text-body-3 text-black">{order.summary.totalPrice.toLocaleString()}원</span>
          </div>
        </section>
      </div>
    </div>
  )
}

export default OrderManagePage
