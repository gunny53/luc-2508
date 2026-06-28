'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { SearchInput } from './desktop-search-input'
import { CartDropdown } from './desktop-cart'
import { Categories } from './desktop-categories'
import { DropdownProvider, useDropdown } from '../dropdown-context'
import { ProfileDropdown } from './desktop-profile'
import { ChangeLangs } from './desktop-change-langs'
import { TopBar } from './header-top-bar'
import { ECSiteLogo } from '@/components/brand/ecsite-logo'
import '../style.css'
function HeaderLayout() {
  const { openDropdown, setOpenDropdown } = useDropdown()

  const showOverlay = openDropdown !== 'none' && openDropdown !== 'cart'
  useEffect(() => {
    document.body.style.overflow = ''
  }, [])

  return (
    <>
      <header
        className={`text-white max-h-[125px] h-[75px] text-[13px] relative z-50
          bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 shadow-lg
          transition-all duration-500 ease-in-out hidden md:block`}
      >
        <div className="max-w-[1350px] mx-auto h-full header-container">
          <div className="px-4 h-full flex items-center justify-between gap-4">
            {}
            <ECSiteLogo variant="light" className="header-logo min-w-[130px]" />
            <div className="flex-1 max-w-[1000px] flex flex-col">
              <div className="flex items-center gap-4">
                <div className="header-item transition-all duration-300 ease-in-out">
                  <Categories />
                </div>
                <div className="header-item flex-1 transition-all duration-300 ease-in-out">
                  <SearchInput />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="header-item transition-all duration-300 ease-in-out">
                <ProfileDropdown />
              </div>
              <div className="header-item transition-all duration-300 ease-in-out">
                <ChangeLangs />
              </div>
              <div className="header-item transition-all duration-300 ease-in-out">
                <CartDropdown />
              </div>
            </div>
          </div>
        </div>
      </header>
      {}
      <div className="body-overlay" />
    </>
  )
}
export function Header() {
  return (
    <>
      <TopBar />
      <DropdownProvider>
        <HeaderLayout />
      </DropdownProvider>
    </>
  )
}
