import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const fields = [
  { key: 'email', label: '이메일', placeholder: 'seller@shop.com', type: 'email' },
  { key: 'password', label: '비밀번호', placeholder: '영문+숫자 8~20자', type: 'password' },
  { key: 'confirm', label: '비밀번호 확인', placeholder: '비밀번호를 다시 입력해주세요', type: 'password' },
  { key: 'name', label: '이름', placeholder: '한글 또는 영문, 2자 이상', type: 'text' },
  { key: 'phone', label: '휴대폰 번호', placeholder: '01012345678 (숫자만)', type: 'text', numeric: true },
  { key: 'business', label: '사업자 등록번호', placeholder: '000-00-00000', type: 'text', numeric: true },
]

function SellerRegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<Record<string, string>>({})
  const [agreed, setAgreed] = useState(false)

  const handleChange = (key: string, value: string, numeric?: boolean) => {
    setForm({ ...form, [key]: numeric ? value.replace(/\D/g, '') : value })
  }

  const allFilled = fields.every((f) => form[f.key])
  const canSubmit = allFilled && agreed

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="relative flex h-14 items-center justify-center border-b border-gray-100 px-3">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <ChevronLeft size={24} className="text-black" />
        </button>
        <h1 className="text-body-3 text-black">판매자 회원가입</h1>
      </header>

      <div className="flex flex-col gap-3 px-4 py-4">
        {fields.map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <label className="text-body-9 text-gray-300">{field.label}</label>
            <input
              type={field.type}
              value={form[field.key] ?? ''}
              inputMode={field.numeric ? 'numeric' : undefined}
              onChange={(e) => handleChange(field.key, e.target.value, field.numeric)}
              placeholder={field.placeholder}
              className="text-body-6 border border-gray-300 px-3 py-3 outline-none placeholder:text-gray-300"
            />
          </div>
        ))}

        <button type="button" onClick={() => setAgreed(!agreed)} className="mt-2 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-3 text-left">
          <span className={`flex h-5 w-5 items-center justify-center rounded ${agreed ? 'bg-primary-200' : 'border border-gray-200 bg-white'}`}>
            {agreed && <span className="text-body-11 text-white">✓</span>}
          </span>
          <span className="text-body-7 text-black">판매자 이용약관에 모두 동의합니다 (필수)</span>
        </button>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => navigate('/seller')}
          className={`text-body-5 mt-2 py-3.5 text-white ${canSubmit ? 'bg-primary-200' : 'bg-gray-200'}`}
        >
          동의하고 가입하기
        </button>
      </div>
    </div>
  )
}

export default SellerRegisterPage
