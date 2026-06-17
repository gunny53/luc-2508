import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ProductCreateRequest,
  Variant,
  Sku,
  ProductDetail,
  ProductUpdateRequest,
  SkuDetail,
} from '@/types/products.interface';
import { BaseEntity } from '@/types/base.interface';
import { productsService } from '@/services/productsService';
import { showToast } from '@/components/ui/toastify';
import { spec } from 'node:test/reporters';

// English content normalized from the original source text.
// English content normalized from the original source text.
type FormSku = Partial<SkuDetail>;

// English content normalized from the original source text.
export type FormState = Omit<ProductCreateRequest, 'skus' | 'categories' | 'brandId' | 'publishedAt' | 'images'> & {
  skus: FormSku[];
  categories: string[]; // English content normalized from the original source text.
  brandId: string | null; // English content normalized from the original source text.
  description: string;
  publishedAt: string | null; // English content normalized from the original source text.
  images: string[]; // English content normalized from the original source text.
};

const INITIAL_STATE: FormState = {
  name: '',
  description: '',
  basePrice: 0,
  virtualPrice: 0,
  brandId: null, // English content normalized from the original source text.
  images: [], // English content normalized from the original source text.
  categories: [],
  specifications: [
    {
      name: '',
      value: '',
    }
  ],
  variants: [],
  skus: [],
  publishedAt: null, // English content normalized from the original source text.
};

interface UseProductsFormProps {
  initialData?: ProductDetail | null;
  onCreateSuccess?: (newProductId: string) => void; // English content normalized from the original source text.
}

