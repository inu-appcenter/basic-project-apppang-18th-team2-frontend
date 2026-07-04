import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function SplashPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/'), 2000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black">
      <h1 className="text-title-2 tracking-widest text-white">앱팡</h1>
      <div className="h-0.5 w-16 bg-white" />
      <p className="text-body-9 text-gray-300">빠르게, 간편하게</p>
      <div className="mt-10 flex gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-gray-300 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-gray-300 [animation-delay:300ms]" />
      </div>
    </div>
  )
}

export default SplashPage
