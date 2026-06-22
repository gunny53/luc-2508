import { useState, useCallback } from 'react'
import { Language } from './languages-columns'
import { languagesService } from '@/services/admin/languages-service'
import { showToast } from '@/components/ui/toastify'
import { parseApiError } from '@/utils/error'
import { LangCreateRequest, LangUpdateRequest, LangGetAllResponse } from '@/types/admin/languages.interface'
import { useServerDataTable } from '@/hooks/use-server-data-table'
import { t } from 'i18next'

export function useLanguages() {
  const getResponseData = useCallback((response: any) => {
    return response.data || []
  }, [])

  const getResponseMetadata = useCallback((response: any) => {
    return {
      totalItems: response.totalItems,
      page: response.page,
      totalPages: response.totalPages,
      limit: response.limit || 10,
      hasNext: response.page < response.totalPages,
      hasPrevious: response.page > 1
    }
  }, [])

  const mapResponseToData = useCallback(
    (lang: any): Language => ({
      id: parseInt(lang.id),
      code: lang.id, // Using id as code
      name: lang.name,
      isActive: true, // Default value
      createdAt: lang.createdAt,
      updatedAt: lang.updatedAt
    }),
    []
  )
  const {
    data: languages,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData
  } = useServerDataTable({
    fetchData: languagesService.getAll,
    getResponseData,
    getResponseMetadata,
    mapResponseToData,
    initialSort: { sortBy: 'createdAt', sortOrder: 'asc' },
    defaultLimit: 10
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)

  // Get language by ID
  const getLanguageById = useCallback(async (id: string) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    try {
      const response = await languagesService.getById(id, controller.signal)
      return response
    } catch (error) {
      if (!controller.signal.aborted) {
        showToast(parseApiError(error), 'error')
      }
      return null
    } finally {
      clearTimeout(timeoutId)
    }
  }, [])

  // Create new language
  const createLanguage = useCallback(
    async (data: LangCreateRequest) => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)

      try {
        const response = await languagesService.create(data, controller.signal)
        showToast(t('admin.showToast.language.createSuccessful'), 'success')
        refreshData()
        return response
      } catch (error) {
        if (!controller.signal.aborted) {
          showToast(parseApiError(error), 'error')
        }
        return null
      } finally {
        clearTimeout(timeoutId)
      }
    },
    [refreshData]
  )

  // Update language
  const updateLanguage = useCallback(
    async (id: string, data: LangUpdateRequest) => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)

      try {
        const response = await languagesService.update(id, data, controller.signal)
        showToast(t('admin.showToast.language.updateSuccessful'), 'success')
        refreshData()
        return response
      } catch (error) {
        if (!controller.signal.aborted) {
          showToast(parseApiError(error), 'error')
        }
        return null
      } finally {
        clearTimeout(timeoutId)
      }
    },
    [refreshData]
  )

  // Delete language
  const deleteLanguage = useCallback(
    async (id: string) => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)

      try {
        const response = await languagesService.deleteById(id, controller.signal)
        showToast(t('admin.showToast.language.deleteSuccessful'), 'success')
        refreshData()
        return response
      } catch (error) {
        if (!controller.signal.aborted) {
          showToast(parseApiError(error), 'error')
        }
        return null
      } finally {
        clearTimeout(timeoutId)
      }
    },
    [refreshData]
  )

  const handleOpenModal = useCallback((language?: Language) => {
    if (language) {
      setSelectedLanguage(language)
    } else {
      setSelectedLanguage(null)
    }
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedLanguage(null)
  }, [])

  return {
    languages,
    pagination,
    isModalOpen,
    selectedLanguage,
    loading,
    // API handlers
    getLanguageById,
    createLanguage,
    updateLanguage,
    deleteLanguage,
    // UI handlers
    handleOpenModal,
    handleCloseModal,
    // Pagination handlers
    handlePageChange,
    handleLimitChange,
    handleSearch,
    refreshData
  }
}
