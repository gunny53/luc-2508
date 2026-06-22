'use client'
import dynamic from 'next/dynamic'

const BrandsDynamic = dynamic(() => import('./brand-table').then((mod) => mod.BrandTable), { ssr: false })

export default function BrandsWrapper() {
  return <BrandsDynamic />
}
