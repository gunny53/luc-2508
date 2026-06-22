English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.
English content normalized from the original source text.
English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.

```typescript
// src/utils/api-adapters.ts
import { BaseResponse, PaginationMetadata } from '@/types/base.interface'

export function createDataTableAdapter<T, P = any>(fetchFunction: (params?: P) => Promise<BaseResponse<T[]>>) {
  return async (params?: P) => {
    const response = await fetchFunction(params)

    return {
      data: response.data || [],
      metadata:
        response.metadata ||
        ({
          page: 1,
          limit: 10,
          totalPages: 1,
          totalItems: 0,
          hasNext: false,
          hasPrevious: false
        } as PaginationMetadata)
    }
  }
}
```

English content normalized from the original source text.

English content normalized from the original source text.

```typescript
// src/components/admin/permissions/usePermissions-with-hook.ts
import { useState, useCallback } from "react";
import { Permission } from "./permissions-columns";
import { permissionService } from "@/services/permission-service";
import { showToast } from "@/components/ui/toastify";
import { parseApiError } from "@/utils/error";
import {
  PerCreateRequest,
  PerUpdateRequest,
  PermissionDetail,
} from "@/types/auth/permission.interface";
import { useServerDataTable } from "@/hooks/use-server-data-table";
import { createDataTableAdapter } from "@/utils/api-adapters";

export function usePermissions() {
  English content normalized from the original source text.
  const permissionAdapter = createDataTableAdapter<PermissionDetail>(permissionService.getAll);

  English content normalized from the original source text.
  const {
    data: permissions,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
  } = useServerDataTable<PermissionDetail, Permission>({
    fetchData: permissionAdapter,
    mapResponseToData: (item) => ({
      id: item.id,
      code: String(item.id),
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
      updatedAt: item.updatedAt,
    }),
    initialSort: { sortBy: "id", sortOrder: "asc" },
    defaultLimit: 10,
  });

  English content normalized from the original source text.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  English content normalized from the original source text.
  const handleCreate = async (data: PerCreateRequest) => {
    try {
      await permissionService.create(data);
      showToast("Permission created successfully", "success");
      English content normalized from the original source text.
      handleSortChange(pagination.sortBy || "id", (pagination.sortOrder as "asc" | "desc") || "asc");
      handleCloseModal();
    } catch (error) {
      showToast(parseApiError(error), "error");
    }
  };

  English content normalized from the original source text.
  const handleUpdate = async (id: number, data: PerUpdateRequest) => {
    try {
      await permissionService.update(String(id), data);
      showToast("Permission updated successfully", "success");
      English content normalized from the original source text.
      handleSortChange(pagination.sortBy || "id", (pagination.sortOrder as "asc" | "desc") || "asc");
      handleCloseModal();
    } catch (error) {
      showToast(parseApiError(error), "error");
    }
  };

  English content normalized from the original source text.
  const handleDelete = async (id: number) => {
    try {
      await permissionService.delete(String(id));
      showToast("Permission deleted successfully", "success");
      English content normalized from the original source text.
      handleSortChange(pagination.sortBy || "id", (pagination.sortOrder as "asc" | "desc") || "asc");
    } catch (error) {
      showToast(parseApiError(error), "error");
    }
  };

  English content normalized from the original source text.
  const handleOpenModal = (permission: Permission | null = null) => {
    setSelectedPermission(permission);
    setIsModalOpen(true);
  };

  English content normalized from the original source text.
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPermission(null);
  }, []);

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
  };
}
```

English content normalized from the original source text.

English content normalized from the original source text.

```tsx
// src/components/admin/permissions/permissions-Table-with-hook.tsx
'use client'

import { useState } from "react"
import { PermissionsColumns, Permission } from "./permissions-columns"
import SearchInput from "@/components/ui/data-table-component/search-input"
import PermissionsModalUpsert from "./permissions-modal-upsert-new"
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal"
import { DataTable } from "@/components/ui/data-table-component/data-table"
import { usePermissions } from "./use-permissions-with-hook"
import { useTranslations } from "next-intl"
import DataTableViewOption from "@/components/ui/data-table-component/data-table-view-option"
import { useDataTable } from "@/hooks/use-data-table"

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
    handleCloseModal,
  } = usePermissions();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleOpenDelete = (permission: Permission) => {
    setPermissionToDelete(permission);
    setDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false);
    setPermissionToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!permissionToDelete) return;
    setDeleteLoading(true);
    try {
      await handleDelete(permissionToDelete.id);
      handleCloseDeleteModal();
    } catch (error) {
      console.error("English content normalized from the original source text.
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (selectedPermission) {
        await handleUpdate(selectedPermission.id, formData);
      } else {
        await handleCreate(formData);
      }
    } catch (error) {
      console.error("English content normalized from the original source text.
    }
  };

  English content normalized from the original source text.
  const table = useDataTable({
    data: permissions,
    columns: PermissionsColumns({ onDelete: handleOpenDelete, onEdit: handleOpenModal }),
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-end gap-2">
        <SearchInput
          value={pagination?.search || ""}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t("admin.permissions.searchPlaceholder")}
          className="w-full md:max-w-sm"
        />
        <DataTableViewOption table={table} />
      </div>

      <DataTable
        table={table}
        columns={PermissionsColumns({ onDelete: handleOpenDelete, onEdit: handleOpenModal })}
        loading={loading}
        notFoundMessage={t("admin.permissions.notFound")}
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
          onLimitChange: handleLimitChange,
        }}
      />

      <PermissionsModalUpsert
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        permission={selectedPermission}
      />

      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title={t("admin.permissions.deleteTitle")}
        description={t("admin.permissions.deleteDescription")}
      />
    </div>
  )
}
```

English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.
English content normalized from the original source text.
English content normalized from the original source text.

English content normalized from the original source text.

```typescript
// useUsers.ts
import { userService } from '@/services/user-service';
import { createDataTableAdapter } from '@/utils/api-adapters';
import { useServerDataTable } from '@/hooks/use-server-data-table';
// ...

export function useUsers() {
  const userAdapter = createDataTableAdapter(userService.getAll);

  const {
    data: users,
    loading,
    pagination,
    // ...
  } = useServerDataTable({
    fetchData: userAdapter,
    mapResponseToData: (item) => ({
      // Map user data
    })
  });

  English content normalized from the original source text.

  return {
    users,
    loading,
    pagination,
    // ...
  };
}
```

English content normalized from the original source text.

- English content normalized from the original source text
- English content normalized from the original source text
- English content normalized from the original source text
