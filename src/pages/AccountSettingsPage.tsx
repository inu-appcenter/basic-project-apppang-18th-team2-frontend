import { Check, ChevronLeft, Loader2, Plus, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addAddress, deleteAddress, getAddresses, updateDefaultAddress } from '@/api/address'
import { logout as logoutRequest } from '@/api/auth'
import { deleteMyInfo, getMyInfo, updateMyInfo } from '@/api/user'
import { useAuthStore } from '@/store/authStore'
import type { Address } from '@/types/api'

function maskName(name: string) {
  if (name.length <= 2) return name[0] + '*'
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
}

function maskEmail(email: string) {
  const [id, domain] = email.split('@')
  return id.slice(0, 3) + '****@' + domain
}

const emptyAddressForm = { receiver: '', receiverPhone: '', roadAddress: '', detailAddress: '' }

function AccountSettingsPage() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const syncAuthUser = useAuthStore((state) => state.login)

  const [userInfo, setUserInfo] = useState<{ userId: number; email: string; name: string; phone?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressLoading, setAddressLoading] = useState(true)
  const [addForm, setAddForm] = useState(emptyAddressForm)
  const [addFormOpen, setAddFormOpen] = useState(false)
  const [addSubmitting, setAddSubmitting] = useState(false)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const fetchUser = () => {
    setLoading(true)
    getMyInfo()
      .then(({ data }) => {
        setUserInfo(data.data)
        setNameInput(data.data.name)
        setPhoneInput(data.data.phone ?? '')
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const fetchAddresses = () => {
    setAddressLoading(true)
    getAddresses()
      .then(({ data }) => setAddresses(data.data))
      .catch(() => {})
      .finally(() => setAddressLoading(false))
  }

  useEffect(() => {
    fetchUser()
    fetchAddresses()
  }, [])

  const handleSaveInfo = async () => {
    setSaveError('')
    if (!/^[가-힣a-zA-Z]{2,}$/.test(nameInput)) {
      setSaveError('이름은 한글 또는 영문 2자 이상이어야 합니다')
      return
    }
    if (!/^010\d{8}$/.test(phoneInput)) {
      setSaveError('휴대폰 번호는 010으로 시작하는 숫자 11자리로 입력해주세요 (- 없이)')
      return
    }
    setSaving(true)
    try {
      await updateMyInfo(nameInput, phoneInput)
      setUserInfo((prev) => (prev ? { ...prev, name: nameInput, phone: phoneInput } : prev))
      if (userInfo) syncAuthUser({ userId: userInfo.userId, email: userInfo.email, name: nameInput, phone: phoneInput })
      setEditing(false)
    } catch {
      setSaveError('회원정보 수정에 실패했습니다')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logoutRequest()
      .catch(() => {})
      .finally(() => {
        logout()
        navigate('/login')
      })
  }

  const handleDeleteAccount = async () => {
    try {
      await deleteMyInfo()
    } catch {
      // 실패해도 로컬 로그아웃은 진행
    } finally {
      logout()
      navigate('/login')
    }
  }

  const handleAddAddress = async () => {
    if (!addForm.receiver.trim() || !addForm.receiverPhone.trim() || !addForm.roadAddress.trim() || !addForm.detailAddress.trim()) return
    setAddSubmitting(true)
    try {
      await addAddress({ ...addForm, isDefault: addresses.length === 0 })
      setAddForm(emptyAddressForm)
      setAddFormOpen(false)
      fetchAddresses()
    } catch {
      // 무시하고 폼 유지
    } finally {
      setAddSubmitting(false)
    }
  }

  const handleSetDefault = (addressId: number) => {
    updateDefaultAddress(addressId)
      .then(fetchAddresses)
      .catch(() => {})
  }

  const handleDeleteAddress = (addressId: number) => {
    deleteAddress(addressId)
      .then(fetchAddresses)
      .catch(() => {})
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 size={24} className="animate-spin text-gray-300" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen justify-center bg-white">
      <div className="flex w-full max-w-120 flex-col bg-white pb-10">
        <header className="relative flex h-14 items-center justify-center px-3">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
            <ChevronLeft size={24} className="text-black" />
          </button>
          <h1 className="text-body-3 text-black">계정 설정</h1>
        </header>

        <section className="flex flex-col items-center gap-3 px-4 py-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <User size={40} className="text-gray-300" />
          </div>
          {userInfo && (
            <div className="flex flex-col items-center">
              <p className="text-body-3 text-black">{maskName(userInfo.name)}</p>
              <p className="text-body-9 text-gray-300">{maskEmail(userInfo.email)}</p>
            </div>
          )}
        </section>

        <div className="h-2 bg-gray-100" />

        <section className="px-4 py-4">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-body-5 text-black">회원정보</h2>
            {!editing && (
              <button type="button" onClick={() => setEditing(true)} className="text-body-9 text-primary-200">
                수정
              </button>
            )}
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 py-3.5">
            <span className="text-body-8 text-gray-300">이메일</span>
            <span className="text-body-7 text-black">{userInfo && maskEmail(userInfo.email)}</span>
          </div>

          {editing ? (
            <>
              <div className="flex items-center justify-between border-b border-gray-100 py-3.5">
                <span className="text-body-8 shrink-0 text-gray-300">이름</span>
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="text-body-7 flex-1 text-right text-black outline-none"
                />
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 py-3.5">
                <span className="text-body-8 shrink-0 text-gray-300">휴대폰</span>
                <input
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="- 없이 숫자만"
                  className="text-body-7 flex-1 text-right text-black outline-none placeholder:text-gray-200"
                />
              </div>
              {saveError && <p className="text-body-11 mt-2 text-red-300">{saveError}</p>}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false)
                    setSaveError('')
                    if (userInfo) {
                      setNameInput(userInfo.name)
                      setPhoneInput(userInfo.phone ?? '')
                    }
                  }}
                  className="text-body-8 flex-1 rounded-lg border border-gray-200 py-2.5 text-black"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSaveInfo}
                  disabled={saving}
                  className="bg-primary-200 text-body-8 flex-1 rounded-lg py-2.5 text-white disabled:bg-gray-200"
                >
                  저장
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between py-3.5">
              <span className="text-body-8 text-gray-300">휴대폰</span>
              <span className="text-body-7 text-black">{userInfo?.phone || '-'}</span>
            </div>
          )}
        </section>

        <div className="h-2 bg-gray-100" />

        <section className="px-4 py-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-body-5 text-black">배송지</h2>
            <button type="button" onClick={() => setAddFormOpen((v) => !v)} className="flex items-center gap-1 text-body-9 text-primary-200">
              <Plus size={14} /> 배송지 추가
            </button>
          </div>

          {addFormOpen && (
            <div className="mb-4 flex flex-col gap-2 rounded-xl border border-gray-200 p-3">
              <input
                value={addForm.receiver}
                onChange={(e) => setAddForm((f) => ({ ...f, receiver: e.target.value }))}
                placeholder="받는 사람"
                className="text-body-8 rounded-lg border border-gray-200 px-3 py-2 outline-none"
              />
              <input
                value={addForm.receiverPhone}
                onChange={(e) => setAddForm((f) => ({ ...f, receiverPhone: e.target.value }))}
                placeholder="연락처 (010-0000-0000)"
                className="text-body-8 rounded-lg border border-gray-200 px-3 py-2 outline-none"
              />
              <input
                value={addForm.roadAddress}
                onChange={(e) => setAddForm((f) => ({ ...f, roadAddress: e.target.value }))}
                placeholder="도로명 주소"
                className="text-body-8 rounded-lg border border-gray-200 px-3 py-2 outline-none"
              />
              <input
                value={addForm.detailAddress}
                onChange={(e) => setAddForm((f) => ({ ...f, detailAddress: e.target.value }))}
                placeholder="상세 주소"
                className="text-body-8 rounded-lg border border-gray-200 px-3 py-2 outline-none"
              />
              <button
                type="button"
                onClick={handleAddAddress}
                disabled={addSubmitting}
                className="bg-primary-200 text-body-8 mt-1 rounded-lg py-2.5 text-white disabled:bg-gray-200"
              >
                저장
              </button>
            </div>
          )}

          {addressLoading ? (
            <Loader2 size={18} className="animate-spin text-gray-300" />
          ) : addresses.length === 0 ? (
            <p className="text-body-9 py-4 text-center text-gray-300">등록된 배송지가 없습니다</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {addresses.map((a) => (
                <li key={a.addressId} className="rounded-xl border border-gray-200 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-body-7 text-black">{a.receiver}</span>
                      {a.isDefault && <span className="text-body-11 rounded-full bg-gray-100 px-2 py-0.5 text-gray-300">기본배송지</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {!a.isDefault && (
                        <button type="button" onClick={() => handleSetDefault(a.addressId)} className="text-body-11 flex items-center gap-0.5 text-gray-300">
                          <Check size={12} /> 기본으로 설정
                        </button>
                      )}
                      {!a.isDefault && (
                        <button type="button" onClick={() => handleDeleteAddress(a.addressId)} aria-label="배송지 삭제" className="text-gray-300">
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-body-9 mt-1 text-gray-300">
                    {a.roadAddress} {a.detailAddress}
                  </p>
                  <p className="text-body-9 text-gray-300">{a.phone}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="h-2 bg-gray-100" />

        <div className="mt-auto flex items-center justify-between px-4 py-6">
          <button type="button" onClick={handleLogout} className="text-body-9 text-gray-300">
            로그아웃
          </button>
          <button type="button" onClick={() => setDeleteConfirmOpen(true)} className="text-body-9 text-gray-300">
            회원탈퇴
          </button>
        </div>

        {deleteConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8">
            <div className="w-full max-w-80 rounded-2xl bg-white p-5">
              <p className="text-body-5 text-center text-black">정말 탈퇴하시겠습니까?</p>
              <p className="text-body-10 mt-2 text-center text-gray-300">탈퇴 후에는 계정 정보를 복구할 수 없습니다</p>
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="text-body-6 flex-1 rounded-lg border border-gray-200 py-2.5 text-black"
                >
                  취소
                </button>
                <button type="button" onClick={handleDeleteAccount} className="bg-primary-200 text-body-6 flex-1 rounded-lg py-2.5 text-white">
                  탈퇴
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AccountSettingsPage
