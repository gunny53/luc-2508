import Image from 'next/image'
import Link from 'next/link'
import { ClientProduct } from '@/types/client.products.interface'
import { formatCurrency } from '@/utils/formatter'
import { ROUTES } from '@/constants/route'
import { getProductUrl } from '@/components/client/products/shared/routes'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'

interface ProductItemProps {
  product?: ClientProduct
  isLoading?: boolean
}

export const ProductItemSkeleton: React.FC = () => {
  return (
    <div className="group block w-full bg-gray-200 rounded-sm shadow-sm overflow-hidden">
      <Skeleton className="w-full aspect-square rounded-none" />
      <div className="p-2 flex flex-col justify-between min-h-[100px]">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  )
}

const ProductItem: React.FC<ProductItemProps> = ({ product, isLoading }) => {
  const [imageError, setImageError] = useState(false)
  if (isLoading || !product) {
    return <ProductItemSkeleton />
  }
  const originalPrice = product.virtualPrice
  const salePrice = product.basePrice
  const hasDiscount = originalPrice > salePrice
  const discountPercent = hasDiscount ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0
  const productImage = imageError
    ? '/images/image-placeholder.jpg'
    : product.images[0] || '/images/image-placeholder.jpg'

  return (
    <Link href={getProductUrl(product.name, product.id)} passHref>
      <div className="group block w-full bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-xl transition-shadow duration-200 ease-in-out cursor-pointer overflow-hidden">
        <div className="relative">
          <Image
            src={productImage}
            alt={product.name}
            width={200}
            height={200}
            className="w-full h-auto object-cover aspect-square"
            onError={() => setImageError(true)}
          />
          {hasDiscount && (
            <div className="absolute top-0 right-0 bg-orange-50 text-primary text-[10px] font-semibold px-2 py-1 flex flex-col items-center justify-center">
              <span>{`-${discountPercent}%`}</span>
            </div>
          )}
        </div>
        <div className="p-2 flex flex-col justify-between min-h-[100px]">
          <h3 className="text-sm text-gray-800 line-clamp-2 mb-1">{product.name}</h3>
          <div className="mt-auto">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <span className="text-base font-medium text-primary">{formatCurrency(salePrice)}</span>
                {hasDiscount && (
                  <span className="text-xs line-through text-gray-500">{formatCurrency(originalPrice)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductItem
