import instance from '@/api/instance'
import type { ApiResponse, LoginResponse, SignupRequest } from '@/types/api'

export function login(email: string, password: string) {
  return instance.post<LoginResponse>('/api/auth/login', { email, password })
}

export function signup(payload: SignupRequest) {
  return instance.post<ApiResponse<{ userId: number }>>('/api/auth/signup', payload)
}
