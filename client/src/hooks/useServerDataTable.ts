// hooks/useServerDataTable.ts
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { PaginationMetadata, PaginationRequest } from '@/types/base.interface';
import { showToast } from '@/components/ui/toastify';
import { parseApiError } from '@/utils/error';
/* English content normalized from the original source text. */
interface UseServerDataTableProps<T, U> {
  /* English content normalized from the original source text. */
  fetchData: (params: PaginationRequest, signal?: AbortSignal) => Promise<any>;
  /* English content normalized from the original source text. */
  getResponseData: (response: any) => T[];
  /* English content normalized from the original source text. */
  getResponseMetadata?: (response: any) => PaginationMetadata | undefined;
  /* English content normalized from the original source text. */
  mapResponseToData?: (item: any) => U;
  /* English content normalized from the original source text. */
  initialSort?: {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    createdById?: string;
  };
  /* English content normalized from the original source text. */
  defaultLimit?: number;
  /* English content normalized from the original source text. */
  requestConfig?: {
    /* English content normalized from the original source text. */
    autoFetchSearch?: boolean;
    /* English content normalized from the original source text. */
    includeSearch?: boolean;
    /* English content normalized from the original source text. */
    includeSort?: boolean;
    /* English content normalized from the original source text. */
    includeCreatedById?: boolean;
  };
}

/* English content normalized from the original source text. */
export function useServerDataTable<T, U = T>({
  fetchData,
  getResponseData,
  getResponseMetadata,
  mapResponseToData,
  initialSort = { },
  defaultLimit = 10,
  requestConfig = {
    autoFetchSearch: true,
    includeSearch: true,
    includeSort: true,
    includeCreatedById: true
  },
}: UseServerDataTableProps<T, U>) {
  // English content normalized from the original source text.
  const [pagination, setPagination] = useState<PaginationMetadata>({
    page: 1,
    limit: defaultLimit,
    search: '',
    sortBy: initialSort.sortBy,
    sortOrder: initialSort.sortOrder,
    createdById: initialSort.createdById,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // English content normalized from the original source text.
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [data, setData] = useState<U[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(pagination.search, 500);

  // English content normalized from the original source text.
  const activeRequestRef = useRef<AbortController | null>(null);

  // English content normalized from the original source text.
const fetchDataRef = useRef(fetchData);
const getResponseDataRef = useRef(getResponseData);
const getResponseMetadataRef = useRef(getResponseMetadata);
const mapResponseToDataRef = useRef(mapResponseToData);

useEffect(() => { fetchDataRef.current = fetchData; }, [fetchData]);
useEffect(() => { getResponseDataRef.current = getResponseData; }, [getResponseData]);
useEffect(() => { getResponseMetadataRef.current = getResponseMetadata; }, [getResponseMetadata]);
useEffect(() => { mapResponseToDataRef.current = mapResponseToData; }, [mapResponseToData]);


  // English content normalized from the original source text.
  useEffect(() => {
    const loadData = async () => {
      // English content normalized from the original source text.
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }

      // English content normalized from the original source text.
      const controller = new AbortController();
      activeRequestRef.current = controller;

      // English content normalized from the original source text.
      const timeoutId = setTimeout(() => {
        if (activeRequestRef.current === controller && !controller.signal.aborted) {
          controller.abort();
          console.warn('Request timed out after 8 seconds');
          setLoading(false);
        }
      }, 8000);

      try {
        setLoading(true);
        // English content normalized from the original source text.
        const requestParams: PaginationRequest = {
          page: pagination.page,
          limit: pagination.limit,
        };

        // English content normalized from the original source text.
        if (requestConfig.includeSearch && debouncedSearch) {
          requestParams.search = debouncedSearch;
        }

        // English content normalized from the original source text.
        if (requestConfig.includeSort) {
          requestParams.sortBy = pagination.sortBy;
          requestParams.sortOrder = pagination.sortOrder;
        }

        // English content normalized from the original source text.
        if (requestConfig.includeCreatedById && pagination.createdById) {
          requestParams.createdById = pagination.createdById;
        }

        // English content normalized from the original source text.
       const response = await fetchDataRef.current(requestParams, controller.signal);

let responseData: T[] = [];
responseData = getResponseDataRef.current(response);

const mappedData: U[] = mapResponseToDataRef.current
  ? responseData.map(mapResponseToDataRef.current)
  : (responseData as unknown as U[]);

// English content normalized from the original source text.
setData(mappedData);

if (getResponseMetadataRef.current) {
  const metadata = getResponseMetadataRef.current(response);

try {
            if (metadata) {
              setPagination(prev => ({
                ...prev,
                totalItems: metadata.totalItems ?? prev.totalItems,
                page: metadata.page || prev.page,
                limit: metadata.limit || prev.limit,
                totalPages: metadata.totalPages || prev.totalPages,
                hasNext: metadata.hasNext ?? prev.hasNext,
                // Support both hasPrevious and hasPrev to ensure compatibility
                hasPrevious: (metadata.hasPrevious !== undefined ? metadata.hasPrevious : metadata.hasPrev) ?? prev.hasPrevious,
              }));
            }
          } catch (error) {
            console.error("Error extracting metadata from response:", error);
          }
        }
      } catch (error) {
        // English content normalized from the original source text.
        clearTimeout(timeoutId);

        // English content normalized from the original source text.
        // if (!controller.signal.aborted) {
        //   console.error("Error fetching data:", error);
        //   showToast(parseApiError(error), 'error');
        // }
      } finally {
        // English content normalized from the original source text.
        if (activeRequestRef.current === controller) {
          setLoading(false);
          activeRequestRef.current = null;
        }
      }
    };

    loadData();

    // Cleanup function
    return () => {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
    };
  }, [
    pagination.page,
    pagination.limit,
    // English content normalized from the original source text.
    ...(requestConfig.includeSearch ? [debouncedSearch] : []),
    // English content normalized from the original source text.
    ...(requestConfig.includeSort ? [pagination.sortBy, pagination.sortOrder] : []),
    // English content normalized from the original source text.
    ...(requestConfig.includeCreatedById ? [pagination.createdById] : []),
    ...(requestConfig.includeSearch && (requestConfig.autoFetchSearch ?? true) ? [debouncedSearch] : []),
    refreshTrigger, // English content normalized from the original source text.
    // English content normalized from the original source text.
  ]);

  // Handlers
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };

const handleSearch = (search: string) => {
  setPagination(prev => ({ ...prev, search, page: 1 }));
  if (requestConfig.includeSearch && (requestConfig.autoFetchSearch === false)) {
    setRefreshTrigger(prev => prev + 1); // English content normalized from the original source text.
  }
};


  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setPagination(prev => ({ ...prev, sortBy, sortOrder }));
  };

  // English content normalized from the original source text.
  const refreshData = () => {
    // English content normalized from the original source text.
    setRefreshTrigger(prev => prev + 1);
    console.log("🔄 Refreshing data...");
  };

  return {
    data,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,
    // Expose setPagination for external control (e.g., infinite scroll)
    setPagination,
  };
}