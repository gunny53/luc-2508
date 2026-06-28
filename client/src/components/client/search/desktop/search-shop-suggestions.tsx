'use client'

import { useTranslations } from 'next-intl'

export default function ShopSuggestion() {
  const t = useTranslations('client.searchPage.shop')

  return (
    <div className="bg-white p-4 border rounded shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">{t('title')}</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-primary rounded-full flex items-center justify-center font-bold">
            EC
          </div>
          <div>
            <div className="font-semibold text-sm">ECSite Store</div>
            <div className="text-xs text-gray-500">★ 5.0 | 7.6k {t('followers')}</div>
          </div>
          <button className="ml-4 px-3 py-1 text-sm border rounded text-primary border-primary">{t('viewShop')}</button>
        </div>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-24 h-32 bg-gray-100 rounded shadow-inner" />
          ))}
        </div>
      </div>
    </div>
  )
}
