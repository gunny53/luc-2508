'use client'

import { ClientProduct } from '@/types/client.products.interface'
import ProductItem from '@/components/ui/product-component/product-item'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination'
import { useProductsContext } from '../context/products-context'
import { useSearchParams } from 'next/navigation'

interface SearchProductGridProps {
  categoryId?: string | null
}

export default function SearchProductGrid({ categoryId }: SearchProductGridProps) {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  console.log('SearchProductGrid rendering with:', { categoryId, searchQuery })
  const { products, metadata, isLoading, isError, error, currentPage, handlePageChange, paginationData } =
    useProductsContext()

  const { totalPages, hasNextPage, hasPrevPage } = paginationData

  console.log(' check: ', products)
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[180px] w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
      </div>
    )
  }
  if (isError) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">S?n ph?m</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          S?n ph?m
        </button>
      </div>
    )
  }
  if (products.length === 0 && !isLoading) {
    const searchParams = new URLSearchParams(window.location.search)
    const searchQuery = searchParams.get('q')

    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="text-black text-lg mb-2">
          {searchQuery
            ? `S?n ph?m${searchQuery}"`
            : categoryId
              ? 'S?n ph?m'
              : 'S?n ph?m'}
        </div>
      </div>
    )
  }
  const renderPaginationItems = () => {
    if (totalPages <= 1) return null

    const items = []
    const maxVisiblePages = 5
    let startPage = 1
    let endPage = totalPages

    if (totalPages > maxVisiblePages) {
      const halfVisible = Math.floor(maxVisiblePages / 2)

      if (currentPage <= halfVisible + 1) {
        endPage = maxVisiblePages
      } else if (currentPage >= totalPages - halfVisible) {
        startPage = totalPages - maxVisiblePages + 1
      } else {
        startPage = currentPage - halfVisible
        endPage = currentPage + halfVisible
      }
    }
    if (startPage > 1) {
      items.push(
        <PaginationItem key="page-1">
          <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      )
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product: ClientProduct) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {hasPrevPage && (
              <PaginationItem>
                <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
              </PaginationItem>
            )}

            {renderPaginationItems()}

            {hasNextPage && (
              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
