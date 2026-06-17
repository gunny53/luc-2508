// src/utils/productSlug.ts

/* English content normalized from the original source text. */
export function createProductSlug(name: string, id: string | number): string {
  // English content normalized from the original source text.
  const nameSlug = name.trim().replace(/\s+/g, "-");
  // English content normalized from the original source text.
  const encodedNameSlug = encodeURIComponent(nameSlug);
  return `${encodedNameSlug}__${id}`;
}

/* English content normalized from the original source text. */
export function extractProductId(slug: string): string {
  try {
    // Decode slug first to handle URL-encoded characters
    const decodedSlug = decodeURIComponent(slug);

    // English content normalized from the original source text.
    const parts = decodedSlug.split("__");

    // English content normalized from the original source text.
    if (parts.length === 2) {
      return parts[1];
    }
  } catch (error) {
    console.error('Error decoding slug:', slug, error);
    // Continue to fallback methods if decoding fails
  }

  // English content normalized from the original source text.
  const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const match = slug.match(uuidPattern);

  if (match) {
    return match[0];
  }

  // English content normalized from the original source text.
  return slug;
}

/* English content normalized from the original source text. */
export function extractProductName(slug: string): string | null {
  try {
    // Decode slug first to handle URL-encoded characters
    const decodedSlug = decodeURIComponent(slug);

    // English content normalized from the original source text.
    const parts = decodedSlug.split("__");

    // English content normalized from the original source text.
    if (parts.length === 2) {
      return parts[0];
    }
  } catch (error) {
    console.error('Error decoding slug for name extraction:', slug, error);
  }

  // English content normalized from the original source text.
  return null;
}
