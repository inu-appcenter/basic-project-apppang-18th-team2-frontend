import { Heart } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialItems = [
  { id: 1, name: '남성 경량 구스다운 패딩 점퍼', price: 61000, originPrice: 89000, rating: 4.8, reviews: 2104 },
  { id: 2, name: '오버핏 울 코트', price: 92800, originPrice: 129000, rating: 4.7, reviews: 1028 },
  { id: 3, name: '베이직 니트 스웨터', price: 34900, rating: 4.8, reviews: 2560 },
  { id: 4, name: '레더 첼시 부츠', price: 79000, rating: 4.6, reviews: 774 },
]

function WishlistPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState(initialItems)

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <Heart size={48} className="text-gray-200" />
        <p className="text-body-6 text-gray-300">찜한 상품이 없습니다</p>
        <button type="button" onClick={() => navigate('/')} className="bg-primary-200 text-body-5 rounded-lg px-6 py-3 text-white">
          쇼핑하러 가기
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="px-4 py-3">
        <h1 className="text-title-5 text-black">찜 리스트</h1>
        <p className="text-body-9 mt-1 text-gray-300">총 {items.length}개</p>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item.id} className="flex gap-3 border-b border-gray-100 px-4 py-4">
            <button
              type="button"
              onClick={() => navigate(`/products/${item.id}`)}
              className="h-24 w-24 shrink-0 rounded-xl bg-gray-100"
            />
            <div className="flex flex-1 flex-col">
              <button type="button" onClick={() => navigate(`/products/${item.id}`)} className="text-body-7 text-left text-black">
                {item.name}
              </button>
              {item.originPrice && (
                <p className="text-body-11 text-gray-300 line-through">{item.originPrice.toLocaleString()}원</p>
              )}
              <p className="text-body-3 text-black">{item.price.toLocaleString()}원</p>
              <p className="text-body-11 mt-auto text-black">
                ★ {item.rating} <span className="text-gray-300">({item.reviews.toLocaleString()})</span>
              </p>
            </div>
            <button type="button" onClick={() => removeItem(item.id)} aria-label="찜 해제" className="self-start p-1 text-black">
              <Heart size={22} fill="currentColor" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WishlistPage
