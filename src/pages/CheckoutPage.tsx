import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const address = {
  name: '주민서',
  detail: '서울 강남구 테헤란로 123, 4층 401호',
  phone: '010-1234-5678',
}

const orderProducts = [
  { id: 1, name: '남성 경량 구스다운 패딩 · 블랙/L', arrival: '내일(목) 도착 예정' },
  { id: 2, name: '베이직 니트 스웨터 · 오트밀/M ×2', arrival: '모레(금) 도착 예정' },
]

const payMethods = ['간편결제 (페이)', '신용·체크카드', '계좌이체']

function CheckoutPage() {
  const navigate = useNavigate()
  const [selectedPay, setSelectedPay] = useState(0)

  const productPrice = 130800
  const shippingFee: number = 0
  const discount = 5000
  const total = productPrice + shippingFee - discount

  return (
    <div className="flex min-h-screen justify-center bg-white">
      <div className="flex w-full max-w-120 flex-col bg-white pb-24">
        <header className="relative flex h-14 items-center justify-center border-b border-gray-100 px-3">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
            <ChevronLeft size={24} className="text-black" />
          </button>
          <h1 className="text-body-3 text-black">주문/결제</h1>
        </header>

        <section className="px-4 py-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-body-5 text-black">배송지</h2>
            <button type="button" className="flex items-center gap-0.5 text-gray-300">
              <span className="text-body-9">변경</span>
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-body-7 text-black">{address.name}</span>
            <span className="text-body-11 rounded-full bg-gray-100 px-2 py-0.5 text-gray-300">기본배송지</span>
          </div>
          <p className="text-body-9 mt-1 text-gray-300">{address.detail}</p>
          <p className="text-body-9 text-gray-300">{address.phone}</p>
        </section>

        <div className="h-2 bg-gray-100" />

        <section className="px-4 py-4">
          <h2 className="text-body-5 mb-3 text-black">주문 상품 {orderProducts.length}개</h2>
          <ul className="flex flex-col gap-3">
            {orderProducts.map((p) => (
              <li key={p.id} className="flex gap-3">
                <div className="h-14 w-14 shrink-0 rounded-lg bg-gray-100" />
                <div>
                  <p className="text-body-8 text-black">{p.name}</p>
                  <p className="text-body-10 text-gray-300">{p.arrival}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="h-2 bg-gray-100" />

        <section className="px-4 py-4">
          <h2 className="text-body-5 mb-3 text-black">결제 수단</h2>
          <div className="flex flex-col gap-3">
            {payMethods.map((method, i) => (
              <button key={method} type="button" onClick={() => setSelectedPay(i)} className="flex items-center gap-2 text-left">
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selectedPay === i ? 'border-black' : 'border-gray-200'}`}>
                  {selectedPay === i && <span className="h-2.5 w-2.5 rounded-full bg-black" />}
                </span>
                <span className={`text-body-7 ${selectedPay === i ? 'text-black' : 'text-gray-300'}`}>{method}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="h-2 bg-gray-100" />

        <section className="px-4 py-4">
          <h2 className="text-body-5 mb-3 text-black">결제 금액</h2>
          <div className="flex justify-between py-1">
            <span className="text-body-8 text-gray-300">상품금액</span>
            <span className="text-body-8 text-black">{productPrice.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-body-8 text-gray-300">배송비</span>
            <span className="text-body-8 text-black">{shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-body-8 text-gray-300">할인</span>
            <span className="text-body-8 text-black">- {discount.toLocaleString()}원</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-gray-100 pt-3">
            <span className="text-body-5 text-black">최종 결제 금액</span>
            <span className="text-body-3 text-black">{total.toLocaleString()}원</span>
          </div>
        </section>

        <div className="fixed bottom-0 left-1/2 w-full max-w-120 -translate-x-1/2 border-t border-gray-100 bg-white p-4">
          <button type="button" onClick={() => navigate('/order-complete')} className="bg-primary-200 text-body-5 w-full rounded-lg py-3.5 text-white">
            {total.toLocaleString()}원 결제하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
