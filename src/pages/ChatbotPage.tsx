import { ArrowLeft, Bot, ChevronDown, Send, ShoppingCart } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'

type RecommendProduct = {
  id: number
  name: string
  price: number
  originPrice?: number
  sale?: number
  rating: number
}

type ChatMessage = {
  id: number
  sender: 'bot' | 'user'
  text?: string
  time: string
  quickReplies?: string[]
  products?: RecommendProduct[]
}

const RECOMMEND_PRODUCTS: RecommendProduct[] = [
  { id: 1, name: '남성 경량 구스다운 패딩 점퍼', price: 61000, originPrice: 89000, sale: 31, rating: 4.8 },
  { id: 3, name: '무선 핸디 청소기', price: 135150, originPrice: 159000, sale: 15, rating: 4.9 },
  { id: 5, name: '오버핏 울 코트', price: 92800, originPrice: 129000, sale: 28, rating: 4.7 },
]

const INITIAL_QUICK_REPLIES = ['상품 추천', '주문 조회', '배송 문의']

function formatTime(date: Date) {
  const hours = date.getHours()
  const period = hours < 12 ? '오전' : '오후'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${period} ${hour12}:${minutes}`
}

let messageId = 0
const nextId = () => {
  messageId += 1
  return messageId
}

function buildBotReply(text: string): Omit<ChatMessage, 'id' | 'sender' | 'time'> {
  if (/추천|상품|패딩|청소기|코트|옷|사고\s?싶/.test(text)) {
    return { text: '요즘 인기 있는 상품을 추천해 드릴게요!', products: RECOMMEND_PRODUCTS }
  }
  if (/주문/.test(text)) {
    return { text: '주문 내역은 마이페이지 > 주문 내역에서 확인하실 수 있어요.', quickReplies: ['배송 문의'] }
  }
  if (/배송/.test(text)) {
    return { text: '배송 조회는 주문 상세 페이지에서 가능해요. 결제 완료 후 보통 2~3일 이내 도착합니다.' }
  }
  if (/교환|반품|환불/.test(text)) {
    return { text: '상품 수령 후 7일 이내에 마이페이지 > 주문 내역에서 교환·반품 신청이 가능해요.' }
  }
  if (/비밀번호|계정|로그인/.test(text)) {
    return { text: '로그인 페이지의 "아이디·비밀번호 찾기"에서 재설정하실 수 있어요.' }
  }
  return { text: '죄송합니다. 해당 질문은 아직 지원하지 않습니다.' }
}

function ChatbotPage() {
  const navigate = useNavigate()
  const addToCart = useCartStore((state) => state.addItem)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: nextId(),
      sender: 'bot',
      text: '안녕하세요! 무엇을 도와드릴까요? 상품 추천, 주문 조회, 배송 문의 등 편하게 말씀해 주세요 😊',
      time: formatTime(new Date()),
      quickReplies: INITIAL_QUICK_REPLIES,
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showScrollDown, setShowScrollDown] = useState(false)

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const el = document.getElementById('main-scroll')
    el?.scrollTo({ top: el.scrollHeight, behavior })
  }

  useEffect(() => {
    scrollToBottom(messages.length <= 1 ? 'auto' : 'smooth')
  }, [messages, isTyping])

  useEffect(() => {
    const el = document.getElementById('main-scroll')
    if (!el) return undefined

    const handleScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
      setShowScrollDown(distanceFromBottom > 200)
    }
    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  const sendMessage = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    setMessages((prev) => [...prev, { id: nextId(), sender: 'user', text: trimmed, time: formatTime(new Date()) }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const reply = buildBotReply(trimmed)
      setMessages((prev) => [...prev, { id: nextId(), sender: 'bot', time: formatTime(new Date()), ...reply }])
      setIsTyping(false)
    }, 900)
  }

  return (
    <div className="flex min-h-full flex-col bg-white">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-gray-100 bg-white px-3 py-3">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기" className="p-1 text-black">
          <ArrowLeft size={22} />
        </button>
        <span className="text-body-5 text-black">앱팡 챗봇</span>
      </div>

      <div className="flex-1 px-4 py-4">
        <ul className="flex flex-col gap-4">
          {messages.map((message) => (
            <li key={message.id} className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex max-w-[85%] items-end gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                {message.sender === 'bot' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <Bot size={16} className="text-gray-300" />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  {message.text && (
                    <div
                      className={`text-body-7 rounded-2xl px-4 py-2.5 ${
                        message.sender === 'user' ? 'bg-primary-200 text-white' : 'bg-gray-100 text-black'
                      }`}
                    >
                      {message.text}
                    </div>
                  )}
                  <span className={`text-body-12 text-gray-300 ${message.sender === 'user' ? 'text-right' : ''}`}>{message.time}</span>
                </div>
              </div>

              {message.products && (
                <div className="mt-2 ml-9 flex gap-2 overflow-x-auto pb-1">
                  {message.products.map((product) => (
                    <div key={product.id} className="w-32 shrink-0 rounded-xl border border-gray-100 p-2">
                      <button type="button" onClick={() => navigate(`/products/${product.id}`)} className="block w-full text-left">
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                          {product.sale && (
                            <span className="text-body-12 absolute top-0 left-0 rounded-br-lg bg-black px-1.5 py-0.5 text-white">
                              {product.sale}%
                            </span>
                          )}
                        </div>
                        <p className="text-body-11 mt-1.5 line-clamp-2 text-black">{product.name}</p>
                        <p className="text-body-9 text-black">{product.price.toLocaleString()}원</p>
                        <p className="text-body-12 text-black">★ {product.rating}</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => addToCart(product.id, 1).catch(() => {})}
                        className="text-body-12 mt-1.5 flex w-full items-center justify-center gap-1 rounded-lg border border-gray-200 py-1.5 text-black"
                      >
                        <ShoppingCart size={12} />
                        담기
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {message.quickReplies && (
                <div className="mt-2 ml-9 flex flex-wrap gap-2">
                  {message.quickReplies.map((reply) => (
                    <button
                      key={reply}
                      type="button"
                      onClick={() => sendMessage(reply)}
                      className="text-body-9 border-primary-200 text-primary-200 rounded-full border px-3 py-1.5"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}

          {isTyping && (
            <li className="flex items-end gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <Bot size={16} className="text-gray-300" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl bg-gray-100 px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-300 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-300 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-300" />
              </div>
            </li>
          )}
        </ul>
      </div>

      {showScrollDown && (
        <button
          type="button"
          onClick={() => scrollToBottom()}
          aria-label="최하단으로 이동"
          className="sticky bottom-20 left-full mr-4 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-black shadow-md"
        >
          <ChevronDown size={18} />
        </button>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage(input)
        }}
        className="sticky bottom-0 flex items-center gap-2 border-t border-gray-100 bg-white px-3 py-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="text-body-7 flex-1 rounded-full border border-gray-200 px-4 py-2.5 outline-none placeholder:text-gray-300"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="전송"
          className="bg-primary-200 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white disabled:bg-gray-200"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}

export default ChatbotPage
