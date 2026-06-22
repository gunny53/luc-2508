export function slugify(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function isCategorySlug(slug: string): boolean {
  return slug.includes('-cat.')
}

export function createCategorySlug(name: string, ids: string[] | string | null | undefined) {
  const urlFriendlyName = name.trim().replace(/\s+/g, '-')
  const idsArray = Array.isArray(ids) ? ids : ids ? [ids] : []
  const idPart = idsArray.length > 0 ? `cat.${idsArray.join('.')}` : ''

  return `/${urlFriendlyName}-${idPart}`
}

export function extractCategoryIds(slug: string): string[] {
  const matches = slug.match(/-cat\.([^/]+)$/)
  if (!matches || !matches[1]) return []

  return matches[1].split('.')
}

export function extractCurrentCategoryId(slug: string): string | null {
  const ids = extractCategoryIds(slug)
  return ids.length > 0 ? ids[ids.length - 1] : null
}

export function extractParentCategoryId(slug: string): string | null {
  const ids = extractCategoryIds(slug)
  return ids.length > 0 ? ids[0] : null
}

export function createUrl(pathname: string, params: URLSearchParams | Record<string, string> = {}) {
  const searchParams = params instanceof URLSearchParams ? params : new URLSearchParams(params)

  const queryString = searchParams.toString()
  return queryString ? `${pathname}?${queryString}` : pathname
}

export function createProductSlug(name: string, id: string | number): string {
  const nameSlug = name.trim().replace(/\s+/g, '-')
  const encodedNameSlug = encodeURIComponent(nameSlug)
  return `${encodedNameSlug}__${id}`
}

export function getProductUrl(name: string, id: string | number): string {
  return `/products/${createProductSlug(name, id)}`
}
