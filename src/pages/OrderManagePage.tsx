import { ChevronLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

const steps = ['결제완료', '상품준비', '배송중', '배송완료']
const currentStep = 3

function OrderManagePage() {
  const navigate = useNavigate()
  const { orderId } = useParams()

  const order = {
    productId: 101,
    name: '남성 경량 구스다운 패딩',
    option: '블랙 / L · 1개',
    completedDate: '2026.06.28(월)',
    receiver: '주*서',
    address: '서울 강남구 테헤란로 1**, ***호',
    phone: '010-****-5678',
  }

  return (
    <div className="flex min-h-screen justify-center bg-white">
      <div className="flex w-full max-w-120 flex-col bg-white">
        <header className="relative flex h-14 items-center justify-center border-b border-gray-100 px-3">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
            <ChevronLeft size={24} className="text-black" />
          </button>
          <h1 className="text-body-3 text-black">주문/배송 관리</h1>
        </header>

        <section className="px-4 py-5">
          <h2 className="text-title-5 text-black">배송 완료</h2>
          <p className="text-body-8 mt-1 text-gray-300">{order.completedDate} 배송 완료</p>
          {orderId && <p className="text-body-11 mt-1 text-gray-200">주문번호 {orderId}</p>}

          <div className="relative mt-6 flex justify-between">
            <div className="absolute top-2 right-2 left-2 h-0.5 bg-gray-200" />
            <div className="bg-primary-200 absolute top-2 left-2 h-0.5" style={{ width: 'calc(100% - 1rem)' }} />
            {steps.map((step, i) => (
              <div key={step} className="relative flex flex-col items-center gap-2">
                <span className={`h-4 w-4 rounded-full ${i <= currentStep ? 'bg-primary-200' : 'bg-gray-200'}`} />
                <span className={`text-body-11 ${i === currentStep ? 'text-black' : 'text-gray-300'}`}>{step}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="h-2 bg-gray-100" />

        <section className="flex gap-3 px-4 py-4">
          <button type="button" onClick={() => navigate(`/products/${order.productId}`)} className="h-16 w-16 shrink-0 rounded-lg bg-gray-100" />
          <div>
            <button type="button" onClick={() => navigate(`/products/${order.productId}`)} className="text-body-7 text-left text-black">
              {order.name}
            </button>
            <p className="text-body-10 text-gray-300">{order.option}</p>
          </div>
        </section>

        <div className="px-4 pb-4">
          <button type="button" onClick={() => navigate('/review/write')} className="text-body-5 w-full rounded-lg border border-black py-3.5 text-black">
            리뷰 작성하기
          </button>
        </div>

        <div className="h-2 bg-gray-100" />

        <section className="px-4 py-4">
          <h2 className="text-body-5 mb-3 text-black">배송 정보</h2>
          <div className="flex justify-between py-1">
            <span className="text-body-8 text-gray-300">받는 사람</span>
            <span className="text-body-8 text-black">{order.receiver}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-body-8 text-gray-300">주소</span>
            <span className="text-body-8 text-black">{order.address}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-body-8 text-gray-300">연락처</span>
            <span className="text-body-8 text-black">{order.phone}</span>
          </div>
        </section>
      </div>
    </div>
  )
}

export default OrderManagePage
