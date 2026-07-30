import instance from '@/api/instance'
import type { ApiResponse, EmailCheckResponse, FindIdRequest, FindIdResponse, LoginResponse, SignupRequest } from '@/types/api'

export function login(email: string, password: string) {
  return instance.post<ApiResponse<LoginResponse>>('/api/auth/login', { email, password })
}

export function signup(payload: SignupRequest) {
  return instance.post<ApiResponse<{ userId: number }>>('/api/auth/signup', payload)
}

export function checkEmail(email: string) {
  return instance.get<ApiResponse<EmailCheckResponse>>('/api/auth/email-check', { params: { email } })
}

export function logout() {
  return instance.post<ApiResponse<string>>('/api/auth/logout')
}

export function findId(payload: FindIdRequest) {
  return instance.post<ApiResponse<FindIdResponse>>('/api/auth/find-id', payload)
}

export function requestPasswordReset(email: string) {
  return instance.post<ApiResponse<string>>('/api/auth/password-reset/request', { email })
}

export function confirmPasswordReset(token: string, newPassword: string) {
  return instance.patch<ApiResponse<string>>('/api/auth/password-reset', { token, newPassword })
}
