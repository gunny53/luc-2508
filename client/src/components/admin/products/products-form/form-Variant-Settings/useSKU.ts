import { useState, useEffect, useMemo, useRef } from 'react';
import { generateSKUs, Sku } from '@/utils/variantUtils';
import type { OptionData } from './form-VariantInput';

interface GroupedSkus {
  [key: string]: Sku[];
}

// Helpers
export const formatPrice = (value: number) => {
  if (value === 0) return '';
  return new Intl.NumberFormat('en-US').format(value);
};

const parsePrice = (value: string) => {
  const numericString = value.replace(/[^0-9]/g, '');
  return numericString === '' ? 0 : parseInt(numericString, 10);
};

// English content normalized from the original source text.
import { SkuDetail } from '@/types/products.interface';

// English content normalized from the original source text.
type FormSku = Partial<SkuDetail>;

// Hook Props
interface UseSkuProps {
  options: OptionData[];
  initialSkus?: FormSku[]; // English content normalized from the original source text.
  onUpdateSkus: (skus: Sku[]) => void;
}

// Helper function to map API SKUs to component SKUs
function mapApiSkusToComponentSkus(apiSkus: FormSku[], options: OptionData[]): Sku[] {
  console.log('mapApiSkusToComponentSkus called with:');
  console.log('API SKUs:', apiSkus);
  console.log('Options:', options);

  if (!apiSkus?.length) {
    console.log('No API SKUs provided');
    return [];
  }

  if (!options?.length) {
    console.log('No options provided');
    return [];
  }

  // English content normalized from the original source text.
  if (apiSkus.some(sku => !sku.value)) {
    console.warn('Some API SKUs are missing value property:',
      apiSkus.filter(sku => !sku.value).map(sku => sku.id));
  }

  return apiSkus.map(apiSku => {
    try {
      // English content normalized from the original source text.
      const skuValue = apiSku.value || '';

      // English content normalized from the original source text.
      const valueParts = skuValue.split('-');
      console.log(`Processing SKU ${apiSku.id}, value: ${skuValue}, parts:`, valueParts);

      // English content normalized from the original source text.
      const variantValues = options.map((option, index) => {
        // English content normalized from the original source text.
        return {
          optionName: option.name,
          value: index < valueParts.length ? valueParts[index] : ''
        };
      });

      // English content normalized from the original source text.
      const name = valueParts.join(' / ');

      // English content normalized from the original source text.
      const mappedSku = {
        id: apiSku.id ? String(apiSku.id) : `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: name, // English content normalized from the original source text.
        price: typeof apiSku.price === 'number' ? apiSku.price : 0,
        stock: typeof apiSku.stock === 'number' ? apiSku.stock : 0,
        image: apiSku.image || '',
        variantValues
      };

      console.log('Mapped SKU:', mappedSku);

      return mappedSku;
    } catch (error) {
      console.error(`Error processing SKU ${apiSku.id}:`, error);

      // English content normalized from the original source text.
      return {
        id: apiSku.id || `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: apiSku.value || 'Unknown',
        price: typeof apiSku.price === 'number' ? apiSku.price : 0,
        stock: typeof apiSku.stock === 'number' ? apiSku.stock : 0,
        image: apiSku.image || '',
        variantValues: options.map(option => ({
          optionName: option.name,
          value: ''
        }))
      };
    }
  });
}

