import { ChevronRight, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const orders = [
  { id: 1001, productId: 101, date: '2026.06.28', status: '배송 완료', name: '남성 경량 구스다운 패딩', option: '블랙 / L · 1개', price: 61000 },
  { id: 1002, productId: 102, date: '2026.06.25', status: '배송중', name: '무선 핸디 청소기', option: '화이트 · 1개', price: 89000 },
  { id: 1003, productId: 103, date: '2026.06.20', status: '배송 완료', name: '캠핑 폴딩 의자', option: '카키 · 2개', price: 38000 },
]

function OrderHistoryPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-white">
      <h1 className="text-title-5 px-4 py-3 text-black">주문 내역</h1>

      <div className="flex flex-col gap-3 px-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-gray-100 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-body-7 text-black">{order.date} 주문</span>
              <span className="text-body-8 text-primary-200">{order.status}</span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(`/products/${order.productId}`)}
                className="h-16 w-16 shrink-0 rounded-lg bg-gray-100"
              />
              <div className="flex flex-1 flex-col">
                <button type="button" onClick={() => navigate(`/products/${order.productId}`)} className="text-body-8 text-left text-black">
                  {order.name}
                </button>
                <span className="text-body-10 text-gray-300">{order.option}</span>
                <span className="text-body-5 text-black">{order.price.toLocaleString()}원</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/cart')}
                aria-label="장바구니 담기"
                className="flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-lg border border-gray-200"
              >
                <ShoppingCart size={16} className="text-black" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/orders/${order.id}`)}
              className="mt-3 flex w-full items-center justify-center gap-0.5 border-t border-gray-100 pt-3 text-black"
            >
              <span className="text-body-8">배송/주문 관리</span>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 px-8 py-8">
        <div className="h-px flex-1 bg-gray-100" />
        <span className="text-body-10 text-gray-300">주문조회를 완료했습니다</span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>
    </div>
  )
}

export default OrderHistoryPage
