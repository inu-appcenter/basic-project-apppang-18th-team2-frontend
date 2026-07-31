import instance from '@/api/instance'
import type { ApiResponse } from '@/types/api'

// 이미지 1장을 S3에 업로드하고 접근 URL을 받는다 (2장이면 두 번 호출)
export function uploadImage(file: File) {
  const form = new FormData()
  form.append('image', file)
  return instance.post<ApiResponse<{ imageUrl: string }>>('/api/images', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