export function useSku({ options, initialSkus, onUpdateSkus }: UseSkuProps) {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // English content normalized from the original source text.
  const isInternalUpdate = useRef(false);

  // English content normalized from the original source text.
  const isInitialized = useRef(false);

  useEffect(() => {
    console.log('useSku effect triggered:', {
      optionsLength: options.length,
      initialSkusLength: initialSkus?.length,
      isInternalUpdate: isInternalUpdate.current,
      isInitialized: isInitialized.current
    });

    // English content normalized from the original source text.
    if (isInitialized.current && isInternalUpdate.current) {
      console.log('Skipping effect due to internal update');
      isInternalUpdate.current = false;
      return;
    }

    // English content normalized from the original source text.
    const hasOptions = options && options.length > 0 && options.some(opt => opt.values && opt.values.length > 0);
    const hasInitialSkus = initialSkus && initialSkus.length > 0;

    // English content normalized from the original source text.
    console.log('SKU data source conditions:', { hasOptions, hasInitialSkus });

    let newSkus: Sku[] = [];

    try {
      if (hasInitialSkus && hasOptions) {
        // English content normalized from the original source text.
        console.log('Using initialSkus from API', initialSkus);
        newSkus = mapApiSkusToComponentSkus(initialSkus, options);
      } else if (hasOptions) {
        // English content normalized from the original source text.
        console.log('Generating new SKUs from options', options);
        newSkus = generateSKUs(options);
      } else {
        console.log('Not enough data to create SKUs');
        // English content normalized from the original source text.
        newSkus = [];
      }

      console.log('Generated new SKUs:', newSkus);

      // English content normalized from the original source text.
      const preservedSkus = newSkus.map(newSku => {
        // English content normalized from the original source text.
        let oldSku = null;

        // English content normalized from the original source text.
        oldSku = skus.find(s => s.id === newSku.id);

        // English content normalized from the original source text.
        if (!oldSku) {
          oldSku = skus.find(s => s.name === newSku.name);
        }

        // English content normalized from the original source text.
        if (!oldSku) {
          // English content normalized from the original source text.
          const newValues = newSku.variantValues.map(v => v.value);

          oldSku = skus.find(s => {
            if (!s.variantValues || !Array.isArray(s.variantValues)) return false;

            // English content normalized from the original source text.
            const oldValues = s.variantValues.map(v => v.value);
            const matchCount = newValues.filter(val => oldValues.includes(val)).length;

            // English content normalized from the original source text.
            return matchCount > 0 && oldValues.length === newValues.length;
          });
        }

        if (oldSku) {
          return {
            ...newSku,
            price: oldSku.price || newSku.price,
            stock: oldSku.stock || newSku.stock,
            image: oldSku.image || newSku.image
          };
        }

        // English content normalized from the original source text.
        return newSku;
      });

      console.log('Setting skus state with preservedSkus:', preservedSkus.length);

      // English content normalized from the original source text.
      setSkus(preservedSkus);

      // Reset expanded state only if the primary option changes
      const oldFirstOption = skus[0]?.variantValues[0]?.optionName;
      const newFirstOption = options[0]?.name;
      if (oldFirstOption !== newFirstOption) {
          setExpandedGroups({});
      }

      // English content normalized from the original source text.
      isInitialized.current = true;
    } catch (error) {
      console.error('Error processing SKUs:', error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, initialSkus]);

  const groupedSkus = useMemo<GroupedSkus>(() => {
    if (!skus || skus.length === 0) {
      return {};
    }

    try {
      // English content normalized from the original source text.
      const hasValidVariantValues = skus.every(sku =>
        sku.variantValues &&
        Array.isArray(sku.variantValues) &&
        sku.variantValues.length > 0
      );

      if (!hasValidVariantValues) {
        console.error('Some SKUs have invalid variantValues', skus);
        return {};
      }

      return skus.reduce((acc, sku) => {
        try {
          // English content normalized from the original source text.
          const groupKey = sku.variantValues[0]?.value || 'Unknown';

          if (!acc[groupKey]) {
            acc[groupKey] = [];
          }
          acc[groupKey].push(sku);
          return acc;
        } catch (error) {
          console.error('Error processing SKU in grouping:', sku, error);
          return acc;
        }
      }, {} as GroupedSkus);
    } catch (error) {
      console.error('Error grouping SKUs:', error);
      return {};
    }
  }, [skus]);

  // English content normalized from the original source text.
  useEffect(() => {
    // English content normalized from the original source text.
    if (!isInitialized.current) {
      return;
    }

    // English content normalized from the original source text.
    if (isInternalUpdate.current && skus.length > 0) {
      console.log('Notifying parent of SKU update:', skus.length);
      onUpdateSkus(skus);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skus]);

  const handleSkuChange = (skuId: string, field: 'price' | 'stock', value: string) => {
    let numericValue: number;

    if (field === 'price') {
      numericValue = parsePrice(value);
    } else { // for stock
      numericValue = value === '' ? 0 : parseInt(value, 10);
    }

    if (isNaN(numericValue)) return;

    // English content normalized from the original source text.
    isInternalUpdate.current = true;
    console.log(`handleSkuChange - Updating SKU ${skuId}, field: ${field}, value: ${value}`);

    const updatedSkus = skus.map(sku =>
      sku.id === skuId ? { ...sku, [field]: numericValue } : sku
    );
    setSkus(updatedSkus);
    // English content normalized from the original source text.
  };

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const handleImageUpdate = (skuId: string, newUrl: string) => {
    console.log(`handleImageUpdate - Updating image for SKU ${skuId} to ${newUrl}`);

    // English content normalized from the original source text.
    isInternalUpdate.current = true;

    const updatedSkus = skus.map(sku =>
      sku.id === skuId ? { ...sku, image: newUrl } : sku
    );
    setSkus(updatedSkus);
    // English content normalized from the original source text.
  };

  return {
    skus,
    groupedSkus,
    expandedGroups,
    handleSkuChange,
    toggleGroup,
    handleImageUpdate,
  };
}