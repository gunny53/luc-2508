'use client'
import ShopSuggestion from './search-shop-suggestions'
import SearchSidebar from './search-sidebar'
import SearchSortBar from './search-sort-bar'
import SearchBrand from './search-brand'
import SearchProductGrid from './search-product-grid'
import { useSearchParams } from 'next/navigation'
import { ProductsProvider } from '../context/products-context'

interface SearchDesktopIndexProps {
  categoryIds?: string[]
  currentCategoryId?: string | null
}

export default function SearchDesktopIndex({ categoryIds = [], currentCategoryId }: SearchDesktopIndexProps) {
  const searchParams = useSearchParams()
  const keyword = searchParams.get('q') || ''
  const parentCategoryId = categoryIds.length > 0 ? categoryIds[0] : null

  return (
    <ProductsProvider currentCategoryId={currentCategoryId}>
      <div className="flex flex-col gap-6 p-6">
        <SearchBrand />

        <div className="flex gap-6">
          <SearchSidebar categoryIds={categoryIds} currentCategoryId={currentCategoryId} />
          <div className="flex-1 space-y-4">
            {keyword && <div className="text-sm text-gray-500">Search results for &quot;{keyword}&quot;</div>}
            <SearchSortBar />
            <SearchProductGrid />
          </div>
        </div>
      </div>
    </ProductsProvider>
  )
}
