import { API_ENDPOINTS } from '../constants'
import { useApiClient } from '../hooks/useApiClient'
import type { UpdateProfileParams, ChangePasswordParams } from '../types'

// Note: this service uses the shared apiClient hook for headers/token handling via store
export function createProfileService() {
  const api = useApiClient()
  return {
    async uploadAvatar(file: File): Promise<string> {
      const form = new FormData()
      form.append('avatar', file)
      const res = await api.post<{ avatarUrl: string }>(API_ENDPOINTS.PROFILE.UPLOAD_AVATAR, form)
      return res.avatarUrl
    },
    async updateProfile(data: UpdateProfileParams) {
      return api.put<{ user: any }>(API_ENDPOINTS.PROFILE.UPDATE, data)
    },
    async changePassword(data: ChangePasswordParams) {
      return api.put<{ message: string }>(API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, data)
    },
    async getExchangeRequests() {
      return api.get<{ requests: any[] }>(API_ENDPOINTS.PROFILE.EXCHANGE_REQUESTS)
    },
  }
}


