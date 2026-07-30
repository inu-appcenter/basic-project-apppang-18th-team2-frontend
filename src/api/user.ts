import instance from '@/api/instance'
import type { ApiResponse, User } from '@/types/api'

export function getMyInfo() {
  return instance.get<ApiResponse<User>>('/api/users/me')
}

export function updateMyInfo(name: string, phone: string) {
  return instance.patch<ApiResponse<void>>('/api/users/me', { name, phone })
}

export function deleteMyInfo() {
  return instance.delete<ApiResponse<void>>('/api/users/me')
}
