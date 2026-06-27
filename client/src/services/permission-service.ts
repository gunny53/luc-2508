import { privateAxios, publicAxios } from '@/lib/api'
import { API_ENDPOINTS } from '@/constants/api'
import {
  PerGetAllResponse,
  PerGetByIdResponse,
  PerUpdateRequest,
  PerUpdateResponse,
  PerCreateRequest,
  PerCreateResponse,
  PerDeleteResponse
} from '@/types/auth/permission.interface'
import { PaginationRequest } from '@/types/base.interface'

export const permissionService = {
  getAll: async (params?: PaginationRequest, signal?: AbortSignal): Promise<PerGetAllResponse> => {
    try {
      const response = await privateAxios.get(API_ENDPOINTS.PERMISSION.GETALL, {
        params: params,
        signal: signal
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
  getById: async (id: string, signal?: AbortSignal): Promise<PerGetByIdResponse> => {
    try {
      const url = API_ENDPOINTS.PERMISSION.GETBYID.replace(':id', id)
      const response = await privateAxios.get(url, { signal })
      return response.data
    } catch (error) {
      throw error
    }
  },
  create: async (data: PerCreateRequest, signal?: AbortSignal): Promise<PerCreateResponse> => {
    try {
      const response = await privateAxios.post(API_ENDPOINTS.PERMISSION.POST, data, { signal })
      return response.data
    } catch (error) {
      throw error
    }
  },
  update: async (id: string, data: PerUpdateRequest, signal?: AbortSignal): Promise<PerUpdateResponse> => {
    try {
      const url = API_ENDPOINTS.PERMISSION.UPDATE.replace(':id', id)
      const response = await privateAxios.put(url, data, { signal })
      return response.data
    } catch (error) {
      throw error
    }
  },
  delete: async (id: string, signal?: AbortSignal): Promise<PerDeleteResponse> => {
    try {
      const url = API_ENDPOINTS.PERMISSION.DELETE_BY_ID.replace(':id', id)
      const response = await privateAxios.delete(url, { signal })
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
}
