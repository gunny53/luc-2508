'use client'

import { ScrollLock } from '@/components/client/layout/scroll-lock'
import { Footer } from '@/components/client/layout/footer/footer'
import HeroSectionWrapper from '@/components/client/landing-page/wrapper/hero-wrapper'
import HeaderWrapper from '@/components/client/layout/header/header-wrapper'
import DesktopCommit from '@/components/client/layout/header/desktop/desktop-commit'
import { useCheckDevice } from '@/hooks/use-check-devices'
import { cn } from '@/lib/utils'

interface ClientLayoutWrapperProps {
  children: React.ReactNode
  hideHeader?: boolean
  hideCommit?: boolean
  hideHero?: boolean
  hideFooter?: boolean
  topContent?: React.ReactNode
  maxWidth?: string | number
  className?: string
}

export default function ClientLayoutWrapper({
  children,
  hideHeader = false,
  hideCommit = false,
  hideHero = false,
  hideFooter = false,
  topContent,
  maxWidth = '1250px',
  className
}: ClientLayoutWrapperProps) {
  const deviceType = useCheckDevice()

  const maxWidthValue = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth

  return (
    <div className="min-h-screen w-full flex flex-col">
      <ScrollLock />

      {}
      {!hideHeader && <HeaderWrapper />}

      {!hideCommit && deviceType !== 'mobile' && <DesktopCommit />}

      {topContent && <div className="w-full">{topContent}</div>}

      {}
      <main className="flex-grow bg-[#F5F5FA]">
        {!hideHero && <HeroSectionWrapper />}
        <div
          className={cn('w-full mx-auto', deviceType !== 'mobile' ? 'px-4 sm:px-6' : '', className)}
          style={{ maxWidth: maxWidthValue }}
        >
          {children}
        </div>
      </main>

      {}
      {!hideFooter && <Footer />}
    </div>
  )
}
