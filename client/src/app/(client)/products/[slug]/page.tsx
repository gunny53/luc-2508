import { clientProductsService } from '@/services/client-products-service'
import ProductPageWrapper from '@/components/client/products/products-wrapper'
import { extractProductId } from '@/components/client/products/shared/product-slug'
import { Metadata, ResolvingMetadata } from 'next'

export const revalidate = 300

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params

  try {
    const productId = extractProductId(slug)
    const productData = await clientProductsService.getProductDetail(productId)
    const previousImages = (await parent).openGraph?.images || []
    const description = productData.description
      ? `${productData.description.slice(0, 150)}...`
      : `Mua ${productData.name} trên ECSite`

    return {
      title: `${productData.name} | ECSite`,
      description,
      openGraph: {
        title: productData.name,
        description,
        images: [
          ...(productData.images || []).map((img) => ({
            url: img,
            width: 800,
            height: 600
          })),
          ...previousImages
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: productData.name,
        description,
        images: productData.images || []
      }
    }
  } catch (error) {
    console.error('[Metadata] Error generating metadata:', error)
    return {
      title: 'Sản phẩm | ECSite',
      description: 'Chi tiết sản phẩm trên ECSite'
    }
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params

  try {
    const productId = extractProductId(slug)
    const productData = await clientProductsService.getProductDetail(productId)
    return <ProductPageWrapper slug={slug} initialData={productData} />
  } catch (error) {
    console.error('[Server] Error fetching product:', error)
    return <ProductPageWrapper slug={slug} error={error instanceof Error ? { message: error.message } : error} />
  }
}
