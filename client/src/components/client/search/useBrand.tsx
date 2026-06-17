'use client'

import { useState, useCallback } from "react"
import { useTranslations } from 'next-intl'
import { Brand } from "@/types/admin/brands.interface"
import * as brandsService from "@/services/admin/brandsService"
import { useServerDataTable } from "@/hooks/useServerDataTable"
import { showToast } from "@/components/ui/toastify"

export const useBrand = () => {
  const t = useTranslations();
  // Modal states

  // English content normalized from the original source text.
  const getResponseData = useCallback((response: any) => {
    return response.data || [];
  }, []);

  const getResponseMetadata = useCallback((response: any) => {
    const metadata = response.metadata || {};
    return {
      totalItems: metadata.totalItems || 0,
      page: metadata.page || 1,
      totalPages: metadata.totalPages || 1,
      limit: metadata.limit || 10,
      hasNext: metadata.hasNext || false,
      hasPrevious: metadata.hasPrev || false // Fixed property name to match server response
    };
  }, []);

  const mapResponseToData = useCallback((brand: any): Brand => {
    return brand;
  }, []);

  // English content normalized from the original source text.
  const {
    data,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,
  } = useServerDataTable({
    fetchData: brandsService.getAllBrands,
    getResponseData,
    getResponseMetadata,
    mapResponseToData,
    initialSort: { sortBy: "updatedAt"},
    defaultLimit: 12, // English content normalized from the original source text.
  });

  return {
    data,
    loading,
    pagination,

    // Server-side pagination handlers
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,
  };
};
