'use client'

import { useBrand } from '../use-brand'
import Image from 'next/image'
import Link from 'next/link'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function SearchBrand() {
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
              {typedBrand.logo ? (
                <div className="w-full h-full relative">
                  <Image src={typedBrand.logo} alt={name} fill className="object-cover" />
                </div>
              ) : (
                <span className="text-sm text-gray-600 font-medium text-center">{name}</span>
              )}
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
        <h2 className="text-gray-800 text-lg font-semibold">
          Th??ng hi?u
        </h2>
        <Link href="/brands" className="text-sm text-primary hover:underline whitespace-nowrap flex items-center gap-1">
          Th??ng hi?u<span className="text-xs">&#8250;</span>
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
