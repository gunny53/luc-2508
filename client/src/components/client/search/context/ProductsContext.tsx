"use client";

import { createContext, useContext, ReactNode, useMemo, useEffect, useRef } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ClientProduct, ClientProductsResponse } from '@/types/client.products.interface';
import { useSearchParams } from 'next/navigation';

interface ProductsContextValue {
  products: ClientProduct[];
  metadata: ClientProductsResponse['metadata'] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  currentPage: number;
  pageLimit: number;
  selectedSort: string;
  handlePageChange: (page: number) => void;
  setSelectedSort: (sort: string) => void;
  paginationData: {
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

interface ProductsProviderProps {
  children: ReactNode;
  currentCategoryId?: string | null;
  querySearch?: string;
}

export function ProductsProvider({ children, currentCategoryId, querySearch }: ProductsProviderProps) {
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || 'relevance';
  const searchQuery = querySearch || searchParams.get('q') || '';

  // English content normalized from the original source text.
  const effectiveCategoryId = searchQuery ? null : currentCategoryId;

  // English content normalized from the original source text.
  const timestamp = searchParams.get('_t') || '';

  // English content normalized from the original source text.
  const prevSearchQueryRef = useRef(searchQuery);
  const prevTimestampRef = useRef(timestamp);

  // English content normalized from the original source text.
  // English content normalized from the original source text.
  const dataKey = useMemo(() => {
    // English content normalized from the original source text.
    const searchChanged = searchQuery !== prevSearchQueryRef.current;
    const timestampChanged = timestamp !== prevTimestampRef.current;

    // English content normalized from the original source text.
    if (searchChanged) prevSearchQueryRef.current = searchQuery;
    if (timestampChanged) prevTimestampRef.current = timestamp;

    // English content normalized from the original source text.
    const keyParts = [
      searchQuery || '',
      effectiveCategoryId || '',
      sort || ''
    ];

    // English content normalized from the original source text.
    // English content normalized from the original source text.
    keyParts.push(timestamp || 'default');

    const finalKey = keyParts.join('-');
    console.log("Generated data key:", finalKey);
    return finalKey;
  }, [searchQuery, effectiveCategoryId, sort, timestamp]);

  // English content normalized from the original source text.
  const productsData = useProducts({
    categoryId: effectiveCategoryId,
    key: dataKey, // English content normalized from the original source text.
    querySearch: searchQuery})

    console.log ("check1: ", productsData)

  // English content normalized from the original source text.
  // English content normalized from the original source text.
  // useEffect(() => {
  //   console.log("ProductsContext detected changes:", {
  //     searchQuery,
  //     currentCategoryId,
  //     effectiveCategoryId,
  //     dataKey
  //   });
  // }, [searchQuery, currentCategoryId, effectiveCategoryId, dataKey]);

  const contextValue = useMemo(() => ({
    ...productsData,
    selectedSort: sort,
    setSelectedSort: (newSort: string) => {
      // English content normalized from the original source text.
      console.log('Changing sort to:', newSort);
    }
  }), [productsData, sort]);

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsContext() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProductsContext must be used within a ProductsProvider');
  }
  return context;
}
