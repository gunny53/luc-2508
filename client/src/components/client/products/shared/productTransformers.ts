/* English content normalized from the original source text. */

import { ClientProductDetail } from "@/types/client.products.interface";

/**
 * Interface MediaItem cho ProductGallery
 */
export interface MediaItem {
  type: "image" | "video";
  src: string;
}

/* English content normalized from the original source text. */
export function transformProductImagesToMedia(product: ClientProductDetail | null): MediaItem[] {
  if (!product || !product.images || !product.images.length) {
    return [];
  }

  // English content normalized from the original source text.
  return product.images.map((url: string) => {
    // English content normalized from the original source text.
    // English content normalized from the original source text.
    const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;

    return {
      type: isVideo ? "video" : "image",
      src: url
    };
  });
}
