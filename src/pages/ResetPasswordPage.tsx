import axios from 'axios'
import { ChevronLeft, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { confirmPasswordReset } from '@/api/auth'

function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const isMismatch = confirm.length > 0 && password !== confirm
  const canSubmit = password.length >= 8 && confirm.length > 0 && !isMismatch && !!token

  const handleSubmit = async () => {
    if (!canSubmit || !token || submitting) return
    setSubmitting(true)
    setError('')
    try {
      await confirmPasswordReset(token, password)
      //원래 탭(재설정을 요청한 화면)에 완료 신호 — 같은 브라우저의 다른 탭에서 storage 이벤트로 감지된다
      localStorage.setItem('passwordResetDone', String(Date.now()))
      setDone(true)
      //이메일 링크로 새로 열린 탭은 스크립트로 닫을 수 있다 — 못 닫는 환경(같은 탭 진입, 모바일 등)이면 완료 화면이 그대로 남는다
      setTimeout(() => window.close(), 1500)
    } catch (e) {
      const message = axios.isAxiosError(e) ? e.response?.data?.message : undefined
      setError(message ?? '비밀번호 재설정에 실패했습니다. 링크가 만료되었을 수 있어요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="relative flex h-14 items-center justify-center border-b border-gray-100 px-3">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <ChevronLeft size={24} className="text-black" />
        </button>
        <h1 className="text-body-3 text-black">비밀번호 재설정</h1>
      </header>

      {done ? (
        <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
          <p className="text-body-3 text-black">비밀번호가 변경되었습니다</p>
          <p className="text-body-9 text-gray-300">
            이 탭은 잠시 후 자동으로 닫힙니다. 닫히지 않으면 직접 닫아주세요.
            <br />
            재설정을 요청했던 화면에서 새 비밀번호로 로그인해주세요.
          </p>
        </div>
      ) : (
      <div className="flex flex-col gap-2 px-4 py-4">
        <p className="text-body-9 text-gray-300">새로 사용할 비밀번호를 입력해주세요</p>

        {!token && (
          <p className="text-body-10 text-red-300">
            유효하지 않은 접근이에요. 이메일에 있는 링크로 다시 들어와주세요.
          </p>
        )}

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
            {!showPassword ? <EyeOff size={20} className="text-gray-300" /> : <Eye size={20} className="text-gray-300" />}
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
        {error && <p className="text-body-10 text-red-300">{error}</p>}

        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
          className={`text-body-5 mt-4 py-3.5 text-white ${canSubmit ? 'bg-primary-200' : 'bg-gray-200'}`}
        >
          비밀번호 재설정
        </button>
      </div>
      )}
    </div>
  )
}

export default ResetPasswordPage
