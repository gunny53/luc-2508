'use client'
import { MoreHorizontal } from 'lucide-react'
import { Row } from '@tanstack/react-table'
import React from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
interface CommandAction<TData> {
  type: 'command'
  label: string
  icon?: React.ReactNode
  onClick?: (rowData: TData) => void
  className?: string
}
interface SeparatorAction {
  type: 'separator'
}
export type ActionItem<TData> = CommandAction<TData> | SeparatorAction

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  t?: (key: string) => string
  actions?: ActionItem<TData>[]
}

export function DataTableRowActions<TData>({ row, actions = [] }: DataTableRowActionsProps<TData>) {
  if (!actions || actions.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open row actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-[160px]" onClick={(e) => e.stopPropagation()}>
        {actions.map((action, index) => {
          if (action.type === 'separator') {
            return <DropdownMenuSeparator key={index} />
          }
          return (
            <DropdownMenuItem
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                action.onClick?.(row.original)
              }}
              className={action.className}
            >
              {action.icon && <span className="mr-2 h-4 w-4">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
