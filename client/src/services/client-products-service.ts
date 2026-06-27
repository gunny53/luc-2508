import { publicAxios } from '@/lib/api'
import { API_ENDPOINTS } from '@/constants/api'
import {
  ClientProductsResponse,
  ClientProductDetail,
  ClientProductsListParams,
  ClientSearchResponse,
  ClientSearchParams
} from '@/types/client.products.interface'

export const clientProductsService = {
  
  getProducts: async (params?: ClientProductsListParams): Promise<ClientProductsResponse> => {
    try {
      const response = await publicAxios.get(API_ENDPOINTS.PRODUCTS.LIST, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching client products:', error)
      throw error
    }
  },

  
  getProductDetail: async (id: string): Promise<ClientProductDetail> => {
    try {
      const url = API_ENDPOINTS.PRODUCTS.DETAIL.replace(':id', id)
      const response = await publicAxios.get(url)
      return response.data.data
    } catch (error) {
      console.error(`Error fetching client product detail with id ${id}:`, error)
      throw error
    }
  },

  




  searchProducts: async (params: ClientSearchParams): Promise<ClientSearchResponse> => {
    try {
      console.log('🔍 Searching products with params:', params)
      const response = await publicAxios.get(API_ENDPOINTS.PRODUCTS.SEARCH, { params })
      console.log('🔍 Search response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error searching products:', error)
      throw error
    }
  },

  






  getSearchSuggestions: async (query: string, limit: number = 5, options: any): Promise<ClientSearchResponse> => {
    try {
      const response = await publicAxios.get(API_ENDPOINTS.PRODUCTS.SEARCH, {
        params: { q: query, limit },
        signal: options?.signal
      })
      return response.data
    } catch (error) {
      console.error('Error fetching search suggestions:', error)
      throw error
    }
  }
}
