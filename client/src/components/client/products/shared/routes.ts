// src/utils/routes.ts
import { createProductSlug } from './productSlug';

/* English content normalized from the original source text. */
export function getProductUrl(name: string, id: string | number): string {
  return `/products/${createProductSlug(name, id)}`;
}
