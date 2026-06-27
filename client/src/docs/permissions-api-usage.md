Quy?n truy c?p

Quy?n truy c?p

Quy?n truy c?p

### Permission Object

```typescript
interface Permission {
  id: number;
  name: Quy?n truy c?p
  description: Quy?n truy c?p
  module: Quy?n truy c?p
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

Quy?n truy c?p

```typescript
Quy?n truy c?p
interface PaginationRequest {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

Quy?n truy c?p
const response = await permissionService.getAll(paginationParams, abortSignal);
```

Quy?n truy c?p

```typescript
interface PerCreateRequest {
  name: string;
  module: string;
  path: string;
  method: string;
  description?: string;
}

Quy?n truy c?p
const response = await permissionService.create(permissionData, abortSignal);
```

Quy?n truy c?p

```typescript
interface PerUpdateRequest {
  name: string;
  module: string;
  path: string;
  method: string;
  description?: string;
}

Quy?n truy c?p
const response = await permissionService.update(permissionId, updateData, abortSignal);
```

Quy?n truy c?p

```typescript
Quy?n truy c?p
const response = await permissionService.delete(permissionId, abortSignal);
```

Quy?n truy c?p

Quy?n truy c?p `usePermissions` Quy?n truy c?p

```typescript
const {
  Quy?n truy c?p
  Quy?n truy c?p
  Quy?n truy c?p
  Quy?n truy c?p
  Quy?n truy c?p
  Quy?n truy c?p
  Quy?n truy c?p
  Quy?n truy c?p
  Quy?n truy c?p
  Quy?n truy c?p
  Quy?n truy c?p
  Quy?n truy c?p
  Quy?n truy c?p
} = usePermissions();
```

Quy?n truy c?p

Quy?n truy c?p

- Quy?n truy c?p
- Quy?n truy c?p

2. **Debounced Search**:
   - Quy?n truy c?p

3. **Memoization**:
   - Quy?n truy c?p

Quy?n truy c?p

Quy?n truy c?p

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

Quy?n truy c?p

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

Quy?n truy c?p

- Quy?n truy c?p
- Quy?n truy c?p

Quy?n truy c?p

- Quy?n truy c?p
- Quy?n truy c?p

3. **UX**:
   - Quy?n truy c?p
   - Quy?n truy c?p

Quy?n truy c?p

Quy?n truy c?p

- Quy?n truy c?p
- Quy?n truy c?p

Quy?n truy c?p

- Quy?n truy c?p
- Quy?n truy c?p

Quy?n truy c?p

- Quy?n truy c?p
- Quy?n truy c?p
