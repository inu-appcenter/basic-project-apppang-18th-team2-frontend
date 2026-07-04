import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Product = {
  id: number
  status: '판매중' | '품절' | '숨김'
  name: string
  stock: number
  price: number
}

const initialProducts: Product[] = [
  { id: 1, status: '판매중', name: '남성 경량 구스다운 패딩', stock: 124, price: 39000 },
  { id: 2, status: '품절', name: '베이직 니트 스웨터', stock: 0, price: 34900 },
  { id: 3, status: '숨김', name: '와이드 슬랙스', stock: 58, price: 29400 },
  { id: 4, status: '판매중', name: '레더 첼시 부츠', stock: 32, price: 79000 },
]

const statusStyle = {
  판매중: 'bg-black text-white',
  품절: 'border border-gray-300 text-gray-300',
  숨김: 'bg-gray-100 text-gray-300',
}

function ProductManagePage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState(initialProducts)
  const [checked, setChecked] = useState<number[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ name: '', stock: '', price: '' })

  const allChecked = checked.length === products.length && products.length > 0

  const toggleAll = () => {
    setChecked(allChecked ? [] : products.map((p) => p.id))
  }

  const toggleOne = (id: number) => {
    setChecked(checked.includes(id) ? checked.filter((c) => c !== id) : [...checked, id])
  }

  const deleteChecked = () => {
    setProducts(products.filter((p) => !checked.includes(p.id)))
    setChecked([])
  }

  const startEdit = (product: Product) => {
    setEditingId(product.id)
    setEditForm({ name: product.name, stock: String(product.stock), price: String(product.price) })
  }

  const saveEdit = (id: number) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, name: editForm.name, stock: Number(editForm.stock), price: Number(editForm.price) } : p,
      ),
    )
    setEditingId(null)
  }

  return (
    <div className="flex min-h-screen justify-center bg-white">
      <div className="flex w-full max-w-120 flex-col bg-white">
        <header className="relative flex h-14 items-center justify-center border-b border-gray-100 px-3">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
            <ChevronLeft size={24} className="text-black" />
          </button>
          <h1 className="text-body-3 text-black">상품 관리</h1>
        </header>

        <div className="flex items-center justify-between px-4 py-3">
          <button type="button" onClick={toggleAll} className="flex items-center gap-2">
            <span className={`flex h-5 w-5 items-center justify-center rounded ${allChecked ? 'bg-primary-200' : 'border border-gray-200'}`}>
              {allChecked && <span className="text-body-11 text-white">✓</span>}
            </span>
            <span className="text-body-7 text-black">전체선택</span>
          </button>
          <button type="button" onClick={deleteChecked} className="text-body-8 rounded-lg border border-black px-3 py-1.5 text-black">
            선택 삭제
          </button>
        </div>

        <ul className="border-t border-gray-100">
          {products.map((product) => (
            <li key={product.id} className="flex gap-3 border-b border-gray-100 px-4 py-4">
              <button type="button" onClick={() => toggleOne(product.id)} className="self-start pt-1">
                <span className={`flex h-5 w-5 items-center justify-center rounded ${checked.includes(product.id) ? 'bg-primary-200' : 'border border-gray-200'}`}>
                  {checked.includes(product.id) && <span className="text-body-11 text-white">✓</span>}
                </span>
              </button>

              <div className="h-14 w-14 shrink-0 rounded-lg bg-gray-100" />

              {editingId === product.id ? (
                <div className="flex flex-1 flex-col gap-2">
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="text-body-8 border border-gray-300 px-2 py-1.5 outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      value={editForm.stock}
                      onChange={(e) => setEditForm({ ...editForm, stock: e.target.value.replace(/\D/g, '') })}
                      className="text-body-8 flex-1 border border-gray-300 px-2 py-1.5 outline-none"
                    />
                    <input
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value.replace(/\D/g, '') })}
                      className="text-body-8 flex-1 border border-gray-300 px-2 py-1.5 outline-none"
                    />
                  </div>
                  <button type="button" onClick={() => saveEdit(product.id)} className="bg-primary-200 text-body-8 self-end rounded-lg px-4 py-1.5 text-white">
                    저장
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className={`text-body-11 w-fit rounded px-2 py-0.5 ${statusStyle[product.status]}`}>{product.status}</span>
                    <span className="text-body-8 text-black">{product.name}</span>
                    <span className="text-body-10 text-gray-300">재고 {product.stock} · {product.price.toLocaleString()}원</span>
                  </div>
                  <button type="button" onClick={() => startEdit(product)} className="text-body-8 self-start rounded-lg border border-gray-200 px-3 py-1.5 text-black">
                    수정
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProductManagePage
