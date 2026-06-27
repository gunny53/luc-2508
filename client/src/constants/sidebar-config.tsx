'use client'

import React from 'react'
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Settings,
  BarChart2,
  MessageSquare,
  FileText,
  Tickets,
  MonitorCog,
  FolderClosed,
  ScrollText,
  Undo,
  Tags
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useUserData } from '@/hooks/use-get-data-user-login'

export type SidebarItem = {
  title: string
  href: string
  icon?: React.ReactNode
  subItems?: SidebarItem[]
  isTitle?: boolean
}

export const useSidebarConfig = (): SidebarItem[] => {
  const t = useTranslations('admin.sidebar')
  const userData = useUserData()
  const userRole = userData?.role?.name
  const baseItems: SidebarItem[] = [
    {
      title: t('dashboard'),
      href: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      title: t('products.products'),
      href: '/admin/products',
      icon: <Package className="w-5 h-5" />,
      subItems: [
        {
          title: t('products.productsList'),
          href: '/admin/products',
          icon: null
        },
        {
          title: t('products.addProducts'),
          href: '/admin/products/new',
          icon: null
        },
        {
          title: t('categories.categories'),
          href: '/admin/category',
          icon: null
        }
      ]
    },
    {
      title: t('orders.orders'),
      href: '/admin/order',
      icon: <ScrollText className="w-5 h-5" />,
      subItems: [
        {
          title: t('orders.listOrders'),
          href: '/admin/order',
          icon: null
        }
      ]
    },
    {
      title: t('voucher.voucher'),
      href: '/admin/voucher',
      icon: <Tickets className="w-5 h-5" />,
      subItems: [
        {
          title: t('voucher.listVoucher'),
          href: '/admin/voucher',
          icon: null
        },
        {
          title: t('voucher.newVoucher'),
          href: '/admin/voucher/new',
          icon: null
        }
      ]
    }
  ]
  const adminOnlyItems: SidebarItem[] = [
    {
      title: t('system.system'),
      href: '/admin/system',
      icon: <MonitorCog className="w-5 h-5" />,
      subItems: [
        {
          title: t('permission.permissionManager'),
          href: '/admin/permissions',
          icon: null
        },
        {
          title: t('role.roleManager'),
          href: '/admin/roles',
          icon: null
        },
        {
          title: t('user.userManager'),
          href: '/admin/users',
          icon: null
        }
        
        
        
        
        
      ]
    },
    {
      title: t('category.category'),
      href: '/admin/categories',
      icon: <FolderClosed className="w-5 h-5" />,
      subItems: [
        {
          title: t('language.languageManager'),
          href: '/admin/languages',
          icon: null
        },
        
        
        
        
        
        {
          title: t('brand.brandManager'),
          href: '/admin/brand',
          icon: <Tags className="w-4 h-4" />
        }
      ]
    }
  ]
  if (userRole === 'ADMIN') {
    return [...baseItems, ...adminOnlyItems]
  } else {
    return baseItems
  }
}

export const useSettingsSidebarConfig = (): SidebarItem[] => {
  const t = useTranslations('admin.sidebar.settings')
  const userData = useUserData()
  const userRole = userData?.role?.name
  const baseSettingsItems: SidebarItem[] = [
    {
      title: t('systemSettings'),
      href: '/admin',
      icon: <Undo className="w-5 h-5" />,
      isTitle: true
    },
    {
      title: t('accountSettings'),
      href: '/admin/settings',
      subItems: [
        {
          title: t('profile'),
          href: '/admin/settings/profile'
        },
        {
          title: t('passwordAndSecurity'),
          href: '/admin/settings/password-and-security'
        }
      ]
    }
  ]
  const adminOnlySettingsItems: SidebarItem[] = []
  if (userRole === 'ADMIN') {
    return [...baseSettingsItems, ...adminOnlySettingsItems]
  } else {
    return baseSettingsItems
  }
}
