import { BrowserRouter, Route, Routes } from 'react-router-dom'

import AuthLayout from '@/layouts/AuthLayout'
import CommonLayout from '@/layouts/CommonLayout'
import AccountSettingsPage from '@/pages/AccountSettingsPage'
import CartPage from '@/pages/CartPage'
import CategoryPage from '@/pages/CategoryPage'
import ChatbotPage from '@/pages/ChatbotPage'
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
import ProductManagePage from '@/pages/seller/ProductManagePage'
import ProductRegisterPage from '@/pages/seller/ProductRegisterPage'
import SellerLoginPage from '@/pages/seller/SellerLoginPage'
import SellerMainPage from '@/pages/seller/SellerMainPage'
import SellerOrderPage from '@/pages/seller/SellerOrderPage'
import SellerRegisterPage from '@/pages/seller/SellerRegisterPage'
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
          <Route path="/chatbot" element={<ChatbotPage />} />
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
          <Route path="/seller/login" element={<SellerLoginPage />} />
          <Route path="/seller/register" element={<SellerRegisterPage />} />
        </Route>

        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-complete" element={<OrderCompletePage />} />
        <Route path="/orders/:orderId" element={<OrderManagePage />} />
        <Route path="/mypage/settings" element={<AccountSettingsPage />} />
        <Route path="/review/write" element={<ReviewWritePage />} />

        <Route path="/seller" element={<SellerMainPage />} />
        <Route path="/seller/products/new" element={<ProductRegisterPage />} />
        <Route path="/seller/products" element={<ProductManagePage />} />
        <Route path="/seller/orders" element={<SellerOrderPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
