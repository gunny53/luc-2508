import { useState, useEffect, useMemo, useRef } from 'react'
import { generateSKUs, Sku } from '@/utils/variant-utils'
import type { OptionData } from './form-variant-input'

interface GroupedSkus {
  [key: string]: Sku[]
}

// Helpers
export const formatPrice = (value: number) => {
  if (value === 0) return ''
  return new Intl.NumberFormat('en-US').format(value)
}

const parsePrice = (value: string) => {
  const numericString = value.replace(/[^0-9]/g, '')
  return numericString === '' ? 0 : parseInt(numericString, 10)
}
import { SkuDetail } from '@/types/products.interface'
type FormSku = Partial<SkuDetail>

// Hook Props
interface UseSkuProps {
  options: OptionData[]
  initialSkus?: FormSku[]
  onUpdateSkus: (skus: Sku[]) => void
}

// Helper function to map API SKUs to component SKUs
function mapApiSkusToComponentSkus(apiSkus: FormSku[], options: OptionData[]): Sku[] {
  console.log('mapApiSkusToComponentSkus called with:')
  console.log('API SKUs:', apiSkus)
  console.log('Options:', options)

  if (!apiSkus?.length) {
    console.log('No API SKUs provided')
    return []
  }

  if (!options?.length) {
    console.log('No options provided')
    return []
  }
  if (apiSkus.some((sku) => !sku.value)) {
    console.warn(
      'Some API SKUs are missing value property:',
      apiSkus.filter((sku) => !sku.value).map((sku) => sku.id)
    )
  }

  return apiSkus.map((apiSku) => {
    try {
      const skuValue = apiSku.value || ''
      const valueParts = skuValue.split('-')
      console.log(`Processing SKU ${apiSku.id}, value: ${skuValue}, parts:`, valueParts)
      const variantValues = options.map((option, index) => {
        return {
          optionName: option.name,
          value: index < valueParts.length ? valueParts[index] : ''
        }
      })
      const name = valueParts.join(' / ')
      const mappedSku = {
        id: apiSku.id ? String(apiSku.id) : `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: name,
        price: typeof apiSku.price === 'number' ? apiSku.price : 0,
        stock: typeof apiSku.stock === 'number' ? apiSku.stock : 0,
        image: apiSku.image || '',
        variantValues
      }

      console.log('Mapped SKU:', mappedSku)

      return mappedSku
    } catch (error) {
      console.error(`Error processing SKU ${apiSku.id}:`, error)
      return {
        id: apiSku.id || `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: apiSku.value || 'Unknown',
        price: typeof apiSku.price === 'number' ? apiSku.price : 0,
        stock: typeof apiSku.stock === 'number' ? apiSku.stock : 0,
        image: apiSku.image || '',
        variantValues: options.map((option) => ({
          optionName: option.name,
          value: ''
        }))
      }
    }
  })
}