export const useProductsForm = ({ initialData, onCreateSuccess }: UseProductsFormProps) => {
  const [productData, setProductData] = useState<FormState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const isEditMode = !!initialData;

  // English content normalized from the original source text.
  const resetForm = () => {
    setProductData(INITIAL_STATE);
    // English content normalized from the original source text.
  };

  useEffect(() => {
    if (initialData) {
      console.log('useProductsForm - Initializing with data:', initialData);

      // English content normalized from the original source text.
      const processedImages = initialData.images?.map((img: any) => {
        if (typeof img === 'string') return img;
        if (img && typeof img === 'object' && 'url' in img) return img.url;
        return '';
      }).filter(Boolean) || [];

      // English content normalized from the original source text.
      const processedCategories = initialData.categories?.map(c => {
        // English content normalized from the original source text.
        return c.id ? String(c.id) : '';
      }).filter(Boolean) || [];

      const mappedData = {
        id: initialData.id,
        name: initialData.name || '',
        description: initialData.description || '',
        basePrice: initialData.basePrice || 0,
        virtualPrice: initialData.virtualPrice || 0,
        brandId: initialData.brand?.id?.toString() || null, // English content normalized from the original source text.
        images: processedImages, // English content normalized from the original source text.
        categories: processedCategories, // English content normalized from the original source text.
        specifications: initialData.specifications || [],
        variants: initialData.variants || [],
        skus: initialData.skus || [], // English content normalized from the original source text.
        publishedAt: initialData.publishedAt, // English content normalized from the original source text.
      };

      console.log('useProductsForm - Processed data:', mappedData);
      setProductData(mappedData);
    }
  }, [initialData]);

  const handleInputChange = useCallback((field: keyof FormState, value: any) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  }, []);

  const setVariants = useCallback((newVariants: Variant[]) => {
    console.log('setVariants called with:', newVariants);

    // English content normalized from the original source text.
    const variantsWithOptions = newVariants.filter(v => v.options && v.options.length > 0);
    console.log('Variants with options:', variantsWithOptions);

    // English content normalized from the original source text.
    if (variantsWithOptions.length === 0) {
      console.log('No variants with options, clearing SKUs');
      setProductData(prev => ({ ...prev, variants: newVariants, skus: [] }));
      return;
    }

    // English content normalized from the original source text.
    const combinations = variantsWithOptions.reduce<string[]>((acc, variant) => {
      if (acc.length === 0) {
        return variant.options.map(opt => opt);
      }
      return acc.flatMap(combination => variant.options.map(opt => `${combination}-${opt}`));
    }, []);

    console.log('Generated combinations:', combinations);

    // English content normalized from the original source text.
    const currentSkus = productData.skus || [];
    console.log('Current SKUs:', currentSkus);

    // English content normalized from the original source text.
    const newSkus: Omit<Sku, 'id'>[] = combinations.map(combo => {
      // English content normalized from the original source text.
      const existingSku = currentSkus.find(sku => sku.value === combo);

      // English content normalized from the original source text.
      if (existingSku) {
        console.log(`Found existing SKU for combination ${combo}:`, existingSku);
        return {
          value: combo,
          price: existingSku.price || productData.basePrice,
          stock: existingSku.stock || 0,
          image: existingSku.image || '',
          id: existingSku.id, // English content normalized from the original source text.
        };
      }

      // English content normalized from the original source text.
      return {
        value: combo,
        price: productData.basePrice,
        stock: 0,
        image: '',
      };
    });

    console.log('New SKUs to set:', newSkus);

    // English content normalized from the original source text.
    setProductData(prev => ({ ...prev, variants: newVariants, skus: newSkus }));
  }, [productData.basePrice, productData.skus]);

  const updateSingleSku = useCallback((index: number, updatedSku: Partial<FormSku>) => {
    console.log(`updateSingleSku - Updating SKU at index ${index}:`, updatedSku);

    setProductData(prev => {
      // English content normalized from the original source text.
      const newSkus = [...prev.skus];

      // English content normalized from the original source text.
      if (index < 0 || index >= newSkus.length) {
        console.error(`updateSingleSku - Invalid index: ${index}, skus length: ${newSkus.length}`);
        return prev; // English content normalized from the original source text.
      }

      // English content normalized from the original source text.
      console.log('updateSingleSku - Current SKU:', newSkus[index]);
      const updatedSkuObject = { ...newSkus[index], ...updatedSku };
      console.log('updateSingleSku - After update:', updatedSkuObject);

      // English content normalized from the original source text.
      newSkus[index] = updatedSkuObject;

      return { ...prev, skus: newSkus };
    });
  }, []);

  const handleSubmit = async (options: { stayOnPage?: boolean } = {}) => {
    setIsSubmitting(true);

    // English content normalized from the original source text.
    // English content normalized from the original source text.
    const processedSkus = productData.skus.map(({ id, createdAt, updatedAt, ...skuRest }) => ({
      value: skuRest.value || '',
      price: skuRest.price || 0,
      stock: skuRest.stock || 0,
      image: skuRest.image || '',
    }));

    // English content normalized from the original source text.
    const filteredImages = productData.images.filter(url => url && url.trim() !== '');
    console.log('English content normalized from the original source text.', productData.images);
    console.log('English content normalized from the original source text.', filteredImages);

    // English content normalized from the original source text.
    // English content normalized from the original source text.
    const validCategories = productData.categories
      .filter(id => id && id !== 'null' && id !== 'undefined' && String(id).trim() !== '');

    console.log('English content normalized from the original source text.', productData.categories);
    console.log('English content normalized from the original source text.', validCategories);
    console.log('English content normalized from the original source text.', productData.categories.map(id => ({
      original: id,
      numeric: String(id).match(/\d+/)?.[0] || 'no match',
      converted: parseInt(String(id).match(/\d+/)?.[0] || id, 10)
    })));

    // English content normalized from the original source text.
    const filteredSpecifications = (productData.specifications || [])
      .filter(spec => spec.name.trim() !== '' && spec.value.trim() !== '')
      .map(spec => ({
        name: spec.name.trim(),
        value: spec.value.trim()
      }));

    console.log('Specifications before filtering:', productData.specifications);
    console.log('Specifications after filtering:', filteredSpecifications);

    const submissionData = {
      name: productData.name,
      description: productData.description, // English content normalized from the original source text.
      publishedAt: productData.publishedAt,
      basePrice: productData.basePrice,
      virtualPrice: productData.virtualPrice,
      brandId: productData.brandId || '', // English content normalized from the original source text.
      images: filteredImages.length > 0 ? filteredImages : [], // English content normalized from the original source text.
      categories: validCategories, // English content normalized from the original source text.
      variants: productData.variants,
      skus: processedSkus,
      specifications: filteredSpecifications,
    };

    console.log('Submitting product data:', submissionData);

    // English content normalized from the original source text.
    if (!submissionData.brandId) {
      showToast('English content normalized from the original source text.', 'error');
      setIsSubmitting(false);
      return;
    }

    // English content normalized from the original source text.
    if (!submissionData.name || submissionData.name.trim() === '') {
      showToast('English content normalized from the original source text.', 'error');
      setIsSubmitting(false);
      return;
    }

    // English content normalized from the original source text.
    const requiredSpecNames = ['English content normalized from the original source text.', 'English content normalized from the original source text.', 'English content normalized from the original source text.', 'English content normalized from the original source text.', 'English content normalized from the original source text.'];
    const existingSpecNames = submissionData.specifications.map(spec => spec.name);

    const missingSpecs = requiredSpecNames.filter(reqName =>
      !existingSpecNames.includes(reqName) ||
      !submissionData.specifications.find(s => s.name === reqName && s.value.trim() !== '')
    );

    if (missingSpecs.length > 0) {
      showToast(`English content normalized from the original source text.${missingSpecs.join(', ')}`, 'error');
      setIsSubmitting(false);
      return;
    }

    // English content normalized from the original source text.
    if (submissionData.variants && submissionData.variants.length > 0) {
      // English content normalized from the original source text.
      if (!submissionData.skus || submissionData.skus.length === 0) {
        showToast('English content normalized from the original source text.', 'error');
        setIsSubmitting(false);
        return;
      }

      // English content normalized from the original source text.
      const skusWithoutPrice = submissionData.skus.filter(sku => !sku.price || sku.price <= 0);
      if (skusWithoutPrice.length > 0) {
        showToast(`English content normalized from the original source text.${skusWithoutPrice.length}English content normalized from the original source text.`, 'error');
        setIsSubmitting(false);
        return;
      }

      // English content normalized from the original source text.
      console.log('Submitting product with variants:', submissionData.variants.length);
      console.log('SKUs being submitted:', submissionData.skus.length);
    }

    // English content normalized from the original source text.
    console.log('Description being submitted:', submissionData.description);

    try {
      // English content normalized from the original source text.
      if (!submissionData.images) submissionData.images = [];

      // English content normalized from the original source text.
      console.log('Final request data (images):', submissionData.images);

      if (initialData) {
        // English content normalized from the original source text.
        await productsService.update(String(initialData.id), submissionData as unknown as ProductUpdateRequest);
        console.log('Product updated successfully');
        showToast('English content normalized from the original source text.', 'success');
      } else {
        // English content normalized from the original source text.
        const response = await productsService.create(submissionData);
        showToast("English content normalized from the original source text.", "success");
        // English content normalized from the original source text.
        if (options.stayOnPage) {
          resetForm();
        } else {
          router.push('/admin/products');
        }
      }
    } catch (error: any) {
      console.error('Failed to submit product:', error);
      // English content normalized from the original source text.
      const errorMessage = error?.response?.data?.message || error?.message || 'English content normalized from the original source text.';
      showToast(errorMessage, 'error');

      // English content normalized from the original source text.
      console.log('Request data was:', submissionData);
      console.log('Error details:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndAddNew = async () => {
    await handleSubmit({ stayOnPage: true });
  };

  return {
    productData,
    isSubmitting,
    handleInputChange,
    setVariants,
    updateSingleSku,
    handleSubmit,
    handleSaveAndAddNew,
    isEditMode,
  };
};