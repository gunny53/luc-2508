import { privateAxios } from '@/lib/api'
import { API_ENDPOINTS } from '@/constants/api'
import {
  CategoryGetAllResponse,
  CategoryGetByIdResponse,
  CategoryCreateRequest,
  CategoryCreateResponse,
  CategoryUpdateRequest,
  CategoryUpdateResponse,
  CategoryDeleteResponse
} from '@/types/admin/category.interface'
import { PaginationRequest } from '@/types/base.interface'

export const categoryService = {
  getAll: async (params?: PaginationRequest): Promise<CategoryGetAllResponse> => {
    try {
      const response = await privateAxios.get(API_ENDPOINTS.CATEGORIES.GETALL, {
        params: params
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
  getById: async (id: string): Promise<CategoryGetByIdResponse> => {
    try {
      const url = API_ENDPOINTS.CATEGORIES.GET_BY_ID.replace(':categoriesId', id)
      const response = await privateAxios.get(url)
      return response.data
    } catch (error) {
      throw error
    }
  },
  create: async (data: CategoryCreateRequest): Promise<CategoryCreateResponse> => {
    try {
      const response = await privateAxios.post(API_ENDPOINTS.CATEGORIES.CREATE, data)
      return response.data
    } catch (error) {
      throw error
    }
  },
  update: async (id: string, data: CategoryUpdateRequest): Promise<CategoryUpdateResponse> => {
    try {
      const url = API_ENDPOINTS.CATEGORIES.UPDATE.replace(':categoriesId', id)
      const response = await privateAxios.put(url, data)
      return response.data
    } catch (error) {
      throw error
    }
  },
  delete: async (id: string): Promise<CategoryDeleteResponse> => {
    try {
      const url = API_ENDPOINTS.CATEGORIES.DELETE_BY_ID.replace(':categoriesId', id)
      const response = await privateAxios.delete(url)
      return response.data
    } catch (error) {
      throw error
    }
  }
}
