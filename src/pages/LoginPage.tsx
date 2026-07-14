import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginRequest } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState(false)

  const isActive = email.length > 0 && password.length > 0

  const handleLogin = async () => {
    try {
      const { data } = await loginRequest(email, password)
      localStorage.setItem('accessToken', data.accessToken)
      // 백엔드 로그인 응답에 아직 사용자 정보가 없어 입력값으로 임시 구성 (TODO: 응답에 user 추가되면 교체)
      login({ userId: 1, email, name: email.split('@')[0] })
      navigate('/')
    } catch {
      setLoginError(true)
    }
  }

  return (
    <div className="relative flex flex-col items-center gap-3 px-3 min-h-screen bg-white w-full">
      <header className="flex justify-end items-center w-full py-5">
        <button type="button" onClick={() => navigate(-1)} className="p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7E7E7E" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div className="flex justify-center items-center w-full py-3">
        <img src="/apppang-logo.png" alt="앱팡" className="h-[29.51px]" />
      </div>

      {/* 이메일 */}
      <div className="flex items-center w-full border border-gray-300 px-3 py-3 gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="아이디(이메일)"
          className="text-body-1 flex-1 outline-none placeholder:text-gray-300"
        />
        {email && (
          <button type="button" onClick={() => setEmail('')} className="flex items-center justify-center w-5 h-5 bg-gray-300 rounded-full shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M2 2l6 6M8 2L2 8" />
            </svg>
          </button>
        )}
      </div>

      {/* 비밀번호 */}
      <div className="flex items-center w-full border border-gray-300 px-3 py-3 gap-2">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="text-body-1 flex-1 outline-none placeholder:text-gray-300"
        />
        <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="shrink-0">
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7E7E7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7E7E7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      {/* 로그인 */}
      <button
        type="button"
        disabled={!isActive}
        onClick={handleLogin}
        className={`flex justify-center items-center w-full py-3 text-base font-bold text-white transition-colors ${
          isActive ? 'bg-primary-200' : 'bg-gray-200'
        }`}
      >
        로그인
      </button>

      {/* 아이디/비밀번호 찾기 */}
      <div className="flex justify-end w-full">
        <button type="button" onClick={() => navigate('/find-account')} className="flex items-center gap-1 text-xs font-semibold text-primary-200">
          아이디·비밀번호 찾기
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#346AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 3L7.5 6l-3 3" />
          </svg>
        </button>
      </div>

      <div className="w-full h-px bg-gray-200" />

      <button type="button" onClick={() => navigate('/register')} className="flex justify-center items-center w-full py-3 border border-gray-200 text-base font-bold text-primary-200">
        회원가입
      </button>

      <div className="flex justify-center items-center gap-1.5 w-full">
        <span className="text-xs font-semibold text-black">사업자이신가요?</span>
        <button type="button" onClick={() => navigate('/seller/login')} className="text-xs font-semibold text-primary-200">
          판매자 로그인
        </button>
        <span className="text-xs font-semibold text-gray-300">·</span>
        <button type="button" onClick={() => navigate('/seller/register')} className="flex items-center gap-1 text-xs font-semibold text-primary-200">
          회원가입하기
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#346AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 3L7.5 6l-3 3" />
          </svg>
        </button>
      </div>

      {/* 로그인 실패 토스트 */}
      {loginError && (
        <div className="absolute top-[57px] left-[95px] flex items-center gap-2 px-3 py-2 bg-white rounded shadow-[4px_4px_12px_0px_rgba(0,0,0,0.25)] w-[200px]">
          <button type="button" onClick={() => setLoginError(false)} className="shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#7E7E7E" strokeWidth="2" strokeLinecap="round">
              <path d="M2 2l8 8M10 2L2 10" />
            </svg>
          </button>
          <p className="text-xs font-semibold flex-1">
            아이디 또는 비밀번호가<br />일치하지 않습니다
          </p>
        </div>
      )}
    </div>
  )
}

export default LoginPage
