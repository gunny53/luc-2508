import { useState, useCallback } from 'react'
import { Permission } from './permissions-columns'
import { permissionService } from '@/services/permission-service'
import { showToast } from '@/components/ui/toastify'
import { parseApiError } from '@/utils/error'
import { PerCreateRequest, PerUpdateRequest, PermissionDetail } from '@/types/auth/permission.interface'
import { useServerDataTable } from '@/hooks/use-server-data-table'

export function usePermissions() {
  const getResponseData = useCallback((response: any) => {
    return response.data || []
  }, [])

  const getResponseMetadata = useCallback((response: any) => {
    return response.metadata
  }, [])

  const mapResponseToData = useCallback(
    (item: PermissionDetail): Permission => ({
      id: item.id,
      name: item.name,
      description: item.description,
      path: item.path,
      method: item.method,
      module: item.module,
      createdById: item.createdById,
      updatedById: item.updatedById,
      deletedById: item.deletedById,
      deletedAt: item.deletedAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }),
    []
  )
  const {
    data: permissions,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData
  } = useServerDataTable<PermissionDetail, Permission>({
    fetchData: permissionService.getAll,
    getResponseData,
    getResponseMetadata,
    mapResponseToData,
    initialSort: { sortBy: 'createdAt', sortOrder: 'asc' },
    defaultLimit: 10,
    requestConfig: {
      includeSearch: false,
      includeSort: false,
      includeCreatedById: true
    }
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)

  const handleCreate = async (data: PerCreateRequest) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    try {
      await permissionService.create(data, controller.signal)
      showToast('Permission created successfully', 'success')
      refreshData()
      handleCloseModal()
    } catch (error) {
      if (!controller.signal.aborted) {
        showToast(parseApiError(error), 'error')
      }
    } finally {
      clearTimeout(timeoutId)
    }
  }

  const handleUpdate = async (id: string, data: PerUpdateRequest) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    try {
      await permissionService.update(String(id), data, controller.signal)
      showToast('Permission updated successfully', 'success')
      refreshData()
      handleCloseModal()
    } catch (error) {
      if (!controller.signal.aborted) {
        showToast(parseApiError(error), 'error')
      }
    } finally {
      clearTimeout(timeoutId)
    }
  }

  const handleDelete = async (id: string) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    try {
      await permissionService.delete(String(id), controller.signal)
      showToast('Permission deleted successfully', 'success')
      refreshData()
    } catch (error) {
      if (!controller.signal.aborted) {
        showToast(parseApiError(error), 'error')
      }
    } finally {
      clearTimeout(timeoutId)
    }
  }

  const handleOpenModal = (permission: Permission | null = null) => {
    setSelectedPermission(permission)
    setIsModalOpen(true)
  }

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedPermission(null)
  }, [])

  return {
    permissions,
    loading,
    pagination,
    isModalOpen,
    selectedPermission,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleOpenModal,
    handleCloseModal,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    refreshData
  }
}
