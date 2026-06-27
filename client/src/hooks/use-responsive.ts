























'use client'

import { useEffect, useState } from 'react'

export function useResponsive() {
  const getDevice = () => {
    if (typeof window === 'undefined') return { isMobile: false, isTablet: false, isDesktop: false }
    const width = window.innerWidth
    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024
    }
  }

  const [device, setDevice] = useState(getDevice)

  useEffect(() => {
    const handleResize = () => setDevice(getDevice())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return device
}
