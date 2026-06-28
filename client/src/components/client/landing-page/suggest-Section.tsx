'use client'

import { useClientSuggestedProducts } from '@/hooks/client-products/use-client-suggested-products'
import ProductItem, { ProductItemSkeleton } from '@/components/ui/product-component/product-item'
import { useTranslations } from 'next-intl'

interface SuggestSectionProps {
  title?: string
  categoryId?: string
  initialLimit?: number
}

const SuggestSection = ({ categoryId, initialLimit = 48 }: SuggestSectionProps) => {
  const t = useTranslations('client.landing.suggest')
  const { products, initialLoading, loading, hasMore, loadMore, error } = useClientSuggestedProducts({
    initialLimit,
    categoryId,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  return (
    <div className="bg-gray-100 py-4">
      <div className="container mx-auto">
        {error && <div className="text-center p-4 text-red-500">{t('loadError')}</div>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {initialLoading
            ? Array.from({ length: initialLimit }).map((_, index) => <ProductItemSkeleton key={index} />)
            : products.map((product) => <ProductItem key={product.id} product={product} isLoading={false} />)}
        </div>

        {!initialLoading && hasMore && (
          <div className="text-center mt-4">
            <button
              className={`px-16 py-2 border border-gray-400 text-gray-600 hover:bg-gray-200 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? t('loadingMore') : t('loadMore')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SuggestSection
