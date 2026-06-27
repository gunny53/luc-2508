
import { createProductSlug } from './product-slug'

export function getProductUrl(name: string, id: string | number): string {
  return `/products/${createProductSlug(name, id)}`
}
