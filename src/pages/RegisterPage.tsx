import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 이미 가입된 이메일 (중복 체크용 목데이터)
const takenEmails = ['test@test.com', 'admin@shop.com']

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/
const nameRegex = /^[가-힣a-zA-Z]{2,}$/

function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [emailChecked, setEmailChecked] = useState(false)
  const [agree, setAgree] = useState({ terms: false, privacy: false, marketing: false })
  const [error, setError] = useState('')

  const allAgreed = agree.terms && agree.privacy && agree.marketing

  const toggleAll = () => {
    const next = !allAgreed
    setAgree({ terms: next, privacy: next, marketing: next })
  }

  const checkEmail = () => {
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식을 입력해주세요.')
      return
    }
    if (takenEmails.includes(email)) {
      setError('이미 가입된 이메일입니다.')
      setEmailChecked(false)
      return
    }
    setError('')
    setEmailChecked(true)
  }

  const handleSubmit = () => {
    if (!emailRegex.test(email)) return setError('올바른 이메일 형식을 입력해주세요.')
    if (!emailChecked) return setError('이메일 중복확인을 해주세요.')
    if (!passwordRegex.test(password)) return setError('비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.')
    if (password !== confirm) return setError('새 비밀번호가 일치하지 않습니다.')
    if (!nameRegex.test(name)) return setError('이름을 정확히 입력하세요.')
    if (phone.length < 10) return setError('휴대폰번호를 올바르게 입력해주세요.')
    if (!agree.terms || !agree.privacy) return setError('필수 약관에 동의해주세요.')
    // 가입 성공 (실제 저장은 API 연동 시)
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="relative flex h-14 items-center justify-center border-b border-gray-100 px-3">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <ChevronLeft size={24} className="text-black" />
        </button>
        <h1 className="text-body-3 text-black">회원가입</h1>
      </header>

      <div className="flex flex-col gap-4 px-4 py-4">
        {/* 이메일 + 중복확인 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-body-9 text-gray-300">이메일</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailChecked(false)
              }}
              placeholder="이메일을 입력하세요"
              className="text-body-6 flex-1 border border-gray-300 px-3 py-3 outline-none placeholder:text-gray-300"
            />
            <button type="button" onClick={checkEmail} className="text-body-7 shrink-0 border border-gray-300 px-3 text-gray-300">
              중복확인
            </button>
          </div>
          {emailChecked && <p className="text-body-10 text-primary-200">사용 가능한 이메일입니다.</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-body-9 text-gray-300">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="영문+숫자의 형식(8~20자)"
            className="text-body-6 border border-gray-300 px-3 py-3 outline-none placeholder:text-gray-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-body-9 text-gray-300">비밀번호 확인</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="확인을 위해 새 비밀번호를 다시 입력해주세요"
            className={`text-body-6 border px-3 py-3 outline-none placeholder:text-gray-300 ${
              confirm && password !== confirm ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {confirm && password !== confirm && (
            <p className="text-body-10 text-red-300">새 비밀번호가 일치하지 않습니다.</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-body-9 text-gray-300">이름</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 정확히 입력하세요"
            className="text-body-6 border border-gray-300 px-3 py-3 outline-none placeholder:text-gray-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-body-9 text-gray-300">휴대폰 번호</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
            placeholder="휴대폰번호를 올바르게 입력해주세요"
            className="text-body-6 border border-gray-300 px-3 py-3 outline-none placeholder:text-gray-300"
          />
        </div>

        {/* 약관 동의 */}
        <div className="mt-2 flex flex-col gap-3 rounded-lg border border-gray-100 p-3">
          <button type="button" onClick={toggleAll} className="flex items-center gap-2 text-left">
            <span className={`flex h-5 w-5 items-center justify-center rounded ${allAgreed ? 'bg-primary-200' : 'border border-gray-200'}`}>
              {allAgreed && <span className="text-body-11 text-white">✓</span>}
            </span>
            <span className="text-body-6 text-black">약관에 모두 동의합니다</span>
          </button>
          <div className="h-px bg-gray-100" />
          {[
            { key: 'terms', label: '[필수] 이용약관 동의' },
            { key: 'privacy', label: '[필수] 개인정보 수집·이용 동의' },
            { key: 'marketing', label: '[선택] 마케팅 정보 수신 동의' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setAgree({ ...agree, [item.key]: !agree[item.key as keyof typeof agree] })}
              className="flex items-center gap-2 text-left"
            >
              <span className={`flex h-4 w-4 items-center justify-center rounded ${agree[item.key as keyof typeof agree] ? 'bg-primary-200' : 'border border-gray-200'}`}>
                {agree[item.key as keyof typeof agree] && <span className="text-[9px] text-white">✓</span>}
              </span>
              <span className="text-body-8 text-gray-300">{item.label}</span>
            </button>
          ))}
        </div>

        {error && <p className="text-body-9 text-red-300">{error}</p>}

        <button type="button" onClick={handleSubmit} className="bg-primary-200 text-body-5 mt-2 py-3.5 text-white">
          동의하고 가입하기
        </button>
      </div>
    </div>
  )
}

export default RegisterPage
