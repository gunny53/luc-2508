'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CheckoutHeader } from './checkout-Header';
import { CheckoutSteps } from './checkout-Steps';
import { InformationTabs } from './information-Tabs/information-Index';
import { PaymentTabs } from './payment-Tabs/payment-Index';
import { FooterSection } from './shared/footer-Section';
import { useCheckout } from './hooks/useCheckout';
import { CheckoutStep } from './checkout-Steps';
import { QrSepay } from './payment/qrSepay';
import { PaymentCod } from './payment/payment-cod';
import { useRouter } from 'next/navigation';
import { useECSiteSocket } from '@/providers/ECSiteSocketProvider';
import { orderService } from '@/services/orderService';
import { toast } from 'sonner';
import { OrderStatus } from '@/types/order.interface';
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { clearCheckoutState } from '@/store/features/checkout/ordersSilde';


interface CheckoutMainProps {
  cartItemIds?: string[];
}

export function CheckoutMain({ cartItemIds = [] }: CheckoutMainProps) {
  // English content normalized from the original source text.
  const { state, goToStep, handleCreateOrder, isSubmitting } = useCheckout();
  const router = useRouter();
  const dispatch = useDispatch();
  const { connect, disconnect, payments, isConnected } = useECSiteSocket();

  // Debug log cartItemIds
  console.log('🛍️ CheckoutMain - Received cartItemIds:', {
    cartItemIds,
    count: cartItemIds.length,
    isValid: cartItemIds.length > 0
  });

  // English content normalized from the original source text.
  const [showQrSepay, setShowQrSepay] = useState(false);
  const [showCodPayment, setShowCodPayment] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectingTo, setRedirectingTo] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [activePaymentId, setActivePaymentId] = useState<number | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<{
    success: boolean;
    paymentMethod?: string;
    orderData?: {
      [key: string]: any;
      orders?: any[];
      paymentId?: number;
    };
    paymentId?: number;
    orderId?: string;
    paymentUrl?: string;
    error?: string;
  } | null>(null);

  // English content normalized from the original source text.
  const handleStepChange = (step: CheckoutStep) => {
    goToStep(step);
  };

  // English content normalized from the original source text.
  const handleNext = async () => {
    if (state.step === 'information') {
      // English content normalized from the original source text.
      const form = document.getElementById('checkout-form') as HTMLFormElement;
      if (form) {
        // English content normalized from the original source text.
        form.requestSubmit();
      }
    } else if (state.step === 'payment') {
      // English content normalized from the original source text.
      const result = await handleCreateOrder(totalAmount);

      // English content normalized from the original source text.
      if (result && result.success) {
        // English content normalized from the original source text.
        setOrderResult(result);

        // English content normalized from the original source text.
        if (result.paymentMethod === 'sepay') {
          // English content normalized from the original source text.
          setShowQrSepay(true);
        } else if (result.paymentMethod === 'vnpay' && result.paymentUrl && result.orderId) {
          // English content normalized from the original source text.
          setIsRedirecting(true);
          setRedirectingTo('vnpay');

          // English content normalized from the original source text.
          if (result.paymentId) {
            setActivePaymentId(result.paymentId);
            setActiveOrderId(result.orderId || '');
            console.log(`[VNPay] Connecting to socket with paymentId: ${result.paymentId}`);
            connect(result.paymentId.toString()); // Convert to string for connect function
          }

          // English content normalized from the original source text.
          sessionStorage.setItem('lastOrderId', result.orderId || '');
          sessionStorage.setItem('orderAmount', totalAmount.toString());

          // English content normalized from the original source text.
          setTimeout(() => {
            // English content normalized from the original source text.
            window.location.href = result.paymentUrl as string;
          }, 1500);
        } else if (result.paymentMethod === 'COD' && result.orderId) {
          // English content normalized from the original source text.
          setShowCodPayment(true);
        } else if (result.orderId) {
          // English content normalized from the original source text.
          router.push(`/checkout/payment-success?orderId=${result.orderId}&status=success&totalAmount=${totalAmount}`);
        }
      } else {
        console.error('❌ Order creation failed:', result);
      }
    }
  };

  const handlePrevious = () => {
    if (state.step === 'payment') {
      handleStepChange('information');
    }
  };

  // Socket event listener for VNPay payment status
  useEffect(() => {
    if (!payments.length || !activeOrderId || !activePaymentId) return;

    console.log(`[WebSocket] Checking for payment events. Total events: ${payments.length}`);

    const latestPayment = payments[payments.length - 1];

    // Check if the latest payment is a success for the current order
    if (
      latestPayment &&
      latestPayment.orderId === activeOrderId &&
      latestPayment.status === 'success' &&
      latestPayment.gateway === 'vnpay'
    ) {
      console.log('✅ VNPay payment success event received via WebSocket for order:', activeOrderId);
      toast.success('English content normalized from the original source text.');

      // Redirect to success page
      router.push(`/checkout/payment-success?orderId=${activeOrderId}&totalAmount=${totalAmount}`);

      // Disconnect socket after successful payment
      disconnect();
    }
  }, [payments, activeOrderId, activePaymentId, router, totalAmount, disconnect]);

  // Fallback polling mechanism for VNPay payment status
  useEffect(() => {
    if (!activeOrderId || !activePaymentId || !isRedirecting || redirectingTo !== 'vnpay') return;

    let intervalId: NodeJS.Timeout;

    const checkVNPayPaymentStatus = async () => {
      console.log(`[Polling] Checking VNPay payment status for orderId: ${activeOrderId}...`);
      try {
        const order = await orderService.getById(activeOrderId);
        if (order && order.data.status === OrderStatus.PICKUPED) {
          clearInterval(intervalId);
          toast.success('English content normalized from the original source text.');
          router.push(`/checkout/payment-success?orderId=${activeOrderId}&totalAmount=${totalAmount}`);

          // Disconnect socket after successful payment
          disconnect();
        }
      } catch (error) {
        console.error('English content normalized from the original source text.', error);
      }
    };

    // Check every 5 seconds
    intervalId = setInterval(checkVNPayPaymentStatus, 5000);

    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, [activeOrderId, activePaymentId, isRedirecting, redirectingTo, router, totalAmount, disconnect]);

  // Cleanup effect to disconnect socket when component unmounts
  useEffect(() => {
    return () => {
      if (activePaymentId) {
        console.log(`[Cleanup] Disconnecting socket for paymentId: ${activePaymentId}`);
        disconnect();
      }
    };
  }, [activePaymentId, disconnect]);

  // English content normalized from the original source text.
  const handlePaymentConfirm = () => {
    // If we have order ID, redirect to order success page, otherwise go to dashboard
    if (orderResult?.orderId) {
      router.push(`/checkout/payment-success?orderId=${orderResult.orderId}&totalAmount=${totalAmount}`);
    } else {
      router.push('/user/dashboard');
    }
  };

  // English content normalized from the original source text.
  const handlePaymentCancel = () => {
    setShowQrSepay(false);
    setOrderResult(null);
    // English content normalized from the original source text.
  };

  // Helper function to get footer step type
  const getFooterStep = (step: CheckoutStep): 'information' | 'payment' => {
    return step === 'cart' ? 'information' : step;
  };

  // English content normalized from the original source text.
  if (showCodPayment && orderResult && orderResult.orderId) {
    return (
      <PaymentCod
        orderId={orderResult.orderId}
        totalAmount={totalAmount}
        paymentId={orderResult.paymentId}
        orderData={orderResult.orderData}
      />
    );
  }

  // English content normalized from the original source text.
  if (showQrSepay && orderResult && orderResult.paymentId && orderResult.orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <QrSepay
          paymentId={orderResult.paymentId.toString()}
          orderId={orderResult.orderId}
          onPaymentConfirm={handlePaymentConfirm}
          onPaymentCancel={handlePaymentCancel}
        />
      </div>
    );
  }

  // English content normalized from the original source text.
  if (isRedirecting && redirectingTo === 'vnpay' && orderResult && orderResult.paymentUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md mx-auto border-blue-200 shadow-lg">
          <CardHeader className="text-center bg-gradient-to-b from-blue-50 to-white rounded-t-lg">
            <div className="flex justify-center mb-4">
              <Image
                src="/payment-icons/vnpay.svg"
                alt="VNPay Logo"
                width={120}
                height={40}
                className="object-contain"
                onError={(e) => {
                  // English content normalized from the original source text.
                  const target = e.target as HTMLImageElement;
                  target.src = "/payment-logos/vnpay.png";
                }}
              />
            </div>
            <CardTitle className="text-blue-700 text-xl font-bold">English content normalized from the original source text.</CardTitle>
            <CardDescription className="text-gray-600">English content normalized from the original source text.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Loading indicator */}
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>English content normalized from the original source text.</p>
              <p>English content normalized from the original source text.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {/* <CheckoutHeader /> */}

      {/* Main Content */}
      <div className="flex-1 max-w-[1920px] w-full mx-auto px-3 sm:px-4 lg:px-8 2xl:px-12 py-3 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-12">
          {/* Main Form Section */}
          <div className="flex-1 order-1 lg:order-1 min-w-0 lg:max-w-[calc(100%-520px)] xl:max-w-[calc(100%-580px)]">
            {/* Steps */}
            <div className="sticky top-0 z-10 -mx-3 px-3 sm:-mx-4 sm:px-4 lg:static lg:mx-0 lg:px-0 py-2">
              <CheckoutSteps activeStep={state.step} onStepChange={handleStepChange} />
            </div>

            {/* Form Content */}
            <div className="mt-3 lg:mt-4 space-y-4">
              {state.step === 'information' ? (
                <InformationTabs onNext={() => goToStep('payment')} />
              ) : (
                <PaymentTabs onPrevious={() => goToStep('information')} />
              )}
            </div>
          </div>

          {/* Order Summary - Desktop */}
          <div className="hidden lg:block w-full lg:w-[500px] xl:w-[560px] order-2 lg:mt-[72px] flex-shrink-0">
            <div className="sticky top-6">
              <FooterSection
                step={getFooterStep(state.step)}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isSubmitting={isSubmitting}
                onTotalChange={setTotalAmount}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary - Mobile */}
      <div className="lg:hidden sticky bottom-0 left-0 right-0 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="p-3">
          <FooterSection
            variant="mobile"
            step={getFooterStep(state.step)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isSubmitting={isSubmitting}
            onTotalChange={setTotalAmount}
          />
        </div>
      </div>
    </div>
  );
}

// Add cleanup effect to clear checkout state when component unmounts
export function CheckoutMainWithCleanup({ cartItemIds = [] }: CheckoutMainProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Cleanup function - clear state when leaving checkout page
    return () => {
      console.log('🧹 Clearing checkout state on page exit');
      dispatch(clearCheckoutState());
    };
  }, [dispatch]);

  return <CheckoutMain cartItemIds={cartItemIds} />;
}
