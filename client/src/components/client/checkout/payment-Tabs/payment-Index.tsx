'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { PaymentMethods } from './payment-Methods';
import { RecipientInfo } from './recipient-Info';
import { ProductsInfo } from './products-Info';
import { useCheckout } from '../hooks/useCheckout';
import { Button } from '@/components/ui/button';

interface PaymentTabsProps {
  onPrevious: () => void;
}

export function PaymentTabs({ onPrevious }: PaymentTabsProps) {
  const { state, updatePaymentMethod } = useCheckout();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Debug: Log state whenever it changes
  useEffect(() => {
    console.log('[PaymentTabs] Current state:', state);
    console.log('[PaymentTabs] ShippingAddress:', state.shippingAddress);
  }, [state]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
    }, 2000);
  };

  const handlePaymentMethodChange = (value: string) => {
    console.log('🔄 Payment method changed to:', value);
    updatePaymentMethod(value);
  };

  if (isCompleted) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-xl font-medium mb-2">English content normalized from the original source text.</h2>
              <p className="text-gray-500 mb-6">English content normalized from the original source text.</p>
              <div className="text-left bg-gray-50 p-4 rounded-md w-full max-w-md">
                <p className="text-sm mb-1"><span className="font-medium">English content normalized from the original source text.</span> #ORD123456789</p>
                <p className="text-sm mb-1"><span className="font-medium">English content normalized from the original source text.</span> {new Date().toLocaleDateString('vi-VN')}</p>
                <p className="text-sm"><span className="font-medium">English content normalized from the original source text.</span> {state.paymentMethod === 'cod' ? 'English content normalized from the original source text.' : 'English content normalized from the original source text.'}</p>
              </div>
              <div className="mt-8 flex gap-4">
                <Button variant="outline" asChild>
                  <a href="/account/orders">English content normalized from the original source text.</a>
                </Button>
                <Button asChild>
                  <a href="/">English content normalized from the original source text.</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* English content normalized from the original source text. */}
      {state.shippingAddress ? (
        <RecipientInfo
          shippingAddress={{
            addressDetail: state.shippingAddress.addressDetail || '',
            ward: state.shippingAddress.ward || '',
            district: state.shippingAddress.district || '',
            province: state.shippingAddress.province || '',
            address: state.shippingAddress.address || '',
            receiverName: state.shippingAddress.receiverName || '',
            receiverPhone: state.shippingAddress.receiverPhone || '',
          }}
          onEdit={onPrevious}
        />
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">English content normalized from the original source text.</p>
          <Button
            variant="outline"
            onClick={onPrevious}
            className="mt-2"
          >English content normalized from the original source text.</Button>
        </div>
      )}

      {/* English content normalized from the original source text. */}
      <ProductsInfo />

      {/* English content normalized from the original source text. */}
      <PaymentMethods
        paymentMethod={state.paymentMethod || ''}
        handlePaymentMethodChange={handlePaymentMethodChange}
      />
    </div>
  );
}
