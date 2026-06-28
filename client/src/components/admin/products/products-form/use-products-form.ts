import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ProductCreateRequest,
  Variant,
  Sku,
  ProductDetail,
  ProductUpdateRequest,
  SkuDetail
} from '@/types/products.interface'
import { BaseEntity } from '@/types/base.interface'
import { productsService } from '@/services/products-service'
import { showToast } from '@/components/ui/toastify'
import { spec } from 'node:test/reporters'
type FormSku = Partial<SkuDetail>
export type FormState = Omit<ProductCreateRequest, 'skus' | 'categories' | 'brandId' | 'publishedAt' | 'images'> & {
  skus: FormSku[]
  categories: string[]
  brandId: string | null
  description: string
  publishedAt: string | null
  images: string[]
}

const INITIAL_STATE: FormState = {
  name: '',
  description: '',
  basePrice: 0,
  virtualPrice: 0,
  brandId: null,
  images: [],
  categories: [],
  specifications: [
    {
      name: '',
      value: ''
    }
  ],
  variants: [],
  skus: [],
  publishedAt: null
}

interface UseProductsFormProps {
  initialData?: ProductDetail | null
  onCreateSuccess?: (newProductId: string) => void
}

export const useProductsForm = ({ initialData, onCreateSuccess }: UseProductsFormProps) => {
  const [productData, setProductData] = useState<FormState>(INITIAL_STATE)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const isEditMode = !!initialData
  const resetForm = () => {
    setProductData(INITIAL_STATE)
  }

  useEffect(() => {
    if (initialData) {
      console.log('useProductsForm - Initializing with data:', initialData)
      const processedImages =
        initialData.images
          ?.map((img: any) => {
            if (typeof img === 'string') return img
            if (img && typeof img === 'object' && 'url' in img) return img.url
            return ''
          })
          .filter(Boolean) || []
      const processedCategories =
        initialData.categories
          ?.map((c) => {
            return c.id ? String(c.id) : ''
          })
          .filter(Boolean) || []

      const mappedData = {
        id: initialData.id,
        name: initialData.name || '',
        description: initialData.description || '',
        basePrice: initialData.basePrice || 0,
        virtualPrice: initialData.virtualPrice || 0,
        brandId: initialData.brand?.id?.toString() || null,
        images: processedImages,
        categories: processedCategories,
        specifications: initialData.specifications || [],
        variants: initialData.variants || [],
        skus: initialData.skus || [],
        publishedAt: initialData.publishedAt
      }

      console.log('useProductsForm - Processed data:', mappedData)
      setProductData(mappedData)
    }
  }, [initialData])

  const handleInputChange = useCallback((field: keyof FormState, value: any) => {
    setProductData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const setVariants = useCallback(
    (newVariants: Variant[]) => {
      console.log('setVariants called with:', newVariants)
      const variantsWithOptions = newVariants.filter((v) => v.options && v.options.length > 0)
      console.log('Variants with options:', variantsWithOptions)
      if (variantsWithOptions.length === 0) {
        console.log('No variants with options, clearing SKUs')
        setProductData((prev) => ({ ...prev, variants: newVariants, skus: [] }))
        return
      }
      const combinations = variantsWithOptions.reduce<string[]>((acc, variant) => {
        if (acc.length === 0) {
          return variant.options.map((opt) => opt)
        }
        return acc.flatMap((combination) => variant.options.map((opt) => `${combination}-${opt}`))
      }, [])

      console.log('Generated combinations:', combinations)
      const currentSkus = productData.skus || []
      console.log('Current SKUs:', currentSkus)
      const newSkus: Omit<Sku, 'id'>[] = combinations.map((combo) => {
        const existingSku = currentSkus.find((sku) => sku.value === combo)
        if (existingSku) {
          console.log(`Found existing SKU for combination ${combo}:`, existingSku)
          return {
            value: combo,
            price: existingSku.price || productData.basePrice,
            stock: existingSku.stock || 0,
            image: existingSku.image || '',
            id: existingSku.id
          }
        }
        return {
          value: combo,
          price: productData.basePrice,
          stock: 0,
          image: ''
        }
      })

      console.log('New SKUs to set:', newSkus)
      setProductData((prev) => ({ ...prev, variants: newVariants, skus: newSkus }))
    },
    [productData.basePrice, productData.skus]
  )

  const updateSingleSku = useCallback((index: number, updatedSku: Partial<FormSku>) => {
    console.log(`updateSingleSku - Updating SKU at index ${index}:`, updatedSku)

    setProductData((prev) => {
      const newSkus = [...prev.skus]
      if (index < 0 || index >= newSkus.length) {
        console.error(`updateSingleSku - Invalid index: ${index}, skus length: ${newSkus.length}`)
        return prev
      }
      console.log('updateSingleSku - Current SKU:', newSkus[index])
      const updatedSkuObject = { ...newSkus[index], ...updatedSku }
      console.log('updateSingleSku - After update:', updatedSkuObject)
      newSkus[index] = updatedSkuObject

      return { ...prev, skus: newSkus }
    })
  }, [])

  const handleSubmit = async (options: { stayOnPage?: boolean } = {}) => {
    setIsSubmitting(true)
    const processedSkus = productData.skus.map(({ id, createdAt, updatedAt, ...skuRest }) => ({
      value: skuRest.value || '',
      price: skuRest.price || 0,
      stock: skuRest.stock || 0,
      image: skuRest.image || ''
    }))
    const filteredImages = productData.images.filter((url) => url && url.trim() !== '')
    console.log('Sản phẩm', productData.images)
    console.log('Sản phẩm', filteredImages)
    const validCategories = productData.categories.filter(
      (id) => id && id !== 'null' && id !== 'undefined' && String(id).trim() !== ''
    )

    console.log('Sản phẩm', productData.categories)
    console.log('Sản phẩm', validCategories)
    console.log(
      'Sản phẩm',
      productData.categories.map((id) => ({
        original: id,
        numeric: String(id).match(/\d+/)?.[0] || 'no match',
        converted: parseInt(String(id).match(/\d+/)?.[0] || id, 10)
      }))
    )
    const filteredSpecifications = (productData.specifications || [])
      .filter((spec) => spec.name.trim() !== '' && spec.value.trim() !== '')
      .map((spec) => ({
        name: spec.name.trim(),
        value: spec.value.trim()
      }))

    console.log('Specifications before filtering:', productData.specifications)
    console.log('Specifications after filtering:', filteredSpecifications)

    const submissionData = {
      name: productData.name,
      description: productData.description,
      publishedAt: productData.publishedAt,
      basePrice: productData.basePrice,
      virtualPrice: productData.virtualPrice,
      brandId: productData.brandId || '',
      images: filteredImages.length > 0 ? filteredImages : [],
      categories: validCategories,
      variants: productData.variants,
      skus: processedSkus,
      specifications: filteredSpecifications
    }

    console.log('Submitting product data:', submissionData)
    if (!submissionData.brandId) {
      showToast('Sản phẩm', 'error')
      setIsSubmitting(false)
      return
    }
    if (!submissionData.name || submissionData.name.trim() === '') {
      showToast('Sản phẩm', 'error')
      setIsSubmitting(false)
      return
    }
    const requiredSpecNames = [
      'Sản phẩm',
      'Sản phẩm',
      'Sản phẩm',
      'Sản phẩm',
      'Sản phẩm'
    ]
    const existingSpecNames = submissionData.specifications.map((spec) => spec.name)

    const missingSpecs = requiredSpecNames.filter(
      (reqName) =>
        !existingSpecNames.includes(reqName) ||
        !submissionData.specifications.find((s) => s.name === reqName && s.value.trim() !== '')
    )

    if (missingSpecs.length > 0) {
      showToast(`Sản phẩm${missingSpecs.join(', ')}`, 'error')
      setIsSubmitting(false)
      return
    }
    if (submissionData.variants && submissionData.variants.length > 0) {
      if (!submissionData.skus || submissionData.skus.length === 0) {
        showToast('Sản phẩm', 'error')
        setIsSubmitting(false)
        return
      }
      const skusWithoutPrice = submissionData.skus.filter((sku) => !sku.price || sku.price <= 0)
      if (skusWithoutPrice.length > 0) {
        showToast(
          `Sản phẩm${skusWithoutPrice.length}Sản phẩm`,
          'error'
        )
        setIsSubmitting(false)
        return
      }
      console.log('Submitting product with variants:', submissionData.variants.length)
      console.log('SKUs being submitted:', submissionData.skus.length)
    }
    console.log('Description being submitted:', submissionData.description)

    try {
      if (!submissionData.images) submissionData.images = []
      console.log('Final request data (images):', submissionData.images)

      if (initialData) {
        await productsService.update(String(initialData.id), submissionData as unknown as ProductUpdateRequest)
        console.log('Product updated successfully')
        showToast('Sản phẩm', 'success')
      } else {
        const response = await productsService.create(submissionData)
        showToast('Sản phẩm', 'success')
        if (options.stayOnPage) {
          resetForm()
        } else {
          router.push('/admin/products')
        }
      }
    } catch (error: any) {
      console.error('Failed to submit product:', error)
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Sản phẩm'
      showToast(errorMessage, 'error')
      console.log('Request data was:', submissionData)
      console.log('Error details:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveAndAddNew = async () => {
    await handleSubmit({ stayOnPage: true })
  }

  return {
    productData,
    isSubmitting,
    handleInputChange,
    setVariants,
    updateSingleSku,
    handleSubmit,
    handleSaveAndAddNew,
    isEditMode
  }
}
