English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.

### Permission Object

```typescript
interface Permission {
  id: number;
  name: English content normalized from the original source text.
  description: English content normalized from the original source text.
  module: English content normalized from the original source text.
  path: string;        // API path
  method: string;      // HTTP method (GET, POST, PUT, DELETE, etc.)
  createdById: string;
  updatedById: string;
  deletedById: string;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}
```

## API Endpoints

English content normalized from the original source text.

```typescript
English content normalized from the original source text.
interface PaginationRequest {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

English content normalized from the original source text.
const response = await permissionService.getAll(paginationParams, abortSignal);
```

English content normalized from the original source text.

```typescript
interface PerCreateRequest {
  name: string;
  module: string;
  path: string;
  method: string;
  description?: string;
}

English content normalized from the original source text.
const response = await permissionService.create(permissionData, abortSignal);
```

English content normalized from the original source text.

```typescript
interface PerUpdateRequest {
  name: string;
  module: string;
  path: string;
  method: string;
  description?: string;
}

English content normalized from the original source text.
const response = await permissionService.update(permissionId, updateData, abortSignal);
```

English content normalized from the original source text.

```typescript
English content normalized from the original source text.
const response = await permissionService.delete(permissionId, abortSignal);
```

English content normalized from the original source text.

English content normalized from the original source text. `usePermissions` English content normalized from the original source text.

```typescript
const {
  English content normalized from the original source text.
  English content normalized from the original source text.
  English content normalized from the original source text.
  English content normalized from the original source text.
  English content normalized from the original source text.
  English content normalized from the original source text.
  English content normalized from the original source text.
  English content normalized from the original source text.
  English content normalized from the original source text.
  English content normalized from the original source text.
  English content normalized from the original source text.
  English content normalized from the original source text.
  English content normalized from the original source text.
} = usePermissions();
```

English content normalized from the original source text.

English content normalized from the original source text.

- English content normalized from the original source text
- English content normalized from the original source text

2. **Debounced Search**:
   - English content normalized from the original source text

3. **Memoization**:
   - English content normalized from the original source text

English content normalized from the original source text.

English content normalized from the original source text.

```typescript
const handleCreatePermission = async (data) => {
  try {
    await handleCreate({
      name: data.name,
      module: data.module,
      path: data.path,
      method: data.method,
      description: data.description
    })
    showToast('Permission created successfully', 'success')
  } catch (error) {
    showToast('Failed to create permission', 'error')
  }
}
```

English content normalized from the original source text.

```typescript
const handleUpdatePermission = async (id, data) => {
  try {
    await handleUpdate(id, {
      name: data.name,
      module: data.module,
      path: data.path,
      method: data.method,
      description: data.description
    })
    showToast('Permission updated successfully', 'success')
  } catch (error) {
    showToast('Failed to update permission', 'error')
  }
}
```

## Best Practices

English content normalized from the original source text.

- English content normalized from the original source text
- English content normalized from the original source text

English content normalized from the original source text.

- English content normalized from the original source text
- English content normalized from the original source text

3. **UX**:
   - English content normalized from the original source text
   - English content normalized from the original source text

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
