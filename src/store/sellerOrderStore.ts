import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type OrderStatus = '결제완료' | '상품준비' | '배송지시' | '배송중' | '배송완료'

export const STATUS_FLOW: OrderStatus[] = ['결제완료', '상품준비', '배송지시', '배송중', '배송완료']

export type Order = {
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

type SellerOrderState = {
  orders: Order[]
  // 배송상태는 앞 단계로만 진행 가능. 성공 여부를 반환해 호출부에서 실패 메시지를 띄울 수 있게 한다
  changeStatus: (id: string, next: OrderStatus) => boolean
}

export const useSellerOrderStore = create<SellerOrderState>()(
  persist(
    (set, get) => ({
      orders: initialOrders,
      changeStatus: (id, next) => {
        const order = get().orders.find((o) => o.id === id)
        if (!order || STATUS_FLOW.indexOf(next) <= STATUS_FLOW.indexOf(order.status)) return false
        set({ orders: get().orders.map((o) => (o.id === id ? { ...o, status: next } : o)) })
        return true
      },
    }),
    { name: 'seller-orders' },
  ),
)
