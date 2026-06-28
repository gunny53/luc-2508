'use client'

import { useBrand } from '../use-brand'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

function BrandLogo({ src, name }: { src?: string; name: string }) {
  const [hasError, setHasError] = useState(false)
  const isKnownBrokenRemote = src?.includes('ecsite.s3.ap-southeast-1.amazonaws.com')
  const showImage = src && !hasError && !isKnownBrokenRemote
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (!showImage) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-orange-50 text-primary">
        <span className="text-xl font-bold">{initials || 'EC'}</span>
        <span className="mt-1 max-w-full truncate px-2 text-xs font-medium">{name}</span>
      </div>
    )
  }

  return <Image src={src} alt={name} fill className="object-contain p-4" onError={() => setHasError(true)} />
}

export default function SearchBrand() {
  const t = useTranslations('client.searchPage.brand')
  const { data: brands, loading } = useBrand()
  const renderBrandItem = (brand: any, i: number) => {
    if (loading) {
      return <div key={`skeleton-${i}`} className="h-[113px] w-full bg-gray-100 animate-pulse" />
    }
    const typedBrand = brand as {
      id: string
      name: string
      logo?: string
      brandTranslations?: { name: string }[]
    }

    const name = typedBrand.brandTranslations?.[0]?.name || typedBrand.name

    return (
      <TooltipProvider key={typedBrand.id || i}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="h-[113px] w-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 bg-white p-2">
              <div className="w-full h-full relative overflow-hidden rounded-sm">
                <BrandLogo src={typedBrand.logo} name={name} />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  const allItems = loading ? Array.from({ length: 12 }).map((_, i) => i) : brands.slice(0, 12)

  return (
    <div className="mb-6 bg-white p-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-800 text-lg font-semibold">{t('title')}</h2>
        <Link href="/brands" className="text-sm text-primary hover:underline whitespace-nowrap flex items-center gap-1">
          {t('viewAll')}
          <span className="text-xs">&#8250;</span>
        </Link>
      </div>

      <Carousel
        opts={{
          align: 'start',
          loop: true,
          slidesToScroll: 6
        }}
        className="w-full"
      >
        <CarouselContent>
          <CarouselItem className="basis-full p-0">
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <div className="grid grid-cols-6">
                {allItems.slice(0, 6).map((item, i) => (
                  <div
                    key={`row1-${i}`}
                    className={`
                      ${i < 5 ? 'border-r border-gray-200' : ''}
                      border-b border-gray-200
                    `}
                  >
                    {renderBrandItem(item, i)}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-6">
                {allItems.slice(6, 12).map((item, i) => (
                  <div
                    key={`row2-${i}`}
                    className={`
                      ${i < 5 ? 'border-r border-gray-200' : ''}
                    `}
                  >
                    {renderBrandItem(item, i + 6)}
                  </div>
                ))}
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="-left-4" />
          <CarouselNext className="-right-4" />
        </div>
      </Carousel>
    </div>
  )
}
