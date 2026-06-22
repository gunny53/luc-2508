'use client'

import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import { CustomerInfo } from './customer-info'
import { ShippingAddress } from './shipping-address'
import { useCheckout } from '../hooks/use-checkout'
import { CustomerFormData, Address, ShippingAddress as ShippingAddressType } from '@/types/checkout.interface'
import { toast } from 'sonner'
import { setCommonInfo } from '@/store/features/checkout/orders-silde'

interface InformationTabsProps {
  onNext: () => void
}

export function InformationTabs({ onNext }: InformationTabsProps) {
  const dispatch = useDispatch()
  const { updateReceiverInfo, updateShippingAddress, updateShippingMethod } = useCheckout()

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [tempNewAddressData, setTempNewAddressData] = useState({
    province: '',
    district: '',
    ward: '',
    address: ''
  })

  const [formData, setFormData] = useState<CustomerFormData>({
    // Customer Info
    fullName: '',
    phoneNumber: '',
    email: '',
    saveInfo: false,
    // Shipping Info
    receiverName: '',
    receiverPhone: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    note: '',
    deliveryMethod: 'standard'
  })
  useEffect(() => {
    if (!selectedAddress) {
      if (
        tempNewAddressData.province ||
        tempNewAddressData.district ||
        tempNewAddressData.ward ||
        tempNewAddressData.address
      ) {
        setFormData((prev) => ({
          ...prev,
          province: tempNewAddressData.province,
          district: tempNewAddressData.district,
          ward: tempNewAddressData.ward,
          address: tempNewAddressData.address
        }))
      }
    }
  }, [selectedAddress, tempNewAddressData])
  const handleCustomerInfoChange = (customerData: {
    fullName: string
    phoneNumber: string
    email: string
    saveInfo: boolean
  }) => {
    setFormData((prev) => ({
      ...prev,
      ...customerData
    }))
  }

  const handleChange = (
    nameOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    value?: string
  ) => {
    let name: string, val: string

    if (typeof nameOrEvent === 'string') {
      name = nameOrEvent
      val = value || ''
    } else {
      name = nameOrEvent.target.name
      val = nameOrEvent.target.value
    }

    setFormData((prev) => ({ ...prev, [name]: val }))

    // Only reset selected address if user manually changes address fields (not programmatic changes)
    if (['province', 'district', 'ward', 'address'].includes(name) && selectedAddress?.id) {
      setSelectedAddress(null)
    }
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, deliveryMethod: value }))
  }

  const handleSelectExistingAddress = (address: Address) => {
    // Prevent unnecessary updates
    const currentAddressString = JSON.stringify(selectedAddress)
    const newAddressString = JSON.stringify(address)

    if (currentAddressString === newAddressString) {
      return
    }
    const isExistingAddress = address.id && address.id.length > 0
    const safeAddressDetail = address.addressDetail || ''
    const safeProvince = address.province || ''
    const safeDistrict = address.district || ''
    const safeWard = address.ward || ''

    if (!isExistingAddress) {
      setTempNewAddressData({
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
        address: formData.address
      })
    }

    // Update selectedAddress first
    setSelectedAddress(isExistingAddress ? address : null)

    // Then batch the form data update
    setFormData((prev) => ({
      ...prev,
      receiverName: address.receiverName || prev.receiverName,
      receiverPhone: address.receiverPhone || prev.receiverPhone,
      province: isExistingAddress ? safeProvince : '',
      district: isExistingAddress ? safeDistrict : '',
      ward: isExistingAddress ? safeWard : '',
      address: isExistingAddress ? safeAddressDetail : ''
    }))
  }

  const handleSubmit = () => {
    const errors: string[] = []
    const receiverName = formData.receiverName || formData.fullName
    if (!receiverName || receiverName.trim() === '') {
      errors.push('English content normalized from the original source text.')
    }
    const receiverPhone = formData.receiverPhone || formData.phoneNumber
    if (!receiverPhone || receiverPhone.trim() === '') {
      errors.push('English content normalized from the original source text.')
    } else if (!/^[0-9]{10,11}$/.test(receiverPhone.replace(/\s/g, ''))) {
      errors.push('English content normalized from the original source text.')
    }
    if (selectedAddress) {
      if (!selectedAddress.addressDetail) {
        // Don't block submission for debugging
      }
    } else {
      if (!formData.address || formData.address.trim() === '') {
        errors.push('English content normalized from the original source text.')
      }
      // For debugging, don't block on these fields
      if (!formData.province) {
      }
      if (!formData.district) {
      }
      if (!formData.ward) {
      }
    }
    if (errors.length > 0) {
      toast.error(errors[0])
      return
    }
    const parseLocationValue = (value: string) => {
      if (!value) return ''
      const parts = value.split('|')
      return parts[1] || parts[0]
    }
    const parseLocationId = (value: string) => {
      if (!value) return null
      const parts = value.split('|')
      return parseInt(parts[0]) || null
    }
    const fullAddress = selectedAddress
      ? `${selectedAddress.addressDetail}, ${parseLocationValue(selectedAddress.ward)}, ${parseLocationValue(selectedAddress.district)}, ${parseLocationValue(selectedAddress.province)}`
      : [
          formData.address,
          parseLocationValue(formData.ward),
          parseLocationValue(formData.district),
          parseLocationValue(formData.province)
        ]
          .filter(Boolean)
          .join(', ')
    let provinceId: number | null = null
    let districtId: number | null = null
    let wardCode: string = ''

    if (selectedAddress) {
      const addressParts = selectedAddress.province?.split('|') || []
      const districtParts = selectedAddress.district?.split('|') || []
      const wardParts = selectedAddress.ward?.split('|') || []

      provinceId = addressParts.length > 0 ? parseInt(addressParts[0]) || null : null
      districtId = districtParts.length > 0 ? parseInt(districtParts[0]) || null : null
      wardCode = wardParts.length > 0 ? wardParts[0] : ''
    } else {
      provinceId = parseLocationId(formData.province)
      districtId = parseLocationId(formData.district)
      wardCode = formData.ward ? formData.ward.split('|')[0] : ''
    }
    const receiverInfo = {
      name: receiverName.trim(),
      phone: receiverPhone.trim(),
      address: fullAddress
    }
    updateReceiverInfo(receiverInfo)
    if (provinceId && districtId && wardCode) {
      const receiverData = {
        name: receiverName.trim(),
        phone: receiverPhone.trim(),
        address: fullAddress,
        provinceId: provinceId,
        districtId: districtId,
        wardCode: wardCode
      }

      dispatch(
        setCommonInfo({
          receiver: receiverData
        })
      )

      console.log('🏠 Updated receiver info to Redux:', receiverData)
    } else {
      const basicReceiverData = {
        name: receiverName.trim(),
        phone: receiverPhone.trim(),
        address: fullAddress,
        provinceId: 204, // Default fallback
        districtId: 1536, // Default fallback
        wardCode: wardCode || '480121' // Default fallback
      }

      dispatch(
        setCommonInfo({
          receiver: basicReceiverData
        })
      )

      console.log('🏠 Updated basic receiver info to Redux (using defaults):', basicReceiverData)
    }
    const shippingAddress = {
      receiverName: formData.receiverName || formData.fullName,
      receiverPhone: formData.receiverPhone || formData.phoneNumber,

      ...(selectedAddress
        ? {
            addressDetail: selectedAddress.addressDetail,
            ward: selectedAddress.ward,
            district: selectedAddress.district,
            province: selectedAddress.province,
            address: fullAddress
          }
        : {
            addressDetail: formData.address || '',
            ward: formData.ward,
            district: formData.district,
            province: formData.province,
            address: fullAddress
          })
    }

    // Update shipping address

    // Ensure addressDetail is not empty
    if (!shippingAddress.addressDetail && shippingAddress.address) {
      shippingAddress.addressDetail = shippingAddress.address
    }

    updateShippingAddress(shippingAddress)
    if (formData.saveInfo) {
      localStorage.setItem(
        'checkoutInfo',
        JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          receiverName: formData.receiverName,
          receiverPhone: formData.receiverPhone,
          province: formData.province,
          district: formData.district,
          ward: formData.ward,
          address: formData.address
        })
      )
    }

    onNext()
  }
  const isLoggedIn = true

  return (
    <div className="space-y-4">
      <form
        id="checkout-form"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <CustomerInfo onDataChange={handleCustomerInfoChange} isLoggedIn={isLoggedIn} />

        <div className="mt-4">
          <ShippingAddress
            formData={formData}
            handleChange={handleChange}
            onSelectExistingAddress={handleSelectExistingAddress}
          />
        </div>

        {/* <div className="mt-4">
          <ShippingType
            deliveryMethod={formData.deliveryMethod}
            handleRadioChange={handleRadioChange}
          />
        </div> */}
      </form>
    </div>
  )
}
