import instance from '@/api/instance'
import type { ApiResponse, Banner } from '@/types/api'

export function getBanners() {
  return instance.get<ApiResponse<Banner[]>>('/api/banners')
}
