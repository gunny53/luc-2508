'use client'

import { useCheckDevice } from '@/hooks/use-check-devices'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const CartDesktop = dynamic(() => import('../cart/desktop/cart-index'), {
  loading: () => <Skeleton className="w-full h-full" />,
  ssr: false
})
const CartMobile = dynamic(() => import('../cart/mobile/cart-index-mobile'), {
  loading: () => <Skeleton className="w-full h-full" />,
  ssr: false
})

export function CartMain() {
  const deviceType = useCheckDevice()
  const isMobileView = deviceType === 'mobile'

  return <div className="w-full h-full">{isMobileView ? <CartMobile /> : <CartDesktop />}</div>
}
