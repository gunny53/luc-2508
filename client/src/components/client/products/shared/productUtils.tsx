import { ReactNode } from 'react';

/* English content normalized from the original source text. */
export interface VariantGroup {
  value: string;
  options: string[];
}

/* English content normalized from the original source text. */
export interface Sku {
  id: string;
  value: string;
  price: number;
  stock: number;
  image: string;
  productId: string;
}

/* English content normalized from the original source text. */
export type SelectedVariants = Record<string, string | null>;

/* English content normalized from the original source text. */
export function createSkuValueFromSelectedVariants(
  selectedVariants: SelectedVariants,
  variantGroups: VariantGroup[]
): string | null {
  // English content normalized from the original source text.
  const allVariantsSelected = Object.values(selectedVariants).every(val => val !== null);

  if (!allVariantsSelected) {
    return null;
  }

  // English content normalized from the original source text.
  // English content normalized from the original source text.

  // English content normalized from the original source text.
  const colorVariant = selectedVariants["Color"] || selectedVariants["English content normalized from the original source text."] || selectedVariants["English content normalized from the original source text."];
  const sizeVariant = selectedVariants["Size"] || selectedVariants["English content normalized from the original source text."] || selectedVariants["English content normalized from the original source text."];

  if (colorVariant && sizeVariant) {
    return `${colorVariant}-${sizeVariant}`;
  }

  // English content normalized from the original source text.
  // English content normalized from the original source text.
  const selectedValues: string[] = [];

  variantGroups.forEach(group => {
    const value = selectedVariants[group.value];
    if (value) {
      selectedValues.push(value);
    }
  });

  return selectedValues.join('-');
}

/* English content normalized from the original source text. */
export function findMatchingSku(
  selectedVariants: SelectedVariants,
  skus: Sku[],
  variantGroups: VariantGroup[]
): Sku | null {
  const skuValue = createSkuValueFromSelectedVariants(selectedVariants, variantGroups);

  if (!skuValue) {
    return null;
  }

  // Normalize the sku.value from the API by removing spaces around the hyphen for a reliable comparison.
  return skus.find(sku => sku.value.replace(/\s*-\s*/g, '-') === skuValue) || null;
}

/* English content normalized from the original source text. */
export function isOptionAvailable(
  variantType: string,
  option: string,
  selectedVariants: SelectedVariants,
  skus: Sku[]
): boolean {
  // English content normalized from the original source text.
  const testVariants = {
    ...selectedVariants,
    [variantType]: option
  };

  // English content normalized from the original source text.
  const remainingVariants = Object.entries(testVariants)
    .filter(([key]) => key === variantType || testVariants[key] !== null)
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {} as SelectedVariants);

  // English content normalized from the original source text.
  return skus.some(sku => {
    // English content normalized from the original source text.
    return Object.values(remainingVariants).every(variant =>
      variant !== null && sku.value.includes(variant)
    );
  });
}

/* English content normalized from the original source text. */
export function getTotalStock(skus: Sku[]): number {
  return skus.reduce((sum, sku) => sum + sku.stock, 0);
}

/* English content normalized from the original source text. */
export function getCurrentStock(
  selectedVariants: SelectedVariants,
  skus: Sku[],
  variantGroups: VariantGroup[]
): number {
  const currentSku = findMatchingSku(selectedVariants, skus, variantGroups);
  return currentSku ? currentSku.stock : getTotalStock(skus);
}

/* English content normalized from the original source text. */
export function getStockMessage(stock: number): ReactNode {
  if (stock <= 0) {
    return <span className="text-red-500">English content normalized from the original source text.</span>;
  }

  if (stock <= 5) {
    return <span className="text-orange-500">English content normalized from the original source text. {stock})</span>;
  }

  return <span>English content normalized from the original source text. {stock}</span>;
}

/* English content normalized from the original source text. */
export function areAllVariantsSelected(selectedVariants: SelectedVariants): boolean {
  return Object.keys(selectedVariants).length > 0 &&
    Object.values(selectedVariants).every(val => val !== null);
}

/* English content normalized from the original source text. */
export function findSelectedSkuPrice(
  selectedVariants: SelectedVariants,
  skus: Sku[],
  variantGroups: VariantGroup[],
  defaultPrice: number
): number {
  const sku = findMatchingSku(selectedVariants, skus, variantGroups);
  return sku ? sku.price : defaultPrice;
}

/* English content normalized from the original source text. */
export async function handleAddToCart(
  selectedVariants: SelectedVariants,
  skus: Sku[],
  variantGroups: VariantGroup[],
  quantity: number,
  addToCartFn: (data: {skuId: string, quantity: number}, showNotification?: boolean) => Promise<string | boolean>
): Promise<string | false> {
  // English content normalized from the original source text.
  const selectedSku = findMatchingSku(selectedVariants, skus, variantGroups);

  // English content normalized from the original source text.
  if (!selectedSku) {
    console.error("English content normalized from the original source text.");
    return false;
  }

  // English content normalized from the original source text.
  if (selectedSku.stock <= 0) {
    console.error("English content normalized from the original source text.");
    return false;
  }

  // English content normalized from the original source text.
  const safeQuantity = Math.min(quantity, selectedSku.stock);

  // English content normalized from the original source text.
  try {
    const result = await addToCartFn({
      skuId: selectedSku.id,
      quantity: safeQuantity
    }, true); // English content normalized from the original source text.

    // Return cart item ID if available, otherwise false
    return typeof result === 'string' ? result : false;
  } catch (error) {
    console.error("English content normalized from the original source text.", error);
    return false;
  }
}
