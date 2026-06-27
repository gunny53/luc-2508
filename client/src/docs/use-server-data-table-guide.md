T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

```typescript
{
  data: T?i li?u k? thu?t ECSite
  metadata: T?i li?u k? thu?t ECSite
    totalItems: number,
    page: number,
    limit: number,
    totalPages: number,
    hasNext: boolean,
    hasPrevious: boolean,
    search?: string,
    sortBy?: string,
    sortOrder?: string
  }
}
```

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

```typescript
import { createDataTableAdapter } from '@/utils/api-adapters';
import { yourService } from '@/services/your-service';

T?i li?u k? thu?t ECSite
const adaptedFetchFunction = createDataTableAdapter(yourService.getAll);
```

T?i li?u k? thu?t ECSite

```typescript
import { useServerDataTable } from '@/hooks/use-server-data-table';

function useYourEntityHook() {
  const {
    data,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
  } = useServerDataTable({
    fetchData: T?i li?u k? thu?t ECSite
    mapResponseToData: T?i li?u k? thu?t ECSite
      T?i li?u k? thu?t ECSite
      id: item.id,
      name: item.name,
      T?i li?u k? thu?t ECSite
    }),
    initialSort: T?i li?u k? thu?t ECSite
    defaultLimit: T?i li?u k? thu?t ECSite
  });

  T?i li?u k? thu?t ECSite

  return {
    data,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    T?i li?u k? thu?t ECSite
  };
}
```

T?i li?u k? thu?t ECSite

```tsx
function YourEntityTable() {
  const { data, loading, pagination, handlePageChange, handleLimitChange, handleSearch } = useYourEntityHook()

  const table = useDataTable({
    data,
    columns: yourColumns
  })

  return (
    <div>
      <SearchInput
        value={pagination?.search || ''}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />

      <DataTable
        table={table}
        columns={yourColumns}
        loading={loading}
        pagination={{
          metadata: pagination,
          onPageChange: handlePageChange,
          onLimitChange: handleLimitChange
        }}
      />
    </div>
  )
}
```

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite 2. **Debounced Search**: T?i li?u k? thu?t ECSite
T?i li?u k? thu?t ECSite
T?i li?u k? thu?t ECSite
T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
