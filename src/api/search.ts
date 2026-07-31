import instance from '@/api/instance'
import type { ApiResponse } from '@/types/api'

export function getAutocomplete(keyword: string) {
  return instance.get<ApiResponse<string[]>>('/api/search/autocomplete', { params: { keyword } })
}

export function getPopular() {
  return instance.get<ApiResponse<string[]>>('/api/search/popular')
}
