'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// English content normalized from the original source text.
export type DropdownType = 'search' | 'none';

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

  useEffect(() => {
    const overlayElement = document.querySelector('.body-overlay');
    const shouldShowOverlay = openDropdown === 'search';

    if (shouldShowOverlay) {
      overlayElement?.classList.add('overlay-active');
    } else {
      overlayElement?.classList.remove('overlay-active');
    }
  }, [openDropdown]);

  // Close dropdown when click outside search container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideClick = !(
        event.target instanceof Element &&
        event.target.closest('.search-container')
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
