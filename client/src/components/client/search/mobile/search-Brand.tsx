'use client'

import { useBrand } from '../use-brand'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

function MobileBrandLogo({ src, name }: { src?: string; name: string }) {
  const [hasError, setHasError] = useState(false)
  const isKnownBrokenRemote = src?.includes('ecsite.s3.ap-southeast-1.amazonaws.com')
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (!src || hasError || isKnownBrokenRemote) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-primary">
        {initials || 'EC'}
      </div>
    )
  }

  return <Image src={src} alt={name} fill className="object-contain" onError={() => setHasError(true)} />
}

export default function SearchBrand() {
  const t = useTranslations('client.searchPage.brand')
  const { data: brands, loading } = useBrand()

  return (
    <div className="bg-white rounded-md shadow-sm border p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-primary text-sm font-semibold uppercase">{t('title')}</h2>
        <Link href="/brands" className="text-sm text-muted-foreground hover:underline">
          {t('viewAll')}
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {!loading &&
          brands?.map((brand) => (
            <Link
              key={brand.id}
              href={`/search?brand=${brand.id}`}
              className="flex flex-col items-center justify-center gap-2 border hover:border-primary transition-colors duration-200 rounded-md p-3"
            >
              <div className="relative w-16 h-16 flex items-center justify-center">
                <MobileBrandLogo src={brand.logo} name={brand.name} />
              </div>
              <span className="text-sm text-center line-clamp-2 leading-tight">{brand.name}</span>
            </Link>
          ))}
      </div>
    </div>
  )
}
