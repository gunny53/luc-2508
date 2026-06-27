'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from 'lucide-react'
import { useUserData } from '@/hooks/use-get-data-user-login'
import { useEffect, useState } from 'react'

interface CustomerInfoProps {
  onDataChange?: (data: { fullName: string; phoneNumber: string; email: string; saveInfo: boolean }) => void
  isLoggedIn?: boolean
}

export function CustomerInfo({ onDataChange, isLoggedIn = true }: CustomerInfoProps) {
  const userData = useUserData()
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    saveInfo: false
  })
  useEffect(() => {
    if (userData) {
      let fullName = userData.name
      if (!fullName) {
        const firstName = userData.firstName || ''
        const lastName = userData.lastName || ''
        fullName = [firstName, lastName].filter(Boolean).join(' ')
      }
      const updatedData = {
        ...formData,
        fullName: userData.name || '',
        phoneNumber: userData.phoneNumber || '',
        email: userData.email || ''
      }

      console.log('[CustomerInfo] Setting user data from Redux:', updatedData)
      setFormData(updatedData)
      if (onDataChange) {
        onDataChange(updatedData)
      }
    }
  }, [userData])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    const updatedData = {
      ...formData,
      [name]: newValue
    }

    setFormData(updatedData)
    if (onDataChange) {
      onDataChange(updatedData)
    }
  }
  const handleCheckboxChange = (checked: boolean) => {
    const updatedData = {
      ...formData,
      saveInfo: checked
    }

    setFormData(updatedData)
    if (onDataChange) {
      onDataChange(updatedData)
    }
  }

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-base font-semibold">
          <User className="h-4 w-4 mr-2" />
          Thanh to?n
        </CardTitle>
        <CardDescription className="text-sm font-light">
          {isLoggedIn
            ? 'Thanh to?n'
            : 'Thanh to?n'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="fullName" className="text-xs font-medium">
                Thanh to?n
              </Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Thanh to?n"
                value={formData.fullName}
                onChange={handleChange}
                readOnly={isLoggedIn}
                className={`${isLoggedIn ? 'bg-gray-100' : ''} text-sm`}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phoneNumber" className="text-xs font-medium">
                Thanh to?n
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Thanh to?n"
                value={formData.phoneNumber}
                onChange={handleChange}
                readOnly={isLoggedIn}
                className={`${isLoggedIn ? 'bg-gray-100' : ''} text-sm`}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              readOnly={isLoggedIn}
              className={`${isLoggedIn ? 'bg-gray-100' : ''} text-sm`}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
