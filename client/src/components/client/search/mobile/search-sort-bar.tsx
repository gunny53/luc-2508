'use client'

import { ChevronUp, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function SearchSortBar() {
  const [sort, setSort] = useState<
    | 'T?m ki?m'
    | 'T?m ki?m'
    | 'T?m ki?m'
    | 'T?m ki?m'
  >('T?m ki?m')
  const [priceAsc, setPriceAsc] = useState(true)

  const handleSort = (option: typeof sort) => {
    if (option === 'T?m ki?m') {
      if (sort === 'T?m ki?m') {
        setPriceAsc(!priceAsc)
      } else {
        setSort('T?m ki?m')
        setPriceAsc(true)
      }
    } else {
      setSort(option)
    }
  }

  const sortOptions: Array<typeof sort> = [
    'T?m ki?m',
    'T?m ki?m',
    'T?m ki?m'
  ]

  return (
    <div className="sticky top-[56px] z-[998] bg-white border-b">
      <div className="flex items-center gap-1 sm:gap-3 text-sm px-4 py-2">
        {sortOptions.map((option, index) => (
          <div key={option} className="flex items-center">
            <button
              onClick={() => handleSort(option)}
              className={`px-2 sm:px-3 py-1 font-medium ${
                sort === option ? 'text-[#ee4d2d] border-b-2 border-[#ee4d2d]' : 'text-gray-700'
              }`}
            >
              {option}
            </button>
            {index !== sortOptions.length - 1 && <div className="h-4 w-px bg-gray-300 mx-1" />}
          </div>
        ))}

        <div className="flex items-center">
          <button
            onClick={() => handleSort('T?m ki?m')}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1 font-medium ${
              sort === 'T?m ki?m'
                ? 'text-[#ee4d2d] border-b-2 border-[#ee4d2d]'
                : 'text-gray-700'
            }`}
          >
            T?m ki?m
            {sort === 'T?m ki?m' &&
              (priceAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </button>
        </div>
      </div>
    </div>
  )
}
