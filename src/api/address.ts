import instance from '@/api/instance'
import type { Address, ApiResponse } from '@/types/api'

export type AddressRequest = {
  receiver: string
  receiverPhone: string
  roadAddress: string
  detailAddress: string
  isDefault: boolean
}

export type AddressUpdateRequest = Omit<AddressRequest, 'isDefault'>

export function getAddresses() {
  return instance.get<ApiResponse<Address[]>>('/api/addresses')
}

export function addAddress(payload: AddressRequest) {
  return instance.post<ApiResponse<number>>('/api/addresses', payload)
}

export function updateAddress(addressId: number, payload: AddressUpdateRequest) {
  return instance.patch<ApiResponse<string>>(`/api/addresses/${addressId}`, payload)
}

export function updateDefaultAddress(addressId: number) {
  return instance.patch<ApiResponse<{ addressId: number; isDefault: boolean }>>(`/api/addresses/${addressId}/default`)
}

export function deleteAddress(addressId: number) {
  return instance.delete<ApiResponse<string>>(`/api/addresses/${addressId}`)
}
