import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { categoryService } from '@/services/admin/category-service'
import { Category, CategoryCreateRequest, CategoryUpdateRequest } from '@/types/admin/category.interface'
import { useServerDataTable } from '@/hooks/use-server-data-table'
import { showToast } from '@/components/ui/toastify'


type ModalMode = 'add' | 'edit'

type BreadcrumbItem = {
  id: string
  name: string
}

export const useCategory = () => {
  const t = useTranslations()

  
  const [upsertOpen, setUpsertOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>('add')
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null)

  
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  
  const [currentParentId, setCurrentParentId] = useState<string | null>(null)
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([])
  const [currentCategoryTitle, setCurrentCategoryTitle] = useState<string>('')
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

  const mapResponseToData = useCallback((category: any): Category => {
    return category
  }, [])
  const currentParentIdRef = useRef<string | null>(null)
  currentParentIdRef.current = currentParentId
  const fetchData = useCallback(async (params: any) => {
    const requestParams = {
      ...params,
      ...(currentParentIdRef.current && { parentCategoryId: currentParentIdRef.current })
    }
    console.log('🔍 API Request Params:', requestParams)
    return categoryService.getAll(requestParams)
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
    fetchData: fetchData,
    getResponseData,
    getResponseMetadata,
    mapResponseToData,
    initialSort: { sortBy: 'createdAt', sortOrder: 'desc' },
    defaultLimit: 10
  })

  
  const refreshDataRef = useRef(refreshData)
  refreshDataRef.current = refreshData

  
  const handleOpenUpsertModal = useCallback((mode: ModalMode, category?: Category) => {
    setModalMode(mode)
    setCategoryToEdit(category || null)
    setUpsertOpen(true)
  }, [])

  const handleCloseUpsertModal = useCallback(() => {
    setUpsertOpen(false)
    setCategoryToEdit(null)
  }, [])

  
  const handleOpenDelete = useCallback((category: Category) => {
    setCategoryToDelete(category)
    setDeleteOpen(true)
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteOpen(false)
    setCategoryToDelete(null)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!categoryToDelete) return
    setDeleteLoading(true)
    try {
      const response = await categoryService.delete(String(categoryToDelete.id))
      showToast(response.message || t('admin.notifications.categoryDeleted'), 'success')
      refreshData()
      setDeleteOpen(false)
      setCategoryToDelete(null)
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message || 'Danh m?c'
      showToast(errorMessage, 'error')
      console.error('Error deleting category:', error)
    } finally {
      setDeleteLoading(false)
    }
  }, [categoryToDelete, refreshData, t])

  
  const handleViewSubcategories = useCallback((category: Category) => {
    console.log('🚀 Navigating to subcategories of:', category.name, 'ID:', category.id)

    setCurrentParentId(category.id)
    setBreadcrumb((prev) => [...prev, { id: category.id, name: category.name }])
    setCurrentCategoryTitle(category.name)

    
    requestAnimationFrame(() => {
      refreshDataRef.current()
    })
  }, [])

  const handleBackToRoot = useCallback(() => {
    console.log('🏠 Navigating back to root')
    setCurrentParentId(null)
    setBreadcrumb([])
    setCurrentCategoryTitle('')

    requestAnimationFrame(() => {
      refreshDataRef.current()
    })
  }, [])

  const handleBreadcrumbClick = useCallback(
    (index: number) => {
      if (index === 0) {
        handleBackToRoot()
        return
      }
      const newBreadcrumb = breadcrumb.slice(0, index)
      const lastCrumb = newBreadcrumb[newBreadcrumb.length - 1]

      console.log('🍞 Breadcrumb click to:', lastCrumb.name, 'ID:', lastCrumb.id)

      setCurrentParentId(lastCrumb.id)
      setBreadcrumb(newBreadcrumb)
      setCurrentCategoryTitle(lastCrumb.name)

      requestAnimationFrame(() => {
        refreshDataRef.current()
      })
    },
    [breadcrumb, handleBackToRoot]
  )

  
  const addCategory = useCallback(
    async (data: CategoryCreateRequest) => {
      try {
        const response = await categoryService.create({
          ...data,
          ...(currentParentId && { parentCategoryId: currentParentId })
        })
        showToast(response.message || t('admin.notifications.categoryCreated'), 'success')
        refreshData()
        handleCloseUpsertModal()
        return response
      } catch (error) {
        const errorMessage =
          (error as any).response?.data?.message || 'Danh m?c'
        showToast(errorMessage, 'error')
        console.error('Error creating category:', error)
        return null
      }
    },
    [currentParentId, refreshData, t, handleCloseUpsertModal]
  )

  const editCategory = useCallback(
    async (id: string, data: CategoryUpdateRequest) => {
      try {
        const response = await categoryService.update(id, data)
        showToast(response.message || t('admin.notifications.categoryUpdated'), 'success')
        refreshData()
        handleCloseUpsertModal()
        return response
      } catch (error) {
        const errorMessage =
          (error as any).response?.data?.message || 'Danh m?c'
        showToast(errorMessage, 'error')
        console.error('Error updating category:', error)
        return null
      }
    },
    [refreshData, t, handleCloseUpsertModal]
  )

  return {
    
    data,
    loading,
    pagination,
    refreshData,

    
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,

    
    upsertOpen,
    modalMode,
    categoryToEdit,
    handleOpenUpsertModal,
    handleCloseUpsertModal,

    
    deleteOpen,
    categoryToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,

    
    addCategory,
    editCategory,

    
    currentParentId,
    breadcrumb,
    currentCategoryTitle,
    handleViewSubcategories,
    handleBackToRoot,
    handleBreadcrumbClick
  }
}
