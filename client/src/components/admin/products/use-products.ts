import { vi } from 'date-fns/locale'
import { useState, useCallback, useEffect, useRef } from 'react'
import { productsService } from '@/services/products-service'
import { useServerDataTable } from '@/hooks/use-server-data-table'
import { Product, ProductCreateRequest, ProductUpdateRequest } from '@/types/products.interface'
import { PaginationMetadata } from '@/types/base.interface'
import { showToast } from '@/components/ui/toastify'
import { parseApiError } from '@/utils/error'
import { useUserData } from '@/hooks/use-get-data-user-login'

interface PopulatedProduct extends Omit<Product, 'brandId' | 'categories'> {
  brand: { id: number; name: string }
  categories: { id: number; name: string }[]
}

export type ProductColumn = {
  id: string
  name: string
  image: string
  price: number
  virtualPrice: number
  status: 'active' | 'inactive'
  category: string
  brand: string
  createdAt: string
  updatedAt: string
  original: PopulatedProduct
}

export function useProducts() {
  const user = useUserData()
  const [upsertOpen, setUpsertOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [productToEdit, setProductToEdit] = useState<ProductColumn | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<ProductColumn | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  
  const [priceFilter, setPriceFilter] = useState<{ minPrice: number | null; maxPrice: number | null }>({
    minPrice: null,
    maxPrice: null
  })

  
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

  
  const [searchQuery, setSearchQuery] = useState<string>('')
  const searchQueryRef = useRef<string>(searchQuery)

  
  const priceFilterRef = useRef<{ minPrice: number | null; maxPrice: number | null }>(priceFilter)
  const categoryFilterRef = useRef<string | null>(categoryFilter)

  
  useEffect(() => {
    
    const savedPriceFilter = sessionStorage.getItem('productPriceFilter')
    if (savedPriceFilter) {
      try {
        const parsedFilter = JSON.parse(savedPriceFilter)
        setPriceFilter(parsedFilter)
        priceFilterRef.current = parsedFilter
        console.log('Restored price filter from session storage:', parsedFilter)
      } catch (error) {
        console.error('Error parsing saved price filter:', error)
        
        sessionStorage.removeItem('productPriceFilter')
      }
    }

    
    const savedCategoryFilter = sessionStorage.getItem('productCategoryFilter')
    if (savedCategoryFilter) {
      try {
        const parsedCategoryId = JSON.parse(savedCategoryFilter)
        setCategoryFilter(parsedCategoryId)
        categoryFilterRef.current = parsedCategoryId
        console.log('Restored category filter from session storage:', parsedCategoryId)
      } catch (error) {
        console.error('Error parsing saved category filter:', error)
        sessionStorage.removeItem('productCategoryFilter')
      }
    }

    
    const savedSearchQuery = sessionStorage.getItem('productSearchQuery')
    if (savedSearchQuery) {
      try {
        const parsedSearchQuery = JSON.parse(savedSearchQuery)
        setSearchQuery(parsedSearchQuery)
        searchQueryRef.current = parsedSearchQuery
        console.log('Restored search query from session storage:', parsedSearchQuery)
      } catch (error) {
        console.error('Error parsing saved search query:', error)
        sessionStorage.removeItem('productSearchQuery')
      }
    }
  }, [])

  
  useEffect(() => {
    priceFilterRef.current = priceFilter
    console.log('Price filter state updated:', priceFilter)
  }, [priceFilter])

  useEffect(() => {
    categoryFilterRef.current = categoryFilter
    console.log('Category filter state updated:', categoryFilter)
  }, [categoryFilter])

  useEffect(() => {
    searchQueryRef.current = searchQuery
    console.log('Search query state updated:', searchQuery)
  }, [searchQuery])

  const getResponseData = useCallback((response: any) => response.data || [], [])

  const getResponseMetadata = useCallback((response: any): PaginationMetadata => {
    const metadata = response.metadata || {}
    return {
      totalItems: metadata.totalItems || 0,
      page: metadata.page || 1,
      totalPages: metadata.totalPages || 1,
      limit: metadata.limit || 10,
      hasNext: metadata.hasNext || false,
      hasPrevious: metadata.hasPrev || false
    }
  }, [])

  const mapResponseToData = useCallback(
    (product: PopulatedProduct): ProductColumn => ({
      id: product.id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.basePrice,
      virtualPrice: product.virtualPrice,
      status: product.publishedAt ? 'active' : 'inactive',
      category: product.categories?.[0]?.name || 'N/A',
      brand: product.brand?.name || 'N/A',
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      original: product
    }),
    []
  )

  
  const fetchDataWithFilters = useCallback(
    (params: any, signal?: AbortSignal) => {
      
      const enhancedParams = { ...params }

      
      const currentPriceFilter = priceFilterRef.current
      const currentCategoryFilter = categoryFilterRef.current
      const currentSearchQuery = searchQueryRef.current

      
      if (currentPriceFilter.minPrice !== null) {
        enhancedParams.minPrice = currentPriceFilter.minPrice
      }
      if (currentPriceFilter.maxPrice !== null) {
        enhancedParams.maxPrice = currentPriceFilter.maxPrice
      }

      
      if (currentCategoryFilter !== null) {
        enhancedParams.categories = currentCategoryFilter
      }

      
      if (currentSearchQuery && currentSearchQuery.trim() !== '') {
        enhancedParams.name = currentSearchQuery.trim()
      }

      console.log('Fetching with params:', enhancedParams)

      
      return productsService.getAll(enhancedParams, signal)
    },
    [
      
    ]
  )

  const serverDataTable = useServerDataTable<PopulatedProduct, ProductColumn>({
    fetchData: fetchDataWithFilters,
    getResponseData,
    getResponseMetadata,
    mapResponseToData,
    initialSort: { sortBy: 'createdAt', sortOrder: 'desc', createdById: user?.id },
    defaultLimit: 10
  })

  const handleOpenUpsertModal = (mode: 'add' | 'edit', product: ProductColumn | null = null) => {
    setModalMode(mode)
    setProductToEdit(product)
    setUpsertOpen(true)
  }

  const handleCloseUpsertModal = () => {
    setUpsertOpen(false)
    setProductToEdit(null)
  }

  const handleOpenDelete = (product: ProductColumn) => {
    setProductToDelete(product)
    setDeleteOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false)
    setProductToDelete(null)
  }

  
  const handlePriceFilterChange = useCallback(
    (minPrice: number | null, maxPrice: number | null) => {
      console.log(`Price filter changed: min=${minPrice}, max=${maxPrice}`)

      
      const newPriceFilter = { minPrice, maxPrice }
      setPriceFilter(newPriceFilter)
      priceFilterRef.current = newPriceFilter

      
      serverDataTable.handlePageChange(1)

      
      console.log('Refreshing with price filter:', newPriceFilter)

      
      if (minPrice === null && maxPrice === null) {
        
        sessionStorage.removeItem('productPriceFilter')
      } else {
        
        sessionStorage.setItem('productPriceFilter', JSON.stringify(newPriceFilter))
      }

      
      serverDataTable.refreshData()
    },
    [serverDataTable]
  )

  
  const handleCategoryFilterChange = useCallback(
    (categoryId: string | null) => {
      console.log(`Category filter changed: categoryId=${categoryId}`)

      
      setCategoryFilter(categoryId)
      categoryFilterRef.current = categoryId

      
      serverDataTable.handlePageChange(1)

      console.log('Refreshing with category filter:', categoryId)

      
      if (categoryId === null) {
        
        sessionStorage.removeItem('productCategoryFilter')
      } else {
        
        sessionStorage.setItem('productCategoryFilter', JSON.stringify(categoryId))
      }

      
      serverDataTable.refreshData()
    },
    [serverDataTable]
  )
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  
  const debouncedSearch = useCallback(
    (query: string) => {
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => {
        
        setSearchQuery(query)
        searchQueryRef.current = query

        
        serverDataTable.handlePageChange(1)

        
        if (!query || query.trim() === '') {
          sessionStorage.removeItem('productSearchQuery')
        } else {
          sessionStorage.setItem('productSearchQuery', JSON.stringify(query))
        }

        
        serverDataTable.refreshData()
      }, 300)
    },
    [serverDataTable]
  )
  const handleSearch = useCallback(
    (query: string) => {
      console.log(`Search query changed: ${query}`)
      setSearchQuery(query)

      
      debouncedSearch(query)
    },
    [debouncedSearch]
  )

  const addProduct = async (data: ProductCreateRequest) => {
    try {
      const response = await productsService.create(data)
      showToast(response.message, 'success')
      serverDataTable.refreshData()
      handleCloseUpsertModal()
      return response
    } catch (error) {
      showToast(parseApiError(error), 'error')
      return null
    }
  }

  const editProduct = async (id: number, data: ProductUpdateRequest) => {
    try {
      const response = await productsService.update(String(id), data)
      showToast(response.message, 'success')
      serverDataTable.refreshData()
      handleCloseUpsertModal()
      return response
    } catch (error) {
      showToast(parseApiError(error), 'error')
      return null
    }
  }

  const handleConfirmDelete = async (): Promise<void> => {
    if (productToDelete) {
      setDeleteLoading(true)
      try {
        const response = await productsService.delete(String(productToDelete.id))
        showToast(response.message, 'success')
        serverDataTable.refreshData()
        handleCloseDeleteModal()
      } catch (error) {
        showToast(parseApiError(error), 'error')
      } finally {
        setDeleteLoading(false)
      }
    }
  }

  return {
    ...serverDataTable,
    upsertOpen,
    modalMode,
    productToEdit,
    handleOpenUpsertModal,
    handleCloseUpsertModal,
    deleteOpen,
    productToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
    addProduct,
    editProduct,
    handlePriceFilterChange,
    priceFilter,
    handleCategoryFilterChange,
    categoryFilter,
    handleSearch, 
    searchQuery
  }
}
