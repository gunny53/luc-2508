'use client'

import ClientLayoutWrapper from '@/components/client/layout/client-layout-wrapper'
import { useResponsive } from '@/hooks/use-responsive'
import { CheckoutProvider } from '@/providers/checkout-context'

interface CheckoutLayoutProps {
  children: React.ReactNode
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  const { isMobile } = useResponsive()

  return (
    <CheckoutProvider>
      <ClientLayoutWrapper hideCommit hideHero hideFooter topContent maxWidth={1650}>
        <div className={`w-full ${isMobile ? 'min-h-screen flex flex-col' : 'min-h-screen'}`}>
          <main className={`flex-1 ${isMobile ? '' : 'pb-4'}`}>
            <div className="w-full">{children}</div>
          </main>
        </div>
      </ClientLayoutWrapper>
    </CheckoutProvider>
  )
}
