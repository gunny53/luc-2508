'use client'
import dynamic from 'next/dynamic'

const HeaderDynamic = dynamic(() => import('./header-main').then((mod) => mod.Header), { ssr: false })

export default function HeaderWrapper() {
  return <HeaderDynamic />
}
