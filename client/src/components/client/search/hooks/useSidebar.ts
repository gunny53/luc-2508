'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCbbCategory } from '@/hooks/combobox/useCbbCategory';
import { createCategorySlug } from '@/utils/slugify';

interface CategoryOption {
  value: string;
  label: string;
  icon?: string | null;
  parentCategoryId?: string | null;
}

interface UseSidebarProps {
  categoryIds?: string[];
  currentCategoryId?: string | null;
}

interface UseSidebarReturn {
  // English content normalized from the original source text.
  selectedCategoryPath: string[];
  selectedCategory: string;
  parentCategory: {value: string, label: string} | null;
  parentCategoryId: string | null;
  parentCategories: CategoryOption[];
  subcategories: CategoryOption[];
  loadingParentCategories: boolean;
  loadingSubcategories: boolean;
  selectedFilters: {[key: string]: string[]};
  setSelectedFilters: React.Dispatch<React.SetStateAction<{[key: string]: string[]}>>;

  // English content normalized from the original source text.
  handleCategorySelect: (categoryId: string, categoryName: string, isParent: boolean) => void;
  handleCheckboxChange: (filterType: string, item: string, checked: boolean) => void;
  handleClearAll: () => void;
}

export function useSidebar({ categoryIds = [], currentCategoryId }: UseSidebarProps): UseSidebarReturn {
  const router = useRouter();

  // English content normalized from the original source text.
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<string[]>(categoryIds);
  const [selectedCategory, setSelectedCategory] = useState<string>(currentCategoryId || "");

  // English content normalized from the original source text.
  const parentCategoryId = categoryIds.length > 0 ? categoryIds[0] : null;
  const [parentCategory, setParentCategory] = useState<{value: string, label: string} | null>(null);

  // English content normalized from the original source text.
  const [selectedFilters, setSelectedFilters] = useState<{[key: string]: string[]}>({
    locations: [],
    brands: [],
    shipping: []
  });

  // English content normalized from the original source text.
  const { categories: parentCategories, loading: loadingParentCategories } = useCbbCategory(null);

  // English content normalized from the original source text.
  const { categories: subcategories, loading: loadingSubcategories } = useCbbCategory(parentCategoryId);

  // English content normalized from the original source text.
  useEffect(() => {
    if (parentCategoryId && parentCategories.length > 0) {
      // English content normalized from the original source text.
      const parentCategoryFound = parentCategories.find(cat => cat.value === parentCategoryId);

      if (parentCategoryFound) {
        setParentCategory(parentCategoryFound);
      }
    }

    if (currentCategoryId) {
      setSelectedCategory(currentCategoryId);
    }
  }, [parentCategoryId, currentCategoryId, parentCategories]);

  // English content normalized from the original source text.
  const handleCategorySelect = (categoryId: string, categoryName: string, isParent: boolean) => {
    if (!categoryId) return;

    let newPath: string[] = [];

    if (isParent) {
      // English content normalized from the original source text.
      newPath = [categoryId];
      setSelectedCategory(categoryId);

      // English content normalized from the original source text.
      const parentCategoryFound = parentCategories.find(cat => cat.value === categoryId);
      if (parentCategoryFound) {
        setParentCategory(parentCategoryFound);
      }
    } else {
      // English content normalized from the original source text.
      if (parentCategory) {
        newPath = [parentCategory.value, categoryId];
        setSelectedCategory(categoryId);
      } else {
        // English content normalized from the original source text.
        const categoryFound = subcategories.find(cat => cat.value === categoryId);
        if (categoryFound && categoryFound.parentCategoryId) {
          newPath = [categoryFound.parentCategoryId, categoryId];
        } else {
          // English content normalized from the original source text.
          newPath = [categoryId];
        }
        setSelectedCategory(categoryId);
      }
    }

    // English content normalized from the original source text.
    setSelectedCategoryPath(newPath);

    // English content normalized from the original source text.
    const slug = createCategorySlug(categoryName, newPath);
    router.push(slug);
  };

  // English content normalized from the original source text.
  const handleCheckboxChange = (filterType: string, item: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const currentItems = [...prev[filterType]];

      if (checked) {
        // English content normalized from the original source text.
        if (!currentItems.includes(item)) {
          return { ...prev, [filterType]: [...currentItems, item] };
        }
      } else {
        // English content normalized from the original source text.
        return { ...prev, [filterType]: currentItems.filter(i => i !== item) };
      }

      return prev;
    });
  };

  // English content normalized from the original source text.
  const handleClearAll = () => {
    setSelectedFilters({
      locations: [],
      brands: [],
      shipping: []
    });
  };

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
  };
}
