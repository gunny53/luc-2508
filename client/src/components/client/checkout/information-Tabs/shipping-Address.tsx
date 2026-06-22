'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { MapPin, Book } from 'lucide-react'
import { CustomerFormData, Address } from '@/types/checkout.interface'
import { addressService } from '@/services/address-service'
import { Address as ProfileAddress } from '@/types/auth/profile.interface'
import { SimpleAddressSelect } from '@/components/ui/simple-address-select'
import { useProvinces, useDistricts, useWards } from '@/hooks/use-shipping'
import { setShippingInfo } from '@/store/features/checkout/orders-silde'

interface ShippingAddressProps {
  formData: CustomerFormData
  handleChange: (
    nameOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    value?: string
  ) => void
  addresses?: Address[]
  onSelectExistingAddress: (address: Address) => void
}

export function ShippingAddress({ formData, handleChange, addresses, onSelectExistingAddress }: ShippingAddressProps) {
  const dispatch = useDispatch()
  const [isSelectingAddress, setIsSelectingAddress] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [savedAddresses, setSavedAddresses] = useState<ProfileAddress[]>([])
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
  const { data: provincesData } = useProvinces()
  const { data: districtsData } = useDistricts(
    { provinceId: parseInt(formData.province?.split('|')[0] || '0') },
    !!formData.province?.split('|')[0]
  )
  const { data: wardsData } = useWards(
    { districtId: parseInt(formData.district?.split('|')[0] || '0') },
    !!formData.district?.split('|')[0]
  )

  // Handle address selection changes (much simpler now)
  const handleAddressFormChange = useCallback(
    (provinceId: string, districtId: string, wardCode: string) => {
      // Only update if not selecting existing address to prevent conflicts
      if (!isSelectingAddress) {
        const provinceName =
          provincesData?.data?.find((p) => p.ProvinceID.toString() === provinceId)?.ProvinceName || ''
        const districtName =
          districtsData?.data?.find((d) => d.DistrictID.toString() === districtId)?.DistrictName || ''
        const wardName = wardsData?.data?.find((w) => w.WardCode === wardCode)?.WardName || ''
        if (provinceId && provinceName) {
          handleChange('province', `${provinceId}|${provinceName}`)
        }
        if (districtId && districtName) {
          handleChange('district', `${districtId}|${districtName}`)
        }
        if (wardCode && wardName) {
          handleChange('ward', `${wardCode}|${wardName}`)
        }
        dispatch(
          setShippingInfo({
            provinceId,
            districtId,
            wardCode,
            provinceName,
            districtName,
            wardName
          })
        )
      }
    },
    [isSelectingAddress, handleChange, dispatch, provincesData, districtsData, wardsData]
  )

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoadingAddresses(true)
        const response = await addressService.getAll()
        if (response.data) {
          setSavedAddresses(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch addresses:', error)
      } finally {
        setIsLoadingAddresses(false)
      }
    }

    fetchAddresses()
  }, [])

  const handleAddressSelect = (id: string) => {
    setSelectedAddressId(id)

    const selected = savedAddresses.find((addr) => addr.id === id)
    if (selected) {
      console.log('[ShippingAddress] Selected address:', selected)

      if (!isSelectingAddress) {
        setIsSelectingAddress(true)
      }

      const addressToUpdate: Address = {
        id: selected.id,
        isDefault: selected.isDefault,
        receiverName: selected.recipient || selected.name || '',
        receiverPhone: selected.phoneNumber || '',
        addressDetail: selected.street,
        ward: `${selected.wardCode}|${selected.ward}`,
        district: `${selected.districtId}|${selected.district}`,
        province: `${selected.provinceId}|${selected.province}`,
        type:
          selected.addressType === 'HOME'
            ? 'English content normalized from the original source text.'
            : 'English content normalized from the original source text.'
      }
      dispatch(
        setShippingInfo({
          provinceId: selected.provinceId?.toString() || '',
          districtId: selected.districtId?.toString() || '',
          wardCode: selected.wardCode || '',
          provinceName: selected.province,
          districtName: selected.district,
          wardName: selected.ward
        })
      )

      setTimeout(() => {
        onSelectExistingAddress(addressToUpdate)
      }, 0)
    }
  }

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between">
          <CardTitle className="flex items-center text-base font-semibold">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            English content normalized from the original source text.
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            {!isSelectingAddress && savedAddresses.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-sm w-full sm:w-auto"
                onClick={() => {
                  setIsSelectingAddress(true)

                  // Clear any previously selected address
                  if (selectedAddressId) {
                    setSelectedAddressId('')
                  }
                }}
              >
                <Book className="h-4 w-4 mr-1.5 flex-shrink-0" />
                English content normalized from the original source text.
              </Button>
            )}
          </div>
        </div>
        <CardDescription className="text-sm font-light mt-2">
          {isSelectingAddress
            ? 'English content normalized from the original source text.'
            : 'English content normalized from the original source text.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="receiverName" className="text-xs font-medium">
                English content normalized from the original source text.
              </Label>
              <Input
                id="receiverName"
                name="receiverName"
                placeholder="English content normalized from the original source text."
                value={formData.receiverName || ''}
                onChange={handleChange}
                className="text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="receiverPhone" className="text-xs font-medium">
                English content normalized from the original source text.
              </Label>
              <Input
                id="receiverPhone"
                name="receiverPhone"
                placeholder="English content normalized from the original source text."
                value={formData.receiverPhone || ''}
                onChange={handleChange}
                className="text-sm"
                required
              />
            </div>
          </div>

          {isSelectingAddress ? (
            <div className="space-y-3">
              <RadioGroup value={selectedAddressId} onValueChange={handleAddressSelect} className="space-y-3">
                {isLoadingAddresses ? (
                  <p>English content normalized from the original source text.</p>
                ) : (
                  savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors ${
                        selectedAddressId === address.id ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                      <Label htmlFor={address.id} className="flex-1 cursor-pointer space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                            {address.addressType === 'HOME'
                              ? 'English content normalized from the original source text.'
                              : 'English content normalized from the original source text.'}
                          </span>
                          {address.isDefault && (
                            <span className="text-xs text-red-500">
                              English content normalized from the original source text.
                            </span>
                          )}
                        </div>
                        <div className="text-sm">
                          {`${address.street}, ${address.ward}, ${address.district}, ${address.province}`}
                        </div>
                      </Label>
                    </div>
                  ))
                )}
              </RadioGroup>
              <div className="flex items-center">
                <span className="text-sm mr-2">English content normalized from the original source text.</span>
                <Button
                  variant="link"
                  className="text-red-500 font-normal p-0 h-auto text-sm hover:text-red-600"
                  onClick={() => {
                    // Update local state
                    setIsSelectingAddress(false)
                    setSelectedAddressId('')

                    // Clear address data
                    const clearedAddressData: Address = {
                      id: '',
                      receiverName: formData.receiverName,
                      receiverPhone: formData.receiverPhone,
                      addressDetail: '',
                      ward: '',
                      district: '',
                      province: '',
                      type: 'English content normalized from the original source text.',
                      isDefault: false
                    }

                    setTimeout(() => {
                      onSelectExistingAddress(clearedAddressData)
                    }, 0)
                  }}
                >
                  English content normalized from the original source text.
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Address Selection Form */}
              <SimpleAddressSelect
                disabled={false}
                onAddressChange={handleAddressFormChange}
                initialValues={{
                  provinceId: formData.province?.split('|')[0] || '',
                  districtId: formData.district?.split('|')[0] || '',
                  wardCode: formData.ward?.split('|')[0] || ''
                }}
              />

              {/* Specific Address Detail */}
              <div className="space-y-1">
                <Label htmlFor="address" className="text-xs font-medium">
                  English content normalized from the original source text.
                </Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="English content normalized from the original source text."
                  value={formData.address}
                  onChange={handleChange}
                  className="text-sm h-9"
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <Label htmlFor="note" className="text-xs font-medium">
              English content normalized from the original source text.
            </Label>
            <Textarea
              id="note"
              name="note"
              placeholder="English content normalized from the original source text."
              value={formData.note}
              onChange={handleChange}
              className="h-20 text-sm resize-none"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
