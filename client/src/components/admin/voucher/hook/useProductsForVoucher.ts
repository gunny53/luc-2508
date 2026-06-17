"use client";

import { useState, useEffect, useCallback } from 'react';
import { useUserData } from '@/hooks/useGetData-UserLogin';
import { useServerDataTable } from '@/hooks/useServerDataTable';
import { productsService } from '@/services/productsService';
import { PaginationRequest } from '@/types/base.interface';
import { Product, ProductsResponse } from '@/types/products.interface';

interface UseProductsForVoucherReturn {
  products: Product[];
  loading: boolean;
  hasMore: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  loadMore: () => void;
  selectedProducts: Product[];
  toggleProduct: (product: Product) => void;
  clearSelection: () => void;
}

interface UseProductsForVoucherProps {
  onSelectionChange?: (products: Product[]) => void;
  initialSelected?: Product[];
}

export function useProductsForVoucher({
  onSelectionChange,
  initialSelected = []
}: UseProductsForVoucherProps = {}): UseProductsForVoucherReturn {
  const userData = useUserData();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(initialSelected);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: products,
    loading,
    pagination,
    handleSearch,
    refreshData,
    setPagination,
  } = useServerDataTable<Product, Product>({
    fetchData: useCallback((params: PaginationRequest) => {
      if (!userData?.id) {
        console.log('User ID not available for products fetch');
        return Promise.resolve({
          data: [],
          metadata: { totalItems: 0, totalPages: 1, page: 1, limit: 10 },
          statusCode: 200,
          message: 'No user data available'
        } as unknown as ProductsResponse);
      }

      console.log('Fetching products with params:', params);

      // English content normalized from the original source text.
      const apiParams: any = {
        ...params,
        createdById: userData.id
      };

      // English content normalized from the original source text.
      if (params.search && params.search.trim()) {
        apiParams.name = params.search.trim();
      }

      console.log('Final API params with name:', apiParams);
      return productsService.getAll(apiParams);
    }, [userData?.id]),
    getResponseData: (response) => {
      console.log('Products API response:', response);
      console.log('Response data length:', response.data?.length);
      console.log('Response metadata:', response.metadata);
      return response.data || [];
    },
    getResponseMetadata: (response) => response.metadata,
    mapResponseToData: (item: Product): Product => item,
    defaultLimit: 20, // Load 20 products at a time for scroll pagination
    requestConfig: {
      includeSearch: true,
      includeSort: true,
      includeCreatedById: true,
    },
  });

  // English content normalized from the original source text.
  useEffect(() => {
    console.log('Products useEffect triggered:', {
      productsLength: products?.length,
      paginationPage: pagination.page,
      currentPage,
      hasMore
    });

    if (products && products.length > 0) {
      // English content normalized from the original source text.
      const actualPage = pagination.page || 1;

      if (actualPage === 1) {
        // English content normalized from the original source text.
        console.log('Replacing all products (page 1)');
        setAllProducts(products);
      } else {
        // English content normalized from the original source text.
        console.log('Appending new products (page', actualPage, ')');
        setAllProducts(prev => {
          // English content normalized from the original source text.
          const existingIds = new Set(prev.map(p => p.id));
          // English content normalized from the original source text.
          const newProducts = products.filter(p => !existingIds.has(p.id));
          console.log('Filtered new products:', newProducts.length, 'out of', products.length);
          return [...prev, ...newProducts];
        });
      }

      // English content normalized from the original source text.
      setHasMore(products.length === pagination.limit && (pagination.hasNext ?? false));
    } else if ((pagination.page || 1) === 1) {
      // English content normalized from the original source text.
      console.log('Clearing products list');
      setAllProducts([]);
      setHasMore(false);
    }
  }, [products, pagination]);

  // Load more function cho infinite scroll
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const currentPageFromPagination = pagination.page || 1;
      const nextPage = currentPageFromPagination + 1;
      setCurrentPage(nextPage);

      // Trigger page change in useServerDataTable
      setPagination(prev => ({ ...prev, page: nextPage }));
      console.log('Loading more products, page:', nextPage);
    }
  }, [loading, hasMore, pagination.page, setPagination]);

  // Search function
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    setAllProducts([]); // English content normalized from the original source text.
    setHasMore(true); // Reset hasMore state

    // English content normalized from the original source text.
    setPagination(prev => ({ ...prev, page: 1, search: term }));
  }, [setPagination]);

  // Product selection functions
  const toggleProduct = useCallback((product: Product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.find(p => p.id === product.id);
      let newSelection: Product[];

      if (isSelected) {
        newSelection = prev.filter(p => p.id !== product.id);
      } else {
        newSelection = [...prev, product];
      }

      // Notify parent component
      onSelectionChange?.(newSelection);
      return newSelection;
    });
  }, [onSelectionChange]);

  const clearSelection = useCallback(() => {
    setSelectedProducts([]);
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  return {
    products: allProducts,
    loading,
    hasMore,
    searchTerm,
    setSearchTerm: handleSearchChange,
    loadMore,
    selectedProducts,
    toggleProduct,
    clearSelection,
  };
}
