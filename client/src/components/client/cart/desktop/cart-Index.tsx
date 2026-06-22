'use client'

import DesktopCartItem from './cart-items'
import { Checkbox } from '@/components/ui/checkbox'
import { useState, useEffect, useMemo, useRef } from 'react'
import DesktopCartHeader from './cart-product-title'
import CartFooter from './cart-footer'
import { Loader2 } from 'lucide-react'
import { VoucherButton } from '../../checkout/shared/cart-modal-voucher'
import { useCart } from '@/providers/cart-context'
import { ShopCart, CartItem } from '@/types/cart.interface'
import { ProductInfo } from '@/types/order.interface'
import { PiStorefrontLight } from 'react-icons/pi'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { setShopOrders, setCommonInfo, setShopProducts } from '@/store/features/checkout/orders-silde'

export default function DesktopCartPageMobile() {
  const {
    cart,
    shopCarts,
    isLoading,
    updateCartItemAndRefresh,
    removeItems,
    selectAllItems,
    lastUpdated,
    forceRefresh
  } = useCart()

  const [selectedShops, setSelectedShops] = useState<Record<string, boolean>>({})
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({})
  const [selectAll, setSelectAll] = useState(false)
  const manualSelectionsRef = useRef<Set<string>>(new Set())
  useEffect(() => {
    const refreshCart = async () => {
      try {
        await forceRefresh()
      } catch (error) {
        console.error('Error refreshing cart on mount:', error)
      }
    }

    refreshCart()
  }, [])
  useEffect(() => {
    const handleForceSelectItem = (event: CustomEvent) => {
      const { itemId, isSelected } = event.detail

      // Mark as manual selection
      manualSelectionsRef.current.add(itemId)

      setSelectedItems((prev) => ({
        ...prev,
        [itemId]: isSelected
      }))
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('forceSelectItem', handleForceSelectItem as EventListener)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('forceSelectItem', handleForceSelectItem as EventListener)
      }
    }
  }, [])
  useEffect(() => {
    if (shopCarts && shopCarts.length > 0) {
      const shopSelectedState: Record<string, boolean> = {}
      const itemSelectedState: Record<string, boolean> = {}

      let allSelected = true

      shopCarts.forEach((shopCart: ShopCart) => {
        const allItemsSelected = shopCart.cartItems.every((item: CartItem) => item.isSelected)
        shopSelectedState[shopCart.shop.id] = allItemsSelected

        if (!allItemsSelected) allSelected = false

        shopCart.cartItems.forEach((item: CartItem) => {
          if (!manualSelectionsRef.current.has(item.id)) {
            itemSelectedState[item.id] = item.isSelected || false
          }
        })
      })

      setSelectedItems((prev) => ({
        ...prev,
        ...itemSelectedState
      }))
      setSelectedShops(shopSelectedState)
      setSelectAll(allSelected)
    }
  }, [shopCarts, lastUpdated])
  const handleToggleShop = async (shopId: string, items: CartItem[]) => {
    const isChecked = !selectedShops[shopId]
    const updatedItems = { ...selectedItems }
    const updatedShops = { ...selectedShops, [shopId]: isChecked }

    items.forEach((item) => {
      updatedItems[item.id] = isChecked
    })

    setSelectedShops(updatedShops)
    setSelectedItems(updatedItems)

    // API call removed as per request
  }
  const handleToggleItem = async (shopId: string, itemId: string, shopItems: CartItem[]) => {
    const newIsSelected = !selectedItems[itemId]

    // Mark as manual selection
    manualSelectionsRef.current.add(itemId)
    const updatedItems = { ...selectedItems, [itemId]: newIsSelected }
    setSelectedItems(updatedItems)

    const allSelected = shopItems.every((item) => updatedItems[item.id])
    setSelectedShops((prev) => ({ ...prev, [shopId]: allSelected }))

    // API call removed as per request
  }
  const handleToggleAll = async () => {
    const newValue = !selectAll
    setSelectAll(newValue)
    const updatedShops: Record<string, boolean> = {}
    const updatedItems: Record<string, boolean> = {}

    shopCarts.forEach((shopCart: ShopCart) => {
      updatedShops[shopCart.shop.id] = newValue
      shopCart.cartItems.forEach((item: CartItem) => {
        updatedItems[item.id] = newValue
      })
    })

    setSelectedShops(updatedShops)
    setSelectedItems(updatedItems)

    // API call removed as per request
  }
  const handleVariationChange = async (itemId: string, newSkuId: string) => {
    const item = shopCarts.flatMap((sc: ShopCart) => sc.cartItems).find((item: CartItem) => item.id === itemId)
    if (item) {
      await updateCartItemAndRefresh(itemId, { skuId: newSkuId, quantity: item.quantity })
    }
  }
  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItems([itemId])
    } catch (error) {
      console.error('Error removing item from cart:', error)
    }
  }
  const handleDeleteSelected = async () => {
    try {
      const selectedItemIds = Object.keys(selectedItems).filter((itemId) => selectedItems[itemId])

      if (selectedItemIds.length === 0) {
        toast.error('English content normalized from the original source text.')
        return
      }
      await removeItems(selectedItemIds)
      setSelectedItems({})
      setSelectedShops({})
      setSelectAll(false)

      toast.success(
        `English content normalized from the original source text.${selectedItemIds.length}English content normalized from the original source text.`
      )
    } catch (error) {
      console.error('Error removing selected items from cart:', error)
      toast.error('English content normalized from the original source text.')
    }
  }

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    if (quantity > 0) {
      const itemToUpdate = shopCarts
        .flatMap((shop: ShopCart) => shop.cartItems)
        .find((item: CartItem) => item.id === itemId)

      if (itemToUpdate) {
        await updateCartItemAndRefresh(itemId, {
          quantity,
          skuId: itemToUpdate.sku.id
        })
      }
    } else {
      await handleRemoveItem(itemId)
    }
  }
  const { total, totalSaved, selectedCount } = useMemo(() => {
    let currentTotal = 0
    let currentTotalSaved = 0
    let count = 0

    shopCarts.forEach((shopCart: ShopCart) => {
      shopCart.cartItems.forEach((item: CartItem) => {
        if (selectedItems[item.id]) {
          const quantity = item.quantity
          const price = item.sku.price || 0
          const regularPrice = item.sku.product.virtualPrice || price

          currentTotal += price * quantity
          if (regularPrice > price) {
            currentTotalSaved += (regularPrice - price) * quantity
          }
          count++
        }
      })
    })

    return { total: currentTotal, totalSaved: currentTotalSaved, selectedCount: count }
  }, [selectedItems, shopCarts])

  const dispatch = useDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  useEffect(() => {
    const selectItemId = searchParams.get('selectItem')
    if (selectItemId) {
      manualSelectionsRef.current.add(selectItemId)
      setSelectedItems((prev) => ({
        ...prev,
        [selectItemId]: true
      }))

      // Clear URL param
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('selectItem')
      window.history.replaceState({}, '', newUrl.pathname)
    }
  }, [searchParams])

  const handleCheckout = () => {
    const selectedShopCarts = shopCarts
      .map((shopCart: ShopCart) => ({
        ...shopCart,
        cartItems: shopCart.cartItems.filter((item: CartItem) => selectedItems[item.id])
      }))
      .filter((shopCart: ShopCart) => shopCart.cartItems.length > 0)

    if (selectedShopCarts.length === 0) {
      toast.error('English content normalized from the original source text.')
      return
    }
    const shopOrdersPayload = selectedShopCarts.map((shopCart: ShopCart) => ({
      shopId: shopCart.shop.id,
      cartItemIds: shopCart.cartItems.map((item: CartItem) => item.id),
      discountCodes: []
    }))
    const shopProductsPayload = selectedShopCarts.reduce((acc: Record<string, ProductInfo[]>, shopCart: ShopCart) => {
      acc[shopCart.shop.id] = shopCart.cartItems.map((item: CartItem) => ({
        id: item.id,
        name: item.sku.product.name,
        image: item.sku.image,
        variation: item.sku.value,
        quantity: item.quantity,
        subtotal: item.sku.price * item.quantity,
        price: item.sku.price,
        shopName: shopCart.shop.name
      }))
      return acc
    }, {})
    const allCartItemIds = selectedShopCarts
      .flatMap((shopCart: ShopCart) => shopCart.cartItems.map((item: CartItem) => item.id))
      .join(',')

    console.log('🛒 Checkout Data:', {
      selectedShopCarts: selectedShopCarts.length,
      cartItemIds: allCartItemIds,
      totalAmount: total,
      shopOrdersPayload,
      shopProductsPayload
    })
    dispatch(setShopOrders(shopOrdersPayload))
    dispatch(setShopProducts(shopProductsPayload))
    dispatch(setCommonInfo({ amount: total, receiver: null, paymentGateway: null }))
    router.push(`/checkout/${allCartItemIds}`)
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">English content normalized from the original source text.</span>
        </div>
      ) : shopCarts && shopCarts.length > 0 ? (
        <>
          <DesktopCartHeader allSelected={selectAll} onToggleAll={handleToggleAll} />
          {shopCarts.map((shopCart: ShopCart, index: number) => (
            <div key={shopCart.shop.id + '-' + index} className="bg-white border rounded-sm">
              {/* Shop Header */}
              <div className="flex items-center px-3 py-4 border-b">
                <Checkbox
                  className="mr-4 ml-[30px]"
                  checked={!!selectedShops[shopCart.shop.id]}
                  onCheckedChange={() => handleToggleShop(shopCart.shop.id, shopCart.cartItems)}
                />
                <PiStorefrontLight className="h-5 w-5 mr-2" />
                <span className="text-base">Shop {shopCart.shop.name}</span>
              </div>

              {/* Items */}
              {shopCart.cartItems.map((cartItem: CartItem) => {
                const isChecked = !!selectedItems[cartItem.id]

                return (
                  <DesktopCartItem
                    key={cartItem.id}
                    item={cartItem}
                    checked={isChecked}
                    quantity={cartItem.quantity}
                    onQuantityChange={handleQuantityChange}
                    onCheckedChange={() => handleToggleItem(shopCart.shop.id, cartItem.id, shopCart.cartItems)}
                    onVariationChange={handleVariationChange}
                    onRemove={() => handleRemoveItem(cartItem.id)}
                  />
                )
              })}
            </div>
          ))}
        </>
      ) : (
        <div className="p-10 text-center flex flex-col items-center justify-center">
          <Image
            src="/images/client/cart/Cart-empty-v2.webp"
            alt="Empty Cart"
            width={200}
            height={200}
            className="object-contain mb-4"
          />
          <div className="text-xl font-medium">English content normalized from the original source text.</div>
          <p className="text-gray-500 mt-2">English content normalized from the original source text.</p>
        </div>
      )}

      {}
      {shopCarts && shopCarts.length > 0 && (
        <CartFooter
          total={total}
          totalSaved={totalSaved}
          selectedCount={selectedCount}
          allSelected={selectAll}
          onToggleAll={handleToggleAll}
          onCheckout={handleCheckout}
          onDeleteSelected={handleDeleteSelected}
        />
      )}
    </div>
  )
}
