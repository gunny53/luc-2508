'use client'

import { useTranslations } from 'next-intl'

interface SearchSidebarProps {
  categoryIds?: string[]
  currentCategoryId?: string | null
}

export default function SearchSidebar({ categoryIds = [], currentCategoryId }: SearchSidebarProps) {
  const t = useTranslations('client.searchPage.sidebar')
  const locations = [t('locationNorth'), t('locationCentral'), t('locationSouth')]
  const categories = [t('allCategories')]
  const shippingOptions = [t('fastShipping'), t('freeShipping')]

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6 text-sm hidden lg:block">
      <FilterSection title={t('location')} items={locations} />
      <FilterSection title={t('filters')} items={categories} />
      <FilterSection title={t('shipping')} items={shippingOptions} />
    </aside>
  )
}

function FilterSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item}>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              {item}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
