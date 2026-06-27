T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

```typescript
T?i li?u k? thu?t ECSite
const getResponseData = useCallback((response: any) => {
  return response.data || [];
}, []);

const getResponseMetadata = useCallback((response: any) => {
  return response.metadata;
}, []);

const mapResponseToData = useCallback((item: ApiItemType): UiItemType => ({
  id: item.id,
  T?i li?u k? thu?t ECSite
}), []);
```

T?i li?u k? thu?t ECSite

```typescript
const {
  data: items,
  loading,
  pagination,
  handlePageChange,
  handleLimitChange,
  handleSearch,
  handleSortChange
} = useServerDataTable<ApiItemType, UiItemType>({
  fetchData: yourService.getAll,
  getResponseData,
  getResponseMetadata,
  mapResponseToData,
  initialSort: { sortBy: 'id', sortOrder: 'asc' },
  defaultLimit: 10
})
```

T?i li?u k? thu?t ECSite

```typescript
const handleCreate = async (data) => {
  try {
    await yourService.create(data);
    T?i li?u k? thu?t ECSite
    handleSortChange(pagination.sortBy || "id", (pagination.sortOrder as "asc" | "desc") || "asc");
  } catch (error) {
    T?i li?u k? thu?t ECSite
  }
};
```

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite

2. **Fetching Data**:
   - T?i li?u k? thu?t ECSite
   - T?i li?u k? thu?t ECSite
   - T?i li?u k? thu?t ECSite
   - T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

1. **React Strict Mode**: T?i li?u k? thu?t ECSite
2. **Waterfall requests**: T?i li?u k? thu?t ECSite
3. **Server Components & Suspense**: T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

1. **AbortController**: T?i li?u k? thu?t ECSite
   T?i li?u k? thu?t ECSite
   T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite
T?i li?u k? thu?t ECSite
T?i li?u k? thu?t ECSite
T?i li?u k? thu?t ECSite
