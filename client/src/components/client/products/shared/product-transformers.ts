import { ClientProductDetail } from '@/types/client.products.interface'

/**
 * Interface MediaItem cho ProductGallery
 */
export interface MediaItem {
  type: 'image' | 'video'
  src: string
}

export function transformProductImagesToMedia(product: ClientProductDetail | null): MediaItem[] {
  if (!product || !product.images || !product.images.length) {
    return []
  }
  return product.images.map((url: string) => {
    const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i) !== null

    return {
      type: isVideo ? 'video' : 'image',
      src: url
    }
  })
}
