import { BrowserRouter, Route, Routes } from 'react-router-dom'

import AuthLayout from '@/layouts/AuthLayout'
import CommonLayout from '@/layouts/CommonLayout'
import AccountSettingsPage from '@/pages/AccountSettingsPage'
import CartPage from '@/pages/CartPage'
import CategoryPage from '@/pages/CategoryPage'
import CheckoutPage from '@/pages/CheckoutPage'
import FindAccountPage from '@/pages/FindAccountPage'
import LoginPage from '@/pages/LoginPage'
import MainPage from '@/pages/MainPage'
import MyPage from '@/pages/MyPage'
import NotFoundPage from '@/pages/NotFoundPage'
import OrderCompletePage from '@/pages/OrderCompletePage'
import OrderHistoryPage from '@/pages/OrderHistoryPage'
import OrderManagePage from '@/pages/OrderManagePage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import ProductListPage from '@/pages/ProductListPage'
import RegisterPage from '@/pages/RegisterPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import ReviewWritePage from '@/pages/ReviewWritePage'
import SearchPage from '@/pages/SearchPage'
import SplashPage from '@/pages/SplashPage'
import WishlistPage from '@/pages/WishlistPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CommonLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/splash" element={<SplashPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/find-account" element={<FindAccountPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          {/* 백엔드가 재설정 이메일 링크를 /password-reset?token=... 으로 생성해서 별칭 라우트 추가 */}
          <Route path="/password-reset" element={<ResetPasswordPage />} />
        </Route>

        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-complete" element={<OrderCompletePage />} />
        <Route path="/orders/:orderId" element={<OrderManagePage />} />
        <Route path="/mypage/settings" element={<AccountSettingsPage />} />
        <Route path="/review/write" element={<ReviewWritePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
