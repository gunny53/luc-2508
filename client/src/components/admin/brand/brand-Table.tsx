'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table-component/data-table'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'
import { PlusIcon } from 'lucide-react'
import { Brand, BrandCreateRequest, BrandUpdateRequest } from '@/types/admin/brands.interface'
import { useBrand } from './use-brand'
import { BrandColumns } from './brand-columns'
import SearchInput from '@/components/ui/data-table-component/search-input'
import { useDataTable } from '@/hooks/use-data-table'
import DataTableViewOption from '@/components/ui/data-table-component/data-table-view-option'
import BrandModalUpsert from './brand-modal-upsert'

export function BrandTable() {
  const t = useTranslations('admin.ModuleBrands.Table')

  const {
    data: brands,
    loading,
    pagination,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    isModalOpen,
    selectedBrand,
    handleOpenModal,
    handleCloseModal,
    deleteOpen,
    brandToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
    createBrand,
    updateBrand
  } = useBrand()

  const handleSubmit = async (values: BrandCreateRequest | BrandUpdateRequest) => {
    if (selectedBrand) {
      await updateBrand(selectedBrand.id, values as BrandUpdateRequest)
    } else {
      await createBrand(values as BrandCreateRequest)
    }
  }

  const table = useDataTable({
    data: brands,
    columns: BrandColumns({
      onEdit: (brand) => handleOpenModal(brand),
      onDelete: handleOpenDelete
    })
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => handleOpenModal()}>
          <PlusIcon className="w-4 h-4 mr-2" />
          {t('addAction')}
        </Button>
      </div>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex-1">
          <SearchInput
            value={pagination.search || ''}
            onValueChange={(value) => handleSearch(value)}
            placeholder={t('searchPlaceholder')}
            className="w-full md:max-w-sm"
          />
        </div>
        <DataTableViewOption table={table} />
      </div>

      <div className="relative">
        <DataTable
          table={table}
          columns={BrandColumns({
            onEdit: (brand) => handleOpenModal(brand),
            onDelete: handleOpenDelete
          })}
          loading={loading}
          notFoundMessage={t('notFound')}
          pagination={{
            metadata: pagination,
            onPageChange: handlePageChange,
            onLimitChange: handleLimitChange
          }}
        />
      </div>

      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => {
          if (!deleteLoading) handleCloseDeleteModal()
        }}
        onConfirm={handleConfirmDelete}
        title={t('deleteConfirm.title')}
        description={
          brandToDelete
            ? t('deleteConfirm.description', {
                name: brandToDelete?.name || ''
              })
            : ''
        }
        confirmText={t('deleteConfirm.deleteAction')}
        cancelText={t('deleteConfirm.cancel')}
        loading={deleteLoading}
      />

      {isModalOpen && (
        <BrandModalUpsert
          open={isModalOpen}
          onClose={handleCloseModal}
          mode={selectedBrand ? 'edit' : 'add'}
          brand={selectedBrand}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}

export default BrandTable
