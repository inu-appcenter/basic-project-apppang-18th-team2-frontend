import { ChevronRight, PackagePlus, RotateCw, Settings2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const deliveryStatus = [
  { label: '결제완료', count: 3 },
  { label: '상품준비', count: 5 },
  { label: '배송지시', count: 2 },
  { label: '배송중', count: 8 },
]

const claimStatus = [
  { label: '취소', count: 1 },
  { label: '반품', count: 0 },
  { label: '교환', count: 2 },
]

function SellerMainPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen justify-center bg-white">
      <div className="flex w-full max-w-120 flex-col bg-white">
        <header className="flex h-14 items-center border-b border-gray-100 px-4">
          <h1 className="text-title-5 text-black">판매자 센터</h1>
        </header>

        <section className="m-4 rounded-2xl border border-gray-100 p-4">
          <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-body-5 text-black">판매/배송</h2>
            <button type="button" aria-label="새로고침" className="text-gray-300">
              <RotateCw size={18} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            {deliveryStatus.map((item, i) => (
              <div key={item.label} className="flex items-center">
                <button
                  type="button"
                  onClick={() => navigate(`/seller/orders?status=${encodeURIComponent(item.label)}`)}
                  className="flex flex-col items-center gap-1 px-1"
                >
                  <span className="text-title-4 text-black">{item.count}</span>
                  <span className="text-body-11 text-gray-300">{item.label}</span>
                </button>
                {i < deliveryStatus.length - 1 && <ChevronRight size={16} className="text-gray-200" />}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-4 rounded-2xl border border-gray-100 p-4">
          <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-body-5 text-black">취소/반품/교환</h2>
            <button type="button" aria-label="새로고침" className="text-gray-300">
              <RotateCw size={18} />
            </button>
          </div>
          <div className="flex justify-around">
            {claimStatus.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <span className="text-title-4 text-black">{item.count}</span>
                <span className="text-body-11 text-gray-300">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-3 p-4">
          <button type="button" onClick={() => navigate('/seller/products/new')} className="bg-primary-200 flex items-center justify-center gap-2 rounded-2xl py-4 text-white">
            <PackagePlus size={20} />
            <span className="text-body-5">상품 등록</span>
          </button>
          <button type="button" onClick={() => navigate('/seller/products')} className="flex items-center justify-center gap-2 rounded-2xl border border-black py-4 text-black">
            <Settings2 size={20} />
            <span className="text-body-5">상품 수정 / 관리</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SellerMainPage
