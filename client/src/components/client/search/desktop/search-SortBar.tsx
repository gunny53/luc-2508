'use client';

import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useProductsContext } from '../context/ProductsContext';

interface SearchSortBarProps {
  categoryId?: string | null;
}

export default function SearchSortBar({ categoryId }: SearchSortBarProps) {
  const [sort, setSort] = useState('English content normalized from the original source text.');
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [priceSort, setPriceSort] = useState<string | null>(null);

  // English content normalized from the original source text.
  const {
    currentPage,
    paginationData,
    handlePageChange,
    isLoading
  } = useProductsContext();

  const { totalPages, hasNextPage, hasPrevPage } = paginationData;
  const dropdownRef = useRef<HTMLDivElement>(null);

  // English content normalized from the original source text.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPriceDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm mb-4">
      {/* English content normalized from the original source text. */}
      <div className="flex items-center gap-3">
        {['English content normalized from the original source text.', 'English content normalized from the original source text.', 'English content normalized from the original source text.'].map((option) => (
          <button
            key={option}
            className={`text-sm px-3 py-1.5 border rounded-md transition-colors duration-200 ${
              sort === option ? 'bg-red-600 text-white border-red-600' : 'text-gray-700 hover:border-red-600 hover:text-red-600'
            }`}
            onClick={() => setSort(option)}
          >
            {option}
          </button>
        ))}

        {/* English content normalized from the original source text. */}
        <div className="relative" ref={dropdownRef}>
          <button
            className={`text-sm px-3 py-1.5 border rounded-md flex items-center gap-1 transition-colors duration-200 ${
              priceSort ? 'bg-red-600 text-white border-red-600' : 'text-gray-700 hover:border-red-600 hover:text-red-600'
            }`}
            onClick={() => setShowPriceDropdown(!showPriceDropdown)}
          >
            {priceSort || 'English content normalized from the original source text.'} <ChevronDown size={14} className={`transition-transform duration-200 ${showPriceDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown menu */}
          {showPriceDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-md z-10">
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-150"
                onClick={() => {
                  setPriceSort('English content normalized from the original source text.');
                  setShowPriceDropdown(false);
                }}
              >English content normalized from the original source text.</button>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-150"
                onClick={() => {
                  setPriceSort('English content normalized from the original source text.');
                  setShowPriceDropdown(false);
                }}
              >English content normalized from the original source text.</button>
            </div>
          )}
        </div>
      </div>

      {/* English content normalized from the original source text. */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 border rounded-md hover:border-red-600 hover:text-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="p-1.5 border rounded-md hover:border-red-600 hover:text-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}