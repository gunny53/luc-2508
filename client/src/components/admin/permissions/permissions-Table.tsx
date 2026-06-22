'use client'

import { useState } from 'react'
import { PermissionsColumns, Permission } from './permissions-columns'
import SearchInput from '@/components/ui/data-table-component/search-input'
import PermissionsModalUpsert from './permissions-modal-upsert'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'
import { DataTable } from '@/components/ui/data-table-component/data-table'
import { usePermissions } from './use-permissions'
import { useTranslations } from 'next-intl'
import DataTableViewOption from '@/components/ui/data-table-component/data-table-view-option'
import { useDataTable } from '@/hooks/use-data-table'
import { Button } from '@/components/ui/button'
import { PlusIcon, Loader2 } from 'lucide-react'

export function PermissionsTable() {
  const t = useTranslations()
  const {
    permissions,
    loading,
    pagination,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    isModalOpen,
    selectedPermission,
    handleDelete,
    handleCreate,
    handleUpdate,
    handleOpenModal,
    handleCloseModal
  } = usePermissions()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleOpenDelete = (permission: Permission) => {
    setPermissionToDelete(permission)
    setDeleteOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false)
    setPermissionToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!permissionToDelete) return
    setDeleteLoading(true)
    try {
      await handleDelete(permissionToDelete.id)
      handleCloseDeleteModal()
    } catch (error) {
      console.error('English content normalized from the original source text.', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      if (selectedPermission) {
        await handleUpdate(selectedPermission.id, formData)
      } else {
        await handleCreate(formData)
      }
    } catch (error) {
      console.error('English content normalized from the original source text.', error)
    }
  }

  // Log to check if permissions are updated
  console.log('Permissions data:', permissions.length, 'items')
  console.log('Current pagination:', pagination)

  // Ensure table is recreated when permissions or pagination changes
  const table = useDataTable({
    data: permissions,
    columns: PermissionsColumns({ onDelete: handleOpenDelete, onEdit: handleOpenModal })
  })

  return (
    <div className="w-full space-y-4">
      {}
      <div className="flex justify-end">
        <Button onClick={() => handleOpenModal()} variant="default">
          <PlusIcon className="w-4 h-4 mr-2" />
          {t('admin.permissions.addAction') || 'English content normalized from the original source text.'}
        </Button>
      </div>

      {}
      <div className="flex justify-between flex-wrap gap-2 items-center">
        <SearchInput
          value={pagination?.search || ''}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t('admin.permissions.searchPlaceholder')}
          className="w-full md:max-w-sm"
        />
        <DataTableViewOption table={table} />
      </div>

      {}
      <DataTable
        table={table}
        columns={PermissionsColumns({ onDelete: handleOpenDelete, onEdit: handleOpenModal })}
        loading={loading}
        notFoundMessage={t('admin.permissions.notFound')}
        pagination={{
          metadata: pagination || {
            page: 1,
            limit: 10,
            totalPages: 1,
            totalItems: 0,
            hasNext: false,
            hasPrevious: false
          },
          onPageChange: handlePageChange,
          onLimitChange: handleLimitChange
        }}
      />

      {}
      <PermissionsModalUpsert
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        permission={selectedPermission}
      />

      {}
      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title={t('admin.permissions.deleteModal.deleteTitle')}
        description={t('admin.permissions.deleteModal.deleteDescription')}
      />
    </div>
  )
}
