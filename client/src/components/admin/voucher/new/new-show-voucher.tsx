'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Plus, X, Search, Package, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect, useRef } from 'react'
import { VoucherFormState } from '../hook/use-new-voucher'
import { VoucherUseCase } from '../hook/voucher-config'
import { useProductsForVoucher } from '../hook/use-products-for-voucher'
import { Product } from '@/types/products.interface'
import { MultiSelectBrand } from '@/components/ui/combobox/multi-select-brand'
import { MultiSelectCategory } from '@/components/ui/combobox/multi-select-category'
import { SingleSelectUser } from '@/components/ui/combobox/single-select-user'

interface ShowVoucherProps {
  formData: VoucherFormState
  updateFormData: (field: keyof VoucherFormState, value: any) => void
  errors: Record<string, string>
  useCase: VoucherUseCase
  voucherType: string
  isEdit?: boolean
}

export default function VoucherShowSettings({ formData, updateFormData, useCase, isEdit = false }: ShowVoucherProps) {
  const [showProductSearch, setShowProductSearch] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  
  const initialSelectedProducts: Product[] = (formData.selectedProducts || []).map((p) => ({
    id: p.id,
    name: p.name,
    basePrice: p.price,
    virtualPrice: p.price,
    images: p.image ? [p.image] : [],
    
    publishedAt: null,
    brandId: 0,
    variants: [],
    productTranslations: [],
    message: '',
    createdAt: '',
    updatedAt: '',
    createdById: 0, 
    updatedById: null,
    deletedById: null,
    deletedAt: null
  }))

  const {
    products,
    loading,
    hasMore,
    searchTerm,
    setSearchTerm,
    loadMore,
    selectedProducts,
    toggleProduct,
    clearSelection
  } = useProductsForVoucher({
    initialSelected: initialSelectedProducts,
    onSelectionChange: (products: Product[]) => {
      
      const formattedProducts = products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.basePrice || p.virtualPrice || 0,
        image: p.images?.[0] || ''
      }))
      updateFormData('selectedProducts', formattedProducts)
    }
  })

  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollHeight - scrollTop <= clientHeight + 10 && hasMore && !loading) {
      loadMore()
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value) + '₫'
  }

  const RequiredLabel = ({
    children,
    htmlFor,
    className
  }: {
    children: React.ReactNode
    htmlFor?: string
    className?: string
  }) => (
    <Label htmlFor={htmlFor} className={cn('text-sm font-medium text-gray-900 flex items-center gap-2', className)}>
      {children}
      <span className="text-red-500">*</span>
    </Label>
  )

  const renderProductSelector = () => (
    <div className="w-full space-y-3">
      <Button
        variant="outline"
        onClick={() => setShowProductSearch(!showProductSearch)}
        className="border-gray-300 text-gray-800"
      >
        <Plus className="-ml-1 mr-2 h-4 w-4" />
        M? gi?m gi?
      </Button>

      {showProductSearch && (
        <div className="border border-gray-300 rounded-lg p-4 space-y-4 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="M? gi?m gi?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 text-gray-900"
            />
          </div>

          <div ref={scrollRef} className="max-h-60 overflow-y-auto space-y-2" onScroll={handleScroll}>
            {products.map((product) => {
              const isSelected = selectedProducts.find((p) => p.id === product.id)
              return (
                <div
                  key={product.id}
                  className={cn(
                    'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors',
                    isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'
                  )}
                  onClick={() => toggleProduct(product)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(product.basePrice || product.virtualPrice || 0)}
                      </div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'w-5 h-5 rounded border-2 flex items-center justify-center',
                      isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    )}
                  >
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              )
            })}

            {loading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                <span className="ml-2 text-sm text-gray-500">
                  M? gi?m gi?
                </span>
              </div>
            )}

            {!loading && products.length === 0 && searchTerm && (
              <div className="text-center py-8 text-gray-600 text-sm">
                M? gi?m gi?
              </div>
            )}

            {!loading && !hasMore && products.length > 0 && (
              <div className="text-center py-2 text-gray-500 text-xs">
                M? gi?m gi?
              </div>
            )}
          </div>
        </div>
      )}

      {selectedProducts.length > 0 && (
        <div className="space-y-3 border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 font-medium">
              M? gi?m gi? {selectedProducts.length} m? gi?m gi?
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8"
            >
              M? gi?m gi?
            </Button>
          </div>
          <div className="space-y-2">
            {selectedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-600">
                      {formatCurrency(product.basePrice || product.virtualPrice || 0)}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleProduct(product)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderDisplaySettings = () => {
    const isAdminPlatformCase = [
      VoucherUseCase.PLATFORM,
      VoucherUseCase.CATEGORIES,
      VoucherUseCase.BRAND,
      VoucherUseCase.SHOP_ADMIN,
      VoucherUseCase.PRODUCT_ADMIN
    ].includes(useCase)

    if (useCase === VoucherUseCase.PRIVATE || useCase === VoucherUseCase.PRIVATE_ADMIN) {
      const isAdminPrivate = useCase === VoucherUseCase.PRIVATE_ADMIN
      return (
        <div className="flex items-start space-x-6">
          <RequiredLabel htmlFor="display-type" className="mt-3 whitespace-nowrap">
            M? gi?m gi?
          </RequiredLabel>
          <RadioGroup value="PRIVATE" className="w-full">
            <div
              className={`flex items-center space-x-2 p-3 rounded-lg border ${isAdminPrivate ? 'bg-red-50 border-red-200' : 'bg-gray-100 border-gray-200'}`}
            >
              <RadioGroupItem value="PRIVATE" id="display-private" checked={true} disabled />
              <Label htmlFor="display-private" className="font-normal text-gray-900">
                <div className="flex items-center gap-2">
                  <span>
                    M? gi?m gi? {isAdminPrivate ? '(Admin)' : ''}
                  </span>
                  {isAdminPrivate && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Platform</span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  M? gi?m gi?{' '}
                  {isAdminPrivate ? 'M? gi?m gi?' : 'Shop'}.
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    }

    if (isAdminPlatformCase) {
      
      return (
        <div className="flex items-start space-x-6">
          <RequiredLabel htmlFor="display-type" className="mt-3 whitespace-nowrap">
            M? gi?m gi?
          </RequiredLabel>
          <RadioGroup value="PUBLIC" className="w-full">
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <RadioGroupItem value="PUBLIC" id="display-public-admin" checked={true} disabled />
              <Label htmlFor="display-public-admin" className="font-normal text-gray-900">
                <div className="flex items-center gap-2">
                  <span>M? gi?m gi?</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Admin</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">M? gi?m gi?</p>
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    }

    
    return (
      <div className="flex items-start space-x-6">
        <RequiredLabel htmlFor="display-type" className="mt-3 whitespace-nowrap">
          M? gi?m gi?
        </RequiredLabel>
        <RadioGroup
          value={formData.displayType || 'PUBLIC'}
          onValueChange={(value) => updateFormData('displayType', value)}
          className="flex flex-col space-y-3"
        >
          <div className="flex items-center space-x-2 rounded-lg hover:bg-gray-50 transition-colors p-1">
            <RadioGroupItem value="PUBLIC" id="display-public" />
            <Label htmlFor="display-public" className="font-normal cursor-pointer text-gray-900">
              M? gi?m gi?
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-lg hover:bg-gray-50 transition-colors p-1">
            <RadioGroupItem value="PRIVATE" id="display-private" />
            <Label htmlFor="display-private" className="font-normal cursor-pointer text-gray-900">
              M? gi?m gi?
            </Label>
          </div>
        </RadioGroup>
      </div>
    )
  }

  const renderApplicableProducts = () => {
    switch (useCase) {
      case VoucherUseCase.SHOP:
        return (
          <div className="flex items-start space-x-6">
            <RequiredLabel className="mt-3 whitespace-nowrap">
              M? gi?m gi?
            </RequiredLabel>
            <RadioGroup value="ALL" className="w-full">
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-gray-100 border border-gray-200">
                <RadioGroupItem value="ALL" id="apply-all" checked={true} disabled />
                <Label htmlFor="apply-all" className="font-normal text-gray-900">
                  M? gi?m gi?
                  <p className="text-xs text-gray-600 mt-1">
                    M? gi?m gi?
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )
      case VoucherUseCase.PRODUCT:
        
        return (
          <div className="flex items-start space-x-6">
            <RequiredLabel className="mt-3 whitespace-nowrap">
              M? gi?m gi?
            </RequiredLabel>
            {renderProductSelector()}
          </div>
        )
      case VoucherUseCase.BRAND:
        
        return (
          <div className="flex items-start space-x-6">
            <RequiredLabel className="mt-3 whitespace-nowrap">
              M? gi?m gi?
            </RequiredLabel>
            <div className="w-full space-y-3">
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-800 font-medium">
                    M? gi?m gi?
                  </span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Platform</span>
                </div>
                <p className="text-xs text-red-600 mt-1">M? gi?m gi?</p>
              </div>
              <MultiSelectBrand
                selectedBrands={formData.selectedBrands || []}
                onSelectionChange={(brands) => updateFormData('selectedBrands', brands)}
                placeholder="M? gi?m gi?"
              />
            </div>
          </div>
        )
      case VoucherUseCase.CATEGORIES:
        
        return (
          <div className="flex items-start space-x-6">
            <RequiredLabel className="mt-3 whitespace-nowrap">
              M? gi?m gi?
            </RequiredLabel>
            <div className="w-full space-y-3">
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-800 font-medium">
                    M? gi?m gi?
                  </span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Platform</span>
                </div>
                <p className="text-xs text-red-600 mt-1">M? gi?m gi?</p>
              </div>
              <MultiSelectCategory
                selectedCategories={formData.selectedCategories || []}
                onSelectionChange={(categories) => updateFormData('selectedCategories', categories)}
                placeholder="M? gi?m gi?"
              />
            </div>
          </div>
        )
      case VoucherUseCase.PLATFORM:
        
        return (
          <div className="flex items-start space-x-6">
            <RequiredLabel className="mt-3 whitespace-nowrap">
              M? gi?m gi?
            </RequiredLabel>
            <RadioGroup value="PLATFORM" className="w-full">
              <div className="flex items-center space-x-2 p-4 rounded-lg bg-red-50 border border-red-200">
                <RadioGroupItem value="PLATFORM" id="apply-platform" checked={true} disabled />
                <Label htmlFor="apply-platform" className="font-normal text-gray-900">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">M? gi?m gi?</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Platform Admin</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    M? gi?m gi?
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )
      case VoucherUseCase.SHOP_ADMIN:
        
        return (
          <div className="flex items-start space-x-6">
            <RequiredLabel className="mt-3 whitespace-nowrap">
              M? gi?m gi?
            </RequiredLabel>
            <div className="w-full space-y-3">
              <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-orange-800 font-medium">🏪 Voucher Shop Admin</span>
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">Admin</span>
                </div>
                <p className="text-xs text-orange-600">M? gi?m gi?</p>
              </div>
              <SingleSelectUser
                selectedUser={formData.selectedShopUser}
                onSelectionChange={(user) => updateFormData('selectedShopUser', user)}
                placeholder="M? gi?m gi?"
              />
              {formData.selectedShopUser && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-800 font-medium">
                      M? gi?m gi?
                    </span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    M? gi?m gi? {formData.selectedShopUser.label}.
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      case VoucherUseCase.PRODUCT_ADMIN:
        
        return (
          <div className="flex items-start space-x-6">
            <RequiredLabel className="mt-3 whitespace-nowrap">
              M? gi?m gi?
            </RequiredLabel>
            <div className="w-full space-y-3">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-blue-800 font-medium">
                    M? gi?m gi?
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Super Admin</span>
                </div>
                <p className="text-xs text-blue-600">M? gi?m gi?</p>
              </div>
              {renderProductSelector()}
            </div>
          </div>
        )
      case VoucherUseCase.PRIVATE_ADMIN:
        
        return (
          <div className="flex items-start space-x-6">
            <RequiredLabel htmlFor="apply-type" className="mt-3 whitespace-nowrap">
              M? gi?m gi?
            </RequiredLabel>
            <div className="w-full space-y-3">
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-red-800 font-medium">
                    M? gi?m gi?
                  </span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Platform Private</span>
                </div>
                <p className="text-xs text-red-600">M? gi?m gi?</p>
              </div>
              <RadioGroup
                value={formData.discountApplyType || 'ALL'}
                onValueChange={(value) => updateFormData('discountApplyType', value)}
                className="w-full space-y-3"
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors">
                  <RadioGroupItem value="ALL" id="apply-all-admin" />
                  <Label htmlFor="apply-all-admin" className="font-normal cursor-pointer text-gray-900">
                    M? gi?m gi?
                  </Label>
                </div>
                <div className="p-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors">
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="SPECIFIC" id="apply-specific-admin" />
                    <Label htmlFor="apply-specific-admin" className="font-normal cursor-pointer text-gray-900">
                      M? gi?m gi?
                    </Label>
                  </div>
                  {formData.discountApplyType === 'SPECIFIC' && renderProductSelector()}
                </div>
              </RadioGroup>
            </div>
          </div>
        )
      case VoucherUseCase.PRIVATE:
      default:
        
        return (
          <div className="flex items-start space-x-6">
            <RequiredLabel htmlFor="apply-type" className="mt-3 whitespace-nowrap">
              M? gi?m gi?
            </RequiredLabel>
            <RadioGroup
              value={formData.discountApplyType || 'ALL'}
              onValueChange={(value) => updateFormData('discountApplyType', value)}
              className="w-full space-y-3"
            >
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="ALL" id="apply-all" />
                <Label htmlFor="apply-all" className="font-normal cursor-pointer text-gray-900">
                  M? gi?m gi?
                </Label>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SPECIFIC" id="apply-specific" />
                  <Label htmlFor="apply-specific" className="font-normal cursor-pointer text-gray-900">
                    M? gi?m gi?
                  </Label>
                </div>
                {formData.discountApplyType === 'SPECIFIC' && (
                  <div className="mt-4 pl-6 space-y-3">{renderProductSelector()}</div>
                )}
              </div>
            </RadioGroup>
          </div>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>M? gi?m gi?</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        {renderDisplaySettings()}
        {renderApplicableProducts()}
      </CardContent>
    </Card>
  )
}
