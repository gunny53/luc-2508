'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Discount, UpdateDiscountRequest, DiscountStatus, DisplayType } from '@/types/discount.interface'
import { discountService } from '@/services/discount-service'
import { VoucherUseCase } from './voucher-config'
import { VoucherFormState } from './use-new-voucher'
const determineUseCaseFromVoucher = (voucher: Discount, userRole: string): VoucherUseCase => {
  const { voucherType, isPlatform, discountApplyType, productIds, categories, brands, shopId } = voucher

  console.log('Determining useCase from voucher:', {
    voucherType,
    isPlatform,
    categories,
    brands,
    shopId,
    userRole,
    displayType: voucher.displayType
  })

  // Case 4: PLATFORM voucher (ADMIN only)
  if (isPlatform && voucherType === 'PLATFORM') {
    return VoucherUseCase.PLATFORM
  }

  // Case 5: CATEGORIES voucher (ADMIN only) - Check voucherType first
  if (voucherType === 'CATEGORY' || (categories && categories.length > 0)) {
    return VoucherUseCase.CATEGORIES
  }

  // Case 6: BRAND voucher (ADMIN only) - Check voucherType first
  if (voucherType === 'BRAND' || (brands && brands.length > 0)) {
    return VoucherUseCase.BRAND
  }

  // Case 7: SHOP_ADMIN voucher (ADMIN only) - voucher for specific shop
  if (userRole === 'ADMIN' && shopId && voucherType === 'SHOP') {
    return VoucherUseCase.SHOP_ADMIN
  }

  // Case 8: PRODUCT_ADMIN voucher (ADMIN only) - product voucher created by admin
  if (userRole === 'ADMIN' && voucherType === 'PRODUCT') {
    return VoucherUseCase.PRODUCT_ADMIN
  }

  // Case 9: PRIVATE_ADMIN voucher (ADMIN only) - private voucher created by admin
  if (userRole === 'ADMIN' && voucher.displayType === 'PRIVATE' && !shopId) {
    return VoucherUseCase.PRIVATE_ADMIN
  }

  // Case 2: PRODUCT voucher (SELLER)
  if (voucherType === 'PRODUCT' && productIds && productIds.length > 0) {
    return VoucherUseCase.PRODUCT
  }

  // Case 3: PRIVATE voucher (SELLER)
  if (voucher.displayType === 'PRIVATE') {
    return VoucherUseCase.PRIVATE
  }

  // Case 1: SHOP voucher (default for SELLER)
  return VoucherUseCase.SHOP
}
const convertVoucherToFormData = async (voucher: Discount, useCase: VoucherUseCase): Promise<VoucherFormState> => {
  const baseFormData: VoucherFormState = {
    name: voucher.name || '',
    code: voucher.code || '',
    description: voucher.description || '',
    discountType: voucher.discountType,
    value: voucher.value || 0,
    minOrderValue: voucher.minOrderValue || 0,
    maxDiscountValue: voucher.maxDiscountValue,
    maxUses: voucher.maxUses || 1,
    maxUsesPerUser: voucher.maxUsesPerUser || 1,
    startDate: voucher.startDate,
    endDate: voucher.endDate,
    isActive: voucher.discountStatus === 'ACTIVE',
    discountApplyType: voucher.discountApplyType,
    showOnProductPage: true,
    selectedProducts: [],
    selectedBrands: [],
    selectedCategories: [],
    selectedShopUser: null,
    categories: voucher.categories || [],
    brands: voucher.brands || [],
    displayType: voucher.displayType,
    isPrivate: voucher.displayType === 'PRIVATE',
    maxDiscountType: voucher.maxDiscountValue ? 'limited' : 'unlimited'
  }

  // TODO: Populate selected items based on useCase
  return baseFormData
}

interface UseEditVoucherProps {
  voucher: Discount
  userData: any
  onEditSuccess?: () => void
}

export interface UseEditVoucherReturn {
  formData: VoucherFormState
  updateFormData: (field: keyof VoucherFormState, value: any) => void
  resetForm: () => void
  submitVoucher: () => Promise<void>
  isLoading: boolean
  errors: Record<string, string>
  useCase: VoucherUseCase
  voucherType: string
  isEdit: boolean
}

