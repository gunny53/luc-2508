
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { CgMenuLeft } from 'react-icons/cg'

import { CartDropdown } from '../desktop/desktop-cart'
import { ProfileDropdown } from './mobile-profile'
import { DropdownProvider } from '../dropdown-context'
import { MobileSearchInput } from './moblie-search-input'
import '../style.css'
import { MobileCategories } from './moblie-categories'
import Link from 'next/link'

export function MobileHeader() {
  const [categories, setCategories] = useState<any[]>([])

  return (
    <DropdownProvider>
      <header
        className="fixed top-0 left-0 right-0 z-[999] w-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 shadow-lg text-white text-[13px] py-2.5 md:hidden"
        style={{
          minHeight: '88px'
        }}
      >
        <div className="flex flex-col gap-2 overflow-visible">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <MobileCategories>
                <CgMenuLeft size={28} strokeWidth={0.1} className="cursor-pointer hover:opacity-80 transition" />
              </MobileCategories>
              <div className="relative h-8 w-28">
                <Link href="/">
                  <Image
                    src="/images/logo/png-jpeg/Logo-Full-White.png"
                    alt="ECSite Logo"
                    fill
                    className="object-contain cursor-pointer"
                  />
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ProfileDropdown />
              <CartDropdown />
            </div>
          </div>

          <div className="w-full px-1">
            <MobileSearchInput />
          </div>
        </div>
      </header>
    </DropdownProvider>
  )
}
