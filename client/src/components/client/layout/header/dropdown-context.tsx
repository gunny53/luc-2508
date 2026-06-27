'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
export type DropdownType = 'categories' | 'search' | 'cart' | 'user' | 'profile' | 'language' | 'none'
interface DropdownContextType {
  openDropdown: DropdownType
  setOpenDropdown: (type: DropdownType) => void
}
const DropdownContext = createContext<DropdownContextType>({
  openDropdown: 'none',
  setOpenDropdown: () => {}
})
export function DropdownProvider({ children }: { children: React.ReactNode }) {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>('none')

  
  useEffect(() => {
    const overlayElement = document.querySelector('.body-overlay')
    const shouldShowOverlay = openDropdown !== 'none' && openDropdown !== 'cart'

    if (shouldShowOverlay) {
      overlayElement?.classList.add('overlay-active')
    } else {
      overlayElement?.classList.remove('overlay-active')
    }
  }, [openDropdown])

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideClick = !(
        event.target instanceof Element &&
        (event.target.closest('.category-hover-container') ||
          event.target.closest('.search-container') ||
          event.target.closest('.profile-container') ||
          event.target.closest('.language-container') ||
          event.target.closest('.cart-container'))
      )

      if (isOutsideClick) {
        setOpenDropdown('none')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return <DropdownContext.Provider value={{ openDropdown, setOpenDropdown }}>{children}</DropdownContext.Provider>
}
export function useDropdown() {
  return useContext(DropdownContext)
}
