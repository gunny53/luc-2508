'use client'

import { Bell, Search, Settings, User, ChevronDown, Store, Globe, LogOut, Menu, Check } from 'lucide-react'
import { useResponsive } from '@/hooks/use-responsive'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu'
import { useLogout } from '@/hooks/use-logout'
import { Button } from '@/components/ui/button'
import { useChangeLang } from '@/hooks/use-change-lang'
import { SearchItem } from './search-item'
import { useTranslations } from 'next-intl'
import { NotificationSheet } from './notification-sheet'
import { useState } from 'react'
import { ECSiteLogo } from '@/components/brand/ecsite-logo'

interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { isMobile } = useResponsive()
  const { handleLogout, loading: logoutLoading } = useLogout()
  const { changeLanguage, currentLangName, currentSelectedLang } = useChangeLang()
  const t = useTranslations()
  const [notificationOpen, setNotificationOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 h-16 z-30">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button onClick={onToggleSidebar} className="text-gray-700 bg-white">
              <Menu className="w-6 h-6" />
            </Button>
          )}
          <ECSiteLogo href="/admin" variant="orange" className="hidden lg:flex" textClassName="text-xl" />
        </div>

        {!isMobile && <SearchItem />}

        <div className="flex items-center space-x-4">
          <Button
            className="p-2 rounded-full hover:bg-gray-100 relative bg-[#fff]"
            onClick={() => setNotificationOpen(true)}
            aria-label={t('admin.notifications.title')}
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 bg-primary rounded-full w-2 h-2"></span>
          </Button>

          <NotificationSheet open={notificationOpen} onOpenChange={setNotificationOpen} />
        </div>
      </div>
    </header>
  )
}
