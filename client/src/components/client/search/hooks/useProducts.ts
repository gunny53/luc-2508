"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ClientProduct,
  ClientSearchResultItem,
} from "@/types/client.products.interface";
import { clientProductsService } from "@/services/clientProductsService";
import { useServerDataTable } from "@/hooks/useServerDataTable";
import { PaginationRequest } from "@/types/base.interface";
import {ENUM} from "@/configs/common";

// English content normalized from the original source text.
interface PaginationData {
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  [key: string]: any;
}

interface UseProductsProps {
  categoryId?: string | null;
  key?: string; // English content normalized from the original source text.
  querySearch?: string; // English content normalized from the original source text.
}

interface UseProductsReturn {
  products: ClientProduct[];
  metadata: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  currentPage: number;
  pageLimit: number;
  handlePageChange: (page: number) => void;
  paginationData: {
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function useProducts({
  categoryId,
  key,
  querySearch,
}: UseProductsProps): UseProductsReturn {
  // English content normalized from the original source text.
  // console.log("useProducts hook called with:", { categoryId, key });
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = querySearch || searchParams.get("q") || "";

  // English content normalized from the original source text.
  const initialPage = Number(searchParams.get("page") || 1);
  const initialLimit = Number(searchParams.get("limit") || 20);

  // English content normalized from the original source text.
  const prevCategoryIdRef = useRef<string | null | undefined>(categoryId);
  const prevSearchQueryRef = useRef<string>(searchQuery);
  const isFirstRenderRef = useRef<boolean>(true);
  const isUpdatingUrlRef = useRef<boolean>(false);

  const [prod, setProd] = useState<ClientProduct[]>([]);
  // English content normalized from the original source text.
  const {
    data: products,
    loading: isLoading,
    pagination: paginationRaw,
    handlePageChange: internalHandlePageChange,
    refreshData,
  } = useServerDataTable<ClientProduct | ClientSearchResultItem, ClientProduct>(
    {
      fetchData: async (params: PaginationRequest, signal?: AbortSignal) => {
        // English content normalized from the original source text.
        console.log("Fetching products with params:", params);
        const apiParams: any = { ...params };

        // English content normalized from the original source text.
        if (searchQuery && searchQuery.trim()) {
          // English content normalized from the original source text.
          console.log("Using SEARCH API for query:", searchQuery);

          apiParams.q = searchQuery;

          // English content normalized from the original source text.
          const urlTimestamp = searchParams.get("_t");
          if (urlTimestamp) {
            apiParams._t = urlTimestamp;
          }

          const searchResponse = await clientProductsService.searchProducts({
            search: searchQuery,
            ...apiParams
          });

          // English content normalized from the original source text.
          const convertedData = searchResponse.data.map((item) => ({
            id: item.productId,
            name: item.productName,
            description: item.productDescription || "",
            basePrice: item.skuPrice || 0,
            virtualPrice: item.skuPrice || 0,
            brandId: item.brandId || "",
            images: item.productImages || [],
            variants: item.variants || [],
            productTranslations: [],
            publishedAt: item.createdAt,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            createdById: 0,
            updatedById: null,
            deletedById: null,
            deletedAt: null,
            isPublished: true,
            brandName: item.brandName || "",
            categories:
              item.categoryIds?.map((id, index) => ({
                id,
                name: item.categoryNames?.[index] || "",
              })) || [],
          })) as unknown as ClientProduct[];

          console.log("Search API response:", {
            itemCount: convertedData.length,
            metadata: searchResponse.metadata,
          });

          setProd(convertedData);

          return searchResponse.success && {
            statusCode: searchResponse.statusCode,
            message: searchResponse.message,
            products: convertedData,
            metadata: searchResponse.metadata,
          };
        } else {
          // English content normalized from the original source text.
          console.log("Using PRODUCTS API");

          if (categoryId) {
            // English content normalized from the original source text.
            apiParams.categories = categoryId;
            console.log("Filtering by categories:", categoryId);
          }

          // English content normalized from the original source text.
          const productsResponse = await clientProductsService.getProducts(apiParams);

          console.log("Products API response:", {
            itemCount: productsResponse.data?.length || 0,
            metadata: productsResponse.metadata,
          });

          setProd(productsResponse.data || []);

          return productsResponse;
        }
      },
      getResponseData: (response: any) => response.data || [],
      getResponseMetadata: (response: any) => response.metadata,
      defaultLimit: initialLimit,
      requestConfig: {
        includeSearch: false,
        includeSort: true,
        includeCreatedById: false,
      },
    });

  // English content normalized from the original source text.
  const pagination: PaginationData = {
    totalItems: paginationRaw?.totalItems || 0,
    page: paginationRaw?.page || initialPage,
    limit: paginationRaw?.limit || initialLimit,
    totalPages: paginationRaw?.totalPages || 1,
    hasNext: paginationRaw?.hasNext || false,
    hasPrevious: paginationRaw?.hasPrevious || false,
  };

  // English content normalized from the original source text.
  useEffect(() => {
    if (initialPage > 1) {
      internalHandlePageChange(initialPage);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // English content normalized from the original source text.
  const handlePageChange = (page: number): void => {
    if (page === pagination.page) return; // English content normalized from the original source text.

    // English content normalized from the original source text.
    isUpdatingUrlRef.current = true;

    // English content normalized from the original source text.
    internalHandlePageChange(page);

    // English content normalized from the original source text.
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", page.toString());

    const pathname = window.location.pathname;
    const queryString = newParams.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(newPath);
  };

  // English content normalized from the original source text.
  const currentTimestampRef = useRef<string | null>(null);

  // English content normalized from the original source text.
  useEffect(() => {
    // English content normalized from the original source text.
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;

      // English content normalized from the original source text.
      if (searchQuery || searchParams.get("_t")) {
        console.log("Initial data load with search or timestamp:", {
          searchQuery,
          timestamp: searchParams.get("_t"),
        });
        refreshData();
      }
      return;
    }

    // English content normalized from the original source text.
    const categoryIdChanged = categoryId !== prevCategoryIdRef.current;
    const searchQueryChanged = searchQuery !== prevSearchQueryRef.current;

    // English content normalized from the original source text.
    const timestamp = searchParams.get("_t");

    // English content normalized from the original source text.
    const timestampChanged = timestamp !== currentTimestampRef.current;
    const hasTimestampTrigger = !!timestamp && timestampChanged;

    console.log("Change detection:", {
      categoryIdChanged,
      searchQueryChanged,
      hasTimestampTrigger,
      timestamp,
      currentTimestamp: currentTimestampRef.current,
    });

    // English content normalized from the original source text.
    if (timestamp) {
      currentTimestampRef.current = timestamp;
    }

    // English content normalized from the original source text.
    if (categoryIdChanged || searchQueryChanged || hasTimestampTrigger) {
      console.log("Data refresh triggered:", {
        categoryId,
        searchQuery,
        hasTimestampTrigger,
        timestampChanged,
      });

      // English content normalized from the original source text.
      prevCategoryIdRef.current = categoryId;
      prevSearchQueryRef.current = searchQuery;

      // English content normalized from the original source text.
      refreshData();
      internalHandlePageChange(1);

      // English content normalized from the original source text.
      // English content normalized from the original source text.
      if (!isUpdatingUrlRef.current && !hasTimestampTrigger) {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("page", "1");
        const pathname = window.location.pathname;
        const queryString = newParams.toString();
        const newPath = queryString ? `${pathname}?${queryString}` : pathname;
        router.push(newPath);
      }

      // Reset flag
      isUpdatingUrlRef.current = false;
    }
  }, [
    categoryId,
    searchQuery,
    internalHandlePageChange,
    router,
    searchParams,
    refreshData,
  ]);

  // English content normalized from the original source text.
  const paginationData = useMemo(
    () => ({
      totalPages: pagination.totalPages,
      hasNextPage: pagination.hasNext,
      hasPrevPage: pagination.hasPrevious || pagination.page > 1,
    }),
    [pagination]
  );

  return {
    products: prod || [],
    metadata: {
      totalItems: pagination.totalItems,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrevious,
    },
    isLoading,
    isError: false,
    error: null,
    currentPage: pagination.page,
    pageLimit: pagination.limit,
    handlePageChange,
    paginationData,
  };
}
