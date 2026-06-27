'use client'

import ClientLayoutWrapper from '@/components/client/layout/client-layout-wrapper'
import { useResponsive } from '@/hooks/use-responsive'

interface CartLayoutProps {
  children: React.ReactNode
}

export default function CartLayout({ children }: CartLayoutProps) {
  const { isMobile } = useResponsive()

  return (
    <ClientLayoutWrapper
      hideHeader={isMobile}
      hideCommit
      hideHero
      hideFooter={isMobile}
      
    >
      <div className={`w-full ${isMobile ? 'min-h-screen flex flex-col' : 'min-h-screen'}`}>
        <main className={`flex-1 ${isMobile ? '' : 'pb-4'}`}>
          <div className="w-full">{children}</div>
        </main>
      </div>
    </ClientLayoutWrapper>
  )
}
