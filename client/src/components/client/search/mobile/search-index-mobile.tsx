'use client'

import { Pagination } from '@/components/ui/pagination'
import SearchSidebar from './search-sidebar'
import ShopSuggestion from './search-shop-suggestions'
import SearchSortBar from './search-sort-bar'
import SearchProductGrid from './search-product-grid'
import SearchBrand from './search-brand'
import { useSearchParams } from 'next/navigation'
import { ProductsProvider } from '../context/products-context'
// import SearchBrandInfo from './search-brand';

interface SearchMobileIndexProps {
  categoryIds?: string[]
  currentCategoryId?: string | null
}

export default function SearchMobileIndex({ categoryIds = [], currentCategoryId }: SearchMobileIndexProps) {
  const searchParams = useSearchParams()
  const keyword = searchParams.get('q') || ''

  const parentCategoryId = categoryIds.length > 0 ? categoryIds[0] : null

  return (
    <ProductsProvider currentCategoryId={currentCategoryId}>
      <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
        <div className="lg:block hidden">
          <SearchSidebar categoryIds={categoryIds} currentCategoryId={currentCategoryId} />
        </div>

        <div className="flex-1 space-y-4">
          {/* <SearchBrandInfo /> */}
          <SearchBrand />
          <ShopSuggestion />
          {keyword && (
            <div className="text-sm text-gray-500">
              English content normalized from the original source text. '{keyword}'
            </div>
          )}
          <SearchSortBar />
          <SearchProductGrid />
          <Pagination />
        </div>
      </div>
    </ProductsProvider>
  )
}
