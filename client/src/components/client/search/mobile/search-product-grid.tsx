'use client'

import { useEffect, useState } from 'react'
import { ClientProduct } from '@/types/client.products.interface'
import ProductItem from '@/components/ui/product-component/product-item'
import { Skeleton } from '@/components/ui/skeleton'
import { useProductsContext } from '../context/products-context'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function SearchProductGridMobile() {
  const t = useTranslations('client.searchPage.products')
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const {
    products,
    isLoading,
    isError,
    currentPage,
    handlePageChange,
    paginationData: { hasNextPage }
  } = useProductsContext()

  const [observerTarget, setObserverTarget] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!observerTarget) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading && hasNextPage) {
        handlePageChange(currentPage + 1)
      }
    })

    observer.observe(observerTarget)
    return () => observer.disconnect()
  }, [observerTarget, isLoading, hasNextPage, currentPage, handlePageChange])
  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[180px] w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
      </div>
    )
  }
  if (isError) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="text-primary mb-4">{t('loadError')}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-orange-700 transition-colors"
        >
          {t('retry')}
        </button>
      </div>
    )
  }
  if (products.length === 0 && !isLoading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="text-black text-lg mb-2">
          {searchQuery ? t('emptySearch', { query: searchQuery }) : t('empty')}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {products.map((product: ClientProduct) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>

      {isLoading && products.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[180px] w-full rounded-md" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
        </div>
      )}

      {hasNextPage && <div ref={setObserverTarget} className="h-10" />}
    </div>
  )
}
