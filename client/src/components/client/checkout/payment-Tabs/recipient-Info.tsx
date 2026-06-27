'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Phone, Mail, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUserData } from '@/hooks/use-get-data-user-login'
import { useSelector } from 'react-redux'
import { selectShippingInfo } from '@/store/features/checkout/orders-silde'
import { useEffect } from 'react'

interface RecipientInfoProps {
  shippingAddress: {
    addressDetail?: string
    ward?: string
    district?: string
    province?: string
    address?: string
    receiverName: string
    receiverPhone: string
  }
  onEdit?: () => void
}

export function RecipientInfo({ shippingAddress, onEdit }: RecipientInfoProps) {
  const userData = useUserData()
  const shippingInfo = useSelector(selectShippingInfo)
  useEffect(() => {
    console.log('[RecipientInfo] Received shippingAddress:', shippingAddress)
    console.log('[RecipientInfo] Redux shippingInfo:', shippingInfo)
  }, [shippingAddress, shippingInfo])
  const customerInfo = {
    name: userData?.name || userData?.firstName + ' ' + userData?.lastName || '',
    phone: userData?.phoneNumber || '',
    email: userData?.email || ''
  }

  
  const parseLocationName = (value?: string): string => {
    if (!value) return ''
    console.log('[RecipientInfo] Parsing location value:', value)
    const parts = value.split('|')
    return parts.length > 1 ? parts[1] : value 
  }

  const getFullAddress = () => {
    
    console.log('[RecipientInfo] Getting full address from:', {
      addressDetail: shippingAddress.addressDetail,
      address: shippingAddress.address,
      ward: shippingAddress.ward,
      district: shippingAddress.district,
      province: shippingAddress.province,
      shippingInfo
    })
    if (shippingInfo && shippingAddress.addressDetail) {
      const parts = [
        shippingAddress.addressDetail,
        shippingInfo.wardName || parseLocationName(shippingAddress.ward),
        shippingInfo.districtName || parseLocationName(shippingAddress.district),
        shippingInfo.provinceName || parseLocationName(shippingAddress.province)
      ].filter(Boolean)

      console.log('[RecipientInfo] Address parts from Redux:', parts)

      if (parts.length > 0) {
        return parts.join(', ')
      }
    }

    
    if (shippingAddress.addressDetail) {
      const parts = [
        shippingAddress.addressDetail,
        parseLocationName(shippingAddress.ward),
        parseLocationName(shippingAddress.district),
        parseLocationName(shippingAddress.province)
      ].filter(Boolean)

      console.log('[RecipientInfo] Address parts fallback:', parts)

      if (parts.length > 0) {
        return parts.join(', ')
      }
    }

    
    if (shippingAddress.address && shippingAddress.address.trim() !== '') {
      return shippingAddress.address
    }

    
    return 'Thanh to?n'
  }

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">
            Thanh to?n
          </CardTitle>
          {onEdit && (
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs font-normal" onClick={onEdit}>
              Thanh to?n
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="block sm:hidden space-y-3">
            <div className="space-y-2">
              <div className="flex items-center text-gray-500">
                <User className="h-3.5 w-3.5 mr-1.5" />
                <span>Thanh to?n</span>
              </div>
              <div className="pl-5 font-medium">{customerInfo.name}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-500">
                <Phone className="h-3.5 w-3.5 mr-1.5" />
                <span>Thanh to?n</span>
              </div>
              <div className="pl-5 font-medium">{customerInfo.phone}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-500">
                <Mail className="h-3.5 w-3.5 mr-1.5" />
                <span>Email</span>
              </div>
              <div className="pl-5 font-medium">{customerInfo.email}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-500">
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                <span>Thanh to?n</span>
              </div>
              <div className="pl-5 font-medium">{getFullAddress()}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-500">
                <User className="h-3.5 w-3.5 mr-1.5" />
                <span>Thanh to?n</span>
              </div>
              <div className="pl-5">
                <span className="font-medium">{shippingAddress.receiverName}</span>
                <span className="text-gray-400 mx-1.5">|</span>
                <span className="font-medium">{shippingAddress.receiverPhone}</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:block">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-500">Thanh to?n</span>
              </div>
              <div className="font-medium">{customerInfo.name}</div>

              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-500">Thanh to?n</span>
              </div>
              <div className="font-medium">{customerInfo.phone}</div>

              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-500">Email:</span>
              </div>
              <div className="font-medium">{customerInfo.email}</div>

              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-500">Thanh to?n</span>
              </div>
              <div className="font-medium">{getFullAddress()}</div>

              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-500">Thanh to?n</span>
              </div>
              <div>
                <span className="font-medium">{shippingAddress.receiverName}</span>
                <span className="text-gray-400 mx-2">|</span>
                <span className="font-medium">
                  {shippingAddress.receiverPhone || 'Thanh to?n'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
