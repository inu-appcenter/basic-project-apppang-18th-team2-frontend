import axios from 'axios'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { findId, requestPasswordReset } from '@/api/auth'

function maskEmail(email: string) {
  const [id, domain] = email.split('@')
  return `${id.slice(0, 3)}****@${domain}`
}

function FindAccountPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'id' | 'password'>('id')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [foundEmail, setFoundEmail] = useState('')
  const [findError, setFindError] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [sending, setSending] = useState(false)

  //이메일을 보낸 뒤, 새 탭에서 재설정이 완료되면 storage 이벤트로 신호를 받아 로그인으로 이동
  useEffect(() => {
    if (!resetSent) return
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'passwordResetDone') navigate('/login')
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [resetSent, navigate])

  const canSubmit = tab === 'id' ? name && phone : name && email

  const handleSubmit = async () => {
    if (sending) return
    setSending(true)
    setFindError('')
    setFoundEmail('')
    setResetSent(false)

    if (tab === 'password') {
      try {
        await requestPasswordReset(email)
        setResetSent(true)
      } catch (error) {
        const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined
        setFindError(message ?? '가입된 이메일을 확인해주세요.')
      } finally {
        setSending(false)
      }
      return
    }

    try {
      const { data } = await findId({ name, phone })
      setFoundEmail(data.data.email)
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined
      setFindError(message ?? '입력하신 정보와 일치하는 회원이 없습니다.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="relative flex h-14 items-center justify-center border-b border-gray-100 px-3">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <ChevronLeft size={24} className="text-black" />
        </button>
        <h1 className="text-body-3 text-black">아이디/비밀번호 찾기</h1>
      </header>

      <div className="m-4 flex gap-1 rounded-xl bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setTab('id')}
          className={`text-body-7 flex-1 rounded-lg py-2.5 ${tab === 'id' ? 'bg-white text-black' : 'text-gray-300'}`}
        >
          아이디 찾기
        </button>
        <button
          type="button"
          onClick={() => setTab('password')}
          className={`text-body-7 flex-1 rounded-lg py-2.5 ${tab === 'password' ? 'bg-white text-black' : 'text-gray-300'}`}
        >
          비밀번호 찾기
        </button>
      </div>

      <div className="flex flex-col gap-3 px-4">
        <p className="text-body-9 text-gray-300">
          {tab === 'id'
            ? '가입 시 입력한 정보로 아이디(이메일)를 찾을 수 있어요'
            : '가입 정보를 확인한 뒤 비밀번호를 재설정할 수 있어요'}
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          className="text-body-6 border border-gray-300 px-3 py-3 outline-none placeholder:text-gray-300"
        />

        {tab === 'id' ? (
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            placeholder="휴대폰 번호 (숫자만)"
            inputMode="numeric"
            className="text-body-6 border border-gray-300 px-3 py-3 outline-none placeholder:text-gray-300"
          />
        ) : (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            className="text-body-6 border border-gray-300 px-3 py-3 outline-none placeholder:text-gray-300"
          />
        )}

        <button
          type="button"
          disabled={!canSubmit || sending}
          onClick={handleSubmit}
          className={`text-body-5 flex items-center justify-center gap-2 py-3.5 text-white ${canSubmit && !sending ? 'bg-primary-200' : 'bg-gray-200'}`}
        >
          {sending && <Loader2 size={18} className="animate-spin" />}
          {sending && tab === 'password' ? '이메일 전송 중...' : tab === 'id' ? '아이디 찾기' : '비밀번호 찾기'}
        </button>

        {findError && <p className="text-body-10 text-red-300">{findError}</p>}

        {tab === 'id' && foundEmail && (
          <div className="mt-2 rounded-xl bg-gray-100 p-5">
            <p className="text-body-9 text-gray-300">회원님의 아이디는</p>
            <p className="text-body-3 mt-1 text-black">{maskEmail(foundEmail)}</p>
          </div>
        )}

        {tab === 'password' && resetSent && (
          <div className="mt-2 rounded-xl bg-gray-100 p-5">
            <p className="text-body-9 text-center text-gray-300">
              입력하신 이메일로 비밀번호 재설정 링크를 보냈어요.
              <br />
              메일함을 확인해주세요.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FindAccountPage
