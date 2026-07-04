import { Eye, EyeOff, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SellerLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const canLogin = email.length > 0 && password.length > 0

  return (
    <div className="flex min-h-screen flex-col items-center gap-3 bg-white px-4">
      <div className="mt-16 mb-2 flex flex-col items-center gap-3">
        <h1 className="text-title-3 tracking-widest text-black">앱팡</h1>
        <span className="bg-primary-200 text-body-11 rounded-full px-3 py-1 text-white">SELLER</span>
        <p className="text-body-9 text-gray-300">판매자 센터에 로그인하세요</p>
      </div>

      <div className="flex w-full items-center gap-2 border border-gray-300 px-3 py-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="아이디(이메일)"
          className="text-body-6 flex-1 outline-none placeholder:text-gray-300"
        />
        {email && (
          <button type="button" onClick={() => setEmail('')} className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
            <X size={12} className="text-white" />
          </button>
        )}
      </div>

      <div className="flex w-full items-center gap-2 border border-gray-300 px-3 py-3">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="text-body-6 flex-1 outline-none placeholder:text-gray-300"
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff size={20} className="text-gray-300" /> : <Eye size={20} className="text-gray-300" />}
        </button>
      </div>

      <button
        type="button"
        disabled={!canLogin}
        onClick={() => navigate('/seller')}
        className={`text-body-5 w-full py-3 text-white ${canLogin ? 'bg-primary-200' : 'bg-gray-200'}`}
      >
        로그인
      </button>

      <div className="flex w-full justify-end">
        <button type="button" onClick={() => navigate('/find-account')} className="text-body-9 text-primary-200">
          아이디·비밀번호 찾기
        </button>
      </div>

      <div className="my-1 h-px w-full bg-gray-200" />

      <button type="button" onClick={() => navigate('/seller/register')} className="text-body-5 text-primary-200 w-full border border-gray-200 py-3">
        판매자 회원가입
      </button>
    </div>
  )
}

export default SellerLoginPage
