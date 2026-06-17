'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { CustomerInfo } from './customer-Info';
import { ShippingAddress } from './shipping-Address';
import { useCheckout } from '../hooks/useCheckout';
import { CustomerFormData, Address, ShippingAddress as ShippingAddressType } from '@/types/checkout.interface';
import { toast } from 'sonner';
import { setCommonInfo } from '@/store/features/checkout/ordersSilde';

interface InformationTabsProps {
  onNext: () => void;
}

export function InformationTabs({ onNext }: InformationTabsProps) {
  const dispatch = useDispatch();
  const { updateReceiverInfo, updateShippingAddress, updateShippingMethod } = useCheckout();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // English content normalized from the original source text.
  const [tempNewAddressData, setTempNewAddressData] = useState({
    province: '',
    district: '',
    ward: '',
    address: ''
  });

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
  });

  // English content normalized from the original source text.
  useEffect(() => {
    if (!selectedAddress) {
      // English content normalized from the original source text.
      if (tempNewAddressData.province || tempNewAddressData.district || tempNewAddressData.ward || tempNewAddressData.address) {
        setFormData(prev => ({
          ...prev,
          province: tempNewAddressData.province,
          district: tempNewAddressData.district,
          ward: tempNewAddressData.ward,
          address: tempNewAddressData.address
        }));
      }
    }
  }, [selectedAddress, tempNewAddressData]);

  // English content normalized from the original source text.
  const handleCustomerInfoChange = (customerData: {
    fullName: string;
    phoneNumber: string;
    email: string;
    saveInfo: boolean;
  }) => {
    setFormData(prev => ({
      ...prev,
      ...customerData
    }));
  };

  const handleChange = (nameOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => {
    let name: string, val: string;

    if (typeof nameOrEvent === 'string') {
      name = nameOrEvent;
      val = value || '';
    } else {
      name = nameOrEvent.target.name;
      val = nameOrEvent.target.value;
    }

    setFormData(prev => ({ ...prev, [name]: val }));

    // Only reset selected address if user manually changes address fields (not programmatic changes)
    if (['province', 'district', 'ward', 'address'].includes(name) && selectedAddress?.id) {
      setSelectedAddress(null);
    }
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, deliveryMethod: value }));
  };

  const handleSelectExistingAddress = (address: Address) => {
    // Prevent unnecessary updates
    const currentAddressString = JSON.stringify(selectedAddress);
    const newAddressString = JSON.stringify(address);

    if (currentAddressString === newAddressString) {
      return;
    }

    // English content normalized from the original source text.
    const isExistingAddress = address.id && address.id.length > 0;

    // English content normalized from the original source text.
    const safeAddressDetail = address.addressDetail || '';
    const safeProvince = address.province || '';
    const safeDistrict = address.district || '';
    const safeWard = address.ward || '';

    if (!isExistingAddress) {
      // English content normalized from the original source text.
      setTempNewAddressData({
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
        address: formData.address
      });
    }

    // Update selectedAddress first
    setSelectedAddress(isExistingAddress ? address : null);

    // Then batch the form data update
    setFormData(prev => ({
      ...prev,
      receiverName: address.receiverName || prev.receiverName,
      receiverPhone: address.receiverPhone || prev.receiverPhone,
      province: isExistingAddress ? safeProvince : '',
      district: isExistingAddress ? safeDistrict : '',
      ward: isExistingAddress ? safeWard : '',
      address: isExistingAddress ? safeAddressDetail : ''
    }));
  };

  const handleSubmit = () => {
    // English content normalized from the original source text.
    const errors: string[] = [];

    // English content normalized from the original source text.
    const receiverName = formData.receiverName || formData.fullName;
    if (!receiverName || receiverName.trim() === '') {
      errors.push('English content normalized from the original source text.');
    }

    // English content normalized from the original source text.
    const receiverPhone = formData.receiverPhone || formData.phoneNumber;
    if (!receiverPhone || receiverPhone.trim() === '') {
      errors.push('English content normalized from the original source text.');
    } else if (!/^[0-9]{10,11}$/.test(receiverPhone.replace(/\s/g, ''))) {
      errors.push('English content normalized from the original source text.');
    }

    // English content normalized from the original source text.

    if (selectedAddress) {
      // English content normalized from the original source text.
      if (!selectedAddress.addressDetail) {
        // Don't block submission for debugging
      }
    } else {
      // English content normalized from the original source text.
      if (!formData.address || formData.address.trim() === '') {
        errors.push('English content normalized from the original source text.');
      }
      // For debugging, don't block on these fields
      if (!formData.province) {
        // English content normalized from the original source text.
      }
      if (!formData.district) {
        // English content normalized from the original source text.
      }
      if (!formData.ward) {
        // English content normalized from the original source text.
      }
    }

    // English content normalized from the original source text.
    if (errors.length > 0) {
      toast.error(errors[0]); // English content normalized from the original source text.
      return;
    }

    // English content normalized from the original source text.
    const parseLocationValue = (value: string) => {
      if (!value) return '';
      const parts = value.split('|');
      return parts[1] || parts[0]; // English content normalized from the original source text.
    };

    // English content normalized from the original source text.
    const parseLocationId = (value: string) => {
      if (!value) return null;
      const parts = value.split('|');
      return parseInt(parts[0]) || null;
    };

    // English content normalized from the original source text.
    const fullAddress = selectedAddress
      ? `${selectedAddress.addressDetail}, ${parseLocationValue(selectedAddress.ward)}, ${parseLocationValue(selectedAddress.district)}, ${parseLocationValue(selectedAddress.province)}`
      : [
          formData.address,
          parseLocationValue(formData.ward),
          parseLocationValue(formData.district),
          parseLocationValue(formData.province)
        ].filter(Boolean).join(', ');

    // English content normalized from the original source text.
    let provinceId: number | null = null;
    let districtId: number | null = null;
    let wardCode: string = '';

    if (selectedAddress) {
      // English content normalized from the original source text.
      // English content normalized from the original source text.
      const addressParts = selectedAddress.province?.split('|') || [];
      const districtParts = selectedAddress.district?.split('|') || [];
      const wardParts = selectedAddress.ward?.split('|') || [];

      provinceId = addressParts.length > 0 ? parseInt(addressParts[0]) || null : null;
      districtId = districtParts.length > 0 ? parseInt(districtParts[0]) || null : null;
      wardCode = wardParts.length > 0 ? wardParts[0] : '';
    } else {
      // English content normalized from the original source text.
      provinceId = parseLocationId(formData.province);
      districtId = parseLocationId(formData.district);
      wardCode = formData.ward ? formData.ward.split('|')[0] : '';
    }

    // English content normalized from the original source text.
    const receiverInfo = {
      name: receiverName.trim(),
      phone: receiverPhone.trim(),
      address: fullAddress,
    };
    updateReceiverInfo(receiverInfo);

    // English content normalized from the original source text.
    // English content normalized from the original source text.
    if (provinceId && districtId && wardCode) {
      const receiverData = {
        name: receiverName.trim(),
        phone: receiverPhone.trim(),
        address: fullAddress,
        provinceId: provinceId,
        districtId: districtId,
        wardCode: wardCode
      };

      dispatch(setCommonInfo({
        receiver: receiverData
      }));

      console.log('🏠 Updated receiver info to Redux:', receiverData);
    } else {
      // English content normalized from the original source text.
      const basicReceiverData = {
        name: receiverName.trim(),
        phone: receiverPhone.trim(),
        address: fullAddress,
        provinceId: 204, // Default fallback
        districtId: 1536, // Default fallback
        wardCode: wardCode || '480121' // Default fallback
      };

      dispatch(setCommonInfo({
        receiver: basicReceiverData
      }));

      console.log('🏠 Updated basic receiver info to Redux (using defaults):', basicReceiverData);
    }

    // English content normalized from the original source text.
    const shippingAddress = {
      receiverName: formData.receiverName || formData.fullName,
      receiverPhone: formData.receiverPhone || formData.phoneNumber,

      ...(selectedAddress
        ? {
            addressDetail: selectedAddress.addressDetail,
            // English content normalized from the original source text.
            ward: selectedAddress.ward,
            district: selectedAddress.district,
            province: selectedAddress.province,
            address: fullAddress
          }
        : {
            addressDetail: formData.address || '',
            // English content normalized from the original source text.
            ward: formData.ward, // English content normalized from the original source text.
            district: formData.district, // English content normalized from the original source text.
            province: formData.province, // English content normalized from the original source text.
            address: fullAddress
          })
    };

    // Update shipping address

    // Ensure addressDetail is not empty
    if (!shippingAddress.addressDetail && shippingAddress.address) {
      shippingAddress.addressDetail = shippingAddress.address;
    }

    updateShippingAddress(shippingAddress);

    // English content normalized from the original source text.
    if (formData.saveInfo) {
      localStorage.setItem('checkoutInfo', JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        receiverName: formData.receiverName,
        receiverPhone: formData.receiverPhone,
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
        address: formData.address,
      }));
    }

    onNext();
  };

  // English content normalized from the original source text.
  const isLoggedIn = true;

  return (
    <div className="space-y-4">
      <form id="checkout-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <CustomerInfo
          onDataChange={handleCustomerInfoChange}
          isLoggedIn={isLoggedIn}
        />

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
  );
}
