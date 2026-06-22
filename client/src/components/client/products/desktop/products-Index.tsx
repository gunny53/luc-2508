'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import ProductGallery from './products-gallery'
import ProductInfo from './products-info'
import ProductSpecs from './products-spec'
import ProductShopInfo from '../products-shop-info'
import ProductReviews from '../products-reviews'
import ProductSuggestions from './products-suggestion'
import { productMock } from './mock-data'
import { slugify } from '@/utils/slugify'
import { ClientProductDetail } from '@/types/client.products.interface'
import { MediaItem, transformProductImagesToMedia } from '../shared/product-transformers'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb'

interface Props {
  slug: string
  product?: ClientProductDetail | null
  isLoading?: boolean
}

export default function ProductDetail({ slug, product: productData, isLoading = false }: Props) {
  // Show loading state if needed
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <p>English content normalized from the original source text.</p>
      </div>
    )
  }
  let productToUse
  let media: MediaItem[]

  if (productData) {
    productToUse = productData
    media = transformProductImagesToMedia(productData)
  } else {
    productToUse = productMock
    media = (productMock.media || []).map((item) => ({
      type: item.type === 'video' ? 'video' : 'image',
      src: item.src
    })) as MediaItem[]
  }
  const sizes =
    productToUse?.variants?.find((v: any) => v.value === 'English content normalized from the original source text.')
      ?.options || []
  const colors =
    productToUse?.variants?.find((v: any) => v.value === 'English content normalized from the original source text.')
      ?.options || []
  const product = {
    ...productToUse,
    sizes,
    colors,
    media
  }

  const category = product.categories && product.categories.length > 0 ? product.categories[0] : null

  const brand = product.brand?.name || ''

  return (
    <div className="bg-[#f5f5f5] py-4">
      {/* ✅ Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-4 mb-3">
        <Breadcrumb className="mb-3 flex flex-wrap items-center text-sm text-muted-foreground">
          <BreadcrumbItem className="flex items-center gap-1">
            <BreadcrumbLink asChild>
              <Link href="/" className="text-[#05a] hover:underline">
                ECSite
              </Link>
            </BreadcrumbLink>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </BreadcrumbItem>

          {category && (
            <BreadcrumbItem className="flex items-center gap-1">
              <BreadcrumbLink asChild>
                <Link href={`/category/${slugify(category.name)}`} className="text-[#05a] hover:underline">
                  {category.name}
                </Link>
              </BreadcrumbLink>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </BreadcrumbItem>
          )}

          {brand && (
            <BreadcrumbItem className="flex items-center gap-1">
              <BreadcrumbLink asChild>
                <Link href={`/brand/${slugify(brand)}`} className="text-[#05a] hover:underline">
                  {brand}
                </Link>
              </BreadcrumbLink>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </BreadcrumbItem>
          )}

          <BreadcrumbItem>
            <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      {}
      <div className="max-w-[1200px] mx-auto bg-white p-4 rounded">
        <div className="grid md:grid-cols-[450px_1fr] gap-4 md:items-start">
          <div className="w-full">
            <ProductGallery media={product.media} />
          </div>
          <div className="w-full">
            <ProductInfo product={product as any} />
          </div>
        </div>

        {}
      </div>
      <div className="max-w-[1200px] mx-auto mt-6 rounded space-y-6">
        {}
        {}

        {}
        <div>
          <ProductSpecs product={product as any} />
        </div>

        {}
        <div>
          <ProductReviews productId={String(product.id)} />
        </div>

        {}
        <div>
          <ProductSuggestions products={[]} />
        </div>
      </div>
    </div>
  )
}
