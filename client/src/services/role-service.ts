import { privateAxios } from '@/lib/api'
import { API_ENDPOINTS } from '@/constants/api'
import {
  RoleGetAllResponse,
  RoleGetByIdResponse,
  RoleCreateRequest,
  RoleCreateResponse,
  RoleUpdateRequest,
  RoleUpdateResponse,
  RoleDeleteResponse,
  RoleAssignPermissionRequest,
  RoleAssignPermissionResponse
} from '@/types/auth/role.interface'
import { PaginationRequest } from '@/types/base.interface'

export const roleService = {
  getAll: async (params?: PaginationRequest): Promise<RoleGetAllResponse> => {
    try {
      const response = await privateAxios.get(API_ENDPOINTS.ROLES.GETALL, {
        params: params
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
  getById: async (id: string): Promise<RoleGetByIdResponse> => {
    try {
      const url = API_ENDPOINTS.ROLES.GETBYID.replace(':id', id)
      const response = await privateAxios.get(url)
      return response.data
    } catch (error) {
      throw error
    }
  },
  create: async (data: RoleCreateRequest): Promise<RoleCreateResponse> => {
    try {
      const response = await privateAxios.post(API_ENDPOINTS.ROLES.POST, data)
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  
  
  
  
  
  
  
  
  
  
  
  update: async (id: string, data: RoleUpdateRequest): Promise<RoleUpdateResponse> => {
    try {
      const url = API_ENDPOINTS.ROLES.UPDATE.replace(':id', id)
      const response = await privateAxios.put(url, data)
      return response.data
    } catch (error) {
      throw error
    }
  },
  delete: async (id: string): Promise<RoleDeleteResponse> => {
    try {
      const url = API_ENDPOINTS.ROLES.DELETE_BY_ID.replace(':id', id)
      const response = await privateAxios.delete(url)
      return response.data
    } catch (error) {
      throw error
    }
  }
}
