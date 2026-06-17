// utils/slugify.ts

import { url } from "inspector";
import { ENUM } from "@/configs/common";

// English content normalized from the original source text.
export function slugify(str: string) {
  return str
    .normalize("NFD") // English content normalized from the original source text.
    .replace(/[\u0300-\u036f]/g, "") // English content normalized from the original source text.
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // English content normalized from the original source text.
    .trim()
    .replace(/\s+/g, "-"); // English content normalized from the original source text.
}



// English content normalized from the original source text.
export function isCategorySlug(slug: string): boolean {
  return slug.includes('-cat.');
}

// English content normalized from the original source text.
export function createCategorySlug(name: string, ids: string[] | string | null | undefined) {
  // English content normalized from the original source text.
  const urlFriendlyName = name
    .trim()
    .replace(/\s+/g, '-');

  // English content normalized from the original source text.
  const idsArray = Array.isArray(ids) ? ids : (ids ? [ids] : []);

  // English content normalized from the original source text.
  const idPart = idsArray.length > 0 ? `cat.${idsArray.join('.')}` : '';

  // English content normalized from the original source text.
  return `/${urlFriendlyName}-${idPart}`;
}

// English content normalized from the original source text.
export function extractCategoryIds(slug: string): string[] {
  // English content normalized from the original source text.
  const matches = slug.match(/-cat\.([^/]+)$/);
  if (!matches || !matches[1]) return [];

  // English content normalized from the original source text.
  return matches[1].split('.');
}

// English content normalized from the original source text.
export function extractCurrentCategoryId(slug: string): string | null {
  const ids = extractCategoryIds(slug);
  return ids.length > 0 ? ids[ids.length - 1] : null;
}

// English content normalized from the original source text.
export function extractParentCategoryId(slug: string): string | null {
  const ids = extractCategoryIds(slug);
  return ids.length > 0 ? ids[0] : null;
}


/* English content normalized from the original source text. */
export function createUrl(
  pathname: string,
  params: URLSearchParams | Record<string, string> = {}
) {
  const searchParams = params instanceof URLSearchParams
    ? params
    : new URLSearchParams(params);

  const queryString = searchParams.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}



/* English content normalized from the original source text. */
export function createProductSlug(name: string, id: string | number): string {
  // English content normalized from the original source text.
  const nameSlug = name.trim().replace(/\s+/g, "-");
  // English content normalized from the original source text.
  const encodedNameSlug = encodeURIComponent(nameSlug);
  return `${encodedNameSlug}__${id}`;
}


/* English content normalized from the original source text. */
export function getProductUrl(name: string, id: string | number): string {
  return `/products/${createProductSlug(name, id)}`;
}
