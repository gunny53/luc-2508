'use client'

import { useResponsive } from '@/hooks/use-responsive'

interface CartLayoutControlProps {
  isEditing: boolean
  total: number
  totalSaved: number
  selectedCount: number
  onEdit: () => void
  title: string
}

export function useCartLayout({ isEditing, total, totalSaved, selectedCount, onEdit, title }: CartLayoutControlProps) {
  const { isMobile } = useResponsive()

  return { isMobile }
}
