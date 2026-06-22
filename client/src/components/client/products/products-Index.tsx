'use client'

import ClientLayoutWrapper from '@/components/client/layout/client-layout-wrapper'
import ProductDetail from '@/components/client/products/desktop/products-index'
import ProductDetailMobile from '@/components/client/products/mobile/products-index-mobile'
import { useCheckDevice } from '@/hooks/use-check-devices'
import { useResponsive } from '@/hooks/use-responsive'
import { useEffect, useState } from 'react'
import { useProduct } from './hooks/use-product'
import { ClientProductDetail } from '@/types/client.products.interface'

interface ProductPageProps {
  slug: string
  initialData?: ClientProductDetail
  error?: any
}

export function ProductPage({ slug, initialData, error: initialError }: ProductPageProps) {
  const [mounted, setMounted] = useState(false)
  const deviceType = useCheckDevice()
  const { isMobile } = useResponsive()
  const { product, isLoading, error } = useProduct(slug, initialData)

  useEffect(() => {
    console.log('✅ [Page] slug param:', slug)
    console.log('✅ [Page] initialData:', initialData ? `Received (${initialData.id})` : 'None')
    setMounted(true)
  }, [slug, initialData])

  if (!mounted || deviceType === 'unknown') return null
  const productError = error || initialError
  if (productError) {
    console.error('❌ [ProductPage] Error:', productError)
  }

  return (
    <ClientLayoutWrapper
      hideHeader={isMobile}
      hideCommit
      hideHero
      hideFooter={isMobile}
      topContent={isMobile}
      maxWidth={1650}
    >
      {deviceType === 'mobile' ? (
        <ProductDetailMobile slug={slug} product={product} isLoading={isLoading} />
      ) : (
        <ProductDetail slug={slug} product={product} isLoading={isLoading} />
      )}
    </ClientLayoutWrapper>
  )
}
