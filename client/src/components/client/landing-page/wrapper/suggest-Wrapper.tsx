'use client'
import dynamic from 'next/dynamic'

const SuggestSectionDynamic = dynamic(() => import('../suggest-section').then((mod) => mod.default), { ssr: false })

export default function SuggestSectionWrapper() {
  return <SuggestSectionDynamic />
}
