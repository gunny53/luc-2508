import { privateAxios } from '@/lib/api'
import {
  SessionGetALLResponse,
  SessionRevokeAllRequest,
  SessionRevokeAllResponse,
  SessionRevokeRequest,
  SessionRevokeResponse
} from '@/types/auth/session.interface'
import { API_ENDPOINTS } from '@/constants/api'
import { PaginationRequest } from '@/types/base.interface'

export const sessionService = {
  getAll: async (params?: PaginationRequest): Promise<SessionGetALLResponse> => {
    const response = await privateAxios.get<SessionGetALLResponse>(API_ENDPOINTS.SESSIONS.GETALL, { params })
    return response.data
  },
  revokeAll: async (data: SessionRevokeAllRequest): Promise<SessionRevokeAllResponse> => {
    const response = await privateAxios.post<SessionRevokeAllResponse>(API_ENDPOINTS.SESSIONS.REVOKE_ALL, data)
    return response.data
  },
  revoke: async (data: SessionRevokeRequest): Promise<SessionRevokeResponse> => {
    const response = await privateAxios.post<SessionRevokeResponse>(API_ENDPOINTS.SESSIONS.REVOKE, data)
    return response.data
  }
}
