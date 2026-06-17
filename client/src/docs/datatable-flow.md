English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.
1. **useServerDataTable Hook**: English content normalized from the original source text.
English content normalized from the original source text.
3. **Module Hook (usePermissions)**: English content normalized from the original source text.
4. **DataTable Component**: English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text. `usePermissions`: English content normalized from the original source text.

```tsx
const { permissions, loading, pagination, ... } = usePermissions();
```

Hook `usePermissions` English content normalized from the original source text.
- English content normalized from the original source text
- English content normalized from the original source text
- English content normalized from the original source text

### 2. Fetching Data

- English content normalized from the original source text
- English content normalized from the original source text
- English content normalized from the original source text
  - English content normalized from the original source text
  - English content normalized from the original source text
  - English content normalized from the original source text

English content normalized from the original source text.

English content normalized from the original source text.
- English content normalized from the original source text
- English content normalized from the original source text
- English content normalized from the original source text
- English content normalized from the original source text

### 4. CRUD Operations

English content normalized from the original source text.
- English content normalized from the original source text
- English content normalized from the original source text
- English content normalized from the original source text

English content normalized from the original source text.

### 1. useServerDataTable.ts

English content normalized from the original source text.

```typescript
const {
  data,
  loading,
  pagination,
  handlePageChange,
  handleLimitChange,
  handleSearch,
  handleSortChange
} = useServerDataTable({
  fetchData: yourApiFunction,
  getResponseData: (response) => response.data,
  getResponseMetadata: (response) => response.metadata,
  mapResponseToData: (item) => transformItem(item),
  initialSort: { sortBy: 'id', sortOrder: 'asc' },
  defaultLimit: 10
});
```

- English content normalized from the original source text
- English content normalized from the original source text
- English content normalized from the original source text
- English content normalized from the original source text
- English content normalized from the original source text
- English content normalized from the original source text

English content normalized from the original source text.

English content normalized from the original source text.

```typescript
export function createDataTableAdapter<T>(apiFunction) {
  return async (params) => {
    const response = await apiFunction(params);
    return {
      data: response.data || [],
      metadata: response.metadata || defaultMetadata
    };
  };
}
```

English content normalized from the original source text.

### 3. usePermissions.ts

English content normalized from the original source text.

```typescript
export function usePermissions() {
  const {
    data: permissions,
    loading,
    pagination,
    English content normalized from the original source text.
  } = useServerDataTable<PermissionDetail, Permission>({
    fetchData: permissionService.getAll,
    getResponseData: (response) => response.data || [],
    getResponseMetadata: (response) => response.metadata,
    mapResponseToData: (item) => ({
      id: item.id,
      English content normalized from the original source text.
    }),
    English content normalized from the original source text.
  });

  English content normalized from the original source text.
  const handleCreate = async (data) => { /* ... */ };
  const handleUpdate = async (id, data) => { /* ... */ };
  const handleDelete = async (id) => { /* ... */ };

  English content normalized from the original source text.

  return {
    permissions,
    loading,
    pagination,
    English content normalized from the original source text.
  };
}
```

English content normalized from the original source text.

English content normalized from the original source text.
   - English content normalized from the original source text
   - English content normalized from the original source text

English content normalized from the original source text.
   - English content normalized from the original source text
   - English content normalized from the original source text

English content normalized from the original source text.
   - English content normalized from the original source text
   - English content normalized from the original source text

English content normalized from the original source text.
   - English content normalized from the original source text
   - English content normalized from the original source text
