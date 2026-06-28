'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

type SortValue = 'relevance' | 'latest' | 'topSales' | 'price'

export default function SearchSortBar() {
  const t = useTranslations('client.searchPage.sort')
  const [sort, setSort] = useState<SortValue>('relevance')
  const [priceAsc, setPriceAsc] = useState(true)

  const handleSort = (option: SortValue) => {
    if (option === 'price') {
      if (sort === 'price') {
        setPriceAsc(!priceAsc)
      } else {
        setSort('price')
        setPriceAsc(true)
      }
      return
    }

    setSort(option)
  }

  const sortOptions: Array<{ value: SortValue; label: string }> = [
    { value: 'relevance', label: t('relevance') },
    { value: 'latest', label: t('latest') },
    { value: 'topSales', label: t('topSales') }
  ]

  return (
    <div className="sticky top-[56px] z-[998] bg-white border-b">
      <div className="flex items-center gap-1 sm:gap-3 text-sm px-4 py-2">
        {sortOptions.map((option, index) => (
          <div key={option.value} className="flex items-center">
            <button
              onClick={() => handleSort(option.value)}
              className={`px-2 sm:px-3 py-1 font-medium ${
                sort === option.value ? 'text-primary border-b-2 border-primary' : 'text-gray-700'
              }`}
            >
              {option.label}
            </button>
            {index !== sortOptions.length - 1 && <div className="h-4 w-px bg-gray-300 mx-1" />}
          </div>
        ))}

        <div className="flex items-center">
          <button
            onClick={() => handleSort('price')}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1 font-medium ${
              sort === 'price' ? 'text-primary border-b-2 border-primary' : 'text-gray-700'
            }`}
          >
            {t('price')}
            {sort === 'price' && (priceAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </button>
        </div>
      </div>
    </div>
  )
}
