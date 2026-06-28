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
        <p>Sản phẩm</p>
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
    productToUse?.variants?.find((v: any) => v.value === 'Sản phẩm')
      ?.options || []
  const colors =
    productToUse?.variants?.find((v: any) => v.value === 'Sản phẩm')
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
    lastActive: 'Sản phẩm',
    rating: 3.7,
    responseRate: 100,
    responseTime: 'Sản phẩm',
    followers: 5500,
    joinedDate: 'Sản phẩm',
    productsCount: 86
  }

  const handleAddToCart = (skuId: string, quantity: number) => {
    console.log('Sản phẩm', { skuId, quantity })
  }

  const handleBuyNow = () => {
    console.log('Mua ngay')
  }

  const handleChat = () => {
    console.log('Sản phẩm')
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
