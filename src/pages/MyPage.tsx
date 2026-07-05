import { ChevronRight, Heart, LogIn, Settings, ShoppingBag, ShoppingCart, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const recentOrders = [
  { id: 1, productId: 101, status: '배송 완료' },
  { id: 2, productId: 102, status: '배송중' },
  { id: 3, productId: 103, status: '상품 준비중' },
  { id: 4, productId: 104, status: '결제 완료' },
]

const menus = [
  { label: '배송지 관리', path: '/mypage/addresses' },
  { label: '리뷰 관리', path: '/mypage/reviews' },
  { label: '고객센터', path: '/mypage/support' },
]

function maskName(name: string) {
  if (name.length <= 2) return name[0] + '*'
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
}

function maskEmail(email: string) {
  const [id, domain] = email.split('@')
  return id.slice(0, 3) + '****@' + domain
}

function MyPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  // 로그인 안 한 상태
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32">
        <User size={48} className="text-gray-200" />
        <p className="text-body-6 text-gray-300">로그인이 필요합니다</p>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="bg-primary-200 text-body-5 flex items-center gap-2 rounded-lg px-6 py-3 text-white"
        >
          <LogIn size={18} />
          로그인하러 가기
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <section className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <User size={28} className="text-gray-300" />
        </div>
        <div className="flex-1">
          <p className="text-body-3 text-black">{maskName(user.name)}님</p>
          <p className="text-body-9 text-gray-300">{maskEmail(user.email)}</p>
        </div>
        <button type="button" onClick={() => navigate('/mypage/settings')} aria-label="계정 설정" className="p-1 text-black">
          <Settings size={24} />
        </button>
      </section>

      <div className="grid grid-cols-2 gap-3 px-4">
        <button type="button" onClick={() => navigate('/orders')} className="flex flex-col items-center gap-1 rounded-xl bg-gray-100 py-4">
          <ShoppingBag size={20} className="text-primary-200" />
          <span className="text-title-5 text-black">12</span>
          <span className="text-body-9 text-gray-300">주문 내역</span>
        </button>
        <button type="button" onClick={() => navigate('/wishlist')} className="flex flex-col items-center gap-1 rounded-xl bg-gray-100 py-4">
          <Heart size={20} className="text-primary-200" />
          <span className="text-title-5 text-black">4</span>
          <span className="text-body-9 text-gray-300">찜 리스트</span>
        </button>
      </div>

      <div className="my-5 h-2 bg-gray-100" />

      <section className="px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-body-5 text-black">주문 내역</h2>
          <button type="button" onClick={() => navigate('/orders')} className="flex items-center gap-0.5 text-gray-300">
            <span className="text-body-9">전체보기</span>
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {recentOrders.map((order) => (
            <div key={order.id} className="w-24 shrink-0">
              <div className="relative aspect-square w-full">
                <button type="button" onClick={() => navigate(`/products/${order.productId}`)} className="h-full w-full rounded-xl bg-gray-100" />
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  aria-label="장바구니 담기"
                  className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white"
                >
                  <ShoppingCart size={13} className="text-black" />
                </button>
              </div>
              <p className="text-body-10 mt-1.5 text-center text-black">{order.status}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="my-5 h-2 bg-gray-100" />

      <nav className="px-4">
        <button type="button" onClick={() => navigate('/mypage/settings')} className="flex w-full items-center justify-between border-b border-gray-100 py-4 text-black">
          <span className="text-body-7">계정 설정</span>
          <ChevronRight size={18} className="text-gray-200" />
        </button>
        {menus.map((menu) => (
          <button key={menu.path} type="button" onClick={() => navigate(menu.path)} className="flex w-full items-center justify-between border-b border-gray-100 py-4 text-black">
            <span className="text-body-7">{menu.label}</span>
            <ChevronRight size={18} className="text-gray-200" />
          </button>
        ))}
      </nav>

      <div className="px-4 py-6">
        <button
          type="button"
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className="text-body-9 text-gray-300"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}

export default MyPage
