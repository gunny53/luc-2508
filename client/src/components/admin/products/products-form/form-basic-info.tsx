'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RichTextEditor } from '@/components/ui/component/rich-text-editor'
import { MediaForm } from './form-media/media-index'
import { ProductCreateRequest } from '@/types/products.interface'
import { FormState } from './use-products-form' 
const formatCurrency = (value: number): string => {
  if (isNaN(value)) return ''
  return new Intl.NumberFormat('en-US').format(value)
}
const parseCurrency = (value: string): number => {
  const number = parseInt(value.replace(/\D/g, ''), 10)
  return isNaN(number) ? 0 : number
}

interface ProductBasicInfoFormProps {
  productData: FormState
  handleInputChange: (field: keyof FormState, value: any) => void
}

export function ProductBasicInfoForm({ productData, handleInputChange }: ProductBasicInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>S?n ph?m</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="product-name">S?n ph?m</Label>
          <Input
            id="product-name"
            value={productData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="S?n ph?m"
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="product-description">S?n ph?m</Label>
          <RichTextEditor
            value={productData.description}
            onChange={(value) => handleInputChange('description', value)}
          />
        </div>

        <div className="grid gap-3">
          <MediaForm images={productData.images} setImages={(newImages) => handleInputChange('images', newImages)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-3">
            <Label htmlFor="base-price">S?n ph?m</Label>
            <Input
              id="base-price"
              type="text"
              value={formatCurrency(productData.basePrice)}
              onChange={(e) => handleInputChange('basePrice', parseCurrency(e.target.value))}
              placeholder="0"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="virtual-price">S?n ph?m</Label>
            <Input
              id="virtual-price"
              type="text"
              value={formatCurrency(productData.virtualPrice)}
              onChange={(e) => handleInputChange('virtualPrice', parseCurrency(e.target.value))}
              placeholder="0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
