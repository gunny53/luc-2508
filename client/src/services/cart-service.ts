import { publicAxios, privateAxios } from '@/lib/api'
import { API_ENDPOINTS } from '@/constants/api'
import { CartResponse, CartItemRequest, UpdateCartItemRequest, DeleteCartRequest } from '@/types/cart.interface'

export const cartService = {
  getCart: async (params?: { limit?: number; page?: number; [key: string]: any }): Promise<CartResponse> => {
    try {
      const response = await privateAxios.get(API_ENDPOINTS.CART.GET_CART, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching cart:', error)
      throw error
    }
  },

  addToCart: async (data: CartItemRequest): Promise<CartResponse> => {
    try {
      const response = await privateAxios.post(API_ENDPOINTS.CART.ADD_TO_CART, data)
      return response.data
    } catch (error) {
      console.error('Error adding item to cart:', error)
      throw error
    }
  },

  updateCartItem: async (itemId: string, data: UpdateCartItemRequest): Promise<CartResponse> => {
    try {
      const url = API_ENDPOINTS.CART.UPDATE_CART_ITEM.replace(':id', itemId)
      const response = await privateAxios.put(url, data)
      return response.data
    } catch (error) {
      console.error(`Error updating cart item ${itemId}:`, error)
      throw error
    }
  },

  deleteCartItems: async (data: DeleteCartRequest): Promise<CartResponse> => {
    try {
      const response = await privateAxios.post(API_ENDPOINTS.CART.DELETE_CART, data)
      return response.data
    } catch (error) {
      console.error('Error deleting items from cart:', error)
      throw error
    }
  },

  selectAllItems: async (isSelected: boolean): Promise<CartResponse> => {
    try {
      const response = await privateAxios.patch(API_ENDPOINTS.CART.GET_CART, { isSelected })
      return response.data
    } catch (error) {
      console.error('Error selecting all items:', error)
      throw error
    }
  }
}
