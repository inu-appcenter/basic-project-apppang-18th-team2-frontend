import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/authStore'
import type { ApiResponse } from '@/types/api'

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean }

// 로그인/회원가입 자체의 401(비번 오류 등)은 재발급 대상이 아니라 그대로 실패 처리한다
const NO_REISSUE_ENDPOINTS = ['/api/auth/login', '/api/auth/signup']

const instance = axios.create({
  baseURL: '',
  timeout: 10000,
  withCredentials: true, // refreshToken httpOnly 쿠키를 주고받기 위해 필요
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function forceLogout() {
  localStorage.removeItem('accessToken')
  useAuthStore.getState().logout()
  window.location.href = '/login'
}

// 동시에 여러 요청이 401을 받아도 재발급 호출은 한 번만 나가도록 공유
let reissuePromise: Promise<string> | null = null

function reissueAccessToken() {
  if (!reissuePromise) {
    reissuePromise = axios
      .post<ApiResponse<{ accessToken: string }>>(
        '/api/auth/reissue',
        null,
        { baseURL: import.meta.env.VITE_API_BASE_URL, withCredentials: true },
      )
      .then(({ data }) => {
        const newToken = data.data.accessToken
        localStorage.setItem('accessToken', newToken)
        return newToken
      })
      .finally(() => {
        reissuePromise = null
      })
  }
  return reissuePromise
}

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined
    const skipReissue = NO_REISSUE_ENDPOINTS.some((url) => originalRequest?.url?.includes(url))

    if (error.response?.status === 401 && !skipReissue) {
      if (originalRequest && !originalRequest._retry) {
        originalRequest._retry = true
        try {
          const newToken = await reissueAccessToken()
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return instance(originalRequest)
        } catch {
          forceLogout()
        }
      } else {
        // 재발급 후 재시도까지 했는데도 또 401이면 더 손쓸 수 없으니 로그아웃
        forceLogout()
      }
    }

    return Promise.reject(error)
  },
)

export default instance
