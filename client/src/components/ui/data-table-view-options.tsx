"use client"

import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"
import { Table } from "@tanstack/react-table"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-8 lg:flex"
        >
          <Settings2 className="mr-2 h-4 w-4" />English content normalized from the original source text.</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" &&
              column.getCanHide() &&
              column.id !== "select" && // English content normalized from the original source text.
              column.id !== "actions" // English content normalized from the original source text.
          )
          .map((column) => {
            // English content normalized from the original source text.
            const headerText = column.columnDef.header?.toString() ||
              {
                "name": "English content normalized from the original source text.",
                "image": "English content normalized from the original source text.",
                "status": "English content normalized from the original source text.",
                "createdAt": "English content normalized from the original source text.",
                "updatedAt": "English content normalized from the original source text.",
              }[column.id] ||
              column.id

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {headerText}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
