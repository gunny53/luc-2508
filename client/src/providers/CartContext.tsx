'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useCart as useCartHook } from '@/components/client/cart/hooks/use-Cart';

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const cartHook = useCartHook({ autoFetch: true });

  // English content normalized from the original source text.
  const {
    addToCart: originalAddToCart,
    fetchCart: originalFetchCart,
    updateCartItem: originalUpdateCartItem,
    removeItems: originalRemoveItems,
    selectAllItems: originalSelectAllItems,
    ...rest
  } = cartHook;

  // English content normalized from the original source text.
  const addToCart = useCallback(async (data: any, showNotification: boolean = true) => {
    const result = await originalAddToCart(data, showNotification);
    if (result) {
      setLastUpdated(Date.now());
    }
    return result;
  }, [originalAddToCart]);

  // English content normalized from the original source text.
  const fetchCart = useCallback(async (params?: string) => {
    const result = await originalFetchCart(params);
    setLastUpdated(Date.now());
    return result;
  }, [originalFetchCart]);

  // English content normalized from the original source text.
  const updateCartItem = useCallback(async (itemId: string, data: any, showNotification: boolean = false) => {
    const result = await originalUpdateCartItem(itemId, data, showNotification);
    if (result) {
      setLastUpdated(Date.now());
    }
    return result;
  }, [originalUpdateCartItem]);

  // English content normalized from the original source text.
  const removeItems = useCallback(async (cartItemIds: string[], showNotification: boolean = true) => {
    const result = await originalRemoveItems(cartItemIds, showNotification);
    if (result) {
      setLastUpdated(Date.now());
    }
    return result;
  }, [originalRemoveItems]);

  // English content normalized from the original source text.
  const selectAllItems = useCallback(async (isSelected: boolean, showNotification: boolean = false) => {
    const result = await originalSelectAllItems(isSelected, showNotification);
    if (result) {
      setLastUpdated(Date.now());
    }
    return result;
  }, [originalSelectAllItems]);

  // English content normalized from the original source text.
  const forceRefresh = useCallback(async () => {
    await originalFetchCart();
    setLastUpdated(Date.now());
  }, [originalFetchCart]);

  // English content normalized from the original source text.
  const updateCartItemAndRefresh = useCallback(async (itemId: string, data: any, showNotification: boolean = false) => {
    const result = await originalUpdateCartItem(itemId, data, showNotification);
    if (result) {
      await forceRefresh(); // English content normalized from the original source text.
    }
    return result;
  }, [originalUpdateCartItem, forceRefresh]);

  // English content normalized from the original source text.
  const selectSpecificItem = useCallback(async (itemId: string, isSelected: boolean = true, showNotification: boolean = false) => {
    try {
      // English content normalized from the original source text.
      const currentCartData = rest.shopCarts;
      if (!currentCartData || currentCartData.length === 0) {
        console.warn('No cart data found for selecting item');
        return false;
      }

      let currentItem = null;
      for (const shopCart of currentCartData) {
        currentItem = shopCart.cartItems.find(item => item.id === itemId);
        if (currentItem) break;
      }

      if (!currentItem) {
        console.warn(`Item with id ${itemId} not found in current cart`);
        return false;
      }

      // English content normalized from the original source text.
      const result = await originalUpdateCartItem(itemId, {
        skuId: currentItem.sku.id,
        quantity: currentItem.quantity,
        isSelected
      }, showNotification);

      if (result) {
        // English content normalized from the original source text.
        await forceRefresh();
        console.log(`Successfully updated selection for item ${itemId} to ${isSelected}`);
      }
      return result;
    } catch (error) {
      console.error('Error selecting specific item:', error);
      throw error;
    }
  }, [originalUpdateCartItem, rest.shopCarts, forceRefresh]);

  // English content normalized from the original source text.
  const findAndSelectNewItem = useCallback(async (skuId: string, quantity: number) => {
    try {
      // English content normalized from the original source text.
      await forceRefresh();

      // English content normalized from the original source text.
      await new Promise(resolve => setTimeout(resolve, 300));

      // English content normalized from the original source text.
      const { shopCarts: currentCartData } = rest;

      if (!currentCartData || currentCartData.length === 0) {
        console.warn('No cart data found after refresh');
        return false;
      }

      // English content normalized from the original source text.
      let foundItem = null;
      for (const shopCart of currentCartData) {
        for (const item of shopCart.cartItems) {
          if (item.sku.id === skuId && item.quantity === quantity) {
            foundItem = item;
            break;
          }
        }
        if (foundItem) break;
      }

      if (!foundItem) {
        console.warn(`Item with skuId ${skuId} and quantity ${quantity} not found in cart`);
        return false;
      }

      // English content normalized from the original source text.
      // English content normalized from the original source text.
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('forceSelectItem', {
          detail: { itemId: foundItem.id, isSelected: true }
        }));
      }

      // English content normalized from the original source text.
      const selectResult = await selectSpecificItem(foundItem.id, true, false);
      if (selectResult) {
        console.log(`Successfully selected item ${foundItem.id} for Buy Now`);
        return foundItem.id;
      }

      return false;
    } catch (error) {
      console.error('Error in findAndSelectNewItem:', error);
      return false;
    }
  }, [forceRefresh, rest, selectSpecificItem]);

  // English content normalized from the original source text.
  const forceSelectItemInUI = useCallback((itemId: string) => {
    // English content normalized from the original source text.
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('forceSelectItem', {
        detail: { itemId, isSelected: true }
      }));
    }
  }, []);

  return (
    <CartContext.Provider value={{
      ...rest,
      addToCart,
      fetchCart,
      updateCartItem,
      removeItems,
      selectAllItems,
      lastUpdated,
      forceRefresh,
      updateCartItemAndRefresh,
      selectSpecificItem,
      findAndSelectNewItem,
      forceSelectItemInUI
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};