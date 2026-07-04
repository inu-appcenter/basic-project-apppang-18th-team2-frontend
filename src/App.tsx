import { BrowserRouter, Route, Routes } from 'react-router-dom'

import AuthLayout from '@/layouts/AuthLayout'
import CommonLayout from '@/layouts/CommonLayout'
// 기존 페이지
import CartPage from '@/pages/CartPage'
import ChatbotPage from '@/pages/ChatbotPage'
import LoginPage from '@/pages/LoginPage'
import MainPage from '@/pages/MainPage'
import MyPage from '@/pages/MyPage'
import NotFoundPage from '@/pages/NotFoundPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import ProductListPage from '@/pages/ProductListPage'
import RegisterPage from '@/pages/RegisterPage'
import SearchPage from '@/pages/SearchPage'
// 추가된 페이지
import SplashPage from '@/pages/SplashPage'
import FindAccountPage from '@/pages/FindAccountPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import CategoryPage from '@/pages/CategoryPage'
import WishlistPage from '@/pages/WishlistPage'
import CheckoutPage from '@/pages/CheckoutPage'
import OrderCompletePage from '@/pages/OrderCompletePage'
import OrderHistoryPage from '@/pages/OrderHistoryPage'
import OrderManagePage from '@/pages/OrderManagePage'
import AccountSettingsPage from '@/pages/AccountSettingsPage'
import ReviewWritePage from '@/pages/ReviewWritePage'
// 판매자 페이지
import SellerLoginPage from '@/pages/seller/SellerLoginPage'
import SellerRegisterPage from '@/pages/seller/SellerRegisterPage'
import SellerMainPage from '@/pages/seller/SellerMainPage'
import ProductRegisterPage from '@/pages/seller/ProductRegisterPage'
import ProductManagePage from '@/pages/seller/ProductManagePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 헤더 + 하단 네비게이션 (CommonLayout) */}
        <Route element={<CommonLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>

        {/* 인증/집중 화면 (AuthLayout) */}
        <Route element={<AuthLayout />}>
          <Route path="/splash" element={<SplashPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/find-account" element={<FindAccountPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/seller/login" element={<SellerLoginPage />} />
          <Route path="/seller/register" element={<SellerRegisterPage />} />
        </Route>

        {/* 단독 전체화면 (레이아웃 없음) */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-complete" element={<OrderCompletePage />} />
        <Route path="/orders/:orderId" element={<OrderManagePage />} />
        <Route path="/mypage/settings" element={<AccountSettingsPage />} />
        <Route path="/review/write" element={<ReviewWritePage />} />

        {/* 판매자 */}
        <Route path="/seller" element={<SellerMainPage />} />
        <Route path="/seller/products/new" element={<ProductRegisterPage />} />
        <Route path="/seller/products" element={<ProductManagePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