export function useSku({ options, initialSkus, onUpdateSkus }: UseSkuProps) {
  const [skus, setSkus] = useState<Sku[]>([])
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const isInternalUpdate = useRef(false)
  const isInitialized = useRef(false)

  useEffect(() => {
    console.log('useSku effect triggered:', {
      optionsLength: options.length,
      initialSkusLength: initialSkus?.length,
      isInternalUpdate: isInternalUpdate.current,
      isInitialized: isInitialized.current
    })
    if (isInitialized.current && isInternalUpdate.current) {
      console.log('Skipping effect due to internal update')
      isInternalUpdate.current = false
      return
    }
    const hasOptions = options && options.length > 0 && options.some((opt) => opt.values && opt.values.length > 0)
    const hasInitialSkus = initialSkus && initialSkus.length > 0
    console.log('SKU data source conditions:', { hasOptions, hasInitialSkus })

    let newSkus: Sku[] = []

    try {
      if (hasInitialSkus && hasOptions) {
        console.log('Using initialSkus from API', initialSkus)
        newSkus = mapApiSkusToComponentSkus(initialSkus, options)
      } else if (hasOptions) {
        console.log('Generating new SKUs from options', options)
        newSkus = generateSKUs(options)
      } else {
        console.log('Not enough data to create SKUs')
        newSkus = []
      }

      console.log('Generated new SKUs:', newSkus)
      const preservedSkus = newSkus.map((newSku) => {
        let oldSku = null
        oldSku = skus.find((s) => s.id === newSku.id)
        if (!oldSku) {
          oldSku = skus.find((s) => s.name === newSku.name)
        }
        if (!oldSku) {
          const newValues = newSku.variantValues.map((v) => v.value)

          oldSku = skus.find((s) => {
            if (!s.variantValues || !Array.isArray(s.variantValues)) return false
            const oldValues = s.variantValues.map((v) => v.value)
            const matchCount = newValues.filter((val) => oldValues.includes(val)).length
            return matchCount > 0 && oldValues.length === newValues.length
          })
        }

        if (oldSku) {
          return {
            ...newSku,
            price: oldSku.price || newSku.price,
            stock: oldSku.stock || newSku.stock,
            image: oldSku.image || newSku.image
          }
        }
        return newSku
      })

      console.log('Setting skus state with preservedSkus:', preservedSkus.length)
      setSkus(preservedSkus)

      // Reset expanded state only if the primary option changes
      const oldFirstOption = skus[0]?.variantValues[0]?.optionName
      const newFirstOption = options[0]?.name
      if (oldFirstOption !== newFirstOption) {
        setExpandedGroups({})
      }
      isInitialized.current = true
    } catch (error) {
      console.error('Error processing SKUs:', error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, initialSkus])

  const groupedSkus = useMemo<GroupedSkus>(() => {
    if (!skus || skus.length === 0) {
      return {}
    }

    try {
      const hasValidVariantValues = skus.every(
        (sku) => sku.variantValues && Array.isArray(sku.variantValues) && sku.variantValues.length > 0
      )

      if (!hasValidVariantValues) {
        console.error('Some SKUs have invalid variantValues', skus)
        return {}
      }

      return skus.reduce((acc, sku) => {
        try {
          const groupKey = sku.variantValues[0]?.value || 'Unknown'

          if (!acc[groupKey]) {
            acc[groupKey] = []
          }
          acc[groupKey].push(sku)
          return acc
        } catch (error) {
          console.error('Error processing SKU in grouping:', sku, error)
          return acc
        }
      }, {} as GroupedSkus)
    } catch (error) {
      console.error('Error grouping SKUs:', error)
      return {}
    }
  }, [skus])
  useEffect(() => {
    if (!isInitialized.current) {
      return
    }
    if (isInternalUpdate.current && skus.length > 0) {
      console.log('Notifying parent of SKU update:', skus.length)
      onUpdateSkus(skus)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skus])

  const handleSkuChange = (skuId: string, field: 'price' | 'stock', value: string) => {
    let numericValue: number

    if (field === 'price') {
      numericValue = parsePrice(value)
    } else {
      // for stock
      numericValue = value === '' ? 0 : parseInt(value, 10)
    }

    if (isNaN(numericValue)) return
    isInternalUpdate.current = true
    console.log(`handleSkuChange - Updating SKU ${skuId}, field: ${field}, value: ${value}`)

    const updatedSkus = skus.map((sku) => (sku.id === skuId ? { ...sku, [field]: numericValue } : sku))
    setSkus(updatedSkus)
  }

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }))
  }

  const handleImageUpdate = (skuId: string, newUrl: string) => {
    console.log(`handleImageUpdate - Updating image for SKU ${skuId} to ${newUrl}`)
    isInternalUpdate.current = true

    const updatedSkus = skus.map((sku) => (sku.id === skuId ? { ...sku, image: newUrl } : sku))
    setSkus(updatedSkus)
  }

  return {
    skus,
    groupedSkus,
    expandedGroups,
    handleSkuChange,
    toggleGroup,
    handleImageUpdate
  }
}
