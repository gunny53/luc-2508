'use client'

import Link from 'next/link'
import { ChevronLeft, Pencil, Check } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

interface MobileCartHeaderProps {
  title: string
  onEdit?: () => void
  isEditingGlobal?: boolean
  total?: number
  totalSaved?: number
  selectedCount?: number
}

export default function MobileCartHeader({ title, onEdit, isEditingGlobal }: MobileCartHeaderProps) {
  const pathname = usePathname()
  const t = useTranslations()
  const isNestedRoute = pathname.split('/').length > 2
  const backUrl = isNestedRoute ? '/user' : '/'

  return (
    <div className="sticky top-0 bg-white z-20">
      <div className="px-4 pt-4 pb-3 flex items-center border-b border-gray-200 justify-between">
        <Link href={backUrl} className="p-1 -ml-2">
          <ChevronLeft className="w-6 h-7 text-gray-600" />
        </Link>
        <h1 className="text-lg font-bold flex-1 text-start">{title}</h1>
      </div>
    </div>
  )
}