export function useEditVoucher({ voucher, userData, onEditSuccess }: UseEditVoucherProps): UseEditVoucherReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const useCase = determineUseCaseFromVoucher(voucher, userData?.role?.name || 'SELLER')
  const voucherType = voucher.voucherType
  const [formData, setFormData] = useState<VoucherFormState>(() => {
    const baseFormData: VoucherFormState = {
      name: voucher.name || '',
      code: voucher.code || '',
      description: voucher.description || '',
      discountType: voucher.discountType,
      value: voucher.value || 0,
      minOrderValue: voucher.minOrderValue || 0,
      maxDiscountValue: voucher.maxDiscountValue,
      maxUses: voucher.maxUses || 1,
      maxUsesPerUser: voucher.maxUsesPerUser || 1,
      startDate: voucher.startDate,
      endDate: voucher.endDate,
      isActive: voucher.discountStatus === 'ACTIVE',
      discountApplyType: voucher.discountApplyType,

      // UI-specific fields
      showOnProductPage: true,
      selectedProducts: [],
      selectedBrands: [],
      selectedCategories: [],
      selectedShopUser: null,
      categories: voucher.categories || [],
      brands: voucher.brands || [],
      displayType: voucher.displayType,
      isPrivate: voucher.displayType === 'PRIVATE',
      maxDiscountType: voucher.maxDiscountValue ? 'limited' : 'unlimited'
    }
    return baseFormData
  })
  useEffect(() => {
    const loadAdditionalData = async () => {
      try {
        const updatedFormData = await convertVoucherToFormData(voucher, useCase)
        setFormData(updatedFormData)
      } catch (error) {
        console.error('Error loading additional voucher data:', error)
      }
    }

    loadAdditionalData()
  }, [voucher, useCase])
  useEffect(() => {
    console.log('useEditVoucher initialized:', {
      voucher,
      useCase,
      voucherType,
      formData,
      userRole: userData?.role?.name
    })
  }, [voucher, useCase, voucherType, userData])
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
  const resetForm = () => {
    const baseFormData: VoucherFormState = {
      name: voucher.name || '',
      code: voucher.code || '',
      description: voucher.description || '',
      discountType: voucher.discountType,
      value: voucher.value || 0,
      minOrderValue: voucher.minOrderValue || 0,
      maxDiscountValue: voucher.maxDiscountValue,
      maxUses: voucher.maxUses || 1,
      maxUsesPerUser: voucher.maxUsesPerUser || 1,
      startDate: voucher.startDate,
      endDate: voucher.endDate,
      isActive: voucher.discountStatus === 'ACTIVE',
      discountApplyType: voucher.discountApplyType,

      // UI-specific fields
      showOnProductPage: true,
      selectedProducts: [],
      selectedBrands: [],
      selectedCategories: [],
      selectedShopUser: null,
      categories: voucher.categories || [],
      brands: voucher.brands || [],
      displayType: voucher.displayType,
      isPrivate: voucher.displayType === 'PRIVATE',
      maxDiscountType: voucher.maxDiscountValue ? 'limited' : 'unlimited'
    }
    setFormData(baseFormData)
    setErrors({})
  }

  // Validate form
  const validateForm = (): boolean => {
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

    setIsLoading(true)
    try {
      const updateData: Partial<UpdateDiscountRequest> = {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        value: formData.value,
        minOrderValue: formData.minOrderValue,
        maxDiscountValue: formData.maxDiscountValue,
        maxUses: formData.maxUses,
        maxUsesPerUser: formData.maxUsesPerUser,
        startDate: formData.startDate,
        endDate: formData.endDate,
        discountApplyType: formData.discountApplyType,
        discountStatus: formData.isActive ? DiscountStatus.ACTIVE : DiscountStatus.INACTIVE,
        displayType: formData.displayType as DisplayType,
        voucherType: voucher.voucherType,
        shopId: voucher.shopId
      }
      switch (useCase) {
        case VoucherUseCase.PRODUCT:
        case VoucherUseCase.PRODUCT_ADMIN:
          if (formData.selectedProducts && formData.selectedProducts.length > 0) {
            updateData.productIds = formData.selectedProducts.map((p) => p.id)
          }
          break
        case VoucherUseCase.CATEGORIES:
          if (formData.selectedCategories && formData.selectedCategories.length > 0) {
            updateData.categories = formData.selectedCategories.map((c) => c.value)
          }
          break
        case VoucherUseCase.BRAND:
          if (formData.selectedBrands && formData.selectedBrands.length > 0) {
            updateData.brands = formData.selectedBrands.map((b) => b.value)
          }
          break
        case VoucherUseCase.SHOP_ADMIN:
          if (formData.selectedShopUser) {
            updateData.shopId = formData.selectedShopUser.value
          }
          break
      }

      console.log('Updating voucher with data:', updateData)

      await discountService.update(voucher.id, updateData)

      toast.success('English content normalized from the original source text.')
      onEditSuccess?.()
    } catch (error: any) {
      console.error('Error updating voucher:', error)
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
    voucherType: voucherType.toString(),
    isEdit: true
  }
}
