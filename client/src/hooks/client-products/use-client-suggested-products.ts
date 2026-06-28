
import { useState, useEffect, useCallback, useRef } from 'react'
import { clientProductsService } from '@/services/client-products-service'
import { ClientProduct } from '@/types/client.products.interface'

interface UseSuggestedProductsOptions {
  initialLimit?: number
  incrementAmount?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  categoryId?: string
}

export function useClientSuggestedProducts({
  initialLimit = 12,
  incrementAmount = 12,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  categoryId
}: UseSuggestedProductsOptions = {}) {
  const [products, setProducts] = useState<ClientProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [limit, setLimit] = useState(initialLimit)
  const isMounted = useRef(true)
  const fetchProducts = useCallback(
    async (currentLimit: number) => {
      try {
        setLoading(true)

        const response = await clientProductsService.getProducts({
          page: 1,
          limit: currentLimit,
          sortBy,
          sortOrder,
          categoryId
        })
        if (isMounted.current) {
          setProducts(response.data || [])
          setHasMore((response.data?.length || 0) >= currentLimit)
          setError(null)
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err instanceof Error ? err : new Error('Failed to fetch products'))
        }
      } finally {
        if (isMounted.current) {
          setLoading(false)
          setInitialLoading(false)
        }
      }
    },
    [sortBy, sortOrder, categoryId]
  )
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const newLimit = limit + incrementAmount
      setLimit(newLimit)
      fetchProducts(newLimit)
    }
  }, [loading, hasMore, limit, incrementAmount, fetchProducts])
  useEffect(() => {
    isMounted.current = true
    setInitialLoading(true)
    setLimit(initialLimit)
    setHasMore(true)

    fetchProducts(initialLimit)

    return () => {
      isMounted.current = false
    }
  }, [fetchProducts, initialLimit])

  return {
    products,
    loading,
    initialLoading,
    error,
    hasMore,
    loadMore
  }
}
