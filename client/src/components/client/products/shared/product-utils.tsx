import { ReactNode } from 'react'

export interface VariantGroup {
  value: string
  options: string[]
}

export interface Sku {
  id: string
  value: string
  price: number
  stock: number
  image: string
  productId: string
}

export type SelectedVariants = Record<string, string | null>

export function createSkuValueFromSelectedVariants(
  selectedVariants: SelectedVariants,
  variantGroups: VariantGroup[]
): string | null {
  const allVariantsSelected = Object.values(selectedVariants).every((val) => val !== null)

  if (!allVariantsSelected) {
    return null
  }
  const colorVariant =
    selectedVariants['Color'] ||
    selectedVariants['English content normalized from the original source text.'] ||
    selectedVariants['English content normalized from the original source text.']
  const sizeVariant =
    selectedVariants['Size'] ||
    selectedVariants['English content normalized from the original source text.'] ||
    selectedVariants['English content normalized from the original source text.']

  if (colorVariant && sizeVariant) {
    return `${colorVariant}-${sizeVariant}`
  }
  const selectedValues: string[] = []

  variantGroups.forEach((group) => {
    const value = selectedVariants[group.value]
    if (value) {
      selectedValues.push(value)
    }
  })

  return selectedValues.join('-')
}

export function findMatchingSku(
  selectedVariants: SelectedVariants,
  skus: Sku[],
  variantGroups: VariantGroup[]
): Sku | null {
  const skuValue = createSkuValueFromSelectedVariants(selectedVariants, variantGroups)

  if (!skuValue) {
    return null
  }

  // Normalize the sku.value from the API by removing spaces around the hyphen for a reliable comparison.
  return skus.find((sku) => sku.value.replace(/\s*-\s*/g, '-') === skuValue) || null
}

export function isOptionAvailable(
  variantType: string,
  option: string,
  selectedVariants: SelectedVariants,
  skus: Sku[]
): boolean {
  const testVariants = {
    ...selectedVariants,
    [variantType]: option
  }
  const remainingVariants = Object.entries(testVariants)
    .filter(([key]) => key === variantType || testVariants[key] !== null)
    .reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {} as SelectedVariants)
  return skus.some((sku) => {
    return Object.values(remainingVariants).every((variant) => variant !== null && sku.value.includes(variant))
  })
}

export function getTotalStock(skus: Sku[]): number {
  return skus.reduce((sum, sku) => sum + sku.stock, 0)
}

export function getCurrentStock(
  selectedVariants: SelectedVariants,
  skus: Sku[],
  variantGroups: VariantGroup[]
): number {
  const currentSku = findMatchingSku(selectedVariants, skus, variantGroups)
  return currentSku ? currentSku.stock : getTotalStock(skus)
}

export function getStockMessage(stock: number): ReactNode {
  if (stock <= 0) {
    return <span className="text-red-500">English content normalized from the original source text.</span>
  }

  if (stock <= 5) {
    return <span className="text-orange-500">English content normalized from the original source text. {stock})</span>
  }

  return <span>English content normalized from the original source text. {stock}</span>
}

export function areAllVariantsSelected(selectedVariants: SelectedVariants): boolean {
  return Object.keys(selectedVariants).length > 0 && Object.values(selectedVariants).every((val) => val !== null)
}

export function findSelectedSkuPrice(
  selectedVariants: SelectedVariants,
  skus: Sku[],
  variantGroups: VariantGroup[],
  defaultPrice: number
): number {
  const sku = findMatchingSku(selectedVariants, skus, variantGroups)
  return sku ? sku.price : defaultPrice
}

export async function handleAddToCart(
  selectedVariants: SelectedVariants,
  skus: Sku[],
  variantGroups: VariantGroup[],
  quantity: number,
  addToCartFn: (data: { skuId: string; quantity: number }, showNotification?: boolean) => Promise<string | boolean>
): Promise<string | false> {
  const selectedSku = findMatchingSku(selectedVariants, skus, variantGroups)
  if (!selectedSku) {
    console.error('English content normalized from the original source text.')
    return false
  }
  if (selectedSku.stock <= 0) {
    console.error('English content normalized from the original source text.')
    return false
  }
  const safeQuantity = Math.min(quantity, selectedSku.stock)
  try {
    const result = await addToCartFn(
      {
        skuId: selectedSku.id,
        quantity: safeQuantity
      },
      true
    )

    // Return cart item ID if available, otherwise false
    return typeof result === 'string' ? result : false
  } catch (error) {
    console.error('English content normalized from the original source text.', error)
    return false
  }
}
