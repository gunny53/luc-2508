'use client'

// English content normalized from the original source text.
import { MoreHorizontal } from 'lucide-react';
import { Row } from '@tanstack/react-table'
import React from 'react'; // Import React for JSX.Element

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  // English content normalized from the original source text.
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// English content normalized from the original source text.
// English content normalized from the original source text.

// English content normalized from the original source text.
interface CommandAction<TData> {
  type: 'command';
  label: string;
  icon?: React.ReactNode;
  onClick?: (rowData: TData) => void;
  className?: string;
}

// English content normalized from the original source text.
interface SeparatorAction {
  type: 'separator';
}

// English content normalized from the original source text.
export type ActionItem<TData> = CommandAction<TData> | SeparatorAction;

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  t?: (key: string) => string;
  actions?: ActionItem<TData>[];
}

export function DataTableRowActions<TData>({
  row,
  actions = [],
}: DataTableRowActionsProps<TData>) {
  // English content normalized from the original source text.

  if (!actions || actions.length === 0) {
    return null; // English content normalized from the original source text.
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          onClick={(e) => e.stopPropagation()} // English content normalized from the original source text.
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">English content normalized from the original source text.</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-auto min-w-[160px]"
        onClick={(e) => e.stopPropagation()} // English content normalized from the original source text.
      >
        {actions.map((action, index) => {
          if (action.type === 'separator') {
            return <DropdownMenuSeparator key={index} />;
          }
          // English content normalized from the original source text.
          return (
            <DropdownMenuItem
              key={index}
              onClick={(e) => {
                e.stopPropagation(); // English content normalized from the original source text.
                action.onClick?.(row.original);
              }}
              className={action.className}
            >
              {action.icon && <span className="mr-2 h-4 w-4">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}