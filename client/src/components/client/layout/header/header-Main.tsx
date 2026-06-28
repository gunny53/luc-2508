'use client'

import { Header as DesktopHeader } from './desktop/desktop-index'
import { MobileHeader } from './moblie/moblie-index'
import { useResponsive } from '@/hooks/use-responsive'
import './style.css'

export function Header() {
  const { isMobile } = useResponsive()

  return (
    <>
      {isMobile ? (
        <header
          className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500"
          style={{ height: 'auto', minHeight: '60px' }}
        >
          <MobileHeader />
        </header>
      ) : (
        <DesktopHeader />
      )}
    </>
  )
}
