'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { cartService } from '@/services/cart-service'
import {
  Cart,
  CartItem,
  CartItemRequest,
  UpdateCartItemRequest,
  CartListResponse,
  ShopCart
} from '@/types/cart.interface'
import { useAuthGuard } from '@/hooks/use-auth-guard'

interface UseCartOptions {
  autoFetch?: boolean
}

export const useCart = (options: UseCartOptions = { autoFetch: false }) => {
  const [shopCarts, setShopCarts] = useState<ShopCart[]>([])
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const { isAuthenticated } = useAuthGuard({ silentCheck: true })
  const transformCartData = useCallback((data: ShopCart[]): Cart => {
    let totalItems = 0
    let totalPrice = 0
    let totalSelectedItems = 0
    let totalSelectedPrice = 0

    data.forEach((shopCart) => {
      shopCart.cartItems.forEach((item) => {
        totalItems += item.quantity
        totalPrice += item.sku.price * item.quantity

        if (item.isSelected) {
          totalSelectedItems += item.quantity
          totalSelectedPrice += item.sku.price * item.quantity
        }
      })
    })

    return {
      shops: data,
      totalItems,
      totalPrice,
      totalSelectedItems,
      totalSelectedPrice
    }
  }, [])
  const fetchCart = useCallback(
    async (params?: string) => {
      if (!isAuthenticated) {
        setShopCarts([])
        setCart(null)
        return null
      }

      try {
        setIsLoading(true)
        const queryParams = params ? JSON.parse(params) : {}
        const finalParams = { limit: 500, ...queryParams }

        const response = await cartService.getCart(finalParams)

        if (response.data && Array.isArray(response.data)) {
          setShopCarts(response.data as ShopCart[])
          const transformedCart = transformCartData(response.data as ShopCart[])
          setCart(transformedCart)
        } else if (response.data as CartListResponse) {
          const cartData = (response.data as CartListResponse).data
          setShopCarts(cartData)
          const transformedCart = transformCartData(cartData)
          setCart(transformedCart)
        }

        return response
      } catch (error: any) {
        console.error('Error fetching cart:', error)
        const errorMessage =
          error.response?.data?.message || error.message || 'English content normalized from the original source text.'
        toast.error(errorMessage)
        setShopCarts([])
        setCart(null)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, transformCartData]
  )
  const addToCart = useCallback(
    async (data: CartItemRequest, showNotification: boolean = true) => {
      try {
        setIsUpdating(true)
        const response = await cartService.addToCart(data)
        await fetchCart()

        if (showNotification) {
          const successMessage = response.message || 'English content normalized from the original source text.'
          toast.success(successMessage)
        }

        // Return the cart item ID from the API response
        // Handle both possible response structures
        let cartItemId: string | null = null
        if (response.data) {
          if ('id' in response.data) {
            // Direct CartItem structure
            cartItemId = response.data.id
          } else if ('cartItem' in response.data && response.data.cartItem) {
            // Nested structure
            cartItemId = response.data.cartItem.id
          }
        }

        return cartItemId || true
      } catch (error: any) {
        console.error('Error adding item to cart:', error)
        if (showNotification) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'English content normalized from the original source text.'
          toast.error(errorMessage)
        }
        return false
      } finally {
        setIsUpdating(false)
      }
    },
    [fetchCart]
  )
  const updateCartItem = useCallback(
    async (itemId: string, data: UpdateCartItemRequest, showNotification: boolean = false) => {
      try {
        setIsUpdating(true)
        const response = await cartService.updateCartItem(itemId, data)
        if (response.data) {
          const cartData = (response.data as CartListResponse).data || response.data
          if (Array.isArray(cartData)) {
            setShopCarts(cartData)
            const transformedCart = transformCartData(cartData)
            setCart(transformedCart)
          } else {
            await fetchCart()
          }
        } else {
          await fetchCart()
        }

        if (showNotification) {
          const successMessage = response.message || 'English content normalized from the original source text.'
          toast.success(successMessage)
        }
        return response
      } catch (error: any) {
        console.error('Error updating cart item:', error)
        if (showNotification) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'English content normalized from the original source text.'
          toast.error(errorMessage)
        }
        return false
      } finally {
        setIsUpdating(false)
      }
    },
    [fetchCart, transformCartData]
  )
  const removeItems = useCallback(
    async (cartItemIds: string[], showNotification: boolean = true) => {
      try {
        setIsUpdating(true)
        const response = await cartService.deleteCartItems({ cartItemIds })
        await fetchCart()

        if (showNotification) {
          const successMessage = response.message || 'English content normalized from the original source text.'
          toast.success(successMessage)
        }
        return true
      } catch (error: any) {
        console.error('Error removing items from cart:', error)
        if (showNotification) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'English content normalized from the original source text.'
          toast.error(errorMessage)
        }
        return false
      } finally {
        setIsUpdating(false)
      }
    },
    [fetchCart]
  )
  const selectAllItems = useCallback(
    async (isSelected: boolean, showNotification: boolean = false) => {
      try {
        setIsUpdating(true)
        const response = await cartService.selectAllItems(isSelected)
        await fetchCart()

        if (showNotification) {
          const successMessage =
            response.message ||
            `English content normalized from the original source text.${isSelected ? 'English content normalized from the original source text.' : 'English content normalized from the original source text.'}English content normalized from the original source text.`
          toast.success(successMessage)
        }
        return true
      } catch (error: any) {
        console.error('Error selecting all items:', error)
        if (showNotification) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'English content normalized from the original source text.'
          toast.error(errorMessage)
        }
        return false
      } finally {
        setIsUpdating(false)
      }
    },
    [fetchCart]
  )
  const calculateSelectedTotal = useCallback((): { items: number; price: number } => {
    if (!cart || !cart.shops || cart.shops.length === 0) {
      return { items: 0, price: 0 }
    }
    return {
      items: cart.totalSelectedItems,
      price: cart.totalSelectedPrice
    }
  }, [cart])
  const getCartDetails = useCallback(() => {
    if (!cart) {
      return {
        isEmpty: true,
        totalItems: 0,
        totalShops: 0,
        totalPrice: 0,
        selectedItems: 0,
        selectedPrice: 0
      }
    }

    return {
      isEmpty: cart.totalItems === 0,
      totalItems: cart.totalItems,
      totalShops: cart.shops.length,
      totalPrice: cart.totalPrice,
      selectedItems: cart.totalSelectedItems,
      selectedPrice: cart.totalSelectedPrice
    }
  }, [cart])
  useEffect(() => {
    if (options.autoFetch && isAuthenticated) {
      fetchCart()
    }
  }, [fetchCart, options.autoFetch, isAuthenticated])
  const updateItemQuantity = useCallback(
    async (itemId: string, skuId: string, quantity: number) => {
      return await updateCartItem(itemId, { skuId, quantity })
    },
    [updateCartItem]
  )

  return {
    // State
    cart,
    shopCarts,
    isLoading,
    isUpdating,
    isAuthenticated,

    // Actions
    fetchCart,
    addToCart,
    updateCartItem,
    removeItems,
    selectAllItems,
    updateItemQuantity,

    // Helpers
    calculateSelectedTotal,
    getCartDetails
  }
}
