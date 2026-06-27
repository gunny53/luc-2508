

export interface ProductVariantOption {
  name: string
  values: string[]
  images?: Record<string, string> 
}

export interface ProductSku {
  id: string
  variantCombo: string
  price: number
  stock: number
  image?: string
}


export interface SelectedVariants {
  [key: string]: string | null
}


export interface AddToCartPayload {
  productId: string
  skuId: string
  quantity: number
  selectedVariants: SelectedVariants
}
