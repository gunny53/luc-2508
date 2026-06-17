"use client";

import { useProductsForm } from "./useProductsForm";
import { ProductDetail } from "@/types/products.interface";

// English content normalized from the original source text.
import { ProductBasicInfoForm } from "./form-BasicInfo";
import { ProductAsideForm } from "./form-Aside/Aside-Index";
import { VariantSettingsIndex } from "./form-Variant-Settings/variantSettings-Index";
import { ProductSpecificationsForm } from "./form-Specifications";

interface ProductFormProps {
  initialData?: ProductDetail | null;
  onCreateSuccess?: (newProductId: string) => void;
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
    handleSaveAndAddNew,
  } = useProductsForm({ initialData, onCreateSuccess });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
      {/* English content normalized from the original source text. */}
      <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <ProductBasicInfoForm
          productData={productData}
          handleInputChange={handleInputChange}
        />

        <VariantSettingsIndex
          variants={productData.variants}
          skus={productData.skus}
          setVariants={setVariants}
          updateSingleSku={updateSingleSku}
        />

        <ProductSpecificationsForm
          specifications={productData.specifications || []}
          handleSpecificationsChange={(specs) =>
            handleInputChange("specifications", specs)
          }
        />
      </div>

      {/* English content normalized from the original source text. */}
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
  );
}

// English content normalized from the original source text.
export { ProductForm };
