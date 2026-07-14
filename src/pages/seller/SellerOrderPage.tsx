import { ChevronDown, ChevronLeft, ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { type OrderStatus, STATUS_FLOW, useSellerOrderStore } from '@/store/sellerOrderStore'

const statusStyle: Record<OrderStatus, string> = {
  결제완료: 'bg-gray-100 text-gray-300',
  상품준비: 'bg-secondary-100 text-secondary-300',
  배송지시: 'bg-primary-100 text-primary-200',
  배송중: 'bg-primary-200 text-white',
  배송완료: 'bg-black text-white',
}

const FILTERS: ('전체' | OrderStatus)[] = ['전체', ...STATUS_FLOW]

function SellerOrderPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const statusParam = searchParams.get('status') as OrderStatus | null

  const orders = useSellerOrderStore((state) => state.orders)
  const changeStatus = useSellerOrderStore((state) => state.changeStatus)
  const [filter, setFilter] = useState<'전체' | OrderStatus>(statusParam && STATUS_FLOW.includes(statusParam) ? statusParam : '전체')
  const [openStatusMenu, setOpenStatusMenu] = useState<string | null>(null)
  const [openDetail, setOpenDetail] = useState<Record<string, boolean>>({})
  const [statusError, setStatusError] = useState<string | null>(null)

  useEffect(() => {
    if (!statusError) return undefined
    const timer = setTimeout(() => setStatusError(null), 2000)
    return () => clearTimeout(timer)
  }, [statusError])

  const filteredOrders = filter === '전체' ? orders : orders.filter((order) => order.status === filter)

  const handleChangeStatus = (id: string, next: OrderStatus) => {
    setOpenStatusMenu(null)
    setStatusError(changeStatus(id, next) ? null : id)
  }

  return (
    <div className="flex min-h-screen justify-center bg-white">
      <div className="flex w-full max-w-120 flex-col bg-white">
        <header className="relative flex h-14 items-center justify-center border-b border-gray-100 px-3">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
            <ChevronLeft size={24} className="text-black" />
          </button>
          <h1 className="text-body-3 text-black">판매 주문 목록</h1>
        </header>

        <div className="flex gap-2 overflow-x-auto px-4 py-3">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`text-body-9 shrink-0 rounded-full px-3 py-1.5 ${filter === item ? 'bg-black text-white' : 'bg-gray-100 text-gray-300'}`}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-body-8 py-24 text-center text-gray-300">조회 가능한 주문이 없습니다</p>
        ) : (
          <ul className="border-t border-gray-100">
            {filteredOrders.map((order) => (
              <li key={order.id} className="border-b border-gray-100 px-4 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-body-10 text-gray-300">판매번호 {order.id}</span>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenStatusMenu((prev) => (prev === order.id ? null : order.id))}
                      className={`text-body-11 rounded-full px-2.5 py-1 ${statusStyle[order.status]}`}
                    >
                      {order.status}
                    </button>
                    {openStatusMenu === order.id && (
                      <div className="absolute top-full right-0 z-10 mt-1 w-24 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                        {STATUS_FLOW.map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => handleChangeStatus(order.id, status)}
                            className={`text-body-9 block w-full px-3 py-1.5 text-left ${status === order.status ? 'text-primary-200' : 'text-black'}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex gap-3">
                  <div className="h-16 w-16 shrink-0 rounded-lg bg-gray-100" />
                  <div className="flex flex-1 flex-col justify-center">
                    <span className="text-body-8 text-black">{order.productName}</span>
                    <span className="text-body-10 text-gray-300">수량 {order.quantity}개</span>
                    <span className="text-body-7 text-black">{(order.price * order.quantity).toLocaleString()}원</span>
                  </div>
                </div>

                {statusError === order.id && <p className="text-body-11 mt-2 text-red-300">배송 상태 변경에 실패했습니다.</p>}

                <button
                  type="button"
                  onClick={() => setOpenDetail((prev) => ({ ...prev, [order.id]: !prev[order.id] }))}
                  className="text-body-10 mt-2 flex items-center gap-0.5 text-gray-300"
                >
                  주문 상세
                  {openDetail[order.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {openDetail[order.id] && (
                  <div className="mt-2 flex flex-col gap-1.5 rounded-xl bg-gray-100 p-3">
                    <div className="text-body-10 flex justify-between">
                      <span className="text-gray-300">주문자</span>
                      <span className="text-black">{order.buyerName}</span>
                    </div>
                    <div className="text-body-10 flex justify-between">
                      <span className="text-gray-300">수령자</span>
                      <span className="text-black">{order.receiverName}</span>
                    </div>
                    <div className="text-body-10 flex justify-between">
                      <span className="text-gray-300">전화번호</span>
                      <span className="text-black">{order.phone}</span>
                    </div>
                    <div className="text-body-10 flex justify-between gap-3">
                      <span className="shrink-0 text-gray-300">주소</span>
                      <span className="text-right text-black">{order.address}</span>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default SellerOrderPage
