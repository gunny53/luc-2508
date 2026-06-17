'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// English content normalized from the original source text.
export type DropdownType = 'categories' | 'search' | 'cart' | 'user' | 'profile' | 'language' | 'none';

// English content normalized from the original source text.
interface DropdownContextType {
  openDropdown: DropdownType;
  setOpenDropdown: (type: DropdownType) => void;
}

// English content normalized from the original source text.
const DropdownContext = createContext<DropdownContextType>({
  openDropdown: 'none',
  setOpenDropdown: () => {},
});

// English content normalized from the original source text.
export function DropdownProvider({ children }: { children: React.ReactNode }) {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>('none');

  // Update overlay visibility without locking scroll
  useEffect(() => {
    const overlayElement = document.querySelector('.body-overlay');
    const shouldShowOverlay = openDropdown !== 'none' && openDropdown !== 'cart';

    if (shouldShowOverlay) {
      overlayElement?.classList.add('overlay-active');
    } else {
      overlayElement?.classList.remove('overlay-active');
    }
  }, [openDropdown]);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideClick = !(
        event.target instanceof Element &&
        (
          event.target.closest('.category-hover-container') ||
          event.target.closest('.search-container') ||
          event.target.closest('.profile-container') ||
          event.target.closest('.language-container') ||
          event.target.closest('.cart-container')
        )
      );

      if (isOutsideClick) {
        setOpenDropdown('none');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <DropdownContext.Provider value={{ openDropdown, setOpenDropdown }}>
      {children}
    </DropdownContext.Provider>
  );
}

// English content normalized from the original source text.
export function useDropdown() {
  return useContext(DropdownContext);
}
