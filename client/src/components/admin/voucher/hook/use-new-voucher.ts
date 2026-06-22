'use client'

import { useState, useEffect } from 'react'
import { VoucherUseCase } from './voucher-config'
import {
  CreateDiscountRequest,
  DiscountApplyType,
  DiscountStatus,
  DiscountType,
  VoucherType,
  DisplayType
} from '@/types/discount.interface'
import { discountService } from '@/services/discount-service'
import { toast } from 'sonner'

// The explicit and complete state for the voucher form.
// This approach avoids using Partial<> to prevent downstream 'undefined' errors.
export type VoucherFormState = {
  name: string
  code: string
  description: string
  discountType: 'PERCENTAGE' | 'FIX_AMOUNT'
  value: number
  minOrderValue: number
  maxDiscountValue?: number | null
  maxUses: number
  maxUsesPerUser: number
  startDate: string
  endDate: string
  isActive: boolean
  discountApplyType: DiscountApplyType

  // UI-specific fields
  showOnProductPage?: boolean
  selectedProducts?: Array<{ id: string; name: string; price: number; image: string }>
  selectedBrands?: Array<{ value: string; label: string; image?: string | null }>
  selectedCategories?: Array<{ value: string; label: string; icon?: string | null; parentCategoryId?: string | null }>
  selectedShopUser?: { value: string; label: string; email?: string | null; phone?: string | null } | null
  categories?: string[]
  brands?: string[]
  displayType?: 'PUBLIC' | 'PRIVATE'
  isPrivate?: boolean
  maxDiscountType?: 'limited' | 'unlimited'
}

// Interface for the hook's return value
export interface UseNewVoucherReturn {
  formData: VoucherFormState
  updateFormData: (field: keyof VoucherFormState, value: any) => void
  resetForm: () => void
  submitVoucher: () => Promise<void>
  isLoading: boolean
  errors: Record<string, string>
  useCase: VoucherUseCase
  voucherType: string
}

const getInitialFormData = (): VoucherFormState => {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(23, 59, 0, 0) // Set 23:59 cho endDate

  return {
    name: '',
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    value: 0,
    minOrderValue: 0,
    maxUses: 1,
    maxUsesPerUser: 1,
    startDate: now.toISOString(),
    endDate: tomorrow.toISOString(),
    isActive: true,
    showOnProductPage: true,
    selectedProducts: [],
    selectedBrands: [],
    selectedCategories: [],
    selectedShopUser: null,
    categories: [],
    brands: [],
    discountApplyType: DiscountApplyType.ALL,
    maxDiscountType: 'unlimited',
    maxDiscountValue: null
  }
}

const initialFormData: VoucherFormState = getInitialFormData()

interface UseNewVoucherProps {
  useCase: VoucherUseCase
  owner: 'PLATFORM' | 'SHOP'
  userData: any
  onCreateSuccess?: () => void
}

