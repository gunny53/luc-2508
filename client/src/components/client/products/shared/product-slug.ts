// src/utils/productSlug.ts

export function createProductSlug(name: string, id: string | number): string {
  const nameSlug = name.trim().replace(/\s+/g, '-')
  const encodedNameSlug = encodeURIComponent(nameSlug)
  return `${encodedNameSlug}__${id}`
}

export function extractProductId(slug: string): string {
  try {
    // Decode slug first to handle URL-encoded characters
    const decodedSlug = decodeURIComponent(slug)
    const parts = decodedSlug.split('__')
    if (parts.length === 2) {
      return parts[1]
    }
  } catch (error) {
    console.error('Error decoding slug:', slug, error)
    // Continue to fallback methods if decoding fails
  }
  const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
  const match = slug.match(uuidPattern)

  if (match) {
    return match[0]
  }
  return slug
}

export function extractProductName(slug: string): string | null {
  try {
    // Decode slug first to handle URL-encoded characters
    const decodedSlug = decodeURIComponent(slug)
    const parts = decodedSlug.split('__')
    if (parts.length === 2) {
      return parts[0]
    }
  } catch (error) {
    console.error('Error decoding slug for name extraction:', slug, error)
  }
  return null
}
