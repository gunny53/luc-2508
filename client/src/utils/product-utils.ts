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
  image: string | null 
  productId: string
}

export type SelectedVariants = Record<string, string | null>

export function createSkuValueFromSelectedVariants(
  selectedVariants: SelectedVariants,
  variantGroups: VariantGroup[]
): string[] {
  console.log('createSkuValueFromSelectedVariants called with:', { selectedVariants, variantGroups })
  const allVariantsSelected = Object.values(selectedVariants).every((val) => val !== null)

  if (!allVariantsSelected) {
    console.log('Not all variants selected, returning empty array')
    return []
  }
  const selectedValues: string[] = []

  if (variantGroups.length > 0) {
    variantGroups.forEach((group) => {
      const value = selectedVariants[group.value]
      if (value) {
        selectedValues.push(value)
      }
    })
  } else {
    Object.values(selectedVariants).forEach((value) => {
      if (value) {
        selectedValues.push(value)
      }
    })
  }

  console.log('Selected values:', selectedValues)

  if (selectedValues.length === 0) {
    return []
  }

  if (selectedValues.length === 1) {
    return [selectedValues[0]]
  }
  const possibleCombinations: string[] = []
  function getPermutations(arr: string[]): string[][] {
    if (arr.length <= 1) return [arr]

    const result: string[][] = []
    for (let i = 0; i < arr.length; i++) {
      const rest = [...arr.slice(0, i), ...arr.slice(i + 1)]
      const perms = getPermutations(rest)
      for (const perm of perms) {
        result.push([arr[i], ...perm])
      }
    }
    return result
  }

  const permutations = getPermutations(selectedValues)
  console.log('Generated permutations:', permutations)
  permutations.forEach((perm) => {
    possibleCombinations.push(perm.join('-'))
    possibleCombinations.push(perm.join(' - '))
  })

  console.log('Final possible combinations:', possibleCombinations)
  return possibleCombinations
}

export function findMatchingSku(
  selectedVariants: SelectedVariants,
  skus: Sku[],
  variantGroups: VariantGroup[]
): Sku | null {
  console.log('findMatchingSku called with:', { selectedVariants, skus: skus.map((s) => s.value), variantGroups })

  const possibleSkuValues = createSkuValueFromSelectedVariants(selectedVariants, variantGroups)

  if (possibleSkuValues.length === 0) {
    console.log('No possible SKU values generated')
    return null
  }

  console.log('Possible SKU values to try:', possibleSkuValues)
  console.log(
    'Available SKU values from API:',
    skus.map((s) => s.value)
  )
  for (const skuValue of possibleSkuValues) {
    console.log(`Trying to match: "${skuValue}"`)
    const normalizedSkuValue = skuValue.replace(/\s*-\s*/g, '-')
    console.log(`Normalized to: "${normalizedSkuValue}"`)

    const foundSku = skus.find((sku) => {
      const normalizedApiValue = sku.value.replace(/\s*-\s*/g, '-')
      console.log(`Comparing "${normalizedSkuValue}" with "${normalizedApiValue}" (original: "${sku.value}")`)
      return normalizedApiValue === normalizedSkuValue
    })

    if (foundSku) {
      console.log(`✅ Found matching SKU: ${foundSku.value} for selected variants:`, selectedVariants)
      return foundSku
    }
  }

  console.log(`❌ No matching SKU found for variants:`, selectedVariants)
  console.log(`Tried combinations:`, possibleSkuValues)
  console.log(
    `Available SKUs:`,
    skus.map((s) => s.value)
  )

  return null
}

export function isOptionAvailable(
  variantType: string,
  option: string,
  selectedVariants: SelectedVariants,
  skus: Sku[],
  variantGroups: VariantGroup[] = []
): boolean {
  const testVariants = {
    ...selectedVariants,
    [variantType]: option
  }
  const hasUnselectedVariants = Object.values(testVariants).some((val) => val === null)

  if (hasUnselectedVariants) {
    return skus.some((sku) => sku.value.includes(option))
  } else {
    const possibleSkuValues = createSkuValueFromSelectedVariants(testVariants, variantGroups)

    return possibleSkuValues.some((skuValue) => {
      const normalizedSkuValue = skuValue.replace(/\s*-\s*/g, '-')
      return skus.some((sku) => {
        const normalizedApiValue = sku.value.replace(/\s*-\s*/g, '-')
        return normalizedApiValue === normalizedSkuValue
      })
    })
  }
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
    console.error('No matching SKU found for selected variants')
    return false
  }
  if (selectedSku.stock <= 0) {
    console.error('Selected SKU is out of stock')
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

    
    return typeof result === 'string' ? result : false
  } catch (error) {
    console.error('Failed to add product to cart', error)
    return false
  }
}