export function useNewVoucher({ useCase, owner, userData, onCreateSuccess }: UseNewVoucherProps): UseNewVoucherReturn {
  const [formData, setFormData] = useState<VoucherFormState>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const parseErrorMessage = (error: any): string => {
    const defaultMessage = 'English content normalized from the original source text.'

    if (!error?.response?.data?.message) {
      return error?.message || defaultMessage
    }

    const apiMessage = error.response.data.message
    if (Array.isArray(apiMessage)) {
      const validationErrors = apiMessage
        .map((err) => err.message || err)
        .filter(Boolean)
        .join('. ')

      return validationErrors || defaultMessage
    }
    if (typeof apiMessage === 'string') {
      return apiMessage
    }

    return defaultMessage
  }

  const getVoucherType = (uc: VoucherUseCase) => {
    if (uc === VoucherUseCase.PRODUCT) return VoucherType.PRODUCT
    if (uc === VoucherUseCase.PRIVATE) return VoucherType.SHOP
    return VoucherType.SHOP
  }
  const voucherType = getVoucherType(useCase)
  useEffect(() => {
    console.log('useNewVoucher initialized:', {
      useCase,
      voucherType
    })

    // Sanitize form data based on use case
    setFormData((prev) => {
      const newFormData = { ...getInitialFormData(), name: prev.name, code: prev.code } // Reset to initial but keep name/code
      switch (useCase) {
        case VoucherUseCase.SHOP:
          newFormData.discountApplyType = DiscountApplyType.ALL
          newFormData.selectedProducts = []
          newFormData.displayType = 'PUBLIC'
          newFormData.isPrivate = false
          break

        case VoucherUseCase.PRODUCT:
          newFormData.discountApplyType = DiscountApplyType.SPECIFIC
          newFormData.selectedProducts = [] // Start with empty selection
          newFormData.displayType = 'PUBLIC'
          newFormData.isPrivate = false
          break

        case VoucherUseCase.PRIVATE:
          newFormData.displayType = 'PRIVATE'
          newFormData.isPrivate = true
          newFormData.discountApplyType = DiscountApplyType.ALL // Default to all
          newFormData.selectedProducts = []
          break

        case VoucherUseCase.PRIVATE_ADMIN:
          newFormData.displayType = 'PRIVATE'
          newFormData.isPrivate = true
          newFormData.discountApplyType = DiscountApplyType.ALL // Default to all
          newFormData.selectedProducts = []
          break
      }
      return newFormData
    })
  }, [useCase])
  const updateFormData = (field: keyof VoucherFormState, value: any) => {
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [field]: value
      }
      if (field === 'discountApplyType' && value === 'ALL') {
        newFormData.selectedProducts = []
      }

      return newFormData
    })
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData(getInitialFormData())
    setErrors({})
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      toast.error('English content normalized from the original source text.')
      return false
    }

    if (!formData.code?.trim()) {
      toast.error('English content normalized from the original source text.')
      return false
    }
    const codePattern = /^[A-Z0-9_-]+$/
    if (formData.code && !codePattern.test(formData.code)) {
      toast.error('English content normalized from the original source text.')
      return false
    }

    if (!formData.startDate) {
      toast.error('English content normalized from the original source text.')
      return false
    }

    if (!formData.endDate) {
      toast.error('English content normalized from the original source text.')
      return false
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('English content normalized from the original source text.')
      return false
    }

    if (formData.value <= 0) {
      toast.error('English content normalized from the original source text.')
      return false
    }

    if (formData.discountType === 'PERCENTAGE' && formData.value > 100) {
      toast.error('English content normalized from the original source text.')
      return false
    }

    if ((formData.minOrderValue ?? 0) < 0) {
      toast.error('English content normalized from the original source text.')
      return false
    }

    if (formData.maxUses < 1) {
      toast.error('English content normalized from the original source text.')
      return false
    }

    if (formData.maxUsesPerUser < 1) {
      toast.error('English content normalized from the original source text.')
      return false
    }
    if (formData.maxUsesPerUser > formData.maxUses) {
      toast.error('English content normalized from the original source text.')
      return false
    }
    if (
      useCase === VoucherUseCase.PRODUCT &&
      formData.discountApplyType === DiscountApplyType.SPECIFIC &&
      (formData.selectedProducts ?? []).length === 0
    ) {
      toast.error('English content normalized from the original source text.')
      return false
    }

    // Validation cho voucher CATEGORIES
    if (useCase === VoucherUseCase.CATEGORIES && (formData.selectedCategories ?? []).length === 0) {
      toast.error('English content normalized from the original source text.')
      return false
    }

    // Validation cho voucher BRAND
    if (useCase === VoucherUseCase.BRAND && (formData.selectedBrands ?? []).length === 0) {
      toast.error('English content normalized from the original source text.')
      return false
    }

    // Validation cho voucher SHOP_ADMIN
    if (useCase === VoucherUseCase.SHOP_ADMIN && !formData.selectedShopUser) {
      toast.error('English content normalized from the original source text.')
      return false
    }
    if (
      useCase === VoucherUseCase.PRODUCT_ADMIN &&
      formData.selectedProducts &&
      formData.selectedProducts.length > 0 &&
      formData.discountApplyType === DiscountApplyType.SPECIFIC &&
      formData.selectedProducts.length === 0
    ) {
      toast.error('English content normalized from the original source text.')
      return false
    }
    if (
      useCase === VoucherUseCase.PRIVATE_ADMIN &&
      formData.discountApplyType === DiscountApplyType.SPECIFIC &&
      (formData.selectedProducts ?? []).length === 0
    ) {
      toast.error('English content normalized from the original source text.')
      return false
    }
    if (
      formData.discountType === 'PERCENTAGE' &&
      formData.maxDiscountValue !== null &&
      formData.maxDiscountValue !== undefined &&
      formData.maxDiscountValue <= 0
    ) {
      toast.error('English content normalized from the original source text.')
      return false
    }

    return true
  }

  // Submit voucher
  const submitVoucher = async (): Promise<void> => {
    if (!validateForm()) {
      return
    }
    if (!userData) {
      toast.error('English content normalized from the original source text.')
      return
    }
    const isAdminCase =
      userData?.role?.name === 'ADMIN' &&
      [
        VoucherUseCase.PLATFORM,
        VoucherUseCase.CATEGORIES,
        VoucherUseCase.BRAND,
        VoucherUseCase.SHOP_ADMIN,
        VoucherUseCase.PRODUCT_ADMIN,
        VoucherUseCase.PRIVATE_ADMIN
      ].includes(useCase)

    const isPlatformVoucher = useCase === VoucherUseCase.PLATFORM
    const actualOwner = isPlatformVoucher ? 'PLATFORM' : 'SHOP'
    let finalVoucherType: VoucherType
    if (useCase === VoucherUseCase.PLATFORM) {
      finalVoucherType = VoucherType.PLATFORM
    } else {
      finalVoucherType = getVoucherType(useCase)
    }
    if (!isAdminCase && !isPlatformVoucher && !userData?.id) {
      toast.error('English content normalized from the original source text.')
      return
    }

    console.log('Debug userData structure:', {
      userData,
      userId: userData?.id,
      userRole: userData?.role?.name
    })

    setIsLoading(true)
    try {
      const payload: CreateDiscountRequest = {
        name: formData.name,
        description: formData.description || formData.name,
        code: formData.code,
        value: formData.value,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        maxUsesPerUser: formData.maxUsesPerUser,
        minOrderValue: formData.minOrderValue,
        maxUses: formData.maxUses,
        shopId: null,
        isPlatform: isPlatformVoucher,
        voucherType: finalVoucherType,
        discountApplyType: formData.discountApplyType,
        discountStatus: formData.isActive ? DiscountStatus.ACTIVE : DiscountStatus.INACTIVE,
        discountType: formData.discountType === 'FIX_AMOUNT' ? DiscountType.FIX_AMOUNT : DiscountType.PERCENTAGE
      }
      switch (useCase) {
        case VoucherUseCase.PLATFORM:
          payload.voucherType = VoucherType.PLATFORM
          payload.isPlatform = true
          payload.shopId = null
          payload.discountApplyType = DiscountApplyType.ALL
          break

        case VoucherUseCase.CATEGORIES:
          payload.voucherType = VoucherType.CATEGORY
          payload.isPlatform = false
          payload.shopId = null
          payload.discountApplyType = DiscountApplyType.SPECIFIC
          if (formData.selectedCategories && formData.selectedCategories.length > 0) {
            ;(payload as any).categories = formData.selectedCategories.map((c) => c.value)
          }
          break

        case VoucherUseCase.BRAND:
          payload.voucherType = VoucherType.BRAND
          payload.isPlatform = false
          payload.shopId = null
          payload.discountApplyType = DiscountApplyType.SPECIFIC
          if (formData.selectedBrands && formData.selectedBrands.length > 0) {
            ;(payload as any).brands = formData.selectedBrands.map((b) => b.value)
          }
          break

        case VoucherUseCase.SHOP_ADMIN:
          payload.voucherType = VoucherType.SHOP
          payload.isPlatform = false
          payload.shopId = formData.selectedShopUser?.value || null
          payload.discountApplyType = DiscountApplyType.ALL
          break

        case VoucherUseCase.PRODUCT_ADMIN:
          payload.voucherType = VoucherType.PRODUCT
          payload.isPlatform = false
          payload.shopId = null
          payload.discountApplyType =
            formData.selectedProducts && formData.selectedProducts.length > 0
              ? DiscountApplyType.SPECIFIC
              : DiscountApplyType.ALL
          break

        case VoucherUseCase.PRIVATE_ADMIN:
          payload.voucherType = VoucherType.SHOP
          payload.isPlatform = false
          payload.shopId = null
          payload.displayType = DisplayType.PRIVATE // Force private
          payload.discountApplyType = formData.discountApplyType
          break

        default:
          payload.voucherType = finalVoucherType
          payload.shopId = userData.id
          payload.isPlatform = false
          break
      }
      if (
        formData.discountType === 'PERCENTAGE' &&
        formData.maxDiscountValue !== null &&
        formData.maxDiscountValue !== undefined &&
        formData.maxDiscountValue > 0
      ) {
        payload.maxDiscountValue = formData.maxDiscountValue
      } else {
        payload.maxDiscountValue = null
      }
      if (useCase === VoucherUseCase.PRIVATE || useCase === VoucherUseCase.PRIVATE_ADMIN) {
        payload.displayType = DisplayType.PRIVATE
      } else {
        payload.displayType = formData.displayType === 'PRIVATE' ? DisplayType.PRIVATE : DisplayType.PUBLIC
      }
      if (useCase === VoucherUseCase.PRODUCT && formData.discountApplyType === DiscountApplyType.SPECIFIC) {
        ;(payload as any).products = formData.selectedProducts?.map((p) => p.id) || []
      }
      if (
        useCase === VoucherUseCase.PRODUCT_ADMIN &&
        formData.selectedProducts &&
        formData.selectedProducts.length > 0
      ) {
        ;(payload as any).products = formData.selectedProducts.map((p) => p.id)
        payload.discountApplyType = DiscountApplyType.SPECIFIC
      }
      if (useCase === VoucherUseCase.PRIVATE_ADMIN && formData.discountApplyType === DiscountApplyType.SPECIFIC) {
        ;(payload as any).products = formData.selectedProducts?.map((p) => p.id) || []
      }

      console.log('User role and owner logic:', {
        userRole: userData?.role?.name,
        useCase,
        isAdminCase,
        isPlatformVoucher,
        shopId: payload.shopId,
        originalVoucherType: voucherType,
        finalVoucherType: finalVoucherType
      })

      console.log('Submitting voucher with payload:', payload)
      if (useCase === VoucherUseCase.PLATFORM) {
        console.log('🔥 PLATFORM VOUCHER DEBUG:', {
          useCase: 'PLATFORM (4)',
          isPlatform: payload.isPlatform,
          voucherType: payload.voucherType,
          shopId: payload.shopId,
          discountApplyType: payload.discountApplyType,
          expectedFormat: {
            isPlatform: true,
            voucherType: 'PLATFORM',
            shopId: null,
            discountApplyType: 'ALL'
          }
        })
      }

      if (useCase === VoucherUseCase.CATEGORIES) {
        console.log('🔥 CATEGORIES VOUCHER DEBUG:', {
          useCase: 'CATEGORIES (5)',
          isPlatform: payload.isPlatform,
          voucherType: payload.voucherType,
          shopId: payload.shopId,
          categories: (payload as any).categories,
          discountApplyType: payload.discountApplyType,
          expectedFormat: {
            isPlatform: false,
            voucherType: 'CATEGORY',
            shopId: null,
            discountApplyType: 'SPECIFIC'
          }
        })
      }

      if (useCase === VoucherUseCase.BRAND) {
        console.log('🔥 BRAND VOUCHER DEBUG:', {
          useCase: 'BRAND (6)',
          isPlatform: payload.isPlatform,
          voucherType: payload.voucherType,
          shopId: payload.shopId,
          brands: (payload as any).brands,
          discountApplyType: payload.discountApplyType,
          expectedFormat: {
            isPlatform: false,
            voucherType: 'BRAND',
            shopId: null,
            discountApplyType: 'SPECIFIC'
          }
        })
      }

      if (useCase === VoucherUseCase.SHOP_ADMIN) {
        console.log('🔥 SHOP_ADMIN VOUCHER DEBUG:', {
          useCase: 'SHOP_ADMIN (7)',
          isPlatform: payload.isPlatform,
          voucherType: payload.voucherType,
          shopId: payload.shopId,
          selectedShopUser: formData.selectedShopUser,
          discountApplyType: payload.discountApplyType,
          expectedFormat: {
            isPlatform: false,
            voucherType: 'SHOP',
            shopId: 'user_id_selected',
            discountApplyType: 'ALL'
          }
        })
      }

      if (useCase === VoucherUseCase.PRODUCT_ADMIN) {
        console.log('🔥 PRODUCT_ADMIN VOUCHER DEBUG:', {
          useCase: 'PRODUCT_ADMIN (8)',
          isPlatform: payload.isPlatform,
          voucherType: payload.voucherType,
          shopId: payload.shopId,
          products: (payload as any).products,
          discountApplyType: payload.discountApplyType,
          expectedFormat: {
            isPlatform: false,
            voucherType: 'PRODUCT',
            shopId: null,
            discountApplyType: 'ALL or SPECIFIC'
          }
        })
      }

      if (useCase === VoucherUseCase.PRIVATE_ADMIN) {
        console.log('🔥 PRIVATE_ADMIN VOUCHER DEBUG:', {
          useCase: 'PRIVATE_ADMIN (9)',
          isPlatform: payload.isPlatform,
          voucherType: payload.voucherType,
          shopId: payload.shopId,
          displayType: payload.displayType,
          products: (payload as any).products,
          discountApplyType: payload.discountApplyType,
          expectedFormat: {
            isPlatform: false,
            voucherType: 'SHOP',
            shopId: null,
            displayType: 'PRIVATE',
            discountApplyType: 'ALL or SPECIFIC'
          }
        })
      }
      const response = await discountService.create(payload)

      console.log('Voucher created successfully:', response)
      toast.success('English content normalized from the original source text.')
      resetForm()
      onCreateSuccess?.()
    } catch (error: any) {
      console.error('Error creating voucher:', error)
      const errorMessage = parseErrorMessage(error)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formData,
    updateFormData,
    resetForm,
    submitVoucher,
    isLoading,
    errors,
    useCase,
    voucherType: voucherType.toString()
  }
}
