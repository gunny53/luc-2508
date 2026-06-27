T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

1. **useServerDataTable Hook**: T?i li?u k? thu?t ECSite
   T?i li?u k? thu?t ECSite
2. **Module Hook (usePermissions)**: T?i li?u k? thu?t ECSite
3. **DataTable Component**: T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite `usePermissions`: T?i li?u k? thu?t ECSite

```tsx
const { permissions, loading, pagination, ... } = usePermissions();
```

Hook `usePermissions` T?i li?u k? thu?t ECSite

- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite

### 2. Fetching Data

- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
  - T?i li?u k? thu?t ECSite
  - T?i li?u k? thu?t ECSite
  - T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite

### 4. CRUD Operations

T?i li?u k? thu?t ECSite

- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

### 1. useServerDataTable.ts

T?i li?u k? thu?t ECSite

```typescript
const { data, loading, pagination, handlePageChange, handleLimitChange, handleSearch, handleSortChange } =
  useServerDataTable({
    fetchData: yourApiFunction,
    getResponseData: (response) => response.data,
    getResponseMetadata: (response) => response.metadata,
    mapResponseToData: (item) => transformItem(item),
    initialSort: { sortBy: 'id', sortOrder: 'asc' },
    defaultLimit: 10
  })
```

- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

```typescript
export function createDataTableAdapter<T>(apiFunction) {
  return async (params) => {
    const response = await apiFunction(params)
    return {
      data: response.data || [],
      metadata: response.metadata || defaultMetadata
    }
  }
}
```

T?i li?u k? thu?t ECSite

### 3. usePermissions.ts

T?i li?u k? thu?t ECSite

```typescript
export function usePermissions() {
  const {
    data: permissions,
    loading,
    pagination,
    T?i li?u k? thu?t ECSite
  } = useServerDataTable<PermissionDetail, Permission>({
    fetchData: permissionService.getAll,
    getResponseData: (response) => response.data || [],
    getResponseMetadata: (response) => response.metadata,
    mapResponseToData: (item) => ({
      id: item.id,
      T?i li?u k? thu?t ECSite
    }),
    T?i li?u k? thu?t ECSite
  });

  T?i li?u k? thu?t ECSite
  const handleCreate = async (data) => { /* ... */ };
  const handleUpdate = async (id, data) => { /* ... */ };
  const handleDelete = async (id) => { /* ... */ };

  T?i li?u k? thu?t ECSite

  return {
    permissions,
    loading,
    pagination,
    T?i li?u k? thu?t ECSite
  };
}
```

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
