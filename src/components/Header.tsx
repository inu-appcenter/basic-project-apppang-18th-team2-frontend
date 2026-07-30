import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()

  return (
    <header className="flex h-14 shrink-0 items-center bg-white px-3">
      <button type="button" onClick={() => navigate('/')} aria-label="홈으로 이동">
        <img src="/apppang-logo.png" alt="앱팡" className=" h-8 object-contain" />
      </button>
    </header>
  )
}

export default Header
