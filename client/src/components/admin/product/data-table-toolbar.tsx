'use client'

import * as React from 'react'
import { type Table as TableInstance } from '@tanstack/react-table'
import { DataTableViewOptions } from './data-table-view-options'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableExport } from './data-table-export'
import { DataTableSearch } from './data-table-search'
// import { DateRangePicker, type DateRange } from "@/components/ui/date-range-picker"
import { useTranslations } from 'next-intl'

interface DataTableToolbarProps<TData> {
  table: TableInstance<TData>
  categories: Array<{ id: string; name: string }>
}

export function DataTableToolbar<TData>({ table, categories }: DataTableToolbarProps<TData>) {
  // const [date, setDate] = React.useState<DateRange>()
  const t = useTranslations()

  return (
    <div className="flex items-center justify-between">
      {' '}
      <div className="flex flex-1 items-center space-x-2">
        <DataTableSearch table={table} />
        {}
        <DataTableFacetedFilter
          column={table.getColumn('category')}
          title={t('admin.dataTableToolbar.categories')}
          options={categories.map((cat) => ({
            label: cat.name,
            value: cat.id
          }))}
        />
        <DataTableViewOptions table={table} />
      </div>
      <div className="flex items-center space-x-2">
        <DataTableExport table={table} />
      </div>
    </div>
  )
}
