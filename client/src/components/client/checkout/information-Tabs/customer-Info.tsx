'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useUserData } from '@/hooks/useGetData-UserLogin';
import { useEffect, useState } from 'react';

interface CustomerInfoProps {
  onDataChange?: (data: {
    fullName: string;
    phoneNumber: string;
    email: string;
    saveInfo: boolean;
  }) => void;
  isLoggedIn?: boolean;
}

export function CustomerInfo({ onDataChange, isLoggedIn = true }: CustomerInfoProps) {
  const userData = useUserData();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    saveInfo: false
  });

  // English content normalized from the original source text.
  useEffect(() => {
    if (userData) {
      // English content normalized from the original source text.
      let fullName = userData.name;
      if (!fullName) {
        const firstName = userData.firstName || '';
        const lastName = userData.lastName || '';
        fullName = [firstName, lastName].filter(Boolean).join(' ');
      }

      // English content normalized from the original source text.
      const updatedData = {
        ...formData,
        fullName: userData.name || '',
        phoneNumber: userData.phoneNumber || '',
        email: userData.email || ''
      };

      console.log('[CustomerInfo] Setting user data from Redux:', updatedData);
      setFormData(updatedData);

      // English content normalized from the original source text.
      if (onDataChange) {
        onDataChange(updatedData);
      }
    }
  }, [userData]);

  // English content normalized from the original source text.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    const updatedData = {
      ...formData,
      [name]: newValue
    };

    setFormData(updatedData);

    // English content normalized from the original source text.
    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  // English content normalized from the original source text.
  const handleCheckboxChange = (checked: boolean) => {
    const updatedData = {
      ...formData,
      saveInfo: checked
    };

    setFormData(updatedData);

    // English content normalized from the original source text.
    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  return (
    <Card className='shadow-none'>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-base font-semibold">
          <User className="h-4 w-4 mr-2" />English content normalized from the original source text.</CardTitle>
        <CardDescription className="text-sm font-light">
          {isLoggedIn
            ? "English content normalized from the original source text."
            : "English content normalized from the original source text."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="fullName" className="text-xs font-medium">English content normalized from the original source text.</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="English content normalized from the original source text."
                value={formData.fullName}
                onChange={handleChange}
                readOnly={isLoggedIn}
                className={`${isLoggedIn ? "bg-gray-100" : ""} text-sm`}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phoneNumber" className="text-xs font-medium">English content normalized from the original source text.</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="English content normalized from the original source text."
                value={formData.phoneNumber}
                onChange={handleChange}
                readOnly={isLoggedIn}
                className={`${isLoggedIn ? "bg-gray-100" : ""} text-sm`}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-medium">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              readOnly={isLoggedIn}
              className={`${isLoggedIn ? "bg-gray-100" : ""} text-sm`}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
