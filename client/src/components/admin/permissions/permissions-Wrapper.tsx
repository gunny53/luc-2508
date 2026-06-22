'use client'
import dynamic from 'next/dynamic'

const PermissionsDynamic = dynamic(() => import('./permissions-table').then((mod) => mod.PermissionsTable), {
  ssr: false
})

export default function PermissionsWrapper() {
  return <PermissionsDynamic />
}
