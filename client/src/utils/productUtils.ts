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
  image: string | null; // Allow image to be null to match SkuDetail type
  productId: string;
}

/* English content normalized from the original source text. */
export type SelectedVariants = Record<string, string | null>;

/* English content normalized from the original source text. */
export function createSkuValueFromSelectedVariants(
  selectedVariants: SelectedVariants,
  variantGroups: VariantGroup[]
): string[] {
  console.log('createSkuValueFromSelectedVariants called with:', { selectedVariants, variantGroups });

  // English content normalized from the original source text.
  const allVariantsSelected = Object.values(selectedVariants).every(val => val !== null);

  if (!allVariantsSelected) {
    console.log('Not all variants selected, returning empty array');
    return [];
  }

  // English content normalized from the original source text.
  const selectedValues: string[] = [];

  if (variantGroups.length > 0) {
    // English content normalized from the original source text.
    variantGroups.forEach(group => {
      const value = selectedVariants[group.value];
      if (value) {
        selectedValues.push(value);
      }
    });
  } else {
    // English content normalized from the original source text.
    Object.values(selectedVariants).forEach(value => {
      if (value) {
        selectedValues.push(value);
      }
    });
  }

  console.log('Selected values:', selectedValues);

  if (selectedValues.length === 0) {
    return [];
  }

  if (selectedValues.length === 1) {
    return [selectedValues[0]];
  }

  // English content normalized from the original source text.
  const possibleCombinations: string[] = [];

  // English content normalized from the original source text.
  function getPermutations(arr: string[]): string[][] {
    if (arr.length <= 1) return [arr];

    const result: string[][] = [];
    for (let i = 0; i < arr.length; i++) {
      const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
      const perms = getPermutations(rest);
      for (const perm of perms) {
        result.push([arr[i], ...perm]);
      }
    }
    return result;
  }

  const permutations = getPermutations(selectedValues);
  console.log('Generated permutations:', permutations);

  // English content normalized from the original source text.
  permutations.forEach(perm => {
    // English content normalized from the original source text.
    possibleCombinations.push(perm.join('-'));
    // English content normalized from the original source text.
    possibleCombinations.push(perm.join(' - '));
  });

  console.log('Final possible combinations:', possibleCombinations);
  return possibleCombinations;
}

/* English content normalized from the original source text. */
export function findMatchingSku(
  selectedVariants: SelectedVariants,
  skus: Sku[],
  variantGroups: VariantGroup[]
): Sku | null {
  console.log('findMatchingSku called with:', { selectedVariants, skus: skus.map(s => s.value), variantGroups });

  const possibleSkuValues = createSkuValueFromSelectedVariants(selectedVariants, variantGroups);

  if (possibleSkuValues.length === 0) {
    console.log('No possible SKU values generated');
    return null;
  }

  console.log('Possible SKU values to try:', possibleSkuValues);
  console.log('Available SKU values from API:', skus.map(s => s.value));

  // English content normalized from the original source text.
  for (const skuValue of possibleSkuValues) {
    console.log(`Trying to match: "${skuValue}"`);

    // English content normalized from the original source text.
    const normalizedSkuValue = skuValue.replace(/\s*-\s*/g, '-');
    console.log(`Normalized to: "${normalizedSkuValue}"`);

    const foundSku = skus.find(sku => {
      const normalizedApiValue = sku.value.replace(/\s*-\s*/g, '-');
      console.log(`Comparing "${normalizedSkuValue}" with "${normalizedApiValue}" (original: "${sku.value}")`);
      return normalizedApiValue === normalizedSkuValue;
    });

    if (foundSku) {
      console.log(`✅ Found matching SKU: ${foundSku.value} for selected variants:`, selectedVariants);
      return foundSku;
    }
  }

  console.log(`❌ No matching SKU found for variants:`, selectedVariants);
  console.log(`Tried combinations:`, possibleSkuValues);
  console.log(`Available SKUs:`, skus.map(s => s.value));

  return null;
}

/* English content normalized from the original source text. */
export function isOptionAvailable(
  variantType: string,
  option: string,
  selectedVariants: SelectedVariants,
  skus: Sku[],
  variantGroups: VariantGroup[] = []
): boolean {
  // English content normalized from the original source text.
  const testVariants = {
    ...selectedVariants,
    [variantType]: option
  };

  // English content normalized from the original source text.
  const hasUnselectedVariants = Object.values(testVariants).some(val => val === null);

  if (hasUnselectedVariants) {
    // English content normalized from the original source text.
    return skus.some(sku => sku.value.includes(option));
  } else {
    // English content normalized from the original source text.
    const possibleSkuValues = createSkuValueFromSelectedVariants(testVariants, variantGroups);

    return possibleSkuValues.some(skuValue => {
      const normalizedSkuValue = skuValue.replace(/\s*-\s*/g, '-');
      return skus.some(sku => {
        const normalizedApiValue = sku.value.replace(/\s*-\s*/g, '-');
        return normalizedApiValue === normalizedSkuValue;
      });
    });
  }
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

// /**
// English content normalized from the original source text.
//  */
// export function getStockMessage(stock: number): ReactNode {
//   if (stock <= 0) {
// English content normalized from the original source text.
//   }

//   if (stock <= 5) {
// English content normalized from the original source text.
//   }

// English content normalized from the original source text.
// }

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
