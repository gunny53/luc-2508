// src/components/client/products/shared/types.ts

export interface ProductVariantOption {
  name: string;
  values: string[];
  images?: Record<string, string>;  // Mapping value -> image
}

export interface ProductSku {
  id: string;
  variantCombo: string; // English content normalized from the original source text.
  price: number;
  stock: number;
  image?: string;
}

// UI State interfaces
export interface SelectedVariants {
  [key: string]: string | null; // English content normalized from the original source text.
}

// Cart related types
export interface AddToCartPayload {
  productId: string;
  skuId: string;
  quantity: number;
  selectedVariants: SelectedVariants;
}