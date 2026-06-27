'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Brand, BrandCreateRequest, BrandUpdateRequest } from '@/types/admin/brands.interface'
import * as brandsService from '@/services/admin/brands-service'
import { useServerDataTable } from '@/hooks/use-server-data-table'
import { showToast } from '@/components/ui/toastify'

export const useBrand = () => {
  const t = useTranslations()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const getResponseData = useCallback((response: any) => {
    return response.data || []
  }, [])

  const getResponseMetadata = useCallback((response: any) => {
    const metadata = response.metadata || {}
    return {
      totalItems: metadata.totalItems || 0,
      page: metadata.page || 1,
      totalPages: metadata.totalPages || 1,
      limit: metadata.limit || 10,
      hasNext: metadata.hasNext || false,
      hasPrevious: metadata.hasPrev || false 
    }
  }, [])

  const mapResponseToData = useCallback((brand: any): Brand => {
    return brand
  }, [])
  const {
    data,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData
  } = useServerDataTable({
    fetchData: brandsService.getAllBrands,
    getResponseData,
    getResponseMetadata,
    mapResponseToData,
    initialSort: { sortBy: 'createdAt', sortOrder: 'desc' },
    defaultLimit: 10
  })

  
  const createBrand = async (brand: BrandCreateRequest) => {
    try {
      const response = await brandsService.createBrand(brand)
      showToast(`Th??ng hi?u${brand.name}`, 'success')
      refreshData()
      handleCloseModal()
      return true
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Th??ng hi?u'
      showToast(errorMessage, 'error')
      return false
    }
  }

  const updateBrand = async (id: number | string, brand: BrandUpdateRequest) => {
    try {
      const response = await brandsService.updateBrand(id, brand)
      showToast(`Th??ng hi?u${brand.name}`, 'success')
      refreshData()
      handleCloseModal()
      return true
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Th??ng hi?u'
      showToast(errorMessage, 'error')
      return false
    }
  }

  const handleConfirmDelete = async () => {
    if (brandToDelete) {
      setDeleteLoading(true)
      try {
        const response = await brandsService.deleteBrand(brandToDelete.id)
        showToast(`Th??ng hi?u${brandToDelete.name}`, 'success')
        refreshData()
        setDeleteOpen(false)
        setBrandToDelete(null)
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Th??ng hi?u'
        showToast(errorMessage, 'error')
      } finally {
        setDeleteLoading(false)
      }
    }
  }

  const handleOpenDelete = (brand: Brand) => {
    setBrandToDelete(brand)
    setDeleteOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false)
    setBrandToDelete(null)
  }

  const handleOpenModal = (brand?: Brand) => {
    setSelectedBrand(brand || null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBrand(null)
  }

  return {
    data,
    loading,
    pagination,

    
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,

    
    deleteOpen,
    brandToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,

    
    isModalOpen,
    selectedBrand,
    handleOpenModal,
    handleCloseModal,
    createBrand,
    updateBrand
  }
}
