import { ChevronLeft, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const isMismatch = confirm.length > 0 && password !== confirm
  const canSubmit = password.length >= 8 && confirm.length > 0 && !isMismatch

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="relative flex h-14 items-center justify-center border-b border-gray-100 px-3">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <ChevronLeft size={24} className="text-black" />
        </button>
        <h1 className="text-body-3 text-black">비밀번호 재설정</h1>
      </header>

      <div className="flex flex-col gap-2 px-4 py-4">
        <p className="text-body-9 text-gray-300">새로 사용할 비밀번호를 입력해주세요</p>

        <label className="text-body-9 mt-3 text-gray-300">새 비밀번호</label>
        <div className="flex items-center gap-2 border border-gray-300 px-3 py-3">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="영문+숫자 조합 8~20자"
            className="text-body-6 flex-1 outline-none placeholder:text-gray-300"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} className="text-gray-300" /> : <Eye size={20} className="text-gray-300" />}
          </button>
        </div>

        <label className="text-body-9 mt-2 text-gray-300">새 비밀번호 확인</label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="비밀번호를 다시 입력해주세요"
          className={`text-body-6 border px-3 py-3 outline-none placeholder:text-gray-300 ${isMismatch ? 'border-red-300' : 'border-gray-300'}`}
        />
        {isMismatch && <p className="text-body-10 text-red-300">새 비밀번호가 일치하지 않습니다.</p>}

        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => navigate('/login')}
          className={`text-body-5 mt-4 py-3.5 text-white ${canSubmit ? 'bg-primary-200' : 'bg-gray-200'}`}
        >
          비밀번호 재설정
        </button>
      </div>
    </div>
  )
}

export default ResetPasswordPage
