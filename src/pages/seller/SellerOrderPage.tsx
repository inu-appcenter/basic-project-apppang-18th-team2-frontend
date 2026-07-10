import { ChevronDown, ChevronLeft, ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

type OrderStatus = '결제완료' | '상품준비' | '배송지시' | '배송중' | '배송완료'

const STATUS_FLOW: OrderStatus[] = ['결제완료', '상품준비', '배송지시', '배송중', '배송완료']

const statusStyle: Record<OrderStatus, string> = {
  결제완료: 'bg-gray-100 text-gray-300',
  상품준비: 'bg-secondary-100 text-secondary-300',
  배송지시: 'bg-primary-100 text-primary-200',
  배송중: 'bg-primary-200 text-white',
  배송완료: 'bg-black text-white',
}

type Order = {
  id: string
  productName: string
  quantity: number
  price: number
  buyerName: string
  receiverName: string
  phone: string
  address: string
  status: OrderStatus
}

const initialOrders: Order[] = [
  { id: 'S20260708-01', productName: '남성 경량 구스다운 패딩', quantity: 1, price: 61000, buyerName: '김민수', receiverName: '김민수', phone: '010-1234-5678', address: '서울 강남구 테헤란로 123, 4층', status: '결제완료' },
  { id: 'S20260708-02', productName: '베이직 니트 스웨터', quantity: 2, price: 34900, buyerName: '이서연', receiverName: '이서연', phone: '010-2345-6789', address: '경기 성남시 분당구 판교로 45', status: '결제완료' },
  { id: 'S20260707-05', productName: '와이드 슬랙스', quantity: 1, price: 29400, buyerName: '박지훈', receiverName: '박지훈 (본인수령)', phone: '010-3456-7890', address: '인천 연수구 송도과학로 12', status: '상품준비' },
  { id: 'S20260707-04', productName: '레더 첼시 부츠', quantity: 1, price: 79000, buyerName: '최유진', receiverName: '최유진', phone: '010-4567-8901', address: '서울 마포구 월드컵로 88', status: '상품준비' },
  { id: 'S20260706-09', productName: '캐시미어 머플러', quantity: 3, price: 24500, buyerName: '정하윤', receiverName: '정하윤 부모님', phone: '010-5678-9012', address: '부산 해운대구 센텀중앙로 55', status: '배송지시' },
  { id: 'S20260706-02', productName: '무선 핸디 청소기', quantity: 1, price: 135150, buyerName: '한도윤', receiverName: '한도윤', phone: '010-6789-0123', address: '대전 유성구 대학로 99', status: '배송중' },
  { id: 'S20260705-11', productName: '데일리 크로스백', quantity: 1, price: 45000, buyerName: '오지은', receiverName: '오지은', phone: '010-7890-1234', address: '서울 송파구 올림픽로 300', status: '배송중' },
  { id: 'S20260704-03', productName: '플리스 머플러 세트', quantity: 2, price: 14500, buyerName: '강태영', receiverName: '강태영', phone: '010-8901-2345', address: '광주 서구 상무중앙로 10', status: '배송완료' },
]

const FILTERS: ('전체' | OrderStatus)[] = ['전체', ...STATUS_FLOW]

function SellerOrderPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const statusParam = searchParams.get('status') as OrderStatus | null

  const [orders, setOrders] = useState(initialOrders)
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
    const order = orders.find((o) => o.id === id)
    if (!order || STATUS_FLOW.indexOf(next) <= STATUS_FLOW.indexOf(order.status)) {
      setStatusError(id)
      return
    }
    setStatusError(null)
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: next } : o)))
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
