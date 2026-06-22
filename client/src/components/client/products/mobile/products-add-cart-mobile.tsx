'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sku,
  VariantGroup,
  SelectedVariants,
  findMatchingSku,
  areAllVariantsSelected,
  getCurrentStock,
  isOptionAvailable,
  handleAddToCart
} from '@/utils/product-utils'
import { useCart } from '@/providers/cart-context'
import { useAuthGuard } from '@/hooks/use-auth-guard'
import { useRouter } from 'next/navigation'

interface Product {
  id?: string
  name: string
  basePrice: number
  virtualPrice: number
  skus: Sku[]
  variants: VariantGroup[]
  media: { type: 'image' | 'video'; src: string }[]
}

interface AddCartMobileProps {
  product: Product
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  isBuyNowMode?: boolean
}

export default function AddCartMobile({ product, isOpen, onOpenChange, isBuyNowMode = false }: AddCartMobileProps) {
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>({})
  const [currentSku, setCurrentSku] = useState<Sku | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addToCart } = useCart()
  const { checkAuth } = useAuthGuard()
  const router = useRouter()
  const variantGroups = product.variants || []

  // Auto-select variants khi component mount
  useEffect(() => {
    const initialVariants: SelectedVariants = {}
    variantGroups.forEach((group) => {
      if (group.value === 'Default' && group.options.includes('Default')) {
        initialVariants[group.value] = 'Default'
      } else {
        initialVariants[group.value] = null
      }
    })
    setSelectedVariants(initialVariants)
  }, [variantGroups])
  const handleVariantSelect = (variantType: string, option: string) => {
    setSelectedVariants((prev) => {
      if (prev[variantType] === option) {
        return { ...prev, [variantType]: null }
      }
      return { ...prev, [variantType]: option }
    })
  }
  useEffect(() => {
    const matchingSku = findMatchingSku(selectedVariants, product.skus, variantGroups)

    if (matchingSku) {
      console.log('English content normalized from the original source text.', matchingSku)
    } else if (areAllVariantsSelected(selectedVariants)) {
      console.log('English content normalized from the original source text.')
    }

    setCurrentSku(matchingSku)
  }, [selectedVariants, product.skus, variantGroups])
  const totalStock = getCurrentStock(selectedVariants, product.skus, variantGroups)
  const isVariantSelected = areAllVariantsSelected(selectedVariants)
  const handleQuantityChange = (increment: number) => {
    setQuantity((current) => {
      const newValue = current + increment

      if (newValue < 1) return 1

      const maxStock = currentSku ? currentSku.stock : totalStock
      if (newValue > maxStock) return maxStock

      return newValue
    })
  }

  const handleAddToCartClick = async () => {
    if (checkAuth()) {
      if (!isVariantSelected || !currentSku || currentSku.stock === 0) return

      setIsAddingToCart(true)
      try {
        await handleAddToCart(selectedVariants, product.skus, variantGroups, quantity, addToCart)
        if (onOpenChange) {
          onOpenChange(false)
        }
        if (isBuyNowMode) {
          router.push('/cart')
        }
      } finally {
        setIsAddingToCart(false)
      }
    } else {
      console.log('User not authenticated')
    }
  }
  const productImage = product.media?.[0]?.src || '/images/image-placeholder.jpg'
  const displayPrice = currentSku ? currentSku.price : product.virtualPrice

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] rounded-t-xl">
        <div className="px-4 py-4 max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-5">
            <div className="flex gap-3">
              <div className="w-20 h-20 relative rounded-md overflow-hidden">
                <Image src={currentSku?.image || productImage} alt={product.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="text-xl font-medium text-red-600">₫{displayPrice.toLocaleString('vi-VN')}</div>
                <div className="text-sm text-muted-foreground">
                  {isVariantSelected && currentSku && (
                    <span>
                      English content normalized from the original source text. {currentSku.stock} English content
                      normalized from the original source text.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <DrawerClose>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>

          {}
          <div className="space-y-5 mb-6">
            {variantGroups.map((variantGroup) => (
              <div key={variantGroup.value} className="space-y-3">
                <div className="font-medium text-sm">
                  {variantGroup.value}:
                  {selectedVariants[variantGroup.value] && (
                    <span className="ml-2 font-normal text-muted-foreground">
                      {selectedVariants[variantGroup.value]}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {variantGroup.options.map((option) => {
                    const isSelected = selectedVariants[variantGroup.value] === option
                    const isAvailable = isOptionAvailable(variantGroup.value, option, selectedVariants, product.skus)

                    return (
                      <button
                        key={option}
                        onClick={() => handleVariantSelect(variantGroup.value, option)}
                        className={cn(
                          'relative px-3 py-2 border rounded-md text-sm transition-all',
                          'flex items-center gap-2',
                          'hover:border-primary hover:text-primary',
                          isSelected ? 'border-primary text-primary' : 'border-input text-foreground',
                          !isAvailable && 'opacity-50 cursor-not-allowed'
                        )}
                        disabled={!isAvailable}
                      >
                        <span>{option}</span>
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-3 h-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {}
          <div className="mb-6">
            <div className="font-medium text-sm mb-3">English content normalized from the original source text.</div>
            <div className="flex items-center">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={!isVariantSelected || quantity <= 1 || !currentSku?.stock}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => handleQuantityChange(1)}
                  disabled={
                    !isVariantSelected || quantity >= (currentSku ? currentSku.stock : totalStock) || !currentSku?.stock
                  }
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {}
          {isVariantSelected && currentSku && currentSku.stock === 0 && (
            <div className="text-red-500 text-sm mb-4">English content normalized from the original source text.</div>
          )}

          {}
          <Button
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-medium text-base rounded-md"
            disabled={!isVariantSelected || !currentSku || currentSku.stock === 0 || isAddingToCart}
            onClick={handleAddToCartClick}
          >
            {isAddingToCart
              ? 'English content normalized from the original source text.'
              : isBuyNowMode
                ? 'English content normalized from the original source text.'
                : 'English content normalized from the original source text.'}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
