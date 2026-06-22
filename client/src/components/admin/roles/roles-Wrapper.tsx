'use client'
import dynamic from 'next/dynamic'

const RolesDynamic = dynamic(() => import('./roles-table').then((mod) => mod.default), { ssr: false })

export default function RolesWrapper() {
  return <RolesDynamic />
}
