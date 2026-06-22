'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCbbCategory } from '@/hooks/combobox/use-cbb-category'
import { createCategorySlug } from '@/utils/slugify'

interface CategoryOption {
  value: string
  label: string
  icon?: string | null
  parentCategoryId?: string | null
}

interface UseSidebarProps {
  categoryIds?: string[]
  currentCategoryId?: string | null
}

interface UseSidebarReturn {
  selectedCategoryPath: string[]
  selectedCategory: string
  parentCategory: { value: string; label: string } | null
  parentCategoryId: string | null
  parentCategories: CategoryOption[]
  subcategories: CategoryOption[]
  loadingParentCategories: boolean
  loadingSubcategories: boolean
  selectedFilters: { [key: string]: string[] }
  setSelectedFilters: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>
  handleCategorySelect: (categoryId: string, categoryName: string, isParent: boolean) => void
  handleCheckboxChange: (filterType: string, item: string, checked: boolean) => void
  handleClearAll: () => void
}

export function useSidebar({ categoryIds = [], currentCategoryId }: UseSidebarProps): UseSidebarReturn {
  const router = useRouter()
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<string[]>(categoryIds)
  const [selectedCategory, setSelectedCategory] = useState<string>(currentCategoryId || '')
  const parentCategoryId = categoryIds.length > 0 ? categoryIds[0] : null
  const [parentCategory, setParentCategory] = useState<{ value: string; label: string } | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    locations: [],
    brands: [],
    shipping: []
  })
  const { categories: parentCategories, loading: loadingParentCategories } = useCbbCategory(null)
  const { categories: subcategories, loading: loadingSubcategories } = useCbbCategory(parentCategoryId)
  useEffect(() => {
    if (parentCategoryId && parentCategories.length > 0) {
      const parentCategoryFound = parentCategories.find((cat) => cat.value === parentCategoryId)

      if (parentCategoryFound) {
        setParentCategory(parentCategoryFound)
      }
    }

    if (currentCategoryId) {
      setSelectedCategory(currentCategoryId)
    }
  }, [parentCategoryId, currentCategoryId, parentCategories])
  const handleCategorySelect = (categoryId: string, categoryName: string, isParent: boolean) => {
    if (!categoryId) return

    let newPath: string[] = []

    if (isParent) {
      newPath = [categoryId]
      setSelectedCategory(categoryId)
      const parentCategoryFound = parentCategories.find((cat) => cat.value === categoryId)
      if (parentCategoryFound) {
        setParentCategory(parentCategoryFound)
      }
    } else {
      if (parentCategory) {
        newPath = [parentCategory.value, categoryId]
        setSelectedCategory(categoryId)
      } else {
        const categoryFound = subcategories.find((cat) => cat.value === categoryId)
        if (categoryFound && categoryFound.parentCategoryId) {
          newPath = [categoryFound.parentCategoryId, categoryId]
        } else {
          newPath = [categoryId]
        }
        setSelectedCategory(categoryId)
      }
    }
    setSelectedCategoryPath(newPath)
    const slug = createCategorySlug(categoryName, newPath)
    router.push(slug)
  }
  const handleCheckboxChange = (filterType: string, item: string, checked: boolean) => {
    setSelectedFilters((prev) => {
      const currentItems = [...prev[filterType]]

      if (checked) {
        if (!currentItems.includes(item)) {
          return { ...prev, [filterType]: [...currentItems, item] }
        }
      } else {
        return { ...prev, [filterType]: currentItems.filter((i) => i !== item) }
      }

      return prev
    })
  }
  const handleClearAll = () => {
    setSelectedFilters({
      locations: [],
      brands: [],
      shipping: []
    })
  }

  return {
    selectedCategoryPath,
    selectedCategory,
    parentCategory,
    parentCategoryId,
    parentCategories,
    subcategories,
    loadingParentCategories,
    loadingSubcategories,
    selectedFilters,
    setSelectedFilters,
    handleCategorySelect,
    handleCheckboxChange,
    handleClearAll
  }
}
