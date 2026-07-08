import { Camera, ChevronLeft, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const user = {
  name: '주민서',
  email: 'minseo@shop.com',
  phone: '01012345678',
  birth: '2000.05.26',
}

function maskName(name: string) {
  if (name.length <= 2) return name[0] + '*'
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
}

function maskEmail(email: string) {
  const [id, domain] = email.split('@')
  return id.slice(0, 3) + '****@' + domain
}

function maskPhone(phone: string) {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3')
}

function AccountSettingsPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen justify-center bg-white">
      <div className="flex w-full max-w-120 flex-col bg-white">
        <header className="relative flex h-14 items-center justify-center px-3">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
            <ChevronLeft size={24} className="text-black" />
          </button>
          <h1 className="text-body-3 text-black">계정 설정</h1>
        </header>

        <section className="flex flex-col items-center gap-3 px-4 py-6">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <User size={40} className="text-gray-300" />
            </div>
            <button type="button" aria-label="프로필 사진 변경" className="bg-primary-200 absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white">
              <Camera size={14} className="text-white" />
            </button>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-body-3 text-black">{maskName(user.name)}</p>
            <p className="text-body-9 text-gray-300">{maskEmail(user.email)}</p>
          </div>
        </section>

        <div className="h-2 bg-gray-100" />

        <section className="px-4 py-4">
          <h2 className="text-body-5 mb-1 text-black">회원정보</h2>
          <div className="flex items-center justify-between border-b border-gray-100 py-3.5">
            <span className="text-body-8 text-gray-300">이메일</span>
            <span className="text-body-7 text-black">{maskEmail(user.email)}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-100 py-3.5">
            <span className="text-body-8 text-gray-300">휴대폰</span>
            <span className="text-body-7 text-black">{maskPhone(user.phone)}</span>
          </div>
          <div className="flex items-center justify-between py-3.5">
            <span className="text-body-8 text-gray-300">생년월일</span>
            <span className="text-body-7 text-black">{user.birth}</span>
          </div>
        </section>

        <div className="h-2 bg-gray-100" />

        <div className="mt-auto flex items-center justify-between px-4 py-6">
          <button type="button" className="text-body-9 text-gray-300">로그아웃</button>
          <button type="button" className="text-body-9 text-gray-300">회원탈퇴</button>
        </div>
      </div>
    </div>
  )
}

export default AccountSettingsPage
