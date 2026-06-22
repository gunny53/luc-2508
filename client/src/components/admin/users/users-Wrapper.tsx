'use client'
import dynamic from 'next/dynamic'

const UsersDynamic = dynamic(() => import('./users-table').then((mod) => mod.default), { ssr: false })

export default function UsersWrapper() {
  return <UsersDynamic />
}
