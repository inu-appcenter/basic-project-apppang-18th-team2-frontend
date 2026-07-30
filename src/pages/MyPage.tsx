import { ChevronRight, Heart, LogIn, Settings, ShoppingBag, ShoppingCart, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout as logoutRequest } from '@/api/auth'
import { getMyOrders } from '@/api/order'
import { getWishlist } from '@/api/wishlist'
import { ORDER_STATUS_LABELS } from '@/constants/order'
import { useAuthStore } from '@/store/authStore'
import { useWishlistStore } from '@/store/wishlistStore'
import type { OrderSummary } from '@/types/api'

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
  const wishlistCount = useWishlistStore((state) => state.items.length)
  const setWishlistItems = useWishlistStore((state) => state.setItems)
  const [orderCount, setOrderCount] = useState(0)
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([])

  useEffect(() => {
    if (!user) return
    getWishlist()
      .then(({ data }) => {
        setWishlistItems(
          data.data.products.map((product) => ({
            id: product.productId,
            name: product.name,
            price: product.salePrice,
            originPrice: product.discountRate > 0 ? product.originalPrice : undefined,
            rating: product.rating,
            reviews: product.reviewCount,
          })),
        )
      })
      .catch(() => {})
  }, [user, setWishlistItems])

  useEffect(() => {
    if (!user) return
    let cancelled = false

    // 목록 API가 페이지당 개수만 주기 때문에 전체 건수는 마지막 페이지까지 이어서 조회해 합산한다
    async function loadOrders() {
      const all: OrderSummary[] = []
      let page = 1
      while (true) {
        const { data } = await getMyOrders(page)
        all.push(...data.data.orders)
        if (!data.data.hasNext) break
        page += 1
      }
      if (!cancelled) {
        setOrderCount(all.length)
        setRecentOrders(all.slice(0, 4))
      }
    }

    loadOrders().catch(() => {})
    return () => {
      cancelled = true
    }
  }, [user])

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
          <span className="text-title-5 text-black">{orderCount}</span>
          <span className="text-body-9 text-gray-300">주문 내역</span>
        </button>
        <button type="button" onClick={() => navigate('/wishlist')} className="flex flex-col items-center gap-1 rounded-xl bg-gray-100 py-4">
          <Heart size={20} className="text-primary-200" />
          <span className="text-title-5 text-black">{wishlistCount}</span>
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
        {recentOrders.length === 0 ? (
          <p className="text-body-9 py-6 text-center text-gray-300">주문 내역이 없습니다</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {recentOrders.map((order) => (
              <div key={order.orderId} className="w-24 shrink-0">
                <div className="relative aspect-square w-full">
                  <button
                    type="button"
                    onClick={() => navigate(`/orders/${order.orderId}`)}
                    className="h-full w-full overflow-hidden rounded-xl bg-gray-100"
                  >
                    {order.thumbnail && <img src={order.thumbnail} alt={order.productName} className="h-full w-full object-cover" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/cart')}
                    aria-label="장바구니 담기"
                    className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white"
                  >
                    <ShoppingCart size={13} className="text-black" />
                  </button>
                </div>
                <p className="text-body-10 mt-1.5 text-center text-black">{ORDER_STATUS_LABELS[order.orderStatus]}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="my-5 h-2 bg-gray-100" />

      <nav className="px-4">
        <button type="button" onClick={() => navigate('/mypage/settings')} className="flex w-full items-center justify-between border-b border-gray-100 py-4 text-black">
          <span className="text-body-7">계정 설정</span>
          <ChevronRight size={18} className="text-gray-200" />
        </button>
      </nav>

      <div className="px-4 py-6">
        <button
          type="button"
          onClick={() => {
            // 서버 세션 정리는 최선을 다해 시도하고, 실패해도 로컬 로그아웃은 진행한다
            logoutRequest()
              .catch(() => {})
              .finally(() => {
                logout()
                navigate('/login')
              })
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
