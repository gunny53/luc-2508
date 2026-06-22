'use client'

import { useProductsForm } from './use-products-form'
import { ProductDetail } from '@/types/products.interface'
import { ProductBasicInfoForm } from './form-basic-info'
import { ProductAsideForm } from './form-aside/aside-index'
import { VariantSettingsIndex } from './form-variant-settings/variant-settings-index'
import { ProductSpecificationsForm } from './form-specifications'

interface ProductFormProps {
  initialData?: ProductDetail | null
  onCreateSuccess?: (newProductId: string) => void
}

function ProductForm({ initialData, onCreateSuccess }: ProductFormProps) {
  const {
    productData,
    isEditMode,
    isSubmitting,
    handleInputChange,
    setVariants,
    updateSingleSku,
    handleSubmit,
    handleSaveAndAddNew
  } = useProductsForm({ initialData, onCreateSuccess })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
      {}
      <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <ProductBasicInfoForm productData={productData} handleInputChange={handleInputChange} />

        <VariantSettingsIndex
          variants={productData.variants}
          skus={productData.skus}
          setVariants={setVariants}
          updateSingleSku={updateSingleSku}
        />

        <ProductSpecificationsForm
          specifications={productData.specifications || []}
          handleSpecificationsChange={(specs) => handleInputChange('specifications', specs)}
        />
      </div>

      {}
      <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <ProductAsideForm
          brandId={productData.brandId}
          categories={productData.categories}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleSaveAndAddNew={handleSaveAndAddNew}
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
        />
      </div>
    </div>
  )
}
export { ProductForm }
