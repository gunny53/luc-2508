
import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '@/hooks/use-debounce'
import { PaginationMetadata, PaginationRequest } from '@/types/base.interface'
import { showToast } from '@/components/ui/toastify'
import { parseApiError } from '@/utils/error'
interface UseServerDataTableProps<T, U> {
  fetchData: (params: PaginationRequest, signal?: AbortSignal) => Promise<any>
  getResponseData: (response: any) => T[]
  getResponseMetadata?: (response: any) => PaginationMetadata | undefined
  mapResponseToData?: (item: any) => U
  initialSort?: {
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    createdById?: string
  }
  defaultLimit?: number
  requestConfig?: {
    autoFetchSearch?: boolean
    includeSearch?: boolean
    includeSort?: boolean
    includeCreatedById?: boolean
  }
}

export function useServerDataTable<T, U = T>({
  fetchData,
  getResponseData,
  getResponseMetadata,
  mapResponseToData,
  initialSort = {},
  defaultLimit = 10,
  requestConfig = {
    autoFetchSearch: true,
    includeSearch: true,
    includeSort: true,
    includeCreatedById: true
  }
}: UseServerDataTableProps<T, U>) {
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
    hasPrevious: false
  })
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const [data, setData] = useState<U[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedSearch = useDebounce(pagination.search, 500)
  const activeRequestRef = useRef<AbortController | null>(null)
  const fetchDataRef = useRef(fetchData)
  const getResponseDataRef = useRef(getResponseData)
  const getResponseMetadataRef = useRef(getResponseMetadata)
  const mapResponseToDataRef = useRef(mapResponseToData)

  useEffect(() => {
    fetchDataRef.current = fetchData
  }, [fetchData])
  useEffect(() => {
    getResponseDataRef.current = getResponseData
  }, [getResponseData])
  useEffect(() => {
    getResponseMetadataRef.current = getResponseMetadata
  }, [getResponseMetadata])
  useEffect(() => {
    mapResponseToDataRef.current = mapResponseToData
  }, [mapResponseToData])
  useEffect(() => {
    const loadData = async () => {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort()
      }
      const controller = new AbortController()
      activeRequestRef.current = controller
      const timeoutId = setTimeout(() => {
        if (activeRequestRef.current === controller && !controller.signal.aborted) {
          controller.abort()
          console.warn('Request timed out after 8 seconds')
          setLoading(false)
        }
      }, 8000)

      try {
        setLoading(true)
        const requestParams: PaginationRequest = {
          page: pagination.page,
          limit: pagination.limit
        }
        if (requestConfig.includeSearch && debouncedSearch) {
          requestParams.search = debouncedSearch
        }
        if (requestConfig.includeSort) {
          requestParams.sortBy = pagination.sortBy
          requestParams.sortOrder = pagination.sortOrder
        }
        if (requestConfig.includeCreatedById && pagination.createdById) {
          requestParams.createdById = pagination.createdById
        }
        const response = await fetchDataRef.current(requestParams, controller.signal)

        let responseData: T[] = []
        responseData = getResponseDataRef.current(response)

        const mappedData: U[] = mapResponseToDataRef.current
          ? responseData.map(mapResponseToDataRef.current)
          : (responseData as unknown as U[])
        setData(mappedData)

        if (getResponseMetadataRef.current) {
          const metadata = getResponseMetadataRef.current(response)

          try {
            if (metadata) {
              setPagination((prev) => ({
                ...prev,
                totalItems: metadata.totalItems ?? prev.totalItems,
                page: metadata.page || prev.page,
                limit: metadata.limit || prev.limit,
                totalPages: metadata.totalPages || prev.totalPages,
                hasNext: metadata.hasNext ?? prev.hasNext,
                
                hasPrevious:
                  (metadata.hasPrevious !== undefined ? metadata.hasPrevious : metadata.hasPrev) ?? prev.hasPrevious
              }))
            }
          } catch (error) {
            console.error('Error extracting metadata from response:', error)
          }
        }
      } catch (error) {
        clearTimeout(timeoutId)
        
        
        
        
      } finally {
        if (activeRequestRef.current === controller) {
          setLoading(false)
          activeRequestRef.current = null
        }
      }
    }

    loadData()

    
    return () => {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort()
      }
    }
  }, [
    pagination.page,
    pagination.limit,
    ...(requestConfig.includeSearch ? [debouncedSearch] : []),
    ...(requestConfig.includeSort ? [pagination.sortBy, pagination.sortOrder] : []),
    ...(requestConfig.includeCreatedById ? [pagination.createdById] : []),
    ...(requestConfig.includeSearch && (requestConfig.autoFetchSearch ?? true) ? [debouncedSearch] : []),
    refreshTrigger
  ])

  
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handleLimitChange = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }))
  }

  const handleSearch = (search: string) => {
    setPagination((prev) => ({ ...prev, search, page: 1 }))
    if (requestConfig.includeSearch && requestConfig.autoFetchSearch === false) {
      setRefreshTrigger((prev) => prev + 1)
    }
  }

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setPagination((prev) => ({ ...prev, sortBy, sortOrder }))
  }
  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1)
    console.log('🔄 Refreshing data...')
  }

  return {
    data,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,
    
    setPagination
  }
}
