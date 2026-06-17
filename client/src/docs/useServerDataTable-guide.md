English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.

```typescript
{
  data: English content normalized from the original source text.
  metadata: English content normalized from the original source text.
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

English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.

```typescript
import { createDataTableAdapter } from '@/utils/api-adapters';
import { yourService } from '@/services/yourService';

English content normalized from the original source text.
const adaptedFetchFunction = createDataTableAdapter(yourService.getAll);
```

English content normalized from the original source text.

```typescript
import { useServerDataTable } from '@/hooks/useServerDataTable';

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
    fetchData: English content normalized from the original source text.
    mapResponseToData: English content normalized from the original source text.
      English content normalized from the original source text.
      id: item.id,
      name: item.name,
      English content normalized from the original source text.
    }),
    initialSort: English content normalized from the original source text.
    defaultLimit: English content normalized from the original source text.
  });

  English content normalized from the original source text.

  return {
    data,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    English content normalized from the original source text.
  };
}
```

English content normalized from the original source text.

```tsx
function YourEntityTable() {
  const {
    data,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch
  } = useYourEntityHook();

  const table = useDataTable({
    data,
    columns: yourColumns
  });

  return (
    <div>
      <SearchInput
        value={pagination?.search || ""}
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
          onLimitChange: handleLimitChange,
        }}
      />
    </div>
  );
}
```

English content normalized from the original source text.

English content normalized from the original source text.
2. **Debounced Search**: English content normalized from the original source text.
English content normalized from the original source text.
English content normalized from the original source text.
English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.

- English content normalized from the original source text
- English content normalized from the original source text
- English content normalized from the original source text
- English content normalized from the original source text
