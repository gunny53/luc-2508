import { useState, useCallback, useEffect } from 'react'
import { roleService } from '@/services/role-service'
import { permissionService } from '@/services/permission-service'
import { showToast } from '@/components/ui/toastify'
import { parseApiError } from '@/utils/error'
import {
  RoleGetAllResponse,
  RoleCreateRequest,
  RoleUpdateRequest,
  Permission,
  RoleGetByIdResponse
} from '@/types/auth/role.interface'
import { PerGetAllResponse, PermissionDetail } from '@/types/auth/permission.interface'
import { Role } from './roles-columns'
import { useServerDataTable } from '@/hooks/use-server-data-table'
import { useTranslations } from 'next-intl'

export function useRoles() {
  const t = useTranslations()

  // Modal states
  const [upsertOpen, setUpsertOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Permissions data for the modal
  const [permissionsData, setPermissionsData] = useState<Record<string, PermissionDetail[]>>({})
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(true)

  // Callbacks for useServerDataTable
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

  const mapResponseToData = useCallback((role: any): Role => {
    return {
      ...role,
      id: role.id,
      description: role.description || '',
      isActive: role.isActive ?? true
    }
  }, [])

  // Use the useServerDataTable hook
  const {
    data: roles,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData
  } = useServerDataTable({
    fetchData: roleService.getAll,
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

  // Fetch permissions for the modal
  const fetchPermissions = useCallback(async () => {
    try {
      setIsPermissionsLoading(true)
      const response = await permissionService.getAll({
        page: 1,
        limit: 1000
      })
      const responseData = Array.isArray(response.data) ? response.data : []
      console.log(
        'Permissions API response data:',
        responseData.length
          ? 'English content normalized from the original source text.'
          : 'English content normalized from the original source text.'
      )
      const sortedData = [...responseData].sort((a, b) => {
        const moduleA = a.module || 'OTHERS'
        const moduleB = b.module || 'OTHERS'
        return moduleA.localeCompare(moduleB)
      })
      const groupedPermissions = sortedData.reduce((acc: Record<string, PermissionDetail[]>, item) => {
        const moduleKey = item.module || 'OTHERS'

        if (!acc[moduleKey]) {
          acc[moduleKey] = []
        }
        const enrichedItem = {
          ...item,
          action: `${item.method} - ${item.path}`
        }

        acc[moduleKey].push(enrichedItem)
        return acc
      }, {})
      setPermissionsData(groupedPermissions)
      console.log('Permissions grouped by modules:', Object.keys(groupedPermissions))
      console.log('Total permissions count:', sortedData.length)
    } catch (error) {
      console.error('Error fetching permissions:', error)
      showToast(parseApiError(error), 'error')
    } finally {
      setIsPermissionsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  // CRUD operations
  const addRole = async (data: RoleCreateRequest) => {
    try {
      const response = await roleService.create(data)
      showToast(response.message || 'English content normalized from the original source text.', 'success')
      refreshData()
      handleCloseUpsertModal()
      return response
    } catch (error) {
      showToast(parseApiError(error), 'error')
      console.error('English content normalized from the original source text.', error)
      return null
    }
  }

  const editRole = async (id: string, data: RoleUpdateRequest) => {
    try {
      const response = await roleService.update(id, data)
      showToast(response.message || 'English content normalized from the original source text.', 'success')
      refreshData()
      handleCloseUpsertModal()
      return response
    } catch (error) {
      showToast(parseApiError(error), 'error')
      console.error('English content normalized from the original source text.', error)
      return null
    }
  }

  const handleConfirmDelete = async (): Promise<void> => {
    if (roleToDelete) {
      setDeleteLoading(true)
      try {
        const response = await roleService.delete(roleToDelete.id)
        showToast(response.message || 'English content normalized from the original source text.', 'success')
        refreshData()
        handleCloseDeleteModal()
      } catch (error) {
        showToast(parseApiError(error), 'error')
        console.error('English content normalized from the original source text.', error)
      } finally {
        setDeleteLoading(false)
      }
    }
  }

  // Modal handlers
  const handleOpenDelete = (role: Role) => {
    setRoleToDelete(role)
    setDeleteOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false)
    setRoleToDelete(null)
  }

  // Fetch role details by ID including permissions
  const fetchRoleDetails = async (roleId: string) => {
    try {
      setIsPermissionsLoading(true)
      const response = await roleService.getById(roleId)
      console.log('Role API response structure:', response)

      // Update roleToEdit with full details including permissions
      if (response) {
        let roleDetails: any

        if (typeof response === 'object' && response !== null) {
          if ('data' in response && response.data && typeof response.data === 'object') {
            roleDetails = response.data
            console.log('Using response.data as role details')
          } else {
            roleDetails = response
            console.log('Using direct response as role details')
          }

          console.log('API Response for role details:', roleDetails)

          // Extract the necessary data and explicitly type as Role
          const roleData: Role = {
            id: roleDetails.id,
            name: roleDetails.name,
            description: roleDetails.description || '',
            isActive: roleDetails.isActive ?? true,
            createdById: roleDetails.createdById,
            updatedById: roleDetails.updatedById,
            deletedById: roleDetails.deletedById,
            deletedAt: roleDetails.deletedAt,
            createdAt: roleDetails.createdAt,
            updatedAt: roleDetails.updatedAt,
            permissions: Array.isArray(roleDetails.permissions)
              ? roleDetails.permissions.map((p: any) => ({
                  ...p,
                  id: p.id.toString(),
                  action: `${p.method} - ${p.path}`
                }))
              : []
          }
          setRoleToEdit(roleData)

          // Log for debugging
          console.log('Processed role data:', roleData)
          console.log('Permissions count:', roleData.permissions?.length || 0)
          console.log('Role permissions:', roleData.permissions)
        }
      }
    } catch (error) {
      showToast(parseApiError(error), 'error')
      console.error('English content normalized from the original source text.', error)
    } finally {
      setIsPermissionsLoading(false)
    }
  }

  const handleOpenUpsertModal = (mode: 'add' | 'edit', role?: Role) => {
    setModalMode(mode)

    if (mode === 'edit' && role) {
      console.log('Opening edit modal for role:', role)
      setRoleToEdit(role)
      // Fetch detailed role info including permissions
      fetchRoleDetails(role.id)
    } else {
      console.log('Opening add modal')
      setRoleToEdit(null)
    }

    setUpsertOpen(true)
  }

  const handleCloseUpsertModal = () => {
    setUpsertOpen(false)
    setRoleToEdit(null)
  }

  return {
    data: roles,
    loading,
    pagination,

    // Server-side pagination handlers
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,

    // Delete
    deleteOpen,
    roleToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,

    // Upsert
    upsertOpen,
    modalMode,
    roleToEdit,
    handleOpenUpsertModal,
    handleCloseUpsertModal,
    addRole,
    editRole,
    fetchRoleDetails,

    // Permissions data
    permissionsData,
    isPermissionsLoading
  }
}
