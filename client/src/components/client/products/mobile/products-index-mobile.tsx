'use client'

import ProductGalleryMobile from './products-gallery-mobile'
import ProductInfoMobile from './products-info-mobile'
import ProductSpecsMobile from './products-spec-mobile'
import ProductReviews from '../products-reviews'
import ProductSuggestionsMobile from './products-suggestion-mobile'
import ProductsFooter from './products-footer'
import ProductShopInfo from '../products-shop-info'
import { productMock } from './mock-data'
import { slugify } from '@/utils/slugify'
import { ClientProductDetail } from '@/types/client.products.interface'
import { MediaItem, transformProductImagesToMedia } from '../shared/product-transformers'

interface Props {
  readonly slug: string
  product?: ClientProductDetail | null
  isLoading?: boolean
}

export default function ProductDetailMobile({ slug, product: productData, isLoading = false }: Props) {
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>S?n ph?m</p>
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
    productToUse?.variants?.find((v: any) => v.value === 'S?n ph?m')
      ?.options || []
  const colors =
    productToUse?.variants?.find((v: any) => v.value === 'S?n ph?m')
      ?.options || []
  const product = {
    ...productToUse,
    sizes,
    colors,
    media
  }

  const defaultShop = {
    id: 'cool-crew-12345',
    name: 'Cool Crew',
    avatar: '/images/logo/coolcrew-logo.png',
    isOnline: true,
    lastActive: 'S?n ph?m',
    rating: 3.7,
    responseRate: 100,
    responseTime: 'S?n ph?m',
    followers: 5500,
    joinedDate: 'S?n ph?m',
    productsCount: 86
  }

  const handleAddToCart = (skuId: string, quantity: number) => {
    console.log('S?n ph?m', { skuId, quantity })
  }

  const handleBuyNow = () => {
    console.log('Mua ngay')
  }

  const handleChat = () => {
    console.log('S?n ph?m')
  }

  return (
    <div className="bg-[#f5f5f5] pb-20">
      <ProductGalleryMobile media={product.media} />
      <ProductInfoMobile product={product as any} />
      <ProductShopInfo shop={defaultShop} />
      <ProductSpecsMobile product={product as any} />
      <ProductReviews productId={String(product.id)} />
      <ProductSuggestionsMobile products={[]} />
      <ProductsFooter
        product={product as any}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onChat={handleChat}
      />
    </div>
  )
}
