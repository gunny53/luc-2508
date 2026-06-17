"use client";

import { ClientProduct } from '@/types/client.products.interface';
import ProductItem from '@/components/ui/product-component/product-Item';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useProductsContext } from '../context/ProductsContext';
import { useSearchParams } from 'next/navigation';

interface SearchProductGridProps {
  categoryId?: string | null;
}

export default function SearchProductGrid({ categoryId }: SearchProductGridProps) {
  // English content normalized from the original source text.
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  // English content normalized from the original source text.
  console.log("SearchProductGrid rendering with:", { categoryId, searchQuery });

  // English content normalized from the original source text.
  const {
    products,
    metadata,
    isLoading,
    isError,
    error,
    currentPage,
    handlePageChange,
    paginationData
  } = useProductsContext();

  const { totalPages, hasNextPage, hasPrevPage } = paginationData;

  console.log(" check: ", products)

  // English content normalized from the original source text.
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array(10).fill(null).map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[180px] w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    );
  }

  // English content normalized from the original source text.
  if (isError) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">English content normalized from the original source text.</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >English content normalized from the original source text.</button>
      </div>
    );
  }

  // English content normalized from the original source text.
  if (products.length === 0 && !isLoading) {
    const searchParams = new URLSearchParams(window.location.search);
    const searchQuery = searchParams.get('q');

    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="text-black text-lg mb-2">
          {searchQuery
            ? `English content normalized from the original source text.${searchQuery}"`
            : categoryId
              ? "English content normalized from the original source text."
              : "English content normalized from the original source text."}
        </div>
      </div>
    );
  }

  // English content normalized from the original source text.
  const renderPaginationItems = () => {
    // English content normalized from the original source text.
    if (totalPages <= 1) return null;

    const items = [];

    // English content normalized from the original source text.
    const maxVisiblePages = 5;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisiblePages) {
      // English content normalized from the original source text.
      const halfVisible = Math.floor(maxVisiblePages / 2);

      if (currentPage <= halfVisible + 1) {
        // English content normalized from the original source text.
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - halfVisible) {
        // English content normalized from the original source text.
        startPage = totalPages - maxVisiblePages + 1;
      } else {
        // English content normalized from the original source text.
        startPage = currentPage - halfVisible;
        endPage = currentPage + halfVisible;
      }
    }

    // English content normalized from the original source text.
    if (startPage > 1) {
      items.push(
        <PaginationItem key="page-1">
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // English content normalized from the original source text.
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // English content normalized from the original source text.
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // English content normalized from the original source text.
    if (endPage < totalPages) {
      // English content normalized from the original source text.
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // English content normalized from the original source text.
  return (
    <div className="space-y-8">
      {/* English content normalized from the original source text. */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product: ClientProduct) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>

      {/* English content normalized from the original source text. */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {/* English content normalized from the original source text. */}
            {hasPrevPage && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              </PaginationItem>
            )}

            {/* English content normalized from the original source text. */}
            {renderPaginationItems()}

            {/* English content normalized from the original source text. */}
            {hasNextPage && (
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}