'use client';
import ShopSuggestion from './search-ShopSuggestions';
import SearchSidebar from './search-Sidebar';
import SearchSortBar from './search-SortBar';
import SearchBrand from './search-Brand';
import SearchProductGrid from './search-ProductGrid';
import { useSearchParams } from 'next/navigation';
import { ProductsProvider } from '../context/ProductsContext';

interface SearchDesktopIndexProps {
  categoryIds?: string[];
  currentCategoryId?: string | null;
}

export default function SearchDesktopIndex({ categoryIds = [], currentCategoryId }: SearchDesktopIndexProps) {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';

  // English content normalized from the original source text.
  const parentCategoryId = categoryIds.length > 0 ? categoryIds[0] : null;

  return (
    <ProductsProvider currentCategoryId={currentCategoryId}>
      <div className="flex flex-col gap-6 p-6">
        {/* Brands carousel section at the top */}
        <SearchBrand />

        {/* Main content with sidebar and products */}
        <div className="flex gap-6">
          <SearchSidebar
            categoryIds={categoryIds}
            currentCategoryId={currentCategoryId}
          />
          <div className="flex-1 space-y-4">
            {/* <ShopSuggestion /> */}
            {keyword && (
              <div className="text-sm text-gray-500">
                English content normalized from the original source text. '{keyword}'
              </div>
            )}
            <SearchSortBar />
            <SearchProductGrid />
          </div>
        </div>
      </div>
    </ProductsProvider>
  );
}