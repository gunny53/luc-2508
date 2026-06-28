'use client'

import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useProductsContext } from '../context/products-context'
import { useTranslations } from 'next-intl'

interface SearchSortBarProps {
  categoryId?: string | null
}

export default function SearchSortBar({ categoryId }: SearchSortBarProps) {
  const t = useTranslations('client.searchPage.sort')
  const sortOptions = [
    { value: 'relevance', label: t('relevance') },
    { value: 'latest', label: t('latest') },
    { value: 'topSales', label: t('topSales') }
  ]
  const [sort, setSort] = useState(sortOptions[0].value)
  const [showPriceDropdown, setShowPriceDropdown] = useState(false)
  const [priceSort, setPriceSort] = useState<string | null>(null)
  const { currentPage, paginationData, handlePageChange, isLoading } = useProductsContext()

  const { totalPages, hasNextPage, hasPrevPage } = paginationData
  const dropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPriceDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm mb-4">
      <div className="flex items-center gap-3">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            className={`text-sm px-3 py-1.5 border rounded-md transition-colors duration-200 ${
              sort === option.value
                ? 'bg-primary text-white border-primary'
                : 'text-gray-700 hover:border-primary hover:text-primary'
            }`}
            onClick={() => setSort(option.value)}
          >
            {option.label}
          </button>
        ))}

        <div className="relative" ref={dropdownRef}>
          <button
            className={`text-sm px-3 py-1.5 border rounded-md flex items-center gap-1 transition-colors duration-200 ${
              priceSort
                ? 'bg-primary text-white border-primary'
                : 'text-gray-700 hover:border-primary hover:text-primary'
            }`}
            onClick={() => setShowPriceDropdown(!showPriceDropdown)}
          >
            {priceSort || t('price')}{' '}
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${showPriceDropdown ? 'rotate-180' : ''}`}
            />
          </button>

          {}
          {showPriceDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-md z-10">
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-150"
                onClick={() => {
                  setPriceSort(t('priceAsc'))
                  setShowPriceDropdown(false)
                }}
              >
                {t('priceAsc')}
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-150"
                onClick={() => {
                  setPriceSort(t('priceDesc'))
                  setShowPriceDropdown(false)
                }}
              >
                {t('priceDesc')}
              </button>
            </div>
          )}
        </div>
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 border rounded-md hover:border-primary hover:text-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-gray-700">{currentPage}</span>
            <span className="text-sm text-gray-500">/</span>
            <span className="text-sm text-gray-500">{totalPages}</span>
          </div>

          <button
            className="p-1.5 border rounded-md hover:border-primary hover:text-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
