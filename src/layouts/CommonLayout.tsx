import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import NavigationBar from '@/components/NavigationBar'

function CommonLayout() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  // 페이지가 바뀌면 스크롤을 맨 위로 올린다 (뒤로 가기 포함)
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen justify-center">
      <div className="flex h-screen w-full max-w-120 flex-col bg-white">
        <Header />
        <main id="main-scroll" ref={mainRef} className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <NavigationBar />
      </div>
    </div>
  )
}

export default CommonLayout
